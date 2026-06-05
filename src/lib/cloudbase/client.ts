/**
 * CloudBase 云数据库客户端（腾讯云开发）
 * CloudRun 环境会自动注入 TCB_ENV 等变量
 * 所有数据写入 CloudBase NoSQL，实现多设备/多用户实时同步
 */

import cloudbase from '@cloudbase/node-sdk';

const DEFAULT_ENV_ID = 'careercraft-d4gfk3hi163786996';

type CloudDatabase = ReturnType<ReturnType<typeof cloudbase.init>['database']>;

let dbInstance: CloudDatabase | null = null;
let initError: string | null = null;
let initLogged = false;

export const COLLECTIONS = {
  users: 'cv_users',
  materials: 'cv_user_materials',
  applications: 'cv_user_applications',
  profiles: 'cv_user_profiles',
  workspace: 'cv_workspace_snapshot',
  resumes: 'cv_resumes',
  talentProfiles: 'cv_talent_profiles',
  jobPositions: 'cv_job_positions',
  jobMatches: 'cv_job_matches',
  userEvents: 'cv_user_events',
  dailyStats: 'cv_daily_stats',
  promptTemplates: 'cv_prompt_templates',
  promptVersions: 'cv_prompt_versions',
  promptTests: 'cv_prompt_tests',
  promptCallLogs: 'cv_prompt_call_logs',
  enterpriseUsers: 'cv_enterprise_users',
  enterpriseBatches: 'cv_enterprise_batches',
  enterpriseResumeResults: 'cv_enterprise_resume_results',
} as const;

/** 是否启用 CloudBase（生产 / 云环境优先） */
export function isCloudBaseEnabled(): boolean {
  if (process.env.USE_CLOUDBASE === 'false') return false;
  if (process.env.USE_CLOUDBASE === 'true') return true;
  return !!(
    process.env.TCB_ENV ||
    process.env.CLOUDBASE_ENV_ID ||
    process.env.TENCENTCLOUD_SECRETID ||
    process.env.NODE_ENV === 'production'
  );
}

export function getCloudBaseEnvId(): string {
  return (
    process.env.TCB_ENV ||
    process.env.CLOUDBASE_ENV_ID ||
    DEFAULT_ENV_ID
  );
}

export function getCloudBaseInitError(): string | null {
  return initError;
}

export function getCloudBaseDb(): CloudDatabase | null {
  if (!isCloudBaseEnabled()) {
    if (!initLogged) { console.info('[cloudbase] disabled by config'); initLogged = true; }
    return null;
  }
  if (dbInstance) return dbInstance;

  try {
    const env = getCloudBaseEnvId();
    const config: {
      env: string;
      secretId?: string;
      secretKey?: string;
    } = { env };

    const hasSecrets = !!(process.env.TENCENTCLOUD_SECRETID && process.env.TENCENTCLOUD_SECRETKEY);

    if (hasSecrets) {
      config.secretId = process.env.TENCENTCLOUD_SECRETID;
      config.secretKey = process.env.TENCENTCLOUD_SECRETKEY;
      console.info(`[cloudbase] 🔑 Using admin credentials for env: ${env}`);
    } else {
      // CloudRun 环境使用服务关联角色，无需显式密钥
      const isCloudRun = !!(process.env.TCB_ENV || process.env.TCB_REGION);
      if (!isCloudRun && process.env.NODE_ENV !== 'production') {
        if (!initLogged) {
          console.info('[cloudbase] ⚠️ Local dev: no CloudBase credentials → fallback to SQLite');
          console.info('[cloudbase] 💡 Set TENCENTCLOUD_SECRETID + TENCENTCLOUD_SECRETKEY in .env.local for local CloudBase');
          initLogged = true;
        }
        return null;
      }
      console.info(`[cloudbase] 🔑 CloudRun managed identity → connecting to env: ${env}`);
    }

    const app = cloudbase.init(config);
    dbInstance = app.database();
    initError = null;
    console.info(`[cloudbase] ✅ connected to env: ${env}`);
    return dbInstance;
  } catch (err) {
    initError = err instanceof Error ? err.message : String(err);
    console.error('[cloudbase] ❌ init failed:', initError);
    if (!initLogged) {
      console.info('[cloudbase] 💡 CloudBase unavailable, falling back to SQLite');
      initLogged = true;
    }
    return null;
  }
}

