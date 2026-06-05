'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type {
  ApplicationPlatform,
  ApplicationStatus,
  JobApplication,
  ApplicationEvent,
} from '@/types/application';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  fetchRemoteApplications,
  syncRemoteApplications,
  createDebouncedSync,
} from '@/lib/user-data-client';
import {
  createRealtimeWatcher,
  type WatchSnapshot,
  type RealtimeWatcher,
} from '@/lib/cloudbase/realtime';
import {
  initCloudBaseWeb,
  isCloudBaseWebReady,
  WEB_COLLECTIONS,
} from '@/lib/cloudbase/web-client';

interface ApplicationStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  byPlatform: Record<ApplicationPlatform, number>;
  interviewRate: number;
  offerRate: number;
}

interface ApplicationContextType {
  applications: JobApplication[];
  addApplication: (data: Omit<JobApplication, 'id' | 'events' | 'createdAt' | 'updatedAt'>) => string;
  updateApplication: (id: string, data: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  addEvent: (applicationId: string, event: Omit<ApplicationEvent, 'id'>) => void;
  stats: ApplicationStats;
}

const ApplicationContext = createContext<ApplicationContextType | null>(null);

function storageKey(userId: string): string {
  return `careercraft-applications-${userId}`;
}

function generateId(): string {
  return `app_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadApplications(userId: string): JobApplication[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveApplications(userId: string, apps: JobApplication[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(apps));
  } catch {
    /* ignore */
  }
}

function computeStats(apps: JobApplication[]): ApplicationStats {
  const byStatus = {
    wishlist: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  } as Record<ApplicationStatus, number>;

  const byPlatform = {
    boss: 0,
    liepin: 0,
    lagou: 0,
    linkedin: 0,
    official: 0,
    referral: 0,
    campus: 0,
    other: 0,
  } as Record<ApplicationPlatform, number>;

  for (const app of apps) {
    byStatus[app.status]++;
    byPlatform[app.platform]++;
  }

  const appliedCount = apps.filter((a) => a.status !== 'wishlist').length;
  const interviewCount = apps.filter((a) =>
    ['interview', 'offer'].includes(a.status)
  ).length;
  const offerCount = apps.filter((a) => a.status === 'offer').length;

  return {
    total: apps.length,
    byStatus,
    byPlatform,
    interviewRate: appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0,
    offerRate: appliedCount > 0 ? Math.round((offerCount / appliedCount) * 100) : 0,
  };
}

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const { t } = useLocale();
  const ca = t.commonActions;
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const syncRef = useRef(createDebouncedSync(syncRemoteApplications));

  const userId = user?.id ?? null;
  const storageUserId = userId ?? 'guest';

  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      setApplications(loadApplications('guest'));
      setHydrated(true);
      return;
    }

    let cancelled = false;

    async function hydrate() {
      const local = loadApplications(userId!);
      const guestLocal = loadApplications('guest');
      const remote = await fetchRemoteApplications();

      if (cancelled) return;

      if (remote && remote.length > 0) {
        setApplications(remote);
        saveApplications(userId!, remote);
      } else if (local.length > 0) {
        setApplications(local);
        void syncRemoteApplications(local);
      } else if (guestLocal.length > 0) {
        setApplications(guestLocal);
        saveApplications(userId!, guestLocal);
        void syncRemoteApplications(guestLocal);
      } else {
        setApplications([]);
      }
      setHydrated(true);
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [userId, authLoading]);

  useEffect(() => {
    if (!hydrated) return;
    saveApplications(storageUserId, applications);
    if (userId) {
      syncRef.current(applications);
    }
  }, [applications, hydrated, userId, storageUserId]);

  // 多端实时同步：CloudBase watch() 替换轮询
  useEffect(() => {
    if (!hydrated || !userId) return;

    let cancelled = false;
    let watcher: RealtimeWatcher | null = null;

    initCloudBaseWeb().then((ok) => {
      if (cancelled || !ok) return;
      if (!isCloudBaseWebReady()) return;

      watcher = createRealtimeWatcher({
        collection: WEB_COLLECTIONS.applications,
        where: { _id: userId },
        onChange: (snap: WatchSnapshot) => {
          if (cancelled) return;
          const doc = snap.docs?.[0] as Record<string, unknown> | undefined;
          if (!doc?.payload) return;
          const remoteApps = Array.isArray(doc.payload)
            ? (doc.payload as JobApplication[])
            : typeof doc.payload === 'string'
            ? (() => { try { return JSON.parse(doc.payload) as JobApplication[]; } catch { return null; } })()
            : null;
          if (!remoteApps) return;

          setApplications((prev) => {
            const prevMax = prev.reduce((m, a) => Math.max(m, new Date(a.updatedAt).getTime()), 0);
            const remoteMax = remoteApps.reduce((m, a) => Math.max(m, new Date(a.updatedAt).getTime()), 0);
            if (remoteMax > prevMax) return remoteApps;
            return prev;
          });
        },
        onError: (err: Error) => {
          console.warn('[applications] watch 出错:', err.message);
        },
      });
    });

    return () => {
      cancelled = true;
      watcher?.close();
    };
  }, [hydrated, userId]);

  const persist = useCallback(
    (next: JobApplication[]) => {
      setApplications(next);
    },
    []
  );

  const addApplication = useCallback(
    (data: Omit<JobApplication, 'id' | 'events' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const id = generateId();
      const app: JobApplication = {
        ...data,
        id,
        events: data.appliedAt
          ? [{ id: generateId(), date: data.appliedAt, type: 'status_change', content: ca.createApplicationEvent }]
          : [],
        createdAt: now,
        updatedAt: now,
      };
      persist([app, ...applications]);
      return id;
    },
    [applications, persist, ca.createApplicationEvent]
  );

  const updateApplication = useCallback(
    (id: string, data: Partial<JobApplication>) => {
      persist(
        applications.map((a) =>
          a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
        )
      );
    },
    [applications, persist]
  );

  const deleteApplication = useCallback(
    (id: string) => {
      persist(applications.filter((a) => a.id !== id));
    },
    [applications, persist]
  );

  const addEvent = useCallback(
    (applicationId: string, event: Omit<ApplicationEvent, 'id'>) => {
      persist(
        applications.map((a) => {
          if (a.id !== applicationId) return a;
          return {
            ...a,
            events: [{ ...event, id: generateId() }, ...a.events],
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [applications, persist]
  );

  const stats = useMemo(() => computeStats(applications), [applications]);

  return (
    <ApplicationContext.Provider
      value={{ applications, addApplication, updateApplication, deleteApplication, addEvent, stats }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplications must be used within ApplicationProvider');
  return ctx;
}
