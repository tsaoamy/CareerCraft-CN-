/**
 * 用户业务数据云端同步客户端 + 多端轮询
 */

import { apiFetch } from '@/lib/api-client';
import type { Material } from '@/types/material';
import type { JobApplication } from '@/types/application';
import type { UserProfileSettings } from '@/types/user-profile';

function maxUpdatedAt(items: { updatedAt?: string }[]): number {
  return items.reduce((max, item) => {
    const t = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;
    return Math.max(max, t);
  }, 0);
}

/** 合并远端与本地：取 updatedAt 更新的一方 */
export function mergeMaterialsByTimestamp(local: Material[], remote: Material[]): Material[] {
  const localMax = maxUpdatedAt(local);
  const remoteMax = maxUpdatedAt(remote);
  if (remoteMax > localMax) return remote;
  if (localMax > remoteMax) return local;
  return remote.length >= local.length ? remote : local;
}

export async function fetchRemoteMaterials(): Promise<Material[] | null> {
  const res = await apiFetch<{ materials: Material[] }>('/api/user-data/materials');
  if (!res.success || !res.data) return null;
  return res.data.materials ?? [];
}

export async function syncRemoteMaterials(materials: Material[]): Promise<boolean> {
  const res = await apiFetch('/api/user-data/materials', {
    method: 'PUT',
    body: JSON.stringify({ materials }),
  });
  return res.success;
}

export async function fetchRemoteApplications(): Promise<JobApplication[] | null> {
  const res = await apiFetch<{ applications: JobApplication[] }>('/api/user-data/applications');
  if (!res.success || !res.data) return null;
  return res.data.applications ?? [];
}

export async function syncRemoteApplications(applications: JobApplication[]): Promise<boolean> {
  const res = await apiFetch('/api/user-data/applications', {
    method: 'PUT',
    body: JSON.stringify({ applications }),
  });
  return res.success;
}

export async function fetchRemoteProfile(): Promise<UserProfileSettings | null> {
  const res = await apiFetch<{ profile: UserProfileSettings | null }>('/api/user-data/profile');
  if (!res.success || !res.data) return null;
  return res.data.profile ?? null;
}

export async function syncRemoteProfile(profile: UserProfileSettings): Promise<boolean> {
  const res = await apiFetch('/api/user-data/profile', {
    method: 'PUT',
    body: JSON.stringify({ profile }),
  });
  return res.success;
}

export async function fetchSyncStatus(): Promise<{
  cloudEnabled: boolean;
  cloudConnected: boolean;
} | null> {
  const res = await apiFetch<{
    cloudEnabled: boolean;
    cloudConnected: boolean;
  }>('/api/sync/status');
  if (!res.success || !res.data) return null;
  return res.data;
}

/** 防抖云端同步 */
export function createDebouncedSync<T>(fn: (data: T) => Promise<boolean>, delayMs = 800) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (data: T) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      void fn(data);
    }, delayMs);
  };
}

/** 注册多端轮询 + 页面聚焦时拉取 */
export function registerCloudPolling(
  pollFn: () => void | Promise<void>,
  intervalMs = 8000
): () => void {
  const tick = () => void pollFn();
  const interval = setInterval(tick, intervalMs);

  const onVisible = () => {
    if (document.visibilityState === 'visible') tick();
  };
  const onFocus = () => tick();

  document.addEventListener('visibilitychange', onVisible);
  window.addEventListener('focus', onFocus);

  return () => {
    clearInterval(interval);
    document.removeEventListener('visibilitychange', onVisible);
    window.removeEventListener('focus', onFocus);
  };
}
