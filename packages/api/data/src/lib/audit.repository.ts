import type { Db } from './db';
import { auditLog } from './schema';

export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'anonymize';

export interface AuditEntry {
  tenantId: string;
  actorId: string;
  action: AuditAction;
  entityType: 'patient' | 'consent' | 'media_file';
  entityId: string;
}

export class AuditRepository {
  constructor(private readonly db: Db) {}

  async record(entry: AuditEntry): Promise<void> {
    await this.db.insert(auditLog).values(entry);
  }
}
