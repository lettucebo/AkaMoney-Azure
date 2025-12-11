import type { D1Database } from '@cloudflare/workers-types';
import type { ClickInfo, ClickStats } from '../models/clickInfo';

/**
 * Service for tracking clicks using Cloudflare D1
 */
export class ClickTrackingService {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  /**
   * Generate a unique click ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Record a click event
   */
  async recordClick(
    code: string,
    userAgent: string | null,
    referrer: string | null,
    ipAddress: string | null
  ): Promise<ClickInfo> {
    const clickInfo: ClickInfo = {
      id: this.generateId(),
      code: code.toLowerCase(),
      userAgent,
      referrer,
      ipAddress,
      timestamp: new Date().toISOString(),
    };

    await this.db
      .prepare(
        'INSERT INTO clickinfo (id, code, user_agent, referrer, ip_address, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(
        clickInfo.id,
        clickInfo.code,
        clickInfo.userAgent,
        clickInfo.referrer,
        clickInfo.ipAddress,
        clickInfo.timestamp
      )
      .run();

    return clickInfo;
  }

  /**
   * Get all clicks for a specific short URL code
   */
  async getClicksByCode(code: string, limit: number = 100): Promise<ClickInfo[]> {
    const result = await this.db
      .prepare(
        'SELECT id, code, user_agent, referrer, ip_address, timestamp FROM clickinfo WHERE code = ? ORDER BY timestamp DESC LIMIT ?'
      )
      .bind(code.toLowerCase(), limit)
      .all();

    return (result.results || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      code: row.code as string,
      userAgent: row.user_agent as string | null,
      referrer: row.referrer as string | null,
      ipAddress: row.ip_address as string | null,
      timestamp: row.timestamp as string,
    }));
  }

  /**
   * Get click count for a specific short URL code
   */
  async getClickCount(code: string): Promise<number> {
    const result = await this.db
      .prepare('SELECT COUNT(*) as count FROM clickinfo WHERE code = ?')
      .bind(code.toLowerCase())
      .first<{ count: number }>();

    return result?.count ?? 0;
  }

  /**
   * Get click statistics for all short URLs
   */
  async getClickStats(): Promise<ClickStats[]> {
    const result = await this.db
      .prepare(
        'SELECT code, COUNT(*) as total_clicks FROM clickinfo GROUP BY code ORDER BY total_clicks DESC'
      )
      .all();

    return (result.results || []).map((row: Record<string, unknown>) => ({
      code: row.code as string,
      totalClicks: row.total_clicks as number,
    }));
  }
}
