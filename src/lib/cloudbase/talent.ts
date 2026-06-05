/**
 * CloudBase 人才画像数据存储
 */

import { v4 as uuidv4 } from 'uuid';
import {
  COLLECTIONS,
  getDoc,
  upsertDoc,
  queryDocs,
  countDocs,
  paginatedDocs,
} from './client';

interface TalentDoc {
  _id: string;
  user_id: string;
  skill_structure: unknown;
  career_direction: string;
  career_path: unknown;
  job_match_score: number;
  capability_tags: unknown;
  growth_potential: number;
  career_risk_score: number;
  career_risk_factors: unknown;
  education_level: string;
  work_years: number;
  industry: string;
  analysis_raw?: unknown;
  created_at: string;
  updated_at: string;
}

export class CloudTalentStore {
  static async getByUserId(userId: string): Promise<TalentDoc | null> {
    const docs = await queryDocs<TalentDoc>(COLLECTIONS.talentProfiles, { user_id: userId }, { limit: 1 });
    return docs[0] ?? null;
  }

  static async upsert(
    userId: string,
    data: {
      skill_structure: unknown;
      career_direction: string;
      career_path: unknown;
      job_match_score: number;
      capability_tags: unknown;
      growth_potential: number;
      career_risk_score: number;
      career_risk_factors: unknown;
      education_level: string;
      work_years: number;
      industry: string;
      analysis_raw?: unknown;
    }
  ): Promise<string> {
    const existing = await this.getByUserId(userId);
    const now = new Date().toISOString();

    if (existing) {
      await upsertDoc(COLLECTIONS.talentProfiles, existing._id, {
        ...data,
        user_id: userId,
        updated_at: now,
      });
      return existing._id;
    }

    const id = uuidv4();
    await upsertDoc(COLLECTIONS.talentProfiles, id, {
      ...data,
      _id: id,
      user_id: userId,
      created_at: now,
      updated_at: now,
    });
    return id;
  }

  static async listAll(page = 1, pageSize = 20): Promise<{
    profiles: TalentDoc[];
    total: number;
  }> {
    const result = await paginatedDocs<TalentDoc>(
      COLLECTIONS.talentProfiles,
      {},
      page,
      pageSize,
      'updated_at',
      'desc'
    );
    return { profiles: result.data, total: result.total };
  }

  static async getSkillDistribution(): Promise<{ name: string; value: number }[]> {
    const docs = await queryDocs<TalentDoc>(
      COLLECTIONS.talentProfiles,
      { capability_tags: { $nin: [null, []] } },
      { limit: 500 }
    );

    const tagCounts: Record<string, number> = {};
    for (const doc of docs) {
      const tags = Array.isArray(doc.capability_tags) ? doc.capability_tags : [];
      for (const tag of tags) {
        if (typeof tag === 'string') {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      }
    }

    return Object.entries(tagCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 30);
  }
}