/** 文档 upsert */
export async function upsertDoc(
  collection: string,
  docId: string,
  data: Record<string, unknown>
): Promise<boolean> {
  const db = getCloudBaseDb();
  if (!db) return false;

  const payload = { ...data, _id: docId, updated_at: new Date().toISOString() };

  try {
    await db.collection(collection).doc(docId).update(payload);
    return true;
  } catch {
    try {
      await db.collection(collection).doc(docId).set(payload);
      return true;
    } catch (err) {
      console.error(`[cloudbase] upsert ${collection}/${docId} failed:`, err);
      return false;
    }
  }
}

/** 读取单文档 */
export async function getDoc<T = Record<string, unknown>>(
  collection: string,
  docId: string
): Promise<T | null> {
  const db = getCloudBaseDb();
  if (!db) return null;

  try {
    const res = await db.collection(collection).doc(docId).get();
    const row = res.data?.[0] as T | undefined;
    return row ?? null;
  } catch {
    return null;
  }
}

/** 读取集合全部文档（限量） */
export async function listDocs<T = Record<string, unknown>>(
  collection: string,
  limit = 100
): Promise<T[]> {
  const db = getCloudBaseDb();
  if (!db) return [];

  try {
    const res = await db.collection(collection).limit(limit).get();
    return (res.data ?? []) as T[];
  } catch (err) {
    console.error(`[cloudbase] list ${collection} failed:`, err);
    return [];
  }
}

/** 条件查询 */
export async function queryDocs<T = Record<string, unknown>>(
  collection: string,
  where: Record<string, unknown>,
  options?: { limit?: number; offset?: number; orderBy?: string; orderDir?: 'asc' | 'desc' }
): Promise<T[]> {
  const db = getCloudBaseDb();
  if (!db) return [];

  try {
    let query = db.collection(collection).where(where);
    if (options?.orderBy) {
      query = query.orderBy(options.orderBy, options.orderDir || 'desc');
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.skip(options.offset);
    }
    const res = await query.get();
    return (res.data ?? []) as T[];
  } catch (err) {
    console.error(`[cloudbase] query ${collection} failed:`, err);
    return [];
  }
}

/** 计数查询 */
export async function countDocs(
  collection: string,
  where: Record<string, unknown> = {}
): Promise<number> {
  const db = getCloudBaseDb();
  if (!db) return 0;

  try {
    const res = await db.collection(collection).where(where).count();
    return res.total ?? 0;
  } catch (err) {
    console.error(`[cloudbase] count ${collection} failed:`, err);
    return 0;
  }
}

/** 删除文档 */
export async function deleteDoc(
  collection: string,
  docId: string
): Promise<boolean> {
  const db = getCloudBaseDb();
  if (!db) return false;

  try {
    await db.collection(collection).doc(docId).remove();
    return true;
  } catch (err) {
    console.error(`[cloudbase] delete ${collection}/${docId} failed:`, err);
    return false;
  }
}

/** 批量删除 */
export async function deleteDocs(
  collection: string,
  where: Record<string, unknown>
): Promise<number> {
  const db = getCloudBaseDb();
  if (!db) return 0;

  try {
    const res = await db.collection(collection).where(where).remove();
    return res.deleted ?? 0;
  } catch (err) {
    console.error(`[cloudbase] batch delete ${collection} failed:`, err);
    return 0;
  }
}

/** 分页查询 */
export async function paginatedDocs<T = Record<string, unknown>>(
  collection: string,
  where: Record<string, unknown>,
  page: number,
  pageSize: number,
  orderBy = 'created_at',
  orderDir: 'asc' | 'desc' = 'desc'
): Promise<{ data: T[]; total: number }> {
  const db = getCloudBaseDb();
  if (!db) return { data: [], total: 0 };

  try {
    const totalRes = await db.collection(collection).where(where).count();
    const total = totalRes.total ?? 0;

    const offset = (page - 1) * pageSize;
    const dataRes = await db
      .collection(collection)
      .where(where)
      .orderBy(orderBy, orderDir)
      .skip(offset)
      .limit(pageSize)
      .get();

    return { data: (dataRes.data ?? []) as T[], total };
  } catch (err) {
    console.error(`[cloudbase] paginated ${collection} failed:`, err);
    return { data: [], total: 0 };
  }
}
