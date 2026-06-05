/**
 * CloudBase 用户账号存储
 */

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import type { SafeUser, AuthProvider } from '@/lib/db/schema';
import { toSafeUser } from '@/lib/db';
import {
  COLLECTIONS,
  getCloudBaseDb,
  getDoc,
  upsertDoc,
  listDocs,
} from './client';

interface CloudUserRow {
  _id: string;
  username: string;
  email?: string | null;
  password_hash?: string;
  phone?: string;
  wechat_openid?: string;
  qq_openid?: string;
  auth_provider?: AuthProvider;
  nickname?: string;
  avatar_url?: string;
  role?: string;
  status?: string;
  created_at?: string;
}

function rowToRecord(row: CloudUserRow): Record<string, unknown> {
  return {
    id: row._id,
    username: row.username,
    email: row.email ?? null,
    password_hash: row.password_hash ?? '',
    phone: row.phone ?? '',
    wechat_openid: row.wechat_openid ?? '',
    qq_openid: row.qq_openid ?? '',
    auth_provider: row.auth_provider ?? 'email',
    nickname: row.nickname ?? '',
    avatar_url: row.avatar_url ?? '',
    role: row.role ?? 'user',
    status: row.status ?? 'active',
    created_at: row.created_at ?? new Date().toISOString(),
  };
}

async function findByEmail(email: string): Promise<CloudUserRow | null> {
  const db = getCloudBaseDb();
  if (!db) return null;
  const res = await db.collection(COLLECTIONS.users).where({ email }).limit(1).get();
  return (res.data?.[0] as CloudUserRow) ?? null;
}

async function findByLogin(login: string): Promise<CloudUserRow | null> {
  const db = getCloudBaseDb();
  if (!db) return null;
  let res = await db.collection(COLLECTIONS.users).where({ email: login }).limit(1).get();
  if (res.data?.[0]) return res.data[0] as CloudUserRow;
  res = await db.collection(COLLECTIONS.users).where({ username: login }).limit(1).get();
  return (res.data?.[0] as CloudUserRow) ?? null;
}

export class CloudUserStore {
  static async ensureAdminSeed(): Promise<void> {
    const existing = await findByLogin('123456');
    if (existing) return;

    const hash = '$2b$10$sBfYfI3vujMfraTWZjO7fOzOyhRE7eXh8C0yPK76XeIrCKwBcn7T2';
    await upsertDoc(COLLECTIONS.users, 'admin-001', {
      username: '123456',
      email: '123456@qq.com',
      password_hash: hash,
      phone: '',
      auth_provider: 'email',
      nickname: '系统管理员',
      role: 'super_admin',
      status: 'active',
      created_at: new Date().toISOString(),
    });
  }

  static async createByEmail(data: {
    username: string;
    email: string;
    password: string;
    nickname?: string;
  }): Promise<SafeUser | null> {
    await this.ensureAdminSeed();

    const dup = await findByEmail(data.email);
    if (dup) return null;

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(data.password, 10);
    const now = new Date().toISOString();

    const ok = await upsertDoc(COLLECTIONS.users, id, {
      username: data.username,
      email: data.email,
      password_hash: passwordHash,
      phone: '',
      wechat_openid: '',
      qq_openid: '',
      auth_provider: 'email',
      nickname: data.nickname || data.username,
      role: 'user',
      status: 'active',
      created_at: now,
    });

    if (!ok) return null;
    const row = await getDoc<CloudUserRow>(COLLECTIONS.users, id);
    return row ? toSafeUser(rowToRecord(row)) : null;
  }

  static async verifyLogin(login: string, password: string): Promise<SafeUser | null> {
    await this.ensureAdminSeed();
    const row = await findByLogin(login);
    if (!row || row.status !== 'active') return null;
    if (row.auth_provider && row.auth_provider !== 'email') return null;

    const valid = await bcrypt.compare(password, row.password_hash || '');
    if (!valid) return null;
    return toSafeUser(rowToRecord(row));
  }

  static async getById(id: string): Promise<SafeUser | null> {
    const row = await getDoc<CloudUserRow>(COLLECTIONS.users, id);
    return row ? toSafeUser(rowToRecord(row)) : null;
  }

