/**
 * 数据库与认证链路验证脚本
 * 运行: npx tsx scripts/verify-db.ts
 */

import { getDb, getDbFilePath, queryOne } from '../src/lib/db/index';
import { UserRepository } from '../src/lib/db/repositories/user';
import { UserDataRepository } from '../src/lib/db/repositories/user-data';

async function main() {
  console.log('[verify] DB path:', getDbFilePath());

  await getDb();
  console.log('[verify] Database initialized OK');

  const admin = await UserRepository.verifyAdminLogin('123456', '123456');
  console.log('[verify] Admin login:', admin ? `OK (${admin.username})` : 'FAILED');

  const userCount = queryOne('SELECT COUNT(*) as c FROM users');
  console.log('[verify] Total users:', userCount?.c ?? 0);

  if (admin) {
    await UserDataRepository.setMaterials(admin.id, [{ id: 'test', title: 'verify' }]);
    const mats = await UserDataRepository.getMaterials(admin.id);
    console.log('[verify] Materials R/W:', Array.isArray(mats) && mats.length > 0 ? 'OK' : 'FAILED');
  }

  console.log('[verify] All checks passed.');
}

main().catch((e) => {
  console.error('[verify] FAILED:', e);
  process.exit(1);
});
