/**
 * CloudBase 岗位/匹配数据存储
 */

import { v4 as uuidv4 } from 'uuid';
import {
  COLLECTIONS,
  getDoc,
  upsertDoc,
  queryDocs,
  countDocs,
  listDocs,
} from './client';

interface PositionDoc {
  _id: string;
  title: string;
  company: string;
  department?: string;
  industry?: string;
  job_level?: string;
  location?: string;
  salary_range?: string;
  jd_text: string;
  requirements: unknown;
  keywords: unknown;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface MatchDoc {
  _id: string;
  user_id: string;
  position_id: string;
  match_score: number;
  skill_gaps: unknown;
  keyword_coverage: number;
  competitiveness_score: number;
  optimization_tips: unknown;
  top5_positions: unknown;
  top5_industries: unknown;
  growth_path: unknown;
  created_at: string;
}

export class CloudMatchingStore {
  /** 同步种子岗位 */
  static async seedPosition(pos: {
    id: string;
    title: string;
    company: string;
    department: string;
    industry: string;
    job_level: string;
    location: string;
    salary_range: string;
    jd_text: string;
    requirements: unknown;
    keywords: unknown;
  }): Promise<void> {
    await upsertDoc(COLLECTIONS.jobPositions, pos.id, {
      ...pos,
      is_active: 1,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  }

  /** 查询所有活跃岗位 */
  static async listPositions(filters?: {
    industry?: string;
    job_level?: string;
    search?: string;
  }): Promise<PositionDoc[]> {
    const where: Record<string, unknown> = { is_active: 1 };
    if (filters?.industry) where.industry = filters.industry;
    if (filters?.job_level) where.job_level = filters.job_level;
    // search uses regex
    if (filters?.search) {
      const s = filters.search;
      return queryDocs<PositionDoc>(
        COLLECTIONS.jobPositions,
        where,
        { limit: 100, orderBy: 'created_at' }
      ).then(docs =>
        docs.filter(
          d =>
            (d.title && d.title.includes(s)) ||
            (d.company && d.company.includes(s)) ||
            (d.jd_text && d.jd_text.includes(s))
        )
      );
    }
    return queryDocs<PositionDoc>(COLLECTIONS.jobPositions, where, {
      limit: 100,
      orderBy: 'created_at',
    });
  }

  /** 创建岗位 */
  static async createPosition(data: {
    title: string;
    company: string;
    department?: string;
    industry?: string;
    job_level?: string;
    location?: string;
    salary_range?: string;
    jd_text: string;
    requirements?: unknown;
    keywords?: unknown;
  }): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();
    await upsertDoc(COLLECTIONS.jobPositions, id, {
      ...data,
      _id: id,
      is_active: 1,
      created_at: now,
      updated_at: now,
    });
    return id;
  }

  /** 保存匹配结果 */
  static async saveMatch(
    userId: string,
    positionId: string,
    result: {
      match_score: number;
      skill_gaps: unknown;
      keyword_coverage: number;
      competitiveness_score: number;
      optimization_tips: unknown;
      top5_positions: unknown;
      top5_industries: unknown;
      growth_path: unknown;
    }
  ): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();
    await upsertDoc(COLLECTIONS.jobMatches, id, {
      _id: id,
      user_id: userId,
      position_id: positionId,
      ...result,
      created_at: now,
    });
    return id;
  }

  /** 获取用户匹配历史 */
  static async getUserMatches(userId: string): Promise<MatchDoc[]> {
    return queryDocs<MatchDoc>(
      COLLECTIONS.jobMatches,
      { user_id: userId },
      { limit: 100, orderBy: 'created_at', orderDir: 'desc' }
    );
  }

  /** 获取匹配统计 */
  static async getMatchStats(): Promise<Record<string, unknown>[]> {
    const positions = await listDocs<PositionDoc>(COLLECTIONS.jobPositions, 200);
    const stats: Record<string, unknown>[] = [];

    for (const pos of positions) {
      if (!pos.is_active) continue;
      const matches = await queryDocs<MatchDoc>(
        COLLECTIONS.jobMatches,
        { position_id: pos._id },
        { limit: 500 }
      );
      const scores = matches.map(m => m.match_score).filter(s => typeof s === 'number');
      stats.push({
        title: pos.title,
        company: pos.company,
        match_count: matches.length,
        avg_score: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
        max_score: scores.length > 0 ? Math.max(...scores) : 0,
      });
    }
    return stats.sort((a, b) => (b.avg_score as number) - (a.avg_score as number));
  }
}
