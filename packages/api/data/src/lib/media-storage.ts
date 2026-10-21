import { Storage } from '@google-cloud/storage';

export interface StoredObject {
  sizeBytes: number;
  contentType: string;
}

/** Private object storage for medical files. Never public; access via signed URLs. */
export interface MediaStorage {
  createUploadUrl(objectKey: string, contentType: string): Promise<string>;
  createDownloadUrl(objectKey: string): Promise<string>;
  stat(objectKey: string): Promise<StoredObject | null>;
  delete(objectKey: string): Promise<void>;
}

const UPLOAD_URL_TTL_MS = 10 * 60 * 1000;
const DOWNLOAD_URL_TTL_MS = 5 * 60 * 1000;

/**
 * Cloud Storage implementation. On Cloud Run the URLs are signed with the
 * runtime service account through the IAM API, so no key file is needed.
 */
export class GcsMediaStorage implements MediaStorage {
  private readonly storage = new Storage();

  constructor(private readonly bucketName: string) {}

  private file(objectKey: string) {
    return this.storage.bucket(this.bucketName).file(objectKey);
  }

  async createUploadUrl(
    objectKey: string,
    contentType: string,
  ): Promise<string> {
    const [url] = await this.file(objectKey).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + UPLOAD_URL_TTL_MS,
      contentType,
    });
    return url;
  }

  async createDownloadUrl(objectKey: string): Promise<string> {
    const [url] = await this.file(objectKey).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + DOWNLOAD_URL_TTL_MS,
    });
    return url;
  }

  async stat(objectKey: string): Promise<StoredObject | null> {
    const file = this.file(objectKey);
    const [exists] = await file.exists();
    if (!exists) return null;
    const [metadata] = await file.getMetadata();
    return {
      sizeBytes: Number(metadata.size ?? 0),
      contentType: metadata.contentType ?? '',
    };
  }

  async delete(objectKey: string): Promise<void> {
    await this.file(objectKey).delete({ ignoreNotFound: true });
  }
}
