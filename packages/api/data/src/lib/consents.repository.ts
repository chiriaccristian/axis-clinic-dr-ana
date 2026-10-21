import { createHash } from 'node:crypto';
import { and, desc, eq, max } from 'drizzle-orm';
import type { Db } from './db';
import { consents, consentTemplates } from './schema';

export type ConsentTemplate = typeof consentTemplates.$inferSelect;
export type Consent = typeof consents.$inferSelect;
export type ConsentKind = ConsentTemplate['kind'];

export interface NewConsent {
  patientId: string;
  templateId: string;
  status: Consent['status'];
  method: Consent['method'];
  documentMediaId?: string | null;
  collectedBy: string;
}

export class ConsentsRepository {
  constructor(private readonly db: Db) {}

  /** Adds a new version of a consent text; older versions stay untouched. */
  async addTemplateVersion(
    tenantId: string,
    input: { kind: ConsentKind; title: string; body: string },
  ): Promise<ConsentTemplate> {
    return this.db.transaction(async (tx) => {
      const [{ latest }] = await tx
        .select({ latest: max(consentTemplates.version) })
        .from(consentTemplates)
        .where(
          and(
            eq(consentTemplates.tenantId, tenantId),
            eq(consentTemplates.kind, input.kind),
          ),
        );
      const [row] = await tx
        .insert(consentTemplates)
        .values({
          ...input,
          tenantId,
          version: (latest ?? 0) + 1,
          bodySha256: createHash('sha256').update(input.body).digest('hex'),
        })
        .returning();
      return row;
    });
  }

  async findTemplate(
    tenantId: string,
    id: string,
  ): Promise<ConsentTemplate | null> {
    const [row] = await this.db
      .select()
      .from(consentTemplates)
      .where(
        and(
          eq(consentTemplates.tenantId, tenantId),
          eq(consentTemplates.id, id),
        ),
      );
    return row ?? null;
  }

  /** Appends a grant or withdrawal. Rows are never updated. */
  async record(tenantId: string, input: NewConsent): Promise<Consent> {
    const [row] = await this.db
      .insert(consents)
      .values({ ...input, tenantId })
      .returning();
    return row;
  }

  /** Full history for a patient, newest first, with the template kind. */
  async history(
    tenantId: string,
    patientId: string,
  ): Promise<Array<Consent & { kind: ConsentKind; version: number }>> {
    const rows = await this.db
      .select({
        consent: consents,
        kind: consentTemplates.kind,
        version: consentTemplates.version,
      })
      .from(consents)
      .innerJoin(consentTemplates, eq(consents.templateId, consentTemplates.id))
      .where(
        and(eq(consents.tenantId, tenantId), eq(consents.patientId, patientId)),
      )
      .orderBy(desc(consents.recordedAt), desc(consents.id));
    return rows.map((r) => ({
      ...r.consent,
      kind: r.kind,
      version: r.version,
    }));
  }

  /** Latest status per consent kind, e.g. `{ treatment: 'granted' }`. */
  async currentStatus(
    tenantId: string,
    patientId: string,
  ): Promise<Partial<Record<ConsentKind, Consent['status']>>> {
    const current: Partial<Record<ConsentKind, Consent['status']>> = {};
    for (const row of await this.history(tenantId, patientId)) {
      current[row.kind] ??= row.status;
    }
    return current;
  }
}
