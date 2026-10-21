import {
  bigserial,
  bigint,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

const createdAt = () =>
  timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

/** A practice (doctor or clinic). Every business row belongs to one. */
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: createdAt(),
});

const tenantId = () =>
  uuid('tenant_id')
    .notNull()
    .references(() => tenants.id);

export const patients = pgTable(
  'patients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: tenantId(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    birthDate: date('birth_date'),
    phone: text('phone'),
    email: text('email'),
    createdAt: createdAt(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    /** Set when personal fields were erased on request (GDPR Art. 17). */
    anonymizedAt: timestamp('anonymized_at', { withTimezone: true }),
  },
  (t) => [index('patients_tenant_idx').on(t.tenantId, t.lastName)],
);

export const consentKind = pgEnum('consent_kind', [
  'treatment',
  'data_processing',
  'photo_use',
  'marketing',
]);

/** The exact wording a patient agrees to. Versions are never edited. */
export const consentTemplates = pgTable(
  'consent_templates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: tenantId(),
    kind: consentKind('kind').notNull(),
    version: integer('version').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    bodySha256: text('body_sha256').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('consent_templates_version_idx').on(
      t.tenantId,
      t.kind,
      t.version,
    ),
  ],
);

export const consentStatus = pgEnum('consent_status', ['granted', 'withdrawn']);

export const consentMethod = pgEnum('consent_method', [
  'tablet_signature',
  'paper_scan',
  'online',
]);

/**
 * Append-only consent history: a withdrawal is a new row, never an update.
 * The current state of a consent is its latest row.
 */
export const consents = pgTable(
  'consents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: tenantId(),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id),
    templateId: uuid('template_id')
      .notNull()
      .references(() => consentTemplates.id),
    status: consentStatus('status').notNull(),
    method: consentMethod('method').notNull(),
    /** Signed PDF or scan, stored as a media file. */
    documentMediaId: uuid('document_media_id'),
    collectedBy: text('collected_by').notNull(),
    recordedAt: timestamp('recorded_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('consents_patient_idx').on(t.tenantId, t.patientId)],
);

export const mediaKind = pgEnum('media_kind', [
  'progress_photo',
  'xray',
  'consent_document',
  'other',
]);

export const mediaStatus = pgEnum('media_status', [
  'pending',
  'uploaded',
  'deleted',
]);

/** Metadata only; the file itself lives in the private bucket. */
export const mediaFiles = pgTable(
  'media_files',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: tenantId(),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id),
    kind: mediaKind('kind').notNull(),
    status: mediaStatus('status').notNull().default('pending'),
    objectKey: text('object_key').notNull().unique(),
    contentType: text('content_type').notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }),
    /** Date the photo or X-ray was taken, not the upload date. */
    takenOn: date('taken_on'),
    bodyArea: text('body_area'),
    uploadedBy: text('uploaded_by').notNull(),
    createdAt: createdAt(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [index('media_files_patient_idx').on(t.tenantId, t.patientId, t.kind)],
);

/** Who did what to which record. IDs only, never personal data. */
export const auditLog = pgTable(
  'audit_log',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    tenantId: tenantId(),
    actorId: text('actor_id').notNull(),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('audit_log_entity_idx').on(t.tenantId, t.entityType, t.entityId),
  ],
);
