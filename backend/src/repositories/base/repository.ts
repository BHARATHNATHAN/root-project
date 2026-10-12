import type { Pool, RowDataPacket } from 'mysql2/promise';

export type SqlValue = string | number | boolean | Date | null;

/**
 * Data-access boundary for future modules.
 * SQL text and bound values stay separate. This class has no HTTP or UI concerns.
 */
export class BaseRepository {
  constructor(protected readonly pool: Pool) {}

  protected async query<T extends RowDataPacket>(
    sql: string,
    params: readonly SqlValue[] = [],
  ): Promise<T[]> {
    const [rows] = await this.pool.query<T[]>(sql, params as SqlValue[]);
    return rows;
  }
}
