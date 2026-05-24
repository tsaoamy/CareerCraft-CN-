/**
 * 行为事件数据仓库 (Phase 2)
 */

import { getDb, queryAll, queryOne, execute } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface TrackEvent {
  event_type: string;
  event_category?: string;
  event_data?: Record<string, unknown>;
  user_id?: string;
  session_id?: string;
  page_url?: string;
  referrer?: string;
  duration_ms?: number;
}

export class EventRepository {
  /**
   * 记录用户行为事件
   */
  static async track(event: TrackEvent): Promise<string> {
    await getDb();

    const id = uuidv4();
    execute(
      `INSERT INTO user_events (id, user_id, session_id, event_type, event_category, event_data, page_url, referrer, duration_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        event.user_id || '',
        event.session_id || '',
        event.event_type,
        event.event_category || 'general',
        JSON.stringify(event.event_data || {}),
        event.page_url || '',
        event.referrer || '',
        event.duration_ms || 0,
      ]
    );

    return id;
  }

  /**
   * 批量记录事件
   */
  static async trackBatch(events: TrackEvent[]): Promise<number> {
    await getDb();

    let count = 0;
    for (const event of events) {
      await this.track(event);
      count++;
    }
    return count;
  }

  /**
   * 获取事件统计（按类型）
   */
  static async getStats(
    startDate: string,
    endDate: string
  ): Promise<Record<string, unknown>[]> {
    await getDb();

    return queryAll(
      `SELECT event_type, COUNT(*) as count
       FROM user_events
       WHERE created_at BETWEEN ? AND ?
       GROUP BY event_type
       ORDER BY count DESC`,
      [startDate, endDate]
    );
  }

  /**
   * 获取事件列表
   */
  static async list(
    page = 1,
    pageSize = 50,
    filters?: { event_type?: string; user_id?: string; startDate?: string; endDate?: string }
  ): Promise<{ events: Record<string, unknown>[]; total: number }> {
    await getDb();

    let where = 'WHERE 1=1';
    const params: unknown[] = [];

    if (filters?.event_type) {
      where += ' AND event_type = ?';
      params.push(filters.event_type);
    }
    if (filters?.user_id) {
      where += ' AND user_id = ?';
      params.push(filters.user_id);
    }
    if (filters?.startDate) {
      where += ' AND created_at >= ?';
      params.push(filters.startDate);
    }
    if (filters?.endDate) {
      where += ' AND created_at <= ?';
      params.push(filters.endDate);
    }

    const totalRow = queryOne(
      `SELECT COUNT(*) as count FROM user_events ${where}`,
      params
    );

    const offset = (page - 1) * pageSize;
    const events = queryAll(
      `SELECT * FROM user_events ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    return {
      events,
      total: (totalRow?.count as number) || 0,
    };
  }

  /**
   * 计算 DAU (日活跃用户)
   */
  static async getDAU(date: string): Promise<number> {
    await getDb();
    const row = queryOne(
      `SELECT COUNT(DISTINCT user_id) as dau FROM user_events
       WHERE date(created_at) = date(?)`,
      [date]
    );
    return (row?.dau as number) || 0;
  }

  /**
   * 计算 MAU (月活跃用户)
   */
  static async getMAU(yearMonth: string): Promise<number> {
    await getDb();
    const row = queryOne(
      `SELECT COUNT(DISTINCT user_id) as mau FROM user_events
       WHERE strftime('%Y-%m', created_at) = ?`,
      [yearMonth]
    );
    return (row?.mau as number) || 0;
  }

  /**
   * 获取用户行为路径
   */
  static async getUserPaths(
    userId: string,
    limit = 20
  ): Promise<Record<string, unknown>[]> {
    await getDb();
    return queryAll(
      `SELECT page_url, event_type, created_at
       FROM user_events
       WHERE user_id = ?
       ORDER BY created_at ASC
       LIMIT ?`,
      [userId, limit]
    );
  }

  /**
   * 获取页面访问统计
   */
  static async getPageStats(
    startDate: string,
    endDate: string
  ): Promise<Record<string, unknown>[]> {
    await getDb();
    return queryAll(
      `SELECT page_url, COUNT(*) as views, COUNT(DISTINCT user_id) as unique_visitors
       FROM user_events
       WHERE event_type = 'page_view' AND created_at BETWEEN ? AND ?
       GROUP BY page_url
       ORDER BY views DESC`,
      [startDate, endDate]
    );
  }

  /**
   * 计算留存率
   */
  static async getRetention(
    cohortDate: string,
    dayN: number
  ): Promise<number> {
    await getDb();

    const row = queryOne(
      `WITH cohort AS (
         SELECT DISTINCT user_id FROM user_events
         WHERE date(created_at) = date(?)
       )
       SELECT COUNT(DISTINCT e.user_id) * 1.0 / COUNT(DISTINCT c.user_id) as rate
       FROM cohort c
       LEFT JOIN user_events e ON c.user_id = e.user_id
         AND date(e.created_at) = date(?, '+' || ? || ' days')`,
      [cohortDate, cohortDate, dayN]
    );

    return (row?.rate as number) || 0;
  }

  /**
   * 更新每日统计表
   */
  static async updateDailyStats(date: string): Promise<void> {
    await getDb();

    const dau = await this.getDAU(date);
    const mau = await this.getMAU(date.substring(0, 7));
    const newUsers = ((queryOne(
      "SELECT COUNT(*) as count FROM users WHERE date(created_at) = date(?)",
      [date]
    ))?.count as number) || 0;

    const totalEvents = ((queryOne(
      'SELECT COUNT(*) as count FROM user_events WHERE date(created_at) = date(?)',
      [date]
    ))?.count as number) || 0;

    const resumeGenerated = ((queryOne(
      "SELECT COUNT(*) as count FROM user_events WHERE event_type = 'resume_generate' AND date(created_at) = date(?)",
      [date]
    ))?.count as number) || 0;

    const resumeDownloaded = ((queryOne(
      "SELECT COUNT(*) as count FROM user_events WHERE event_type = 'resume_download' AND date(created_at) = date(?)",
      [date]
    ))?.count as number) || 0;

    const aiCalls = ((queryOne(
      "SELECT COUNT(*) as count FROM user_events WHERE event_category = 'ai_call' AND date(created_at) = date(?)",
      [date]
    ))?.count as number) || 0;

    execute(
      `INSERT OR REPLACE INTO daily_stats
       (id, stat_date, dau, mau, new_users, active_users, total_events, resume_generated, resume_downloaded, ai_calls)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `ds-${date}`,
        date,
        dau,
        mau,
        newUsers,
        dau,
        totalEvents,
        resumeGenerated,
        resumeDownloaded,
        aiCalls,
      ]
    );
  }

  /**
   * 获取每日统计趋势
   */
  static async getDailyStatsRange(
    startDate: string,
    endDate: string
  ): Promise<Record<string, unknown>[]> {
    await getDb();
    return queryAll(
      `SELECT * FROM daily_stats WHERE stat_date BETWEEN ? AND ? ORDER BY stat_date ASC`,
      [startDate, endDate]
    );
  }
}
