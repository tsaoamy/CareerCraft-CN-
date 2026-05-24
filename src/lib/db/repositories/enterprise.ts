/**
 * 企业版数据仓库 (Phase 7)
 */

import { getDb, queryAll, queryOne, execute } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class EnterpriseRepository {
  /**
   * 创建企业用户
   */
  static async createEnterpriseUser(data: {
    user_id: string;
    company_name: string;
    company_size?: string;
    subscription_tier?: string;
  }): Promise<string> {
    await getDb();

    const existing = queryOne(
      'SELECT id FROM enterprise_users WHERE user_id = ?',
      [data.user_id]
    );
    if (existing) return existing.id as string;

    const id = uuidv4();
    execute(
      `INSERT INTO enterprise_users (id, user_id, company_name, company_size, subscription_tier)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        data.user_id,
        data.company_name,
        data.company_size || '',
        data.subscription_tier || 'trial',
      ]
    );

    return id;
  }

  /**
   * 获取企业用户信息
   */
  static async getByUserId(userId: string): Promise<Record<string, unknown> | null> {
    await getDb();
    return queryOne('SELECT * FROM enterprise_users WHERE user_id = ?', [userId]);
  }

  /**
   * 创建简历批次
   */
  static async createBatch(
    enterpriseUserId: string,
    batchName: string,
    totalResumes: number,
    filters?: Record<string, unknown>
  ): Promise<string> {
    await getDb();

    const id = uuidv4();
    execute(
      `INSERT INTO enterprise_batches (id, enterprise_user_id, batch_name, total_resumes, filters)
       VALUES (?, ?, ?, ?, ?)`,
      [id, enterpriseUserId, batchName, totalResumes, JSON.stringify(filters || {})]
    );

    return id;
  }

  /**
   * 获取企业批次列表
   */
  static async getBatches(enterpriseUserId: string): Promise<Record<string, unknown>[]> {
    await getDb();
    return queryAll(
      'SELECT * FROM enterprise_batches WHERE enterprise_user_id = ? ORDER BY created_at DESC',
      [enterpriseUserId]
    );
  }

  /**
   * 添加简历分析结果
   */
  static async addResumeResult(data: {
    batch_id: string;
    resume_content: string;
    parsed_data?: Record<string, unknown>;
    score?: number;
    tags?: string[];
    recommendation?: string;
    interview_questions?: string[];
  }): Promise<string> {
    await getDb();

    const id = uuidv4();

    // 获取当前排名
    const rankRow = queryOne(
      'SELECT COUNT(*) as count FROM enterprise_resume_results WHERE batch_id = ?',
      [data.batch_id]
    );
    const rank = ((rankRow?.count as number) || 0) + 1;

    execute(
      `INSERT INTO enterprise_resume_results (id, batch_id, resume_content, parsed_data, score, rank, tags, recommendation, interview_questions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.batch_id,
        data.resume_content,
        JSON.stringify(data.parsed_data || {}),
        data.score || 0,
        rank,
        JSON.stringify(data.tags || []),
        data.recommendation || '',
        JSON.stringify(data.interview_questions || []),
      ]
    );

    // 更新批次进度
    execute(
      'UPDATE enterprise_batches SET processed = processed + 1 WHERE id = ?',
      [data.batch_id]
    );

    return id;
  }

  /**
   * 获取批次分析结果（按排名排序）
   */
  static async getBatchResults(
    batchId: string,
    filters?: {
      minScore?: number;
      keywords?: string[];
      educationLevel?: string;
    }
  ): Promise<Record<string, unknown>[]> {
    await getDb();

    let where = 'WHERE batch_id = ?';
    const params: unknown[] = [batchId];

    if (filters?.minScore) {
      where += ' AND score >= ?';
      params.push(filters.minScore);
    }

    return queryAll(
      `SELECT * FROM enterprise_resume_results ${where} ORDER BY score DESC`,
      params
    );
  }

  /**
   * 更新批次状态
   */
  static async updateBatchStatus(
    batchId: string,
    status: string
  ): Promise<boolean> {
    await getDb();
    const result = execute(
      'UPDATE enterprise_batches SET status = ? WHERE id = ?',
      [status, batchId]
    );
    return result.changes > 0;
  }

  /**
   * 获取候选人排行榜
   */
  static async getLeaderboard(
    batchId: string,
    topN = 10
  ): Promise<Record<string, unknown>[]> {
    await getDb();
    return queryAll(
      `SELECT * FROM enterprise_resume_results
       WHERE batch_id = ?
       ORDER BY score DESC
       LIMIT ?`,
      [batchId, topN]
    );
  }
}
