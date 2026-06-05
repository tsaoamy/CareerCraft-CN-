/**
 * 人才画像数据仓库 (Phase 4) — CloudBase 优先，SQLite 本地回退
 */

import { getDb, queryAll, queryOne, execute } from '@/lib/db';
import { isCloudBaseEnabled } from '@/lib/cloudbase/client';
import { CloudTalentStore } from '@/lib/cloudbase/talent';
import { v4 as uuidv4 } from 'uuid';

export interface TalentAnalysis {
  skill_structure: {
    technical: { name: string; level: number }[];
    soft: { name: string; level: number }[];
    tools: { name: string; proficiency: number }[];
  };
  career_direction: string;
  career_path: { role: string; years: number; description: string }[];
  job_match_score: number;
  capability_tags: string[];
  growth_potential: number;
  career_risk_score: number;
  career_risk_factors: string[];
  education_level: string;
  work_years: number;
  industry: string;
}

export class TalentRepository {
  static async getByUserId(userId: string): Promise<Record<string, unknown> | null> {
    if (isCloudBaseEnabled()) {
      const cloud = await CloudTalentStore.getByUserId(userId);
      if (cloud) return cloud as unknown as Record<string, unknown>;
    }
    await getDb();
    return queryOne('SELECT * FROM talent_profiles WHERE user_id = ?', [userId]);
  }

  static async upsert(userId: string, analysis: TalentAnalysis): Promise<string> {
    if (isCloudBaseEnabled()) {
      return CloudTalentStore.upsert(userId, {
        skill_structure: analysis.skill_structure,
        career_direction: analysis.career_direction,
        career_path: analysis.career_path,
        job_match_score: analysis.job_match_score,
        capability_tags: analysis.capability_tags,
        growth_potential: analysis.growth_potential,
        career_risk_score: analysis.career_risk_score,
        career_risk_factors: analysis.career_risk_factors,
        education_level: analysis.education_level,
        work_years: analysis.work_years,
        industry: analysis.industry,
        analysis_raw: analysis,
      });
    }
    await getDb();
    const existing = await this.getByUserId(userId);
    if (existing) {
      execute(
        `UPDATE talent_profiles SET
          skill_structure = ?, career_direction = ?, career_path = ?,
          job_match_score = ?, capability_tags = ?, growth_potential = ?,
          career_risk_score = ?, career_risk_factors = ?,
          education_level = ?, work_years = ?, industry = ?,
          analysis_raw = ?, analyzed_at = datetime('now'), updated_at = datetime('now')
        WHERE user_id = ?`,
        [
          JSON.stringify(analysis.skill_structure), analysis.career_direction,
          JSON.stringify(analysis.career_path), analysis.job_match_score,
          JSON.stringify(analysis.capability_tags), analysis.growth_potential,
          analysis.career_risk_score, JSON.stringify(analysis.career_risk_factors),
          analysis.education_level, analysis.work_years, analysis.industry,
          JSON.stringify(analysis), userId,
        ]
      );
      return existing.id as string;
    }
    const id = uuidv4();
    execute(
      `INSERT INTO talent_profiles (id, user_id, skill_structure, career_direction, career_path,
        job_match_score, capability_tags, growth_potential, career_risk_score, career_risk_factors,
        education_level, work_years, industry, analysis_raw)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, JSON.stringify(analysis.skill_structure), analysis.career_direction,
        JSON.stringify(analysis.career_path), analysis.job_match_score,
        JSON.stringify(analysis.capability_tags), analysis.growth_potential,
        analysis.career_risk_score, JSON.stringify(analysis.career_risk_factors),
        analysis.education_level, analysis.work_years, analysis.industry, JSON.stringify(analysis)]
    );
    return id;
  }

  static async listAll(page = 1, pageSize = 20): Promise<{ profiles: Record<string, unknown>[]; total: number }> {
    if (isCloudBaseEnabled()) {
      const result = await CloudTalentStore.listAll(page, pageSize);
      return { profiles: result.profiles as unknown as Record<string, unknown>[], total: result.total };
    }
    await getDb();
    const totalRow = queryOne('SELECT COUNT(*) as count FROM talent_profiles');
    const profiles = queryAll(
      `SELECT tp.*, u.username, u.email, u.nickname FROM talent_profiles tp
       JOIN users u ON tp.user_id = u.id ORDER BY tp.updated_at DESC LIMIT ? OFFSET ?`,
      [pageSize, (page - 1) * pageSize]
    );
    return { profiles, total: (totalRow?.count as number) || 0 };
  }

  static async getSkillDistribution(): Promise<Record<string, unknown>[]> {
    if (isCloudBaseEnabled()) return CloudTalentStore.getSkillDistribution();
    await getDb();
    const profiles = queryAll("SELECT capability_tags FROM talent_profiles WHERE capability_tags != '[]'");
    const tagCounts: Record<string, number> = {};
    for (const p of profiles) {
      try { for (const tag of JSON.parse(p.capability_tags as string) as string[]) tagCounts[tag] = (tagCounts[tag] || 0) + 1; } catch { /* skip */ }
    }
    return Object.entries(tagCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 30);
  }
}
