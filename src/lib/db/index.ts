/**
 * 数据库初始化和管理
 * 使用 sql.js (纯 JS SQLite) - Node.js API Routes
 */

import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { DB_SCHEMA, type SafeUser } from './schema';

let db: SqlJsDatabase | null = null;
let initPromise: Promise<SqlJsDatabase> | null = null;
let dbFilePath: string | null = null;

/** 解析数据库文件路径（支持 DATABASE_PATH 环境变量） */
export function getDbFilePath(): string {
  if (dbFilePath) return dbFilePath;

  const envPath = process.env.DATABASE_PATH?.trim();
  if (envPath) {
    dbFilePath = path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath);
  } else {
    const dataDir = path.join(process.cwd(), 'data');
    dbFilePath = path.join(dataDir, 'careercraft.db.sqlite');
  }

  const dir = path.dirname(dbFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return dbFilePath;
}

function resolveWasmPath(): string {
  // 在 CloudRun standalone 输出中，node_modules 与 server.js 同级
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'),
    path.join(cwd, '.next', 'standalone', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'),
    path.join(__dirname, '..', '..', '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'),
    // CloudRun /app 根路径
    '/app/node_modules/sql.js/dist/sql-wasm.wasm',
    // 递归搜索（兜底）
    ...findWasmRecursive(path.join(cwd, 'node_modules'), 4),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      console.info(`[db] SQLite WASM found at: ${candidate}`);
      return candidate;
    }
  }
  // 最后尝试：列出目录以帮助调试
  const nmDir = path.join(cwd, 'node_modules');
  const sqlDir = path.join(cwd, 'node_modules', 'sql.js');
  const debugInfo = [
    `cwd=${cwd}`,
    `node_modules exists: ${fs.existsSync(nmDir)}`,
    `sql.js dir exists: ${fs.existsSync(sqlDir)}`,
    sqlDir && fs.existsSync(sqlDir) ? `sql.js contents: ${fs.readdirSync(sqlDir).join(', ')}` : '',
  ].filter(Boolean).join(' | ');
  throw new Error(`sql.js wasm file not found. Debug info: ${debugInfo}`);
}

/** 递归查找 wasm 文件（深度限制） */
function findWasmRecursive(dir: string, maxDepth: number): string[] {
  const results: string[] = [];
  if (maxDepth <= 0 || !fs.existsSync(dir)) return results;
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isFile() && entry.name === 'sql-wasm.wasm') {
        results.push(full);
      } else if (entry.isDirectory() && maxDepth > 1) {
        results.push(...findWasmRecursive(full, maxDepth - 1));
      }
    }
  } catch { /* 权限拒绝，跳过 */ }
  return results;
}

function stripSqlComments(sql: string): string {
  return sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .trim();
}

function isIgnorableSchemaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('duplicate column name') ||
    message.includes('already exists')
  );
}

function loadSavedDatabase(SQL: Awaited<ReturnType<typeof initSqlJs>>, filePath: string): SqlJsDatabase {
  if (fs.existsSync(filePath)) {
    const savedData = fs.readFileSync(filePath);
    if (savedData.length > 0) {
      return new SQL.Database(savedData);
    }
  }
  return new SQL.Database();
}

function applySchema(database: SqlJsDatabase): void {
  const statements = DB_SCHEMA.split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const rawStmt of statements) {
    const stmt = stripSqlComments(rawStmt);
    if (!stmt) continue;

    try {
      database.run(`${stmt};`);
    } catch (error) {
      if (isIgnorableSchemaError(error)) continue;
      throw error;
    }
  }
}

async function initDb(): Promise<SqlJsDatabase> {
  const wasmPath = resolveWasmPath();
  const filePath = getDbFilePath();

  const SQL = await initSqlJs({
    wasmBinary: fs.readFileSync(wasmPath),
  } as Parameters<typeof initSqlJs>[0]);

  const database = loadSavedDatabase(SQL, filePath);
  applySchema(database);

  // 首次启动时立即落盘，确保 data 目录与文件存在
  const data = database.export();
  fs.writeFileSync(filePath, Buffer.from(data));

  console.info(`[db] SQLite ready: ${filePath}`);
  return database;
}

/**
 * 初始化数据库（单例模式）
 */
export async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db;

  if (!initPromise) {
    initPromise = initDb()
      .then((database) => {
        db = database;
        return database;
      })
      .catch((error) => {
        initPromise = null;
        console.error('Database initialization failed:', error);
        throw error;
      });
  }

  return initPromise;
}

/**
 * 持久化数据库到文件
 */
export async function saveDb(): Promise<void> {
  if (!db) return;

  try {
    const filePath = getDbFilePath();
    const data = db.export();
    fs.writeFileSync(filePath, Buffer.from(data));
  } catch (error) {
    console.warn('Failed to save DB file:', error);
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

  const changesRow = queryOne('SELECT changes() as changes');
  const lastIdRow = queryOne('SELECT last_insert_rowid() as id');

  void saveDb();

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
    email: (user.email as string) || null,
    phone: (user.phone as string) || '',
    wechat_openid: (user.wechat_openid as string) || '',
    qq_openid: (user.qq_openid as string) || '',
    auth_provider: (user.auth_provider as SafeUser['auth_provider']) || 'email',
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
    initPromise = null;
  }
}
