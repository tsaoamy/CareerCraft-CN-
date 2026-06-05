/**
 * 招聘匹配数据仓库 (Phase 5) — CloudBase 优先，SQLite 本地回退
 */

import { getDb, queryAll, queryOne, execute, saveDb } from '@/lib/db';
import { JOB_POSITIONS_SEED, getPositionById } from '@/data/job-positions';
import { isCloudBaseEnabled } from '@/lib/cloudbase/client';
import { CloudMatchingStore } from '@/lib/cloudbase/matching';
import { v4 as uuidv4 } from 'uuid';

export interface MatchResult {
  match_score: number;
  skill_gaps: { skill: string; required_level: number; current_level: number }[];
  keyword_coverage: number;
  competitiveness_score: number;
  optimization_tips: string[];
  top5_positions: { title: string; company: string; match_score: number }[];
  top5_industries: string[];
  growth_path: { step: number; description: string; timeframe: string }[];
}

export class MatchingRepository {
  static async seedPositions(): Promise<void> {
    if (isCloudBaseEnabled()) {
      for (const p of JOB_POSITIONS_SEED) {
        await CloudMatchingStore.seedPosition(p as unknown as {
          id: string; title: string; company: string; department: string;
          industry: string; job_level: string; location: string;
          salary_range: string; jd_text: string; requirements: unknown; keywords: unknown;
        });
      }
      return;
    }
    await getDb();
    execute(`UPDATE job_positions SET is_active = 0 WHERE id IN ('job-001','job-002','job-003','job-004','job-005')`);
    for (const p of JOB_POSITIONS_SEED) {
      execute(`INSERT OR REPLACE INTO job_positions (id, title, company, department, industry, job_level, location, salary_range, jd_text, requirements, keywords, is_active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))`,
        [p.id, p.title, p.company, p.department, p.industry, p.job_level, p.location, p.salary_range, p.jd_text, JSON.stringify(p.requirements), JSON.stringify(p.keywords)]);
    }
    await saveDb();
  }

  static async listPositions(filters?: { industry?: string; job_level?: string; search?: string }): Promise<Record<string, unknown>[]> {
    if (isCloudBaseEnabled()) {
      await this.seedPositions();
      const docs = await CloudMatchingStore.listPositions(filters);
      return docs as unknown as Record<string, unknown>[];
    }
    await this.seedPositions();
    let where = "WHERE is_active = 1"; const params: unknown[] = [];
    if (filters?.industry) { where += ' AND industry = ?'; params.push(filters.industry); }
    if (filters?.job_level) { where += ' AND job_level = ?'; params.push(filters.job_level); }
    if (filters?.search) { const s = `%${filters.search}%`; where += ' AND (title LIKE ? OR company LIKE ? OR jd_text LIKE ?)'; params.push(s, s, s); }
    return queryAll(`SELECT * FROM job_positions ${where} ORDER BY created_at DESC`, params);
  }

  static async createPosition(data: { title: string; company: string; department?: string; industry?: string; job_level?: string; location?: string; salary_range?: string; jd_text: string; requirements?: Record<string, unknown>; keywords?: string[]; }): Promise<string> {
    if (isCloudBaseEnabled()) return CloudMatchingStore.createPosition(data);
    await getDb();
    const id = uuidv4();
    execute(`INSERT INTO job_positions (id, title, company, department, industry, job_level, location, salary_range, jd_text, requirements, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.title, data.company, data.department || '', data.industry || '', data.job_level || '', data.location || '', data.salary_range || '', data.jd_text, JSON.stringify(data.requirements || {}), JSON.stringify(data.keywords || [])]);
    return id;
  }

  static async saveMatch(userId: string, positionId: string, result: MatchResult): Promise<string> {
    if (isCloudBaseEnabled()) return CloudMatchingStore.saveMatch(userId, positionId, result);
    await getDb();
    const id = uuidv4();
    execute(`INSERT INTO job_matches (id, user_id, position_id, match_score, skill_gaps, keyword_coverage, competitiveness_score, optimization_tips, top5_positions, top5_industries, growth_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, positionId, result.match_score, JSON.stringify(result.skill_gaps), result.keyword_coverage, result.competitiveness_score, JSON.stringify(result.optimization_tips), JSON.stringify(result.top5_positions), JSON.stringify(result.top5_industries), JSON.stringify(result.growth_path)]);
    return id;
  }

  static async getUserMatches(userId: string): Promise<Record<string, unknown>[]> {
    if (isCloudBaseEnabled()) {
      const docs = await CloudMatchingStore.getUserMatches(userId);
      return docs as unknown as Record<string, unknown>[];
    }
    await getDb();
    return queryAll(`SELECT jm.*, jp.title, jp.company, jp.industry FROM job_matches jm JOIN job_positions jp ON jm.position_id = jp.id WHERE jm.user_id = ? ORDER BY jm.created_at DESC`, [userId]);
  }

  static async getMatchStats(): Promise<Record<string, unknown>[]> {
    if (isCloudBaseEnabled()) return CloudMatchingStore.getMatchStats();
    await getDb();
    return queryAll(`SELECT jp.title, jp.company, COUNT(jm.id) as match_count, AVG(jm.match_score) as avg_score, MAX(jm.match_score) as max_score FROM job_positions jp LEFT JOIN job_matches jm ON jp.id = jm.position_id GROUP BY jp.id ORDER BY avg_score DESC`);
  }
}
