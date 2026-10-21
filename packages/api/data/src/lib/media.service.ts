import { randomUUID } from 'node:crypto';
import { AuditRepository } from './audit.repository';
import type { Db } from './db';
import { NotFoundError, ValidationError } from './errors';
import {
  MediaRepository,
  type MediaFile,
  type MediaKind,
} from './media.repository';
import type { MediaStorage } from './media-storage';
import { PatientsRepository } from './patients.repository';

/** File types accepted for photos, X-rays and consent documents. */
export const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/pdf',
  'application/dicom',
] as const;

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export interface UploadRequest {
  patientId: string;
  kind: MediaKind;
  contentType: string;
  takenOn?: string | null;
  bodyArea?: string | null;
}

/** Who is acting and for which practice; comes from the authenticated session. */
export interface Actor {
  tenantId: string;
  userId: string;
}

/**
 * Upload flow: requestUpload -> browser PUTs the file to the signed URL ->
 * confirmUpload. Object keys hold only IDs, never names.
 */
export class MediaService {
  private readonly media: MediaRepository;
  private readonly patients: PatientsRepository;
  private readonly audit: AuditRepository;

  constructor(
    db: Db,
    private readonly storage: MediaStorage,
  ) {
    this.media = new MediaRepository(db);
    this.patients = new PatientsRepository(db);
    this.audit = new AuditRepository(db);
  }

  async requestUpload(
    actor: Actor,
    input: UploadRequest,
  ): Promise<{ media: MediaFile; uploadUrl: string }> {
    if (
      !(ALLOWED_CONTENT_TYPES as readonly string[]).includes(input.contentType)
    ) {
      throw new ValidationError('unsupported_content_type');
    }
    const patient = await this.patients.findById(
      actor.tenantId,
      input.patientId,
    );
    if (!patient || patient.anonymizedAt) throw new NotFoundError('patient');

    const id = randomUUID();
    const media = await this.media.insertPending(actor.tenantId, {
      id,
      patientId: patient.id,
      kind: input.kind,
      contentType: input.contentType,
      objectKey: `tenants/${actor.tenantId}/patients/${patient.id}/${id}`,
      takenOn: input.takenOn ?? null,
      bodyArea: input.bodyArea ?? null,
      uploadedBy: actor.userId,
    });
    const uploadUrl = await this.storage.createUploadUrl(
      media.objectKey,
      media.contentType,
    );
    return { media, uploadUrl };
  }

  /** Checks the file really arrived and matches what was announced. */
  async confirmUpload(actor: Actor, mediaId: string): Promise<MediaFile> {
    const media = await this.media.findById(actor.tenantId, mediaId);
    if (!media || media.status !== 'pending')
      throw new NotFoundError('media_file');

    const stored = await this.storage.stat(media.objectKey);
    if (!stored) throw new ValidationError('upload_missing');
    if (
      stored.contentType !== media.contentType ||
      stored.sizeBytes > MAX_UPLOAD_BYTES
    ) {
      await this.storage.delete(media.objectKey);
      await this.media.markDeleted(actor.tenantId, media.id);
      throw new ValidationError('upload_rejected');
    }

    await this.media.markUploaded(actor.tenantId, media.id, stored.sizeBytes);
    await this.audit.record({
      ...this.auditBase(actor, media.id),
      action: 'create',
    });
    return { ...media, status: 'uploaded', sizeBytes: stored.sizeBytes };
  }

  async listForPatient(
    actor: Actor,
    patientId: string,
    kind?: MediaKind,
  ): Promise<MediaFile[]> {
    return this.media.listForPatient(actor.tenantId, patientId, kind);
  }

  /** Short-lived link for viewing; every call is written to the audit log. */
  async getViewUrl(actor: Actor, mediaId: string): Promise<string> {
    const media = await this.media.findById(actor.tenantId, mediaId);
    if (!media || media.status !== 'uploaded')
      throw new NotFoundError('media_file');
    await this.audit.record({
      ...this.auditBase(actor, media.id),
      action: 'read',
    });
    return this.storage.createDownloadUrl(media.objectKey);
  }

  /** Removes the file; the bucket's soft delete keeps it recoverable for 30 days. */
  async remove(actor: Actor, mediaId: string): Promise<void> {
    const media = await this.media.findById(actor.tenantId, mediaId);
    if (!media || media.status === 'deleted')
      throw new NotFoundError('media_file');
    await this.storage.delete(media.objectKey);
    await this.media.markDeleted(actor.tenantId, media.id);
    await this.audit.record({
      ...this.auditBase(actor, media.id),
      action: 'delete',
    });
  }

  private auditBase(actor: Actor, mediaId: string) {
    return {
      tenantId: actor.tenantId,
      actorId: actor.userId,
      entityType: 'media_file' as const,
      entityId: mediaId,
    };
  }
}
