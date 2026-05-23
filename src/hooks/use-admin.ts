// ==========================================
// Admin Hooks — 数据获取 + 状态管理
// ==========================================

import { useState, useEffect, useCallback } from "react";
import type {
  DashboardStats,
  DashboardTrends,
  UserBehaviorData,
  ResumeRecord,
  AIMonitorStats,
  AIErrorLog,
  AIHourlyCall,
  AdminUser,
  AdminLog,
  PaginationParams,
} from "@/types/admin";
import { useAdminAuth } from "@/lib/admin/admin-auth-context";
import * as dataService from "@/lib/admin/data-service";

// ──── Dashboard Stats ────
export function useAdminDashboardStats() {
  const { role } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<DashboardTrends | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dataService.adminGetDashboardStats(role ?? undefined),
      dataService.adminGetDashboardTrends(role ?? undefined, 7),
    ]).then(([statsRes, trendsRes]) => {
      setStats(statsRes.data);
      setTrends(trendsRes.data);
      setLoading(false);
    });
  }, [role]);

  return { stats, trends, loading };
}

// ──── User Behavior ────
export function useAdminUserBehavior() {
  const { role } = useAdminAuth();
  const [data, setData] = useState<UserBehaviorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.adminGetUserBehavior(role ?? undefined).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [role]);

  return { data, loading };
}

// ──── Resume Records ────
export function useAdminResumeRecords() {
  const { role } = useAdminAuth();
  const [records, setRecords] = useState<ResumeRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetch = useCallback(async () => {
    setLoading(true);
    const res = await dataService.adminGetResumeRecords(params, role ?? undefined);
    setRecords(res.data.data);
    setTotal(res.data.total);
    setTotalPages(res.data.totalPages);
    setLoading(false);
  }, [params, role]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { records, total, totalPages, loading, params, setParams, refetch: fetch };
}

// ──── AI Monitor ────
export function useAdminAIMonitor() {
  const { role } = useAdminAuth();
  const [stats, setStats] = useState<AIMonitorStats | null>(null);
  const [logs, setLogs] = useState<AIErrorLog[]>([]);
  const [hourly, setHourly] = useState<AIHourlyCall[]>([]);
  const [logTotal, setLogTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });

  const fetchLogs = useCallback(async () => {
    const [statsRes, hourlyRes, logsRes] = await Promise.all([
      dataService.adminGetAIMonitorStats(role ?? undefined),
      dataService.adminGetAIHourlyCalls(role ?? undefined),
      dataService.adminGetAIErrorLogs(params, role ?? undefined),
    ]);
    setStats(statsRes.data);
    setHourly(hourlyRes.data);
    setLogs(logsRes.data.data);
    setLogTotal(logsRes.data.total);
    setLoading(false);
  }, [params, role]);

  useEffect(() => {
    setLoading(true);
    fetchLogs();
  }, [fetchLogs]);

  return { stats, logs, hourly, logTotal, loading, params, setParams };
}

// ──── Admin Users ────
export function useAdminUsers() {
  const { role } = useAdminAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await dataService.adminGetUsers(params, role ?? undefined);
    setUsers(res.data.data);
    setTotal(res.data.total);
    setTotalPages(res.data.totalPages);
    setLoading(false);
  }, [params, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, total, totalPages, loading, params, setParams, refetch: fetchUsers };
}

// ──── Admin Logs ────
export function useAdminLogs() {
  const { role } = useAdminAuth();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 15,
    sortBy: "timestamp",
    sortOrder: "desc",
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const res = await dataService.adminGetLogs(params, role ?? undefined);
    setLogs(res.data.data);
    setTotal(res.data.total);
    setLoading(false);
  }, [params, role]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, total, loading, params, setParams };
}

// ──── Animated Number ────
export function useAnimatedNumber(target: number, duration = 1000) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCurrent(0);
      return;
    }
    const startTime = Date.now();
    const startValue = current;
    const diff = target - startValue;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCurrent(Math.round(startValue + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return current;
}
