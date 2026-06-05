/**
 * GET /api/health - 系统健康检查
 * 诊断 CloudBase / SQLite 连接状态
 */
import { NextResponse } from 'next/server';
import { isCloudBaseEnabled, getCloudBaseEnvId, getCloudBaseInitError, getCloudBaseDb } from '@/lib/cloudbase/client';

export const runtime = 'nodejs';

export async function GET() {
  const info: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    node_env: process.env.NODE_ENV || 'unknown',
    use_cloudbase: process.env.USE_CLOUDBASE || 'not set',
    tcb_env: process.env.TCB_ENV || 'not set',
    cloudbase_env_id: process.env.CLOUDBASE_ENV_ID || 'not set',
    cloudbase_enabled: isCloudBaseEnabled(),
  };

  // CloudBase Node SDK 状态
  try {
    const db = getCloudBaseDb();
    info.cloudbase_db = db ? 'connected' : 'null (fallback to SQLite)';
    info.cloudbase_init_error = getCloudBaseInitError();

    if (db) {
      // 测试读取 cv_users
      try {
        const res = await db.collection('cv_users').where({}).limit(1).get();
        info.cloudbase_test_read = `ok (${res.data?.length ?? 0} docs)`;
      } catch (e) {
        info.cloudbase_test_read = `failed: ${e instanceof Error ? e.message : String(e)}`;
      }
    }
  } catch (e) {
    info.cloudbase_db = `init error: ${e instanceof Error ? e.message : String(e)}`;
    info.cloudbase_init_error = getCloudBaseInitError();
  }

  // SQLite 状态
  try {
    const { getDb } = await import('@/lib/db');
    const sqliteDb = await getDb();
    const res = sqliteDb.exec('SELECT COUNT(*) as count FROM users');
    const count = res[0]?.values?.[0]?.[0] ?? '?';
    info.sqlite = `ok (${count} users)`;
    info.sqlite_path = process.env.DATABASE_PATH || 'data/careercraft.db.sqlite';
  } catch (e) {
    info.sqlite = `failed: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({ success: true, data: info });
}