  static async verifyAdminLogin(login: string, password: string): Promise<SafeUser | null> {
    const user = await this.verifyLogin(login, password);
    if (!user) return null;
    if (user.role !== 'admin' && user.role !== 'super_admin') return null;
    return user;
  }

  // =====================================================
  // 手机号登录验证
  // =====================================================
  static async verifyLoginByPhone(phone: string, password: string): Promise<SafeUser | null> {
    await this.ensureAdminSeed();

    const db = getCloudBaseDb();
    if (!db) return null;

    const res = await db.collection(COLLECTIONS.users).where({ phone, auth_provider: 'phone' }).limit(1).get();
    const row = (res.data?.[0] as CloudUserRow) ?? null;
    if (!row || row.status !== 'active') return null;

    const valid = await bcrypt.compare(password, row.password_hash || '');
    if (!valid) return null;
    return toSafeUser(rowToRecord(row));
  }

  // =====================================================
  // 微信/QQ OAuth 登录验证
  // =====================================================
  static async verifyLoginByOAuth(provider: 'wechat' | 'qq', openid: string): Promise<SafeUser | null> {
    await this.ensureAdminSeed();

    const db = getCloudBaseDb();
    if (!db) return null;

    const field = provider === 'wechat' ? 'wechat_openid' : 'qq_openid';
    const res = await db.collection(COLLECTIONS.users).where({ [field]: openid, auth_provider: provider }).limit(1).get();
    const row = (res.data?.[0] as CloudUserRow) ?? null;
    if (!row || row.status !== 'active') return null;

    return toSafeUser(rowToRecord(row));
  }

  // =====================================================
  // 手机号注册
  // =====================================================
  static async createByPhone(data: {
    phone: string;
    password: string;
    nickname?: string;
  }): Promise<SafeUser | null> {
    await this.ensureAdminSeed();

    const db = getCloudBaseDb();
    if (!db) return null;

    // 检查手机号是否已存在
    const dupRes = await db.collection(COLLECTIONS.users).where({ phone: data.phone }).limit(1).get();
    if (dupRes.data?.[0]) return null;

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(data.password, 10);
    const username = data.nickname || `用户${data.phone.slice(-4)}`;
    const now = new Date().toISOString();

    const ok = await upsertDoc(COLLECTIONS.users, id, {
      username,
      email: '',
      password_hash: passwordHash,
      phone: data.phone,
      wechat_openid: '',
      qq_openid: '',
      auth_provider: 'phone',
      nickname: data.nickname || username,
      role: 'user',
      status: 'active',
      created_at: now,
    });

    if (!ok) return null;
    const row = await getDoc<CloudUserRow>(COLLECTIONS.users, id);
    return row ? toSafeUser(rowToRecord(row)) : null;
  }

  // =====================================================
  // 微信/QQ OAuth 注册（首次登录即注册）
  // =====================================================
  static async createByOAuth(data: {
    provider: 'wechat' | 'qq';
    openid: string;
    nickname?: string;
  }): Promise<SafeUser | null> {
    await this.ensureAdminSeed();

    const db = getCloudBaseDb();
    if (!db) return null;

    const field = data.provider === 'wechat' ? 'wechat_openid' : 'qq_openid';

    // 检查 openid 是否已存在
    const dupRes = await db.collection(COLLECTIONS.users).where({ [field]: data.openid }).limit(1).get();
    if (dupRes.data?.[0]) {
      const row = dupRes.data[0] as CloudUserRow;
      return toSafeUser(rowToRecord(row));
    }

    const id = uuidv4();
    const username = data.nickname || `${data.provider}_${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const ok = await upsertDoc(COLLECTIONS.users, id, {
      username,
      email: '',
      password_hash: '',
      phone: '',
      wechat_openid: data.provider === 'wechat' ? data.openid : '',
      qq_openid: data.provider === 'qq' ? data.openid : '',
      auth_provider: data.provider,
      nickname: data.nickname || username,
      role: 'user',
      status: 'active',
      created_at: now,
    });

    if (!ok) return null;
    const row = await getDoc<CloudUserRow>(COLLECTIONS.users, id);
    return row ? toSafeUser(rowToRecord(row)) : null;
  }
}

export async function listAllUsers(limit = 200): Promise<SafeUser[]> {
  const rows = await listDocs<CloudUserRow>(COLLECTIONS.users, limit);
  return rows.map((r) => toSafeUser(rowToRecord(r)));
}
