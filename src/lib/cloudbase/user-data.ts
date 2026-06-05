/**
 * CloudBase 用户业务数据（素材 / 投递 / 资料 + 团队共享快照）
 */

import {
  COLLECTIONS,
  getDoc,
  upsertDoc,
  listDocs,
} from './client';

interface PayloadDoc {
  _id: string;
  user_id: string;
  username?: string;
  nickname?: string;
  payload: unknown;
  updated_at?: string;
}

interface WorkspaceDoc {
  _id: string;
  user_id: string;
  username: string;
  nickname: string;
  materials: unknown[];
  applications: unknown[];
  updated_at: string;
}

function parsePayload<T>(raw: unknown, fallback: T): T {
  if (raw === null || raw === undefined) return fallback;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
  return raw as T;
}

export class CloudUserDataStore {
  static async getMaterials(userId: string): Promise<unknown[]> {
    const doc = await getDoc<PayloadDoc>(COLLECTIONS.materials, userId);
    if (!doc) return [];
    return parsePayload(doc.payload, [] as unknown[]);
  }

  static async setMaterials(
    userId: string,
    materials: unknown[],
    meta?: { username?: string; nickname?: string }
  ): Promise<boolean> {
    const ok = await upsertDoc(COLLECTIONS.materials, userId, {
      user_id: userId,
      username: meta?.username ?? '',
      nickname: meta?.nickname ?? '',
      payload: materials,
    });

    if (ok) {
      await this.updateWorkspaceSnapshot(userId, { materials }, meta);
    }
    return ok;
  }

  static async getApplications(userId: string): Promise<unknown[]> {
    const doc = await getDoc<PayloadDoc>(COLLECTIONS.applications, userId);
    if (!doc) return [];
    return parsePayload(doc.payload, [] as unknown[]);
  }

  static async setApplications(
    userId: string,
    applications: unknown[],
    meta?: { username?: string; nickname?: string }
  ): Promise<boolean> {
    const ok = await upsertDoc(COLLECTIONS.applications, userId, {
      user_id: userId,
      username: meta?.username ?? '',
      nickname: meta?.nickname ?? '',
      payload: applications,
    });

    if (ok) {
      await this.updateWorkspaceSnapshot(userId, { applications }, meta);
    }
    return ok;
  }

  static async getProfile(userId: string): Promise<Record<string, unknown> | null> {
    const doc = await getDoc<PayloadDoc>(COLLECTIONS.profiles, userId);
    if (!doc?.payload) return null;
    return parsePayload(doc.payload, null as unknown as Record<string, unknown>);
  }

  static async setProfile(userId: string, profile: Record<string, unknown>): Promise<boolean> {
    return upsertDoc(COLLECTIONS.profiles, userId, {
      user_id: userId,
      payload: profile,
    });
  }

  /** 更新团队共享快照 — 供其他用户读取 */
  private static async updateWorkspaceSnapshot(
    userId: string,
    partial: { materials?: unknown[]; applications?: unknown[] },
    meta?: { username?: string; nickname?: string }
  ): Promise<void> {
    const existing = await getDoc<WorkspaceDoc>(COLLECTIONS.workspace, userId);
    await upsertDoc(COLLECTIONS.workspace, userId, {
      user_id: userId,
      username: meta?.username ?? existing?.username ?? '用户',
      nickname: meta?.nickname ?? existing?.nickname ?? '',
      materials: partial.materials ?? existing?.materials ?? [],
      applications: partial.applications ?? existing?.applications ?? [],
    });
  }

  /** 获取所有用户的共享素材（跨用户可见） */
  static async getSharedMaterials(): Promise<
    Array<{ ownerId: string; ownerName: string; materials: unknown[]; updatedAt: string }>
  > {
    const docs = await listDocs<WorkspaceDoc>(COLLECTIONS.workspace, 200);
    return docs
      .filter((d) => Array.isArray(d.materials) && d.materials.length > 0)
      .map((d) => ({
        ownerId: d.user_id || d._id,
        ownerName: d.nickname || d.username || '用户',
        materials: d.materials,
        updatedAt: d.updated_at || '',
      }));
  }

  static async getSyncMeta(userId: string): Promise<{ updated_at?: string } | null> {
    const doc = await getDoc<PayloadDoc>(COLLECTIONS.materials, userId);
    return doc ? { updated_at: doc.updated_at } : null;
  }
}
