/**
 * CloudBase Web SDK 客户端（浏览器端）
 * 使用 CloudBase Auth v3 进行用户认证
 * 使用 accessKey (publishable key) 初始化
 *
 * 架构：
 * - 认证：CloudBase Auth SDK → signUp / signInWithPassword / getSession
 * - 数据读取：Web SDK database().watch() 实时监听
 * - 数据写入：API Route → Node SDK（绕过安全规则，admin 权限）
 */

import cloudbase from '@cloudbase/js-sdk';

/* ========== 环境变量 ========== */
const ENV_ID = process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID || 'careercraft-d4gfk3hi163786996';
const REGION = process.env.NEXT_PUBLIC_CLOUDBASE_REGION || 'ap-shanghai';
const ACCESS_KEY = process.env.NEXT_PUBLIC_CLOUDBASE_PUBLISHABLE_KEY || '';

/* ========== 实例缓存 ========== */
let appInstance: ReturnType<typeof cloudbase.init> | null = null;
let authInstance: ReturnType<ReturnType<typeof cloudbase.init>['auth']> | null = null;
let dbInstance: ReturnType<ReturnType<typeof cloudbase.init>['database']> | null = null;

function log(...args: unknown[]) {
  console.info('[cloudbase-web]', ...args);
}

function logError(...args: unknown[]) {
  console.error('[cloudbase-web]', ...args);
}

/** 获取 CloudBase App 实例（唯一入口） */
export function getCloudBaseApp() {
  if (!appInstance) {
    if (!ACCESS_KEY) {
      logError('❌ PUBLISHABLE_KEY 未配置！请设置 NEXT_PUBLIC_CLOUDBASE_PUBLISHABLE_KEY 环境变量');
      logError('   获取方式：https://tcb.cloud.tencent.com/dev?envId=' + ENV_ID + '#/env/apikey');
    }
    appInstance = cloudbase.init({
      env: ENV_ID,
      region: REGION,
      accessKey: ACCESS_KEY,
      auth: { detectSessionInUrl: true },
    });
    log('✅ App 实例已初始化', { env: ENV_ID, region: REGION, hasAccessKey: !!ACCESS_KEY });
  }
  return appInstance;
}

/** 获取 Auth 实例（v3 Supabase-like API） */
export function getCloudBaseAuth() {
  if (!authInstance) {
    authInstance = getCloudBaseApp().auth({ persistence: 'local' });
    log('✅ Auth 实例已创建 (persistence: local)');
  }
  return authInstance;
}

/** 获取数据库实例 */
export function getCloudBaseWebDb() {
  if (!dbInstance) {
    dbInstance = getCloudBaseApp().database();
  }
  return dbInstance;
}

/* ========== 集合名称常量 ========== */
export const WEB_COLLECTIONS = {
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
} as const;

/* ========== 向后兼容：旧版初始化函数 ========== */
let isReady = false;

/** @deprecated 使用 getCloudBaseAuth() 代替 */
export function initCloudBaseWeb(): Promise<boolean> {
  try {
    getCloudBaseAuth();
    isReady = true;
    log('✅ 初始化完成');
    return Promise.resolve(true);
  } catch (err) {
    logError('❌ 初始化失败:', err);
    return Promise.resolve(false);
  }
}

/** @deprecated 使用 getCloudBaseAuth().getSession() 代替 */
export function isCloudBaseWebReady(): boolean {
  return isReady;
}

/** @deprecated */
export function getCloudBaseWebError(): string | null {
  return null;
}

