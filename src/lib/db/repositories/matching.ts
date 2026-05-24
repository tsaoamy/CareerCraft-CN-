/**
 * 招聘匹配数据仓库 (Phase 5)
 */

import { getDb, queryAll, queryOne, execute } from '@/lib/db';
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
  /**
   * 获取所有岗位
   */
  static async listPositions(filters?: {
    industry?: string;
    job_level?: string;
    search?: string;
  }): Promise<Record<string, unknown>[]> {
    await getDb();

    let where = "WHERE is_active = 1";
    const params: unknown[] = [];

    if (filters?.industry) {
      where += ' AND industry = ?';
      params.push(filters.industry);
    }
    if (filters?.job_level) {
      where += ' AND job_level = ?';
      params.push(filters.job_level);
    }
    if (filters?.search) {
      where += ' AND (title LIKE ? OR company LIKE ? OR jd_text LIKE ?)';
      const s = `%${filters.search}%`;
      params.push(s, s, s);
    }

    return queryAll(
      `SELECT * FROM job_positions ${where} ORDER BY created_at DESC`,
      params
    );
  }

  /**
   * 创建岗位
   */
  static async createPosition(data: {
    title: string;
    company: string;
    department?: string;
    industry?: string;
    job_level?: string;
    location?: string;
    salary_range?: string;
    jd_text: string;
    requirements?: Record<string, unknown>;
    keywords?: string[];
  }): Promise<string> {
    await getDb();

    const id = uuidv4();
    execute(
      `INSERT INTO job_positions (id, title, company, department, industry, job_level, location, salary_range, jd_text, requirements, keywords)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.title,
        data.company,
        data.department || '',
        data.industry || '',
        data.job_level || '',
        data.location || '',
        data.salary_range || '',
        data.jd_text,
        JSON.stringify(data.requirements || {}),
        JSON.stringify(data.keywords || []),
      ]
    );

    return id;
  }

  /**
   * 保存匹配结果
   */
  static async saveMatch(
    userId: string,
    positionId: string,
    result: MatchResult
  ): Promise<string> {
    await getDb();

    const id = uuidv4();
    execute(
      `INSERT INTO job_matches (id, user_id, position_id, match_score, skill_gaps, keyword_coverage, competitiveness_score, optimization_tips, top5_positions, top5_industries, growth_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        positionId,
        result.match_score,
        JSON.stringify(result.skill_gaps),
        result.keyword_coverage,
        result.competitiveness_score,
        JSON.stringify(result.optimization_tips),
        JSON.stringify(result.top5_positions),
        JSON.stringify(result.top5_industries),
        JSON.stringify(result.growth_path),
      ]
    );

    return id;
  }

  /**
   * 获取用户匹配历史
   */
  static async getUserMatches(userId: string): Promise<Record<string, unknown>[]> {
    await getDb();
    return queryAll(
      `SELECT jm.*, jp.title, jp.company, jp.industry
       FROM job_matches jm
       JOIN job_positions jp ON jm.position_id = jp.id
       WHERE jm.user_id = ?
       ORDER BY jm.created_at DESC`,
      [userId]
    );
  }

  /**
   * 获取岗位匹配统计
   */
  static async getMatchStats(): Promise<Record<string, unknown>[]> {
    await getDb();
    return queryAll(
      `SELECT
         jp.title,
         jp.company,
         COUNT(jm.id) as match_count,
         AVG(jm.match_score) as avg_score,
         MAX(jm.match_score) as max_score
       FROM job_positions jp
       LEFT JOIN job_matches jm ON jp.id = jm.position_id
       GROUP BY jp.id
       ORDER BY avg_score DESC`
    );
  }
}
