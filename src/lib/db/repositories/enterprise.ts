/**
 * 企业版数据仓库 (Phase 7) — CloudBase 优先，SQLite 本地回退
 */

import { getDb, queryAll, queryOne, execute } from '@/lib/db';
import { isCloudBaseEnabled } from '@/lib/cloudbase/client';
import { CloudEnterpriseStore } from '@/lib/cloudbase/enterprise';
import { v4 as uuidv4 } from 'uuid';

export class EnterpriseRepository {
  static async createEnterpriseUser(data: { user_id: string; company_name: string; company_size?: string; subscription_tier?: string; }): Promise<string> {
    if (isCloudBaseEnabled()) return CloudEnterpriseStore.createEnterpriseUser(data);
    await getDb();
    const existing = queryOne('SELECT id FROM enterprise_users WHERE user_id = ?', [data.user_id]);
    if (existing) return existing.id as string;
    const id = uuidv4();
    execute(`INSERT INTO enterprise_users (id, user_id, company_name, company_size, subscription_tier) VALUES (?, ?, ?, ?, ?)`, [id, data.user_id, data.company_name, data.company_size || '', data.subscription_tier || 'trial']);
    return id;
  }

  static async getByUserId(userId: string): Promise<Record<string, unknown> | null> {
    if (isCloudBaseEnabled()) {
      const doc = await CloudEnterpriseStore.getByUserId(userId);
      return doc as unknown as Record<string, unknown> | null;
    }
    await getDb();
    return queryOne('SELECT * FROM enterprise_users WHERE user_id = ?', [userId]);
  }

  static async createBatch(enterpriseUserId: string, batchName: string, totalResumes: number, filters?: Record<string, unknown>): Promise<string> {
    if (isCloudBaseEnabled()) return CloudEnterpriseStore.createBatch(enterpriseUserId, batchName, totalResumes, filters);
    await getDb();
    const id = uuidv4();
    execute(`INSERT INTO enterprise_batches (id, enterprise_user_id, batch_name, total_resumes, filters) VALUES (?, ?, ?, ?, ?)`, [id, enterpriseUserId, batchName, totalResumes, JSON.stringify(filters || {})]);
    return id;
  }

  static async getBatches(enterpriseUserId: string): Promise<Record<string, unknown>[]> {
    if (isCloudBaseEnabled()) {
      const docs = await CloudEnterpriseStore.getBatches(enterpriseUserId);
      return docs as unknown as Record<string, unknown>[];
    }
    await getDb();
    return queryAll('SELECT * FROM enterprise_batches WHERE enterprise_user_id = ? ORDER BY created_at DESC', [enterpriseUserId]);
  }

  static async addResumeResult(data: { batch_id: string; resume_content: string; parsed_data?: Record<string, unknown>; score?: number; tags?: string[]; recommendation?: string; interview_questions?: string[]; }): Promise<string> {
    if (isCloudBaseEnabled()) return CloudEnterpriseStore.addResumeResult(data);
    await getDb();
    const id = uuidv4();
    const rankRow = queryOne('SELECT COUNT(*) as count FROM enterprise_resume_results WHERE batch_id = ?', [data.batch_id]);
    const rank = ((rankRow?.count as number) || 0) + 1;
    execute(`INSERT INTO enterprise_resume_results (id, batch_id, resume_content, parsed_data, score, rank, tags, recommendation, interview_questions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.batch_id, data.resume_content, JSON.stringify(data.parsed_data || {}), data.score || 0, rank, JSON.stringify(data.tags || []), data.recommendation || '', JSON.stringify(data.interview_questions || [])]);
    execute('UPDATE enterprise_batches SET processed = processed + 1 WHERE id = ?', [data.batch_id]);
    return id;
  }

  static async getBatchResults(batchId: string, filters?: { minScore?: number; keywords?: string[]; educationLevel?: string; }): Promise<Record<string, unknown>[]> {
    if (isCloudBaseEnabled()) {
      const docs = await CloudEnterpriseStore.getBatchResults(batchId, filters);
      return docs as unknown as Record<string, unknown>[];
    }
    await getDb();
    let where = 'WHERE batch_id = ?'; const params: unknown[] = [batchId];
    if (filters?.minScore) { where += ' AND score >= ?'; params.push(filters.minScore); }
    return queryAll(`SELECT * FROM enterprise_resume_results ${where} ORDER BY score DESC`, params);
  }

  static async updateBatchStatus(batchId: string, status: string): Promise<boolean> {
    if (isCloudBaseEnabled()) return CloudEnterpriseStore.updateBatchStatus(batchId, status);
    await getDb();
    const result = execute('UPDATE enterprise_batches SET status = ? WHERE id = ?', [status, batchId]);
    return result.changes > 0;
  }

  static async getLeaderboard(batchId: string, topN = 10): Promise<Record<string, unknown>[]> {
    if (isCloudBaseEnabled()) {
      const docs = await CloudEnterpriseStore.getLeaderboard(batchId, topN);
      return docs as unknown as Record<string, unknown>[];
    }
    await getDb();
    return queryAll(`SELECT * FROM enterprise_resume_results WHERE batch_id = ? ORDER BY score DESC LIMIT ?`, [batchId, topN]);
  }
}
