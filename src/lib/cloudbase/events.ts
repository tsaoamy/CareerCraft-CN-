/**
 * CloudBase 行为事件数据存储
 */

import { v4 as uuidv4 } from 'uuid';
import {
  COLLECTIONS,
  upsertDoc,
  queryDocs,
  countDocs,
  paginatedDocs,
} from './client';

interface EventDoc {
  _id: string;
  user_id: string;
  session_id: string;
  event_type: string;
  event_category: string;
  event_data: unknown;
  page_url: string;
  referrer: string;
  duration_ms: number;
  created_at: string;
}

interface DailyStatsDoc {
  _id: string;
  stat_date: string;
  dau: number;
  mau: number;
  new_users: number;
  active_users: number;
  total_events: number;
  resume_generated: number;
  resume_downloaded: number;
  ai_calls: number;
  updated_at: string;
}

export class CloudEventStore {
  /** 记录事件 */
  static async track(event: {
    event_type: string;
    event_category?: string;
    event_data?: unknown;
    user_id?: string;
    session_id?: string;
    page_url?: string;
    referrer?: string;
    duration_ms?: number;
  }): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();
    await upsertDoc(COLLECTIONS.userEvents, id, {
      _id: id,
      user_id: event.user_id || '',
      session_id: event.session_id || '',
      event_type: event.event_type,
      event_category: event.event_category || 'general',
      event_data: event.event_data || {},
      page_url: event.page_url || '',
      referrer: event.referrer || '',
      duration_ms: event.duration_ms || 0,
      created_at: now,
    });
    return id;
  }

  /** 获取统计 */
  static async getStats(startDate: string, endDate: string): Promise<Record<string, unknown>[]> {
    // Use end date +1 day for range queries
    const docs = await queryDocs<EventDoc>(
      COLLECTIONS.userEvents,
      {},
      { limit: 1000, orderBy: 'created_at', orderDir: 'desc' }
    );

    const filtered = docs.filter(d => {
      const date = d.created_at?.substring(0, 10);
      return date && date >= startDate.substring(0, 10) && date <= endDate.substring(0, 10);
    });

    const typeMap: Record<string, number> = {};
    for (const d of filtered) {
      typeMap[d.event_type] = (typeMap[d.event_type] || 0) + 1;
    }

    return Object.entries(typeMap)
      .map(([event_type, count]) => ({ event_type, count }))
      .sort((a, b) => b.count - a.count);
  }

  /** 获取事件列表 */
  static async list(
    page = 1,
    pageSize = 50,
    filters?: { event_type?: string; user_id?: string; startDate?: string; endDate?: string }
  ): Promise<{ events: EventDoc[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (filters?.event_type) where.event_type = filters.event_type;
    if (filters?.user_id) where.user_id = filters.user_id;

    const result = await paginatedDocs<EventDoc>(
      COLLECTIONS.userEvents,
      where,
      page,
      pageSize,
      'created_at',
      'desc'
    );

    let events = result.data;
    if (filters?.startDate || filters?.endDate) {
      const sd = filters.startDate ? filters.startDate.substring(0, 10) : null;
      const ed = filters.endDate ? filters.endDate.substring(0, 10) : null;
      events = events.filter(d => {
        const dDate = d.created_at?.substring(0, 10);
        if (!dDate) return false;
        if (sd && dDate < sd) return false;
        if (ed && dDate > ed) return false;
        return true;
      });
    }

    return { events, total: result.total };
  }

  /** 计算 DAU */
  static async getDAU(date: string): Promise<number> {
    const dateStr = date.substring(0, 10);
    const docs = await queryDocs<EventDoc>(
      COLLECTIONS.userEvents,
      {},
      { limit: 2000 }
    );
    const userIds = new Set<string>();
    for (const d of docs) {
      if (d.created_at?.substring(0, 10) === dateStr && d.user_id) {
        userIds.add(d.user_id);
      }
    }
    return userIds.size;
  }

  /** 计算 MAU */
  static async getMAU(yearMonth: string): Promise<number> {
    const docs = await queryDocs<EventDoc>(
      COLLECTIONS.userEvents,
      {},
      { limit: 5000 }
    );
    const userIds = new Set<string>();
    for (const d of docs) {
      const ym = d.created_at?.substring(0, 7);
      if (ym === yearMonth && d.user_id) {
        userIds.add(d.user_id);
      }
    }
    return userIds.size;
  }

  /** 更新每日统计 */
  static async updateDailyStats(date: string): Promise<void> {
    const dau = await this.getDAU(date);
    const mau = await this.getMAU(date.substring(0, 7));

    const dateStr = date.substring(0, 10);
    const allDocs = await queryDocs<EventDoc>(
      COLLECTIONS.userEvents,
      {},
      { limit: 5000 }
    );
    const dayDocs = allDocs.filter(d => d.created_at?.substring(0, 10) === dateStr);

    const totalEvents = dayDocs.length;
    const resumeGenerated = dayDocs.filter(d => d.event_type === 'resume_generate').length;
    const resumeDownloaded = dayDocs.filter(d => d.event_type === 'resume_download').length;
    const aiCalls = dayDocs.filter(d => d.event_category === 'ai_call').length;

    const statId = `ds-${dateStr}`;
    await upsertDoc(COLLECTIONS.dailyStats, statId, {
      _id: statId,
      stat_date: dateStr,
      dau,
      mau,
      new_users: 0,
      active_users: dau,
      total_events: totalEvents,
      resume_generated: resumeGenerated,
      resume_downloaded: resumeDownloaded,
      ai_calls: aiCalls,
      updated_at: new Date().toISOString(),
    });
  }

  /** 获取每日统计范围 */
  static async getDailyStatsRange(startDate: string, endDate: string): Promise<DailyStatsDoc[]> {
    const docs = await queryDocs<DailyStatsDoc>(
      COLLECTIONS.dailyStats,
      {},
      { limit: 365, orderBy: 'stat_date', orderDir: 'asc' }
    );
    return docs.filter(d => {
      const dDate = d.stat_date?.substring(0, 10);
      return dDate && dDate >= startDate.substring(0, 10) && dDate <= endDate.substring(0, 10);
    });
  }

  /** 计算留存率 */
  static async getRetention(cohortDate: string, dayN: number): Promise<number> {
    const cohortStr = cohortDate.substring(0, 10);
    const allDocs = await queryDocs<EventDoc>(
      COLLECTIONS.userEvents,
      {},
      { limit: 5000 }
    );

    // Get cohort users
    const cohortUsers = new Set<string>();
    for (const d of allDocs) {
      if (d.created_at?.substring(0, 10) === cohortStr && d.user_id) {
        cohortUsers.add(d.user_id);
      }
    }
    if (cohortUsers.size === 0) return 0;

    // Calculate target date
    const cohortDateObj = new Date(cohortStr);
    cohortDateObj.setDate(cohortDateObj.getDate() + dayN);
    const targetStr = cohortDateObj.toISOString().substring(0, 10);

    // Count retained
    const retainedUsers = new Set<string>();
    for (const d of allDocs) {
      if (d.created_at?.substring(0, 10) === targetStr && d.user_id && cohortUsers.has(d.user_id)) {
        retainedUsers.add(d.user_id);
      }
    }

    return retainedUsers.size / cohortUsers.size;
  }
}
