/**
 * 用户数据仓库 — 支持邮箱/手机/微信/QQ 多种注册登录方式
 */

import { getDb, queryOne, queryAll, execute, toSafeUser } from '@/lib/db';
import { SafeUser, AuthProvider } from '@/lib/db/schema';
import { isCloudBaseEnabled } from '@/lib/cloudbase/client';
import { CloudUserStore } from '@/lib/cloudbase/users';
import { listAllUsers } from '@/lib/cloudbase/users';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

interface CreateByEmailInput {
  username: string;
  email: string;
  password: string;
  nickname?: string;
}

interface CreateByPhoneInput {
  phone: string;
  password: string;
  nickname?: string;
}

interface CreateByOAuthInput {
  provider: 'wechat' | 'qq';
  openid: string;
  nickname?: string;
}

function generateUsername(prefix: string): string {
  const ts = Date.now().toString(36).slice(-4);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${ts}${rand}`;
}

export class UserRepository {
  // =====================================================
  // 邮箱注册
  // =====================================================
  static async createByEmail(data: CreateByEmailInput): Promise<SafeUser | null> {
    if (isCloudBaseEnabled()) {
      const cloud = await CloudUserStore.createByEmail(data);
      if (cloud) return cloud;
    }

    await getDb();

    const existing = queryOne(
      'SELECT id FROM users WHERE email = ?',
      [data.email]
    );
    if (existing) return null;

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(data.password, 10);

    execute(
      `INSERT INTO users (id, username, email, password_hash, phone, wechat_openid, qq_openid, auth_provider, nickname, role, status)
       VALUES (?, ?, ?, ?, '', '', '', 'email', ?, 'user', 'active')`,
      [id, data.username, data.email, passwordHash, data.nickname || data.username]
    );

    const user = queryOne('SELECT * FROM users WHERE id = ?', [id]);
    return user ? toSafeUser(user) : null;
  }

  // =====================================================
  // 手机号注册
  // =====================================================
  static async createByPhone(data: CreateByPhoneInput): Promise<SafeUser | null> {
    if (isCloudBaseEnabled()) {
      const cloud = await CloudUserStore.createByPhone(data);
      if (cloud) return cloud;
    }

    await getDb();

    const existing = queryOne(
      'SELECT id FROM users WHERE phone = ?',
      [data.phone]
    );
    if (existing) return null;

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(data.password, 10);
    const username = data.nickname || `用户${data.phone.slice(-4)}`;

    execute(
      `INSERT INTO users (id, username, email, password_hash, phone, wechat_openid, qq_openid, auth_provider, nickname, role, status)
       VALUES (?, ?, NULL, ?, ?, '', '', 'phone', ?, 'user', 'active')`,
      [id, username, passwordHash, data.phone, data.nickname || username]
    );

    const user = queryOne('SELECT * FROM users WHERE id = ?', [id]);
    return user ? toSafeUser(user) : null;
  }

  // =====================================================
  // 微信/QQ OAuth 注册（首次登录即注册）
  // =====================================================
  static async createByOAuth(data: CreateByOAuthInput): Promise<SafeUser | null> {
    if (isCloudBaseEnabled()) {
      const cloud = await CloudUserStore.createByOAuth(data);
      if (cloud) return cloud;
    }

    await getDb();

    const field = data.provider === 'wechat' ? 'wechat_openid' : 'qq_openid';

    const existing = queryOne(
      `SELECT * FROM users WHERE ${field} = ? AND ${field} != ''`,
      [data.openid]
    );
    if (existing) return toSafeUser(existing);

    const id = uuidv4();
    const username = data.nickname || generateUsername(data.provider);

    execute(
      `INSERT INTO users (id, username, email, password_hash, phone, wechat_openid, qq_openid, auth_provider, nickname, role, status)
       VALUES (?, ?, NULL, NULL, '', ?, ?, ?, ?, 'user', 'active')`,
      [
        id, username,
        data.provider === 'wechat' ? data.openid : '',
        data.provider === 'qq' ? data.openid : '',
        data.provider,
        data.nickname || username,
      ]
    );

    const user = queryOne('SELECT * FROM users WHERE id = ?', [id]);
    return user ? toSafeUser(user) : null;
  }

  // =====================================================
  // 通用创建（兼容旧接口）
  // =====================================================
  static async create(data: {
    username: string;
    email: string;
    password: string;
    nickname?: string;
  }): Promise<SafeUser | null> {
    return this.createByEmail(data);
  }

  // =====================================================
  // 邮箱/用户名 + 密码登录
  // =====================================================
  static async verifyLogin(login: string, password: string): Promise<SafeUser | null> {
    if (isCloudBaseEnabled()) {
      const cloud = await CloudUserStore.verifyLogin(login, password);
      if (cloud) return cloud;
    }

    await getDb();

    const user = queryOne(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND auth_provider = ? AND status = ?',
      [login, login, 'email', 'active']
    );
    if (!user) return null;

    const valid = await bcrypt.compare(password, (user.password_hash as string) || '');
    if (!valid) return null;

    return toSafeUser(user);
  }

  // =====================================================
  // 手机号 + 密码登录
  // =====================================================
  static async verifyLoginByPhone(phone: string, password: string): Promise<SafeUser | null> {
    if (isCloudBaseEnabled()) {
      const cloud = await CloudUserStore.verifyLoginByPhone(phone, password);
      if (cloud) return cloud;
    }

    await getDb();

    const user = queryOne(
      'SELECT * FROM users WHERE phone = ? AND auth_provider = ? AND status = ?',
      [phone, 'phone', 'active']
    );
    if (!user) return null;

    const valid = await bcrypt.compare(password, (user.password_hash as string) || '');
    if (!valid) return null;

    return toSafeUser(user);
  }

  // =====================================================
  // 微信/QQ OAuth 登录（按 openid 查找）
  // =====================================================
  static async verifyLoginByOAuth(provider: 'wechat' | 'qq', openid: string): Promise<SafeUser | null> {
    if (isCloudBaseEnabled()) {
      const cloud = await CloudUserStore.verifyLoginByOAuth(provider, openid);
      if (cloud) return cloud;
    }

    await getDb();

    const field = provider === 'wechat' ? 'wechat_openid' : 'qq_openid';

    const user = queryOne(
      `SELECT * FROM users WHERE ${field} = ? AND ${field} != '' AND auth_provider = ? AND status = ?`,
      [openid, provider, 'active']
    );
    if (!user) return null;

    return toSafeUser(user);
  }

  // =====================================================
  // 管理员登录
  // =====================================================
  static async verifyAdminLogin(login: string, password: string): Promise<SafeUser | null> {
    const user = await this.verifyLogin(login, password);
    if (!user) return null;
    if (user.role !== 'admin' && user.role !== 'super_admin') return null;
    return user;
  }

  // =====================================================
  // 获取用户详情
  // =====================================================
  static async getById(id: string): Promise<SafeUser | null> {
    if (isCloudBaseEnabled()) {
      const cloud = await CloudUserStore.getById(id);
      if (cloud) return cloud;
    }

    await getDb();
    const user = queryOne('SELECT * FROM users WHERE id = ?', [id]);
    return user ? toSafeUser(user) : null;
  }

  // =====================================================
  // 换绑手机号 / 邮箱
  // =====================================================
  static async updatePhone(userId: string, phone: string): Promise<{ ok: boolean; error?: string }> {
    await getDb();

    const existing = queryOne(
      'SELECT id FROM users WHERE phone = ? AND phone != "" AND id != ?',
      [phone, userId]
    );
    if (existing) {
      return { ok: false, error: '该手机号已被其他账号绑定' };
    }

    const result = execute(
      `UPDATE users SET phone = ?, updated_at = datetime('now') WHERE id = ?`,
      [phone, userId]
    );
    return result.changes > 0
      ? { ok: true }
      : { ok: false, error: '换绑失败，用户不存在' };
  }

  static async updateEmail(userId: string, email: string): Promise<{ ok: boolean; error?: string }> {
    await getDb();

    const existing = queryOne(
      'SELECT id FROM users WHERE email = ? AND email IS NOT NULL AND email != "" AND id != ?',
      [email, userId]
    );
    if (existing) {
      return { ok: false, error: '该邮箱已被其他账号绑定' };
    }

    const result = execute(
      `UPDATE users SET email = ?, updated_at = datetime('now') WHERE id = ?`,
      [email, userId]
    );
    return result.changes > 0
      ? { ok: true }
      : { ok: false, error: '换绑失败，用户不存在' };
  }

  // =====================================================
  // 管理员获取所有用户列表
  // =====================================================
  static async listAll(
    page = 1,
    pageSize = 20,
    filters?: { role?: string; status?: string; search?: string }
  ): Promise<{ users: SafeUser[]; total: number }> {
    if (isCloudBaseEnabled()) {
      const allUsers = await listAllUsers(500);
      let filtered = allUsers;
      if (filters?.role) filtered = filtered.filter(u => u.role === filters.role);
      if (filters?.status) filtered = filtered.filter(u => u.status === filters.status);
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(u =>
          (u.username && u.username.toLowerCase().includes(s)) ||
          (u.email && u.email.toLowerCase().includes(s)) ||
          (u.phone && u.phone.includes(s)) ||
          (u.nickname && u.nickname.toLowerCase().includes(s))
        );
      }
      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const users = filtered.slice(start, start + pageSize);
      return { users, total };
    }
    await getDb();

    let where = 'WHERE 1=1';
    const params: unknown[] = [];

    if (filters?.role) {
      where += ' AND role = ?';
      params.push(filters.role);
    }
    if (filters?.status) {
      where += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters?.search) {
      where += ' AND (username LIKE ? OR email LIKE ? OR phone LIKE ? OR nickname LIKE ?)';
      const s = `%${filters.search}%`;
      params.push(s, s, s, s);
    }

    const totalRows = queryOne(
      `SELECT COUNT(*) as count FROM users ${where}`,
      params
    );
    const total = (totalRows?.count as number) || 0;

    const offset = (page - 1) * pageSize;
    const userRows = queryAll(
      `SELECT * FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    return {
      users: userRows.map(toSafeUser),
      total,
    };
  }

  // =====================================================
  // 更新用户信息（管理员）
  // =====================================================
  static async updateByAdmin(
    id: string,
    data: { role?: string; status?: string; nickname?: string }
  ): Promise<boolean> {
    await getDb();

    const sets: string[] = [];
    const params: unknown[] = [];

    if (data.role) {
      sets.push('role = ?');
      params.push(data.role);
    }
    if (data.status) {
      sets.push('status = ?');
      params.push(data.status);
    }
    if (data.nickname) {
      sets.push('nickname = ?');
      params.push(data.nickname);
    }

    if (sets.length === 0) return false;

    sets.push("updated_at = datetime('now')");
    params.push(id);

    const result = execute(
      `UPDATE users SET ${sets.join(', ')} WHERE id = ?`,
      params
    );
    return result.changes > 0;
  }

  // =====================================================
  // 获取用户统计
  // =====================================================
  static async getStats(): Promise<{
    total: number;
    active: number;
    newToday: number;
    admins: number;
  }> {
    await getDb();

    const totalRow = queryOne('SELECT COUNT(*) as count FROM users');
    const activeRow = queryOne(
      "SELECT COUNT(*) as count FROM users WHERE status = 'active'"
    );
    const newTodayRow = queryOne(
      "SELECT COUNT(*) as count FROM users WHERE date(created_at) = date('now')"
    );
    const adminRow = queryOne(
      "SELECT COUNT(*) as count FROM users WHERE role IN ('admin', 'super_admin')"
    );

    return {
      total: (totalRow?.count as number) || 0,
      active: (activeRow?.count as number) || 0,
      newToday: (newTodayRow?.count as number) || 0,
      admins: (adminRow?.count as number) || 0,
    };
  }
}
