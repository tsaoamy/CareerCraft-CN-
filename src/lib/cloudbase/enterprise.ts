/**
 * CloudBase 企业版数据存储
 */

import { v4 as uuidv4 } from 'uuid';
import {
  COLLECTIONS,
  getDoc,
  upsertDoc,
  queryDocs,
} from './client';

interface EnterpriseUserDoc {
  _id: string;
  user_id: string;
  company_name: string;
  company_size: string;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}

interface EnterpriseBatchDoc {
  _id: string;
  enterprise_user_id: string;
  batch_name: string;
  total_resumes: number;
  processed: number;
  filters: unknown;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ResumeResultDoc {
  _id: string;
  batch_id: string;
  resume_content: string;
  parsed_data: unknown;
  score: number;
  rank: number;
  tags: unknown;
  recommendation: string;
  interview_questions: unknown;
  created_at: string;
}

export class CloudEnterpriseStore {
  /** 创建企业用户 */
  static async createEnterpriseUser(data: {
    user_id: string;
    company_name: string;
    company_size?: string;
    subscription_tier?: string;
  }): Promise<string> {
    const docs = await queryDocs<EnterpriseUserDoc>(
      COLLECTIONS.enterpriseUsers,
      { user_id: data.user_id },
      { limit: 1 }
    );
    if (docs[0]) return docs[0]._id;

    const id = uuidv4();
    const now = new Date().toISOString();
    await upsertDoc(COLLECTIONS.enterpriseUsers, id, {
      _id: id,
      user_id: data.user_id,
      company_name: data.company_name,
      company_size: data.company_size || '',
      subscription_tier: data.subscription_tier || 'trial',
      created_at: now,
      updated_at: now,
    });
    return id;
  }

  /** 获取企业用户 */
  static async getByUserId(userId: string): Promise<EnterpriseUserDoc | null> {
    const docs = await queryDocs<EnterpriseUserDoc>(
      COLLECTIONS.enterpriseUsers,
      { user_id: userId },
      { limit: 1 }
    );
    return docs[0] ?? null;
  }

  /** 创建批次 */
  static async createBatch(
    enterpriseUserId: string,
    batchName: string,
    totalResumes: number,
    filters?: Record<string, unknown>
  ): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();
    await upsertDoc(COLLECTIONS.enterpriseBatches, id, {
      _id: id,
      enterprise_user_id: enterpriseUserId,
      batch_name: batchName,
      total_resumes: totalResumes,
      processed: 0,
      filters: filters || {},
      status: 'pending',
      created_at: now,
      updated_at: now,
    });
    return id;
  }

  /** 获取批次列表 */
  static async getBatches(enterpriseUserId: string): Promise<EnterpriseBatchDoc[]> {
    return queryDocs<EnterpriseBatchDoc>(
      COLLECTIONS.enterpriseBatches,
      { enterprise_user_id: enterpriseUserId },
      { limit: 100, orderBy: 'created_at', orderDir: 'desc' }
    );
  }

  /** 添加简历分析结果 */
  static async addResumeResult(data: {
    batch_id: string;
    resume_content: string;
    parsed_data?: Record<string, unknown>;
    score?: number;
    tags?: string[];
    recommendation?: string;
    interview_questions?: string[];
  }): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();

    // Calculate rank
    const existing = await queryDocs<ResumeResultDoc>(
      COLLECTIONS.enterpriseResumeResults,
      { batch_id: data.batch_id },
      { limit: 1000 }
    );
    const rank = existing.length + 1;

    await upsertDoc(COLLECTIONS.enterpriseResumeResults, id, {
      _id: id,
      batch_id: data.batch_id,
      resume_content: data.resume_content,
      parsed_data: data.parsed_data || {},
      score: data.score || 0,
      rank,
      tags: data.tags || [],
      recommendation: data.recommendation || '',
      interview_questions: data.interview_questions || [],
      created_at: now,
    });

    // Update batch progress
    const batch = await getDoc<EnterpriseBatchDoc>(COLLECTIONS.enterpriseBatches, data.batch_id);
    if (batch) {
      await upsertDoc(COLLECTIONS.enterpriseBatches, data.batch_id, {
        processed: (batch.processed || 0) + 1,
        updated_at: now,
      });
    }

    return id;
  }

  /** 获取批次结果 */
  static async getBatchResults(
    batchId: string,
    filters?: { minScore?: number; keywords?: string[]; educationLevel?: string }
  ): Promise<ResumeResultDoc[]> {
    const where: Record<string, unknown> = { batch_id: batchId };
    if (filters?.minScore) {
      where.score = { $gte: filters.minScore };
    }
    return queryDocs<ResumeResultDoc>(
      COLLECTIONS.enterpriseResumeResults,
      where,
      { limit: 500, orderBy: 'score', orderDir: 'desc' }
    );
  }

  /** 更新批次状态 */
  static async updateBatchStatus(batchId: string, status: string): Promise<boolean> {
    await upsertDoc(COLLECTIONS.enterpriseBatches, batchId, {
      status,
      updated_at: new Date().toISOString(),
    });
    return true;
  }

  /** 获取排行榜 */
  static async getLeaderboard(batchId: string, topN = 10): Promise<ResumeResultDoc[]> {
    return queryDocs<ResumeResultDoc>(
      COLLECTIONS.enterpriseResumeResults,
      { batch_id: batchId },
      { limit: topN, orderBy: 'score', orderDir: 'desc' }
    );
  }
}
