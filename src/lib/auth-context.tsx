'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const USERS_KEY = 'careercraft-users';
const SESSION_KEY = 'careercraft-session';

const AuthContext = createContext<AuthContextType | null>(null);

function getUsers(): Record<string, { user: User; password: string }> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch { return {}; }
}

function saveUsers(users: Record<string, { user: User; password: string }>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Expire after 7 days
    if (Date.now() - session.timestamp > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session.user;
  } catch { return null; }
}

function saveSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, timestamp: Date.now() }));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(getSession());
    setHydrated(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = getUsers();
    const entry = users[email.toLowerCase()];
    if (!entry) {
      return { success: false, error: '账号不存在' };
    }
    if (entry.password !== password) {
      return { success: false, error: '密码错误' };
    }
    setUser(entry.user);
    saveSession(entry.user);
    return { success: true };
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const users = getUsers();
    const key = email.toLowerCase();
    if (users[key]) {
      return { success: false, error: '该邮箱已被注册' };
    }
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      username,
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
    };
    users[key] = { user: newUser, password };
    saveUsers(users);
    setUser(newUser);
    saveSession(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
