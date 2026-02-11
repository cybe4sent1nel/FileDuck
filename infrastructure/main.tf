terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "fileduck-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "fileduck"
}

variable "environment" {
  default = "production"
}

# S3 Buckets
resource "aws_s3_bucket" "quarantine" {
  bucket = "${var.project_name}-quarantine-${var.environment}"

  tags = {
    Name        = "FileDuck Quarantine"
    Environment = var.environment
  }
}

resource "aws_s3_bucket" "public" {
  bucket = "${var.project_name}-public-${var.environment}"

  tags = {
    Name        = "FileDuck Public"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "quarantine" {
  bucket = aws_s3_bucket.quarantine.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_versioning" "public" {
  bucket = aws_s3_bucket.public.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "quarantine" {
  bucket = aws_s3_bucket.quarantine.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "quarantine" {
  bucket = aws_s3_bucket.quarantine.id

  rule {
    id     = "delete-old-files"
    status = "Enabled"

    expiration {
      days = 7
    }
  }
}

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.project_name}"
}

resource "aws_s3_bucket_policy" "public" {
  bucket = aws_s3_bucket.public.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOAI"
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.oai.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.public.arn}/*"
      }
    ]
  })
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} CDN"
  default_root_object = ""

  origin {
    domain_name = aws_s3_bucket.public.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.public.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.public.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true

    trusted_key_groups = [aws_cloudfront_key_group.signed_urls.id]
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "${var.project_name} CDN"
    Environment = var.environment
  }
}

# CloudFront Key Group for Signed URLs
resource "aws_cloudfront_public_key" "signed_urls" {
  comment     = "Public key for signed URLs"
  encoded_key = file("${path.module}/cloudfront-public-key.pem")
  name        = "${var.project_name}-signed-urls-key"
}

resource "aws_cloudfront_key_group" "signed_urls" {
  comment = "Key group for signed URLs"
  items   = [aws_cloudfront_public_key.signed_urls.id]
  name    = "${var.project_name}-signed-urls-group"
}

# IAM User for API Access
resource "aws_iam_user" "api" {
  name = "${var.project_name}-api-${var.environment}"

  tags = {
    Name        = "FileDuck API User"
    Environment = var.environment
  }
}

resource "aws_iam_access_key" "api" {
  user = aws_iam_user.api.name
}

resource "aws_iam_user_policy" "api_s3" {
  name = "${var.project_name}-api-s3-policy"
  user = aws_iam_user.api.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.quarantine.arn}/*",
          "${aws_s3_bucket.public.arn}/*",
          aws_s3_bucket.quarantine.arn,
          aws_s3_bucket.public.arn
        ]
      }
    ]
  })
}

# SNS Topic for Malware Alerts
resource "aws_sns_topic" "malware_alerts" {
  name = "${var.project_name}-malware-alerts"

  tags = {
    Name        = "FileDuck Malware Alerts"
    Environment = var.environment
  }
}

resource "aws_sns_topic_subscription" "malware_email" {
  topic_arn = aws_sns_topic.malware_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

variable "alert_email" {
  description = "Email for malware alerts"
  type        = string
}

# Outputs
output "quarantine_bucket" {
  value = aws_s3_bucket.quarantine.id
}

output "public_bucket" {
  value = aws_s3_bucket.public.id
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.cdn.domain_name
}

output "cloudfront_key_group_id" {
  value = aws_cloudfront_key_group.signed_urls.id
}

output "api_access_key_id" {
  value     = aws_iam_access_key.api.id
  sensitive = true
}

output "api_secret_access_key" {
  value     = aws_iam_access_key.api.secret
  sensitive = true
}

output "sns_topic_arn" {
  value = aws_sns_topic.malware_alerts.arn
}
