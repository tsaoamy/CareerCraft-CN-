"use client";

// ==========================================
// Admin Auth Context — 基于 JWT 的管理员会话
// 与用户端共用 careercraft_token_v2，通过 /api/auth/me 校验 admin 角色
// ==========================================

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types/admin";
import { AUTH_TOKEN_KEY, ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { isAdminRole } from "@/lib/auth/rbac";

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminName: string;
  role: UserRole | null;
}

interface AdminAuthContextType extends AdminAuthState {
  logout: () => void;
  checkAccess: () => boolean;
  refreshSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

function setAdminSessionCookie() {
  document.cookie = `${ADMIN_SESSION_COOKIE}=1; path=/; max-age=86400; SameSite=Lax`;
}

function clearAdminSessionCookie() {
  document.cookie = `${ADMIN_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = "admin_session=; path=/; max-age=0; SameSite=Lax";
}

function clearLegacyMockTokens() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("careercraft_admin_session");
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AdminAuthState>({
    isAuthenticated: false,
    isLoading: true,
    adminName: "",
    role: null,
  });

  const refreshSession = useCallback(async () => {
    clearLegacyMockTokens();
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setState({ isAuthenticated: false, isLoading: false, adminName: "", role: null });
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok || !data.success || !data.data?.user) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        clearAdminSessionCookie();
        setState({ isAuthenticated: false, isLoading: false, adminName: "", role: null });
        return;
      }

      const user = data.data.user;
      if (!isAdminRole(user.role)) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        clearAdminSessionCookie();
        setState({ isAuthenticated: false, isLoading: false, adminName: "", role: null });
        return;
      }

      setAdminSessionCookie();
      setState({
        isAuthenticated: true,
        isLoading: false,
        adminName: user.nickname || user.username || "Admin",
        role: user.role as UserRole,
      });
    } catch {
      setState({ isAuthenticated: false, isLoading: false, adminName: "", role: null });
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    clearLegacyMockTokens();
    clearAdminSessionCookie();
    setState({ isAuthenticated: false, isLoading: false, adminName: "", role: null });
    router.push("/admin/login");
  }, [router]);

  const checkAccess = useCallback(() => {
    return state.isAuthenticated && (state.role === "admin" || state.role === "super_admin");
  }, [state.isAuthenticated, state.role]);

  return (
    <AdminAuthContext.Provider value={{ ...state, logout, checkAccess, refreshSession }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

/** 管理员登录成功后写入 token 与 cookie */
export function persistAdminLogin(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  clearLegacyMockTokens();
  setAdminSessionCookie();
}
