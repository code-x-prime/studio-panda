import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { envConfig } from './env-config'

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${envConfig.r2.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: envConfig.r2.accessKeyId,
    secretAccessKey: envConfig.r2.secretAccessKey,
  },
})

export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ url: string; fileKey: string }> {
  const fileKey = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`

  // If R2 credentials are not set, return fallback mock URL safely
  if (!envConfig.r2.accountId || !envConfig.r2.accessKeyId) {
    console.warn('Cloudflare R2 credentials missing. Returning local placeholder URL.')
    return {
      url: `/placeholder.svg?name=${encodeURIComponent(fileName)}`,
      fileKey,
    }
  }

  const command = new PutObjectCommand({
    Bucket: envConfig.r2.bucketName,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: contentType,
  })

  await r2Client.send(command)

  const publicUrl = envConfig.r2.publicUrl.endsWith('/')
    ? `${envConfig.r2.publicUrl}${fileKey}`
    : `${envConfig.r2.publicUrl}/${fileKey}`

  return { url: publicUrl, fileKey }
}

export async function deleteFromR2(fileKey: string): Promise<boolean> {
  if (!envConfig.r2.accountId || !envConfig.r2.accessKeyId) {
    return true
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: envConfig.r2.bucketName,
      Key: fileKey,
    })
    await r2Client.send(command)
    return true
  } catch (error) {
    console.error('Error deleting file from R2:', error)
    return false
  }
}
