/**
 * 用户数据仓库
 */

import { getDb, queryOne, queryAll, execute, toSafeUser } from '@/lib/db';
import { SafeUser, User } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class UserRepository {
  /**
   * 创建用户
   */
  static async create(data: {
    username: string;
    email: string;
    password: string;
    nickname?: string;
  }): Promise<SafeUser | null> {
    await getDb();

    const existing = queryOne(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [data.email, data.username]
    );
    if (existing) return null;

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(data.password, 10);

    execute(
      `INSERT INTO users (id, username, email, password_hash, nickname, role, status)
       VALUES (?, ?, ?, ?, ?, 'user', 'active')`,
      [id, data.username, data.email, passwordHash, data.nickname || data.username]
    );

    const user = queryOne('SELECT * FROM users WHERE id = ?', [id]);
    return user ? toSafeUser(user) : null;
  }

  /**
   * 用户登录验证
   */
  static async verifyLogin(login: string, password: string): Promise<SafeUser | null> {
    await getDb();

    const user = queryOne(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [login, login]
    );
    if (!user) return null;

    if (user.status !== 'active') return null;

    const valid = await bcrypt.compare(password, user.password_hash as string);
    if (!valid) return null;

    return toSafeUser(user);
  }

  /**
   * 管理员登录验证
   */
  static async verifyAdminLogin(login: string, password: string): Promise<SafeUser | null> {
    const user = await this.verifyLogin(login, password);
    if (!user) return null;
    if (user.role !== 'admin' && user.role !== 'super_admin') return null;
    return user;
  }

  /**
   * 获取用户详情
   */
  static async getById(id: string): Promise<SafeUser | null> {
    await getDb();
    const user = queryOne('SELECT * FROM users WHERE id = ?', [id]);
    return user ? toSafeUser(user) : null;
  }

  /**
   * 管理员获取所有用户列表
   */
  static async listAll(
    page = 1,
    pageSize = 20,
    filters?: { role?: string; status?: string; search?: string }
  ): Promise<{ users: SafeUser[]; total: number }> {
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
      where += ' AND (username LIKE ? OR email LIKE ? OR nickname LIKE ?)';
      const s = `%${filters.search}%`;
      params.push(s, s, s);
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

  /**
   * 更新用户信息（管理员）
   */
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

  /**
   * 获取用户统计
   */
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
