import type { Db } from './db';
import { PatientsRepository } from './patients.repository';
import { createTenant, createTestDb } from './test-db';

describe('PatientsRepository', () => {
  let db: Db;
  let close: () => Promise<void>;
  let repo: PatientsRepository;
  let tenantA: string;
  let tenantB: string;

  beforeAll(async () => {
    ({ db, close } = await createTestDb());
    repo = new PatientsRepository(db);
    tenantA = await createTenant(db, 'Cabinet A');
    tenantB = await createTenant(db, 'Cabinet B');
  });

  afterAll(() => close());

  it('creates and reads a patient within the same tenant', async () => {
    const patient = await repo.create(tenantA, {
      firstName: 'Ioana',
      lastName: 'Exemplu',
      phone: '0700000000',
    });
    expect(await repo.findById(tenantA, patient.id)).toMatchObject({
      lastName: 'Exemplu',
    });
  });

  it('never returns another tenant’s patient', async () => {
    const patient = await repo.create(tenantA, {
      firstName: 'Ana',
      lastName: 'Fictiv',
    });
    expect(await repo.findById(tenantB, patient.id)).toBeNull();
    expect((await repo.list(tenantB)).map((p) => p.id)).not.toContain(
      patient.id,
    );
    expect(await repo.anonymize(tenantB, patient.id)).toBe(false);
  });

  it('anonymizes personal fields and hides the patient from lists', async () => {
    const patient = await repo.create(tenantA, {
      firstName: 'Maria',
      lastName: 'Test',
      email: 'maria@example.com',
      birthDate: '1990-01-01',
    });
    expect(await repo.anonymize(tenantA, patient.id)).toBe(true);

    const row = await repo.findById(tenantA, patient.id);
    expect(row).toMatchObject({ firstName: '-', email: null, birthDate: null });
    expect(row?.anonymizedAt).toBeInstanceOf(Date);
    expect((await repo.list(tenantA)).map((p) => p.id)).not.toContain(
      patient.id,
    );
  });
});
