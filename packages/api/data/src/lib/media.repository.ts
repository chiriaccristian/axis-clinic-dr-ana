import { and, desc, eq } from 'drizzle-orm';
import type { Db } from './db';
import { mediaFiles } from './schema';

export type MediaFile = typeof mediaFiles.$inferSelect;
export type MediaKind = MediaFile['kind'];

export class MediaRepository {
  constructor(private readonly db: Db) {}

  async insertPending(
    tenantId: string,
    input: Omit<typeof mediaFiles.$inferInsert, 'tenantId' | 'status'>,
  ): Promise<MediaFile> {
    const [row] = await this.db
      .insert(mediaFiles)
      .values({ ...input, tenantId, status: 'pending' })
      .returning();
    return row;
  }

  async findById(tenantId: string, id: string): Promise<MediaFile | null> {
    const [row] = await this.db
      .select()
      .from(mediaFiles)
      .where(and(eq(mediaFiles.tenantId, tenantId), eq(mediaFiles.id, id)));
    return row ?? null;
  }

  async listForPatient(
    tenantId: string,
    patientId: string,
    kind?: MediaKind,
  ): Promise<MediaFile[]> {
    return this.db
      .select()
      .from(mediaFiles)
      .where(
        and(
          eq(mediaFiles.tenantId, tenantId),
          eq(mediaFiles.patientId, patientId),
          eq(mediaFiles.status, 'uploaded'),
          kind ? eq(mediaFiles.kind, kind) : undefined,
        ),
      )
      .orderBy(desc(mediaFiles.takenOn), desc(mediaFiles.createdAt));
  }

  async markUploaded(
    tenantId: string,
    id: string,
    sizeBytes: number,
  ): Promise<void> {
    await this.db
      .update(mediaFiles)
      .set({ status: 'uploaded', sizeBytes })
      .where(and(eq(mediaFiles.tenantId, tenantId), eq(mediaFiles.id, id)));
  }

  async markDeleted(tenantId: string, id: string): Promise<void> {
    await this.db
      .update(mediaFiles)
      .set({ status: 'deleted', deletedAt: new Date() })
      .where(and(eq(mediaFiles.tenantId, tenantId), eq(mediaFiles.id, id)));
  }
}
