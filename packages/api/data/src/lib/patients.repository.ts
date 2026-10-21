import { and, asc, eq, isNull } from 'drizzle-orm';
import type { Db } from './db';
import { patients } from './schema';

export type Patient = typeof patients.$inferSelect;

export interface NewPatient {
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  phone?: string | null;
  email?: string | null;
}

export class PatientsRepository {
  constructor(private readonly db: Db) {}

  async create(tenantId: string, input: NewPatient): Promise<Patient> {
    const [row] = await this.db
      .insert(patients)
      .values({ ...input, tenantId })
      .returning();
    return row;
  }

  async findById(tenantId: string, id: string): Promise<Patient | null> {
    const [row] = await this.db
      .select()
      .from(patients)
      .where(and(eq(patients.tenantId, tenantId), eq(patients.id, id)));
    return row ?? null;
  }

  async list(tenantId: string): Promise<Patient[]> {
    return this.db
      .select()
      .from(patients)
      .where(
        and(eq(patients.tenantId, tenantId), isNull(patients.anonymizedAt)),
      )
      .orderBy(asc(patients.lastName), asc(patients.firstName));
  }

  /** Erases personal fields but keeps the row, so medical history stays linked. */
  async anonymize(tenantId: string, id: string): Promise<boolean> {
    const rows = await this.db
      .update(patients)
      .set({
        firstName: '-',
        lastName: '-',
        birthDate: null,
        phone: null,
        email: null,
        anonymizedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(patients.tenantId, tenantId), eq(patients.id, id)))
      .returning({ id: patients.id });
    return rows.length > 0;
  }
}
