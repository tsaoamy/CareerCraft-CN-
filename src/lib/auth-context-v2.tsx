/**
 * CareerCraft 认证系统 - v2.0
 * 基于 JWT + 真实 API，替代原有 localStorage 模拟
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SafeUser } from '@/lib/db/schema';

interface AuthState {
  user: SafeUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    nickname?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContextV2 = createContext<AuthState | undefined>(undefined);

export function AuthProviderV2({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化：从 localStorage 恢复 session
  useEffect(() => {
    const savedToken = localStorage.getItem('careercraft_token_v2');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function fetchUser(authToken: string) {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.data.user);
      } else {
        localStorage.removeItem('careercraft_token_v2');
        setToken(null);
        setUser(null);
      }
    } catch {
      // 离线时使用缓存
    } finally {
      setIsLoading(false);
    }
  }

  const login = useCallback(async (login: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('careercraft_token_v2', data.data.token);
        return { success: true };
      }

      return { success: false, error: data.error || '登录失败' };
    } catch {
      return { success: false, error: '网络错误，请检查连接' };
    }
  }, []);

  const register = useCallback(
    async (regData: {
      username: string;
      email: string;
      password: string;
      nickname?: string;
    }) => {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(regData),
        });
        const data = await res.json();

        if (data.success) {
          setToken(data.data.token);
          setUser(data.data.user);
          localStorage.setItem('careercraft_token_v2', data.data.token);
          return { success: true };
        }

        return { success: false, error: data.error || '注册失败' };
      } catch {
        return { success: false, error: '网络错误，请检查连接' };
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('careercraft_token_v2');
  }, []);

  const refreshUser = useCallback(async () => {
    if (token) await fetchUser(token);
  }, [token]);

  return (
    <AuthContextV2.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContextV2.Provider>
  );
}

export function useAuthV2() {
  const ctx = useContext(AuthContextV2);
  if (!ctx) throw new Error('useAuthV2 must be used within AuthProviderV2');
  return ctx;
}
