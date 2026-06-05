/**
 * CareerCraft 认证系统
 * 基于 CloudBase Auth v3（Supabase-like API）
 * 支持：用户名+密码 注册/登录、手机号+密码（预留）、OAuth（预留）
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getCloudBaseAuth } from '@/lib/cloudbase/web-client';
import { AUTH_TOKEN_KEY } from '@/lib/auth/constants';

// ──────────── 类型 ────────────
export interface AuthUser {
  /** CloudBase Auth UID（同时作为 id 字段向后兼容） */
  uid: string;
  /** 向后兼容 id → 同 uid */
  id: string;
  username: string;
  email: string | null;
  phone: string;
  wechat_openid: string;
  qq_openid: string;
  auth_provider: string;
  nickname: string;
  avatar_url: string;
  role: string;
  status: string;
  created_at: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  /** 用户名注册 */
  register: (username: string, password: string, nickname?: string) => Promise<{ success: boolean; error?: string }>;
  /** 用户名登录 */
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  /** 登出 */
  logout: () => Promise<void>;

  /** 手机号注册（预留） */
  registerByPhone: (phone: string, password: string, nickname?: string) => Promise<{ success: boolean; error?: string }>;
  /** 手机号登录（预留） */
  loginByPhone: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;

  /** 微信登录 */
  loginByWechat: (openid: string, nickname?: string) => Promise<{ success: boolean; error?: string }>;
  /** QQ 登录 */
  loginByQQ: (openid: string, nickname?: string) => Promise<{ success: boolean; error?: string }>;

  /** 刷新用户信息 */
  refreshUser: () => Promise<void>;

  /** 发送绑定/换绑验证码 */
  sendBindCode: (type: 'phone' | 'email', target: string, purpose: string) => Promise<{ success: boolean; error?: string; retryAfter?: number }>;
  /** 绑定/换绑手机号 */
  bindPhone: (phone: string, code: string) => Promise<{ success: boolean; error?: string }>;
  /** 绑定/换绑邮箱 */
  bindEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthState | null>(null);

// ──────────── 辅助函数 ────────────
function buildUserFromSession(session: { user?: Record<string, unknown> }): AuthUser | null {
  const u = session.user;
  if (!u || !u.id) return null;
  const meta = (u.user_metadata || {}) as Record<string, unknown>;
  const uid = String(u.id);
  const username = String(meta.username || meta.name || 'user');
  return {
    uid,
    id: uid,
    username,
    email: (u.email as string) || null,
    phone: (u.phone as string) || '',
    wechat_openid: '',
    qq_openid: '',
    auth_provider: (u.phone as string) ? 'phone' : 'cloud_base',
    nickname: String(meta.nickName || meta.nickname || meta.name || '用户'),
    avatar_url: String(meta.avatarUrl || meta.picture || ''),
    role: 'user',
    status: 'active',
    created_at: String(u.created_at || new Date().toISOString()),
  };
}

async function ensureUserProfile(params: {
  uid: string;
  username: string;
  nickname?: string;
  email?: string | null;
  phone?: string | null;
}): Promise<void> {
  try {
    const res = await fetch('/api/auth/create-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      console.error('[auth] 创建用户档案失败:', await res.text());
    }
  } catch (err) {
    console.error('[auth] 创建用户档案网络错误:', err);
  }
}

