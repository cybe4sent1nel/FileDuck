import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// MinIO configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  // Support MinIO endpoint (for local dev or MinIO deployment)
  ...(process.env.AWS_ENDPOINT && {
    endpoint: process.env.AWS_ENDPOINT,
    forcePathStyle: true, // Required for MinIO
  }),
});

const QUARANTINE_BUCKET = process.env.S3_BUCKET_QUARANTINE!;
const PUBLIC_BUCKET = process.env.S3_BUCKET_PUBLIC!;
const MULTIPART_CHUNK_SIZE = 100 * 1024 * 1024; // 100 MB

export async function createMultipartUpload(
  filename: string,
  fileSize: number
): Promise<{ uploadId: string; presignedUrls: string[] }> {
  const key = `quarantine/${Date.now()}-${filename}`;
  
  // Initiate multipart upload
  const createCommand = new CreateMultipartUploadCommand({
    Bucket: QUARANTINE_BUCKET,
    Key: key,
    ContentType: 'application/octet-stream',
  });

  const { UploadId } = await (s3Client as any).send(createCommand);
  
  if (!UploadId) {
    throw new Error('Failed to create multipart upload');
  }

  // Calculate number of parts
  const numParts = Math.ceil(fileSize / MULTIPART_CHUNK_SIZE);
  const presignedUrls: string[] = [];

  // Generate presigned URLs for each part
  for (let partNumber = 1; partNumber <= numParts; partNumber++) {
    const uploadPartCommand = new UploadPartCommand({
      Bucket: QUARANTINE_BUCKET,
      Key: key,
      UploadId,
      PartNumber: partNumber,
    });

    const presignedUrl = await getSignedUrl(s3Client, uploadPartCommand, {
      expiresIn: 3600, // 1 hour
    });

    presignedUrls.push(presignedUrl);
  }

  return {
    uploadId: UploadId,
    presignedUrls,
  };
}

export async function completeMultipartUpload(
  key: string,
  uploadId: string,
  parts: { ETag: string; PartNumber: number }[]
): Promise<void> {
  const command = new CompleteMultipartUploadCommand({
    Bucket: QUARANTINE_BUCKET,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  });

  await (s3Client as any).send(command);
}

export async function moveToPublicBucket(quarantineKey: string): Promise<string> {
  const publicKey = quarantineKey.replace('quarantine/', 'public/');

  // Copy to public bucket
  const copyCommand = new CopyObjectCommand({
    CopySource: `${QUARANTINE_BUCKET}/${quarantineKey}`,
    Bucket: PUBLIC_BUCKET,
    Key: publicKey,
  });

  await (s3Client as any).send(copyCommand);

  // Delete from quarantine
  const deleteCommand = new DeleteObjectCommand({
    Bucket: QUARANTINE_BUCKET,
    Key: quarantineKey,
  });

  await (s3Client as any).send(deleteCommand);

  return publicKey;
}

export async function deleteFromQuarantine(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: QUARANTINE_BUCKET,
    Key: key,
  });

  await (s3Client as any).send(command);
}

export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: PUBLIC_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: 3600, // 1 hour
  });
}

export { s3Client };
