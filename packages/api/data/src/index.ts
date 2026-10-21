export * from './lib/schema';
export * as schema from './lib/schema';
export { connectDb, readDbConfig } from './lib/db';
export type { Db, DbConfig, DbConnection, Schema } from './lib/db';
export { NotFoundError, ValidationError } from './lib/errors';
export { AuditRepository } from './lib/audit.repository';
export type { AuditAction, AuditEntry } from './lib/audit.repository';
export { PatientsRepository } from './lib/patients.repository';
export type { NewPatient, Patient } from './lib/patients.repository';
export { ConsentsRepository } from './lib/consents.repository';
export type {
  Consent,
  ConsentKind,
  ConsentTemplate,
  NewConsent,
} from './lib/consents.repository';
export { MediaRepository } from './lib/media.repository';
export type { MediaFile, MediaKind } from './lib/media.repository';
export { GcsMediaStorage } from './lib/media-storage';
export type { MediaStorage, StoredObject } from './lib/media-storage';
export {
  ALLOWED_CONTENT_TYPES,
  MAX_UPLOAD_BYTES,
  MediaService,
} from './lib/media.service';
export type { Actor, UploadRequest } from './lib/media.service';
