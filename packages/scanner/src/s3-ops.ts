import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

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

export async function moveToPublicBucket(quarantineKey: string): Promise<string> {
  const publicKey = quarantineKey.replace('quarantine/', 'public/');

  // Copy to public bucket
  const copyCommand = new CopyObjectCommand({
    CopySource: `${QUARANTINE_BUCKET}/${quarantineKey}`,
    Bucket: PUBLIC_BUCKET,
    Key: publicKey,
  });

  await s3Client.send(copyCommand);

  // Delete from quarantine
  const deleteCommand = new DeleteObjectCommand({
    Bucket: QUARANTINE_BUCKET,
    Key: quarantineKey,
  });

  await s3Client.send(deleteCommand);

  return publicKey;
}

export async function deleteFromQuarantine(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: QUARANTINE_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}
