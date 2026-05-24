/**
 * 数据库初始化和管理
 * 使用 sql.js (纯 JS SQLite) - 兼容 Next.js Edge Runtime
 */

import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { DB_SCHEMA, SafeUser, User } from './schema';

let db: SqlJsDatabase | null = null;

/**
 * 初始化数据库（单例模式）
 */
export async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db;

  try {
    // 优先从 localStorage (浏览器) 或文件系统 (Node.js) 加载
    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    });

    // 尝试从之前的保存恢复数据
    let savedData: Uint8Array | null = null;

    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('careercraft_db');
        if (saved) {
          savedData = new Uint8Array(JSON.parse(saved));
        }
      } catch { /* 忽略 */ }
    }

    // 尝试从文件系统加载 (Node.js runtime)
    if (!savedData && typeof process !== 'undefined') {
      try {
        const fs = require('fs');
        const path = require('path');
        const dbPath = path.join(process.cwd(), '.careercraft.db.sqlite');
        if (fs.existsSync(dbPath)) {
          savedData = fs.readFileSync(dbPath);
        }
      } catch { /* 浏览器环境忽略 */ }
    }

    db = savedData && savedData.length > 0
      ? new SQL.Database(savedData)
      : new SQL.Database();

    // 执行 Schema 初始化
    db.run(DB_SCHEMA);

    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

/**
 * 持久化数据库到存储
 */
export async function saveDb(): Promise<void> {
  if (!db) return;

  const data = db.export();

  // 保存到 localStorage
  if (typeof localStorage !== 'undefined') {
    try {
      const arr = Array.from(data);
      localStorage.setItem('careercraft_db', JSON.stringify(arr));
    } catch (e) {
      console.warn('Failed to save DB to localStorage (may exceed quota):', e);
    }
  }

  // 保存到文件系统 (Node.js)
  if (typeof process !== 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const dbPath = path.join(process.cwd(), '.careercraft.db.sqlite');
      fs.writeFileSync(dbPath, Buffer.from(data));
    } catch { /* 浏览器环境忽略 */ }
  }
}

/**
 * 执行查询并返回结果
 */
export function queryAll(sql: string, params: unknown[] = []): Record<string, unknown>[] {
  if (!db) throw new Error('Database not initialized');

  const stmt = db.prepare(sql);

  if (params.length > 0) {
    stmt.bind(params);
  }

  const results: Record<string, unknown>[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push(row);
  }
  stmt.free();

  return results;
}

/**
 * 执行单条查询
 */
export function queryOne(sql: string, params: unknown[] = []): Record<string, unknown> | null {
  const results = queryAll(sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * 执行写入操作 (INSERT/UPDATE/DELETE)
 */
export function execute(sql: string, params: unknown[] = []): { changes: number; lastInsertId: number } {
  if (!db) throw new Error('Database not initialized');

  db.run(sql, params);
  const lastId = (db as unknown as { exec?: (sql: string) => { lastInsertRowid: number }[] }[]).length
    ? 0
    : 0;

  // 获取受影响行数和最后插入ID
  const changesRow = queryOne('SELECT changes() as changes');
  const lastIdRow = queryOne('SELECT last_insert_rowid() as id');

  return {
    changes: (changesRow?.changes as number) || 0,
    lastInsertId: (lastIdRow?.id as number) || 0,
  };
}

/**
 * 转换为安全用户对象（移除敏感信息）
 */
export function toSafeUser(user: Record<string, unknown>): SafeUser {
  return {
    id: user.id as string,
    username: user.username as string,
    email: user.email as string,
    nickname: (user.nickname as string) || '',
    avatar_url: (user.avatar_url as string) || '',
    role: (user.role as SafeUser['role']) || 'user',
    status: (user.status as SafeUser['status']) || 'active',
    created_at: user.created_at as string,
  };
}

/**
 * 关闭数据库连接
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
