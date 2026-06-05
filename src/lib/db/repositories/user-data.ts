/**
 * 用户业务数据持久化 — CloudBase 优先，SQLite 本地回退
 */

import { execute, queryOne, getDb } from '../index';
import { isCloudBaseEnabled } from '@/lib/cloudbase/client';
import { CloudUserDataStore } from '@/lib/cloudbase/user-data';

function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export interface UserDataMeta {
  username?: string;
  nickname?: string;
}

export class UserDataRepository {
  static async getMaterials(userId: string): Promise<unknown[]> {
    if (isCloudBaseEnabled()) {
      const cloud = await CloudUserDataStore.getMaterials(userId);
      if (cloud.length > 0 || isCloudBaseEnabled()) return cloud;
    }
    await getDb();
    const row = queryOne('SELECT payload FROM user_materials WHERE user_id = ?', [userId]);
    return parseJson(row?.payload as string | undefined, []);
  }

  static async setMaterials(
    userId: string,
    materials: unknown[],
    meta?: UserDataMeta
  ): Promise<void> {
    if (isCloudBaseEnabled()) {
      const ok = await CloudUserDataStore.setMaterials(userId, materials, meta);
      if (ok) return;
    }
    await getDb();
    const payload = JSON.stringify(materials);
    const existing = queryOne('SELECT user_id FROM user_materials WHERE user_id = ?', [userId]);
    if (existing) {
      execute(
        `UPDATE user_materials SET payload = ?, updated_at = datetime('now') WHERE user_id = ?`,
        [payload, userId]
      );
    } else {
      execute(`INSERT INTO user_materials (user_id, payload) VALUES (?, ?)`, [userId, payload]);
    }
  }

  static async getApplications(userId: string): Promise<unknown[]> {
    if (isCloudBaseEnabled()) {
      return CloudUserDataStore.getApplications(userId);
    }
    await getDb();
    const row = queryOne('SELECT payload FROM user_applications WHERE user_id = ?', [userId]);
    return parseJson(row?.payload as string | undefined, []);
  }

  static async setApplications(
    userId: string,
    applications: unknown[],
    meta?: UserDataMeta
  ): Promise<void> {
    if (isCloudBaseEnabled()) {
      const ok = await CloudUserDataStore.setApplications(userId, applications, meta);
      if (ok) return;
    }
    await getDb();
    const payload = JSON.stringify(applications);
    const existing = queryOne('SELECT user_id FROM user_applications WHERE user_id = ?', [userId]);
    if (existing) {
      execute(
        `UPDATE user_applications SET payload = ?, updated_at = datetime('now') WHERE user_id = ?`,
        [payload, userId]
      );
    } else {
      execute(`INSERT INTO user_applications (user_id, payload) VALUES (?, ?)`, [userId, payload]);
    }
  }

  static async getProfile(userId: string): Promise<Record<string, unknown> | null> {
    if (isCloudBaseEnabled()) {
      return CloudUserDataStore.getProfile(userId);
    }
    await getDb();
    const row = queryOne('SELECT payload FROM user_profile_settings WHERE user_id = ?', [userId]);
    if (!row?.payload) return null;
    return parseJson(row.payload as string, null as unknown as Record<string, unknown>);
  }

  static async setProfile(userId: string, profile: Record<string, unknown>): Promise<void> {
    if (isCloudBaseEnabled()) {
      const ok = await CloudUserDataStore.setProfile(userId, profile);
      if (ok) return;
    }
    await getDb();
    const payload = JSON.stringify(profile);
    const existing = queryOne('SELECT user_id FROM user_profile_settings WHERE user_id = ?', [userId]);
    if (existing) {
      execute(
        `UPDATE user_profile_settings SET payload = ?, updated_at = datetime('now') WHERE user_id = ?`,
        [payload, userId]
      );
    } else {
      execute(`INSERT INTO user_profile_settings (user_id, payload) VALUES (?, ?)`, [userId, payload]);
    }
  }

  static async getSharedMaterials() {
    if (isCloudBaseEnabled()) {
      return CloudUserDataStore.getSharedMaterials();
    }
    return [];
  }
}
