"use client";

// ==========================================
// Admin Auth Context — 独立的权限管理系统
// 与用户认证完全分离
// ==========================================

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { UserRole } from "@/types/admin";

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminName: string;
  role: UserRole | null;
}

interface AdminAuthContextType extends AdminAuthState {
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  checkAccess: () => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const ADMIN_SESSION_KEY = "careercraft_admin_session";
const ADMIN_PASSWORD = "123456"; // 生产环境使用 JWT + bcrypt

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({
    isAuthenticated: false,
    isLoading: true,
    adminName: "",
    role: null,
  });

  // 恢复会话
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) {
        const session = JSON.parse(saved);
        if (session.expiresAt && new Date(session.expiresAt).getTime() > Date.now()) {
          setState({
            isAuthenticated: true,
            isLoading: false,
            adminName: session.adminName || "Admin",
            role: session.role || "admin",
          });
          return;
        }
      }
    } catch {
      // ignore
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    // 生产环境：JWT 验证
    if (password === ADMIN_PASSWORD) {
      const session = {
        adminName: "CareerCraft Admin",
        role: "super_admin" as UserRole,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setState({
        isAuthenticated: true,
        isLoading: false,
        adminName: session.adminName,
        role: session.role,
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setState({
      isAuthenticated: false,
      isLoading: false,
      adminName: "",
      role: null,
    });
  }, []);

  const checkAccess = useCallback(() => {
    return state.isAuthenticated && (state.role === "admin" || state.role === "super_admin");
  }, [state.isAuthenticated, state.role]);

  return (
    <AdminAuthContext.Provider value={{ ...state, login, logout, checkAccess }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
