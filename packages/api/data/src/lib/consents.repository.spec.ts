import { ConsentsRepository } from './consents.repository';
import type { Db } from './db';
import { PatientsRepository } from './patients.repository';
import { createTenant, createTestDb } from './test-db';

describe('ConsentsRepository', () => {
  let db: Db;
  let close: () => Promise<void>;
  let repo: ConsentsRepository;
  let tenantId: string;
  let patientId: string;

  beforeAll(async () => {
    ({ db, close } = await createTestDb());
    repo = new ConsentsRepository(db);
    tenantId = await createTenant(db);
    patientId = (
      await new PatientsRepository(db).create(tenantId, {
        firstName: 'Elena',
        lastName: 'Fictiv',
      })
    ).id;
  });

  afterAll(() => close());

  it('numbers template versions per kind and hashes the text', async () => {
    const v1 = await repo.addTemplateVersion(tenantId, {
      kind: 'photo_use',
      title: 'Fotografii',
      body: 'Text v1',
    });
    const v2 = await repo.addTemplateVersion(tenantId, {
      kind: 'photo_use',
      title: 'Fotografii',
      body: 'Text v2',
    });
    expect([v1.version, v2.version]).toEqual([1, 2]);
    expect(v1.bodySha256).toMatch(/^[0-9a-f]{64}$/);
    expect(v1.bodySha256).not.toBe(v2.bodySha256);
  });

  it('keeps the full history and reports the latest status per kind', async () => {
    const treatment = await repo.addTemplateVersion(tenantId, {
      kind: 'treatment',
      title: 'Tratament',
      body: 'Acord tratament',
    });
    const marketing = await repo.addTemplateVersion(tenantId, {
      kind: 'marketing',
      title: 'Marketing',
      body: 'Acord marketing',
    });
    const base = {
      patientId,
      method: 'tablet_signature' as const,
      collectedBy: 'user-1',
    };

    await repo.record(tenantId, {
      ...base,
      templateId: treatment.id,
      status: 'granted',
    });
    await repo.record(tenantId, {
      ...base,
      templateId: marketing.id,
      status: 'granted',
    });
    await repo.record(tenantId, {
      ...base,
      templateId: marketing.id,
      status: 'withdrawn',
    });

    expect(await repo.currentStatus(tenantId, patientId)).toEqual({
      treatment: 'granted',
      marketing: 'withdrawn',
    });
    expect(await repo.history(tenantId, patientId)).toHaveLength(3);
  });

  it('hides consents from other tenants', async () => {
    const other = await createTenant(db, 'Alt cabinet');
    expect(await repo.history(other, patientId)).toEqual([]);
  });
});