// ──────────── Provider ────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化：先尝试 JWT token 恢复，再回退到 CloudBase Auth session
  useEffect(() => {
    let cancelled = false;

    async function init() {
      // 1. 优先从后端 JWT token 恢复
      const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const json = await res.json();
          if (json.success && json.data.user && !cancelled) {
            setUser(json.data.user);
            console.info('[auth] ✅ JWT 恢复登录:', json.data.user.id);
            setIsLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      }

      // 2. 回退到 CloudBase Auth session
      try {
        const auth = getCloudBaseAuth();
        const { data, error } = await auth.getSession();

        if (error) {
          console.error('[auth] getSession error:', error);
          if (!cancelled) setIsLoading(false);
          return;
        }

        if (data?.session) {
          const authUser = buildUserFromSession(data.session);
          if (authUser && !cancelled) {
            setUser(authUser);
            console.info('[auth] ✅ CloudBase 恢复登录, uid:', authUser.uid);
          }
        } else {
          console.info('[auth] 未登录');
        }
      } catch (err) {
        console.error('[auth] 检查 session 异常:', err);
      }
      if (!cancelled) setIsLoading(false);
    }

    init();

    // 监听 CloudBase auth 状态变化（兼容模式）
    let unsubscribe: (() => void) | undefined;
    try {
      const auth = getCloudBaseAuth();
      const sub = auth.onAuthStateChange((event: string, session: unknown) => {
        console.info('[auth] 状态变化:', event);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const s = session as { user?: Record<string, unknown> };
          const authUser = buildUserFromSession(s);
          if (authUser) setUser(authUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });
      unsubscribe = typeof sub === 'function' ? sub : () => {};
    } catch {
      /* ignore */
    }

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // ── 用户名注册 ──
  const register = useCallback(async (username: string, password: string, nickname?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const auth = getCloudBaseAuth();
      // v3 SDK signUp 主要通过 OTP，但支持 Supabase 式 username+password 注册
      // 使用类型断言绕过 v3 SDK 的类型限制
      const { data, error } = await (auth as unknown as {
        signUp(params: Record<string, unknown>): Promise<{ data: { user?: { id: string; email?: string; phone?: string; user_metadata?: Record<string, unknown>; created_at?: string }; session?: Record<string, unknown> }; error: { message: string } | null }>
      }).signUp({
        username,
        password,
        nickname: nickname || username,
      });

      if (error) {
        console.error('[auth] REGISTER_ERROR', error);
        return { success: false, error: error.message || '注册失败' };
      }

      // 如果 signUp 返回了 OTP 回调 (v3 特性)，说明需要验证码，但我们发送的是 password
      // 尝试直接读取 user（Supabase 模式）
      const userData = (data.user || data.session?.user) as Record<string, unknown> | undefined;
      if (!userData) {
        // 降级到 v1 API
        const emailForSignup = `${username}@careercraft-app.local`;
        const v1Result = await auth.signUpWithEmailAndPassword(emailForSignup, password);
        if (v1Result.error) {
          console.error('[auth] REGISTER_ERROR (v1 fallback)', v1Result.error);
          return { success: false, error: v1Result.error.message || '注册失败' };
        }
        const v1User = v1Result.data?.user || v1Result.data?.session?.user;
        if (!v1User) {
          return { success: false, error: '注册成功但获取用户信息失败' };
        }
        const meta = (v1User.user_metadata || {}) as Record<string, unknown>;
        const uid = String(v1User.id);
        const authUser: AuthUser = {
          uid, id: uid, username,
          email: v1User.email || null,
          phone: (v1User.phone as string) || '',
          wechat_openid: '', qq_openid: '', auth_provider: 'cloud_base',
          nickname: nickname || username,
          avatar_url: '', role: 'user', status: 'active',
          created_at: String(v1User.created_at || new Date().toISOString()),
        };
        await ensureUserProfile({ uid, username, nickname: authUser.nickname, email: v1User.email || null });
        setUser(authUser);
        return { success: true };
      }

      const meta = (userData.user_metadata || {}) as Record<string, unknown>;
      const uid = String(userData.id);
      const authUser: AuthUser = {
        uid, id: uid, username,
        email: (userData.email as string | null) || null,
        phone: ((userData.phone as string) || ''),
        wechat_openid: '', qq_openid: '', auth_provider: 'cloud_base',
        nickname: nickname || username,
        avatar_url: '', role: 'user', status: 'active',
        created_at: String((userData.created_at as string) || new Date().toISOString()),
      };

      await ensureUserProfile({ uid, username, nickname: authUser.nickname });
      setUser(authUser);
      console.info('[auth] ✅ 注册成功:', uid);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[auth] REGISTER_ERROR', err);
      return { success: false, error: message || '注册失败，请重试' };
    }
  }, []);

  // ── 用户名登录 ──
  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'email', login: username, password }),
      });
      const json = await res.json();
      if (json.success) {
        setUser(json.data.user);
        if (json.data.token) localStorage.setItem(AUTH_TOKEN_KEY, json.data.token);
        return { success: true };
      }
      return { success: false, error: json.error || '登录失败' };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[auth] LOGIN_ERROR', err);
      return { success: false, error: message || '登录失败，请重试' };
    }
  }, []);

  // ── 登出 ──
  const logout = useCallback(async () => {
    try {
      const auth = getCloudBaseAuth();
      await auth.signOut();
    } catch (err) {
      console.error('[auth] 登出失败:', err);
    }
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    console.info('[auth] ✅ 已登出');
  }, []);

  // ── 手机号注册 ──
  const registerByPhone = useCallback(async (phone: string, password: string, nickname?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'phone', phone, password, nickname: nickname || `用户${phone.slice(-4)}` }),
      });
      const json = await res.json();
      if (json.success) {
        setUser(json.data.user);
        if (json.data.token) localStorage.setItem(AUTH_TOKEN_KEY, json.data.token);
        console.info('[auth] ✅ 手机号注册成功:', json.data.user.id);
        return { success: true };
      }
      return { success: false, error: json.error || '手机号注册失败' };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[auth] PHONE_REGISTER_ERROR', err);
      return { success: false, error: message || '注册失败，请重试' };
    }
  }, []);

  // ── 手机号登录 ──
  const loginByPhone = useCallback(async (phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'phone', phone, password }),
      });
      const json = await res.json();
      if (json.success) {
        setUser(json.data.user);
        if (json.data.token) localStorage.setItem(AUTH_TOKEN_KEY, json.data.token);
        return { success: true };
      }
      return { success: false, error: json.error || '登录失败' };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[auth] PHONE_LOGIN_ERROR', err);
      return { success: false, error: message || '登录失败，请重试' };
    }
  }, []);

  // ── 微信/QQ 登录（演示模式，保持兼容） ──
  const loginByWechat = useCallback(async (openid: string, _nickname?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'wechat', openid }),
      });
      const json = await res.json();
      if (json.success) {
        setUser(json.data.user);
        if (json.data.token) localStorage.setItem(AUTH_TOKEN_KEY, json.data.token);
        return { success: true };
      }
      return { success: false, error: json.error || '微信登录失败' };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[auth] WECHAT_LOGIN_ERROR', err);
      return { success: false, error: message || '网络错误' };
    }
  }, []);

  const loginByQQ = useCallback(async (openid: string, _nickname?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'qq', openid }),
      });
      const json = await res.json();
      if (json.success) {
        setUser(json.data.user);
        if (json.data.token) localStorage.setItem(AUTH_TOKEN_KEY, json.data.token);
        return { success: true };
      }
      return { success: false, error: json.error || 'QQ登录失败' };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[auth] QQ_LOGIN_ERROR', err);
      return { success: false, error: message || '网络错误' };
    }
  }, []);

  // ── 刷新用户 ──
  const refreshUser = useCallback(async () => {
    try {
      const auth = getCloudBaseAuth();
      const { data, error } = await auth.getSession();
      if (error || !data?.session) {
        setUser(null);
        return;
      }
      const authUser = buildUserFromSession(data.session);
      if (authUser) setUser(authUser);
    } catch (err) {
      console.error('[auth] 刷新用户失败:', err);
    }
  }, []);

  // ── 绑定/换绑（功能开发中） ──
  const sendBindCode = useCallback(async (type: 'phone' | 'email', target: string, _purpose: string) => {
    console.log(`[auth] sendBindCode: ${type}=${target}（功能开发中，后续将接入 CloudBase 验证码 API）`);
    return { success: false, error: '该功能正在开发中，敬请期待' };
  }, []);

  const bindPhone = useCallback(async (phone: string, code: string) => {
    console.log(`[auth] bindPhone: ${phone}, code=${code}（功能开发中）`);
    return { success: false, error: '该功能正在开发中，敬请期待' };
  }, []);

  const bindEmail = useCallback(async (email: string, code: string) => {
    console.log(`[auth] bindEmail: ${email}, code=${code}（功能开发中）`);
    return { success: false, error: '该功能正在开发中，敬请期待' };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user, isAuthenticated: !!user, isLoading,
        register, login, logout,
        registerByPhone, loginByPhone,
        loginByWechat, loginByQQ,
        refreshUser,
        sendBindCode, bindPhone, bindEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
