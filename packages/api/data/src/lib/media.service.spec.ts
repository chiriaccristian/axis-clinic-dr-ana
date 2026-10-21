import { eq } from 'drizzle-orm';
import type { Db } from './db';
import { NotFoundError, ValidationError } from './errors';
import type { MediaStorage, StoredObject } from './media-storage';
import { MediaService, type Actor } from './media.service';
import { PatientsRepository } from './patients.repository';
import { auditLog } from './schema';
import { createTenant, createTestDb } from './test-db';

class FakeStorage implements MediaStorage {
  readonly objects = new Map<string, StoredObject>();

  async createUploadUrl(objectKey: string): Promise<string> {
    return `https://upload.test/${objectKey}`;
  }
  async createDownloadUrl(objectKey: string): Promise<string> {
    return `https://download.test/${objectKey}`;
  }
  async stat(objectKey: string): Promise<StoredObject | null> {
    return this.objects.get(objectKey) ?? null;
  }
  async delete(objectKey: string): Promise<void> {
    this.objects.delete(objectKey);
  }
}

describe('MediaService', () => {
  let db: Db;
  let close: () => Promise<void>;
  let storage: FakeStorage;
  let service: MediaService;
  let actor: Actor;
  let otherActor: Actor;
  let patientId: string;

  beforeAll(async () => {
    ({ db, close } = await createTestDb());
    storage = new FakeStorage();
    service = new MediaService(db, storage);
    actor = { tenantId: await createTenant(db, 'A'), userId: 'doctor-a' };
    otherActor = { tenantId: await createTenant(db, 'B'), userId: 'doctor-b' };
    patientId = (
      await new PatientsRepository(db).create(actor.tenantId, {
        firstName: 'Radu',
        lastName: 'Fictiv',
      })
    ).id;
  });

  afterAll(() => close());

  async function uploadXray() {
    const { media, uploadUrl } = await service.requestUpload(actor, {
      patientId,
      kind: 'xray',
      contentType: 'image/jpeg',
      takenOn: '2026-10-01',
    });
    storage.objects.set(media.objectKey, {
      sizeBytes: 1234,
      contentType: 'image/jpeg',
    });
    return { media: await service.confirmUpload(actor, media.id), uploadUrl };
  }

  it('uploads with an ID-only object key and lists the file', async () => {
    const { media, uploadUrl } = await uploadXray();
    expect(media.objectKey).toBe(
      `tenants/${actor.tenantId}/patients/${patientId}/${media.id}`,
    );
    expect(uploadUrl).toContain(media.objectKey);
    expect(media).toMatchObject({ status: 'uploaded', sizeBytes: 1234 });
    expect(
      (await service.listForPatient(actor, patientId, 'xray')).map((m) => m.id),
    ).toContain(media.id);
  });

  it('audits every view', async () => {
    const { media } = await uploadXray();
    await service.getViewUrl(actor, media.id);
    const entries = await db
      .select()
      .from(auditLog)
      .where(eq(auditLog.entityId, media.id));
    expect(entries.map((e) => e.action).sort()).toEqual(['create', 'read']);
    expect(entries.every((e) => e.actorId === 'doctor-a')).toBe(true);
  });

  it('rejects unsupported file types', async () => {
    await expect(
      service.requestUpload(actor, {
        patientId,
        kind: 'other',
        contentType: 'text/html',
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects a file whose type differs from what was announced', async () => {
    const { media } = await service.requestUpload(actor, {
      patientId,
      kind: 'progress_photo',
      contentType: 'image/png',
    });
    storage.objects.set(media.objectKey, {
      sizeBytes: 10,
      contentType: 'text/html',
    });
    await expect(service.confirmUpload(actor, media.id)).rejects.toBeInstanceOf(
      ValidationError,
    );
    expect(storage.objects.has(media.objectKey)).toBe(false);
  });

  it('keeps files of one practice invisible to another', async () => {
    const { media } = await uploadXray();
    await expect(
      service.requestUpload(otherActor, {
        patientId,
        kind: 'xray',
        contentType: 'image/jpeg',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
    await expect(
      service.getViewUrl(otherActor, media.id),
    ).rejects.toBeInstanceOf(NotFoundError);
    await expect(service.remove(otherActor, media.id)).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(await service.listForPatient(otherActor, patientId)).toEqual([]);
  });

  it('removes the file and hides it from lists', async () => {
    const { media } = await uploadXray();
    await service.remove(actor, media.id);
    expect(storage.objects.has(media.objectKey)).toBe(false);
    expect(
      (await service.listForPatient(actor, patientId)).map((m) => m.id),
    ).not.toContain(media.id);
    await expect(service.getViewUrl(actor, media.id)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
