'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type {
  AppNotification,
  NotificationPreferences,
  NotificationType,
} from '@/types/notification';
import { DEFAULT_NOTIFICATION_PREFS } from '@/types/notification';
import { useAuth } from '@/lib/auth-context';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'> & { read?: boolean }) => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

function storageKey(userId: string, suffix: string): string {
  return `careercraft-${suffix}-${userId}`;
}

function generateId(): string {
  return `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadList(userId: string): AppNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(userId, 'notifications'));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveList(userId: string, list: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(userId, 'notifications'), JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

function loadPrefs(userId: string): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_PREFS;
  try {
    const raw = localStorage.getItem(storageKey(userId, 'notification-prefs'));
    if (!raw) return DEFAULT_NOTIFICATION_PREFS;
    return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_PREFS;
  }
}

function savePrefs(userId: string, prefs: NotificationPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(userId, 'notification-prefs'), JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

function seedNotifications(): AppNotification[] {
  const now = Date.now();
  return [
    {
      id: generateId(),
      type: 'system',
      title: '欢迎使用职航',
      message: '录入素材库经历后，可在 JD 分析中一键生成定制简历并追踪投递进度。',
      href: '/materials',
      read: false,
      createdAt: new Date(now - 3600000).toISOString(),
    },
    {
      id: generateId(),
      type: 'jd',
      title: 'JD 智能分析已就绪',
      message: '粘贴岗位描述，同一面板完成匹配分析、简历定制与面试准备。',
      href: '/jd-analyzer',
      read: false,
      createdAt: new Date(now - 7200000).toISOString(),
    },
    {
      id: generateId(),
      type: 'application',
      title: '投递追踪功能上线',
      message: '支持 Boss 直聘、猎聘、内推等渠道，手动记录投递状态与进展。',
      href: '/applications',
      read: false,
      createdAt: new Date(now - 86400000).toISOString(),
    },
    {
      id: generateId(),
      type: 'interview',
      title: 'AI 面试官多维度练习',
      message: '行为 / 情景 / 技术面试，支持中英文，可先查看备考素材库。',
      href: '/interview',
      read: true,
      createdAt: new Date(now - 172800000).toISOString(),
    },
    {
      id: generateId(),
      type: 'product',
      title: '职航 v2 功能更新',
      message: '智能匹配覆盖腾讯、Apple、Tesla 等大厂岗位，JD 与简历定制已合并输出。',
      href: '/talent/matching',
      read: true,
      createdAt: new Date(now - 259200000).toISOString(),
    },
  ];
}

const TYPE_TO_PREF: Partial<Record<NotificationType, keyof NotificationPreferences>> = {
  resume: 'resumeComplete',
  jd: 'jdAnalysis',
  interview: 'interviewScore',
  product: 'productUpdates',
  system: 'industryNews',
  application: 'productUpdates',
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id;
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFS);

  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      setNotifications([]);
      setPreferences(DEFAULT_NOTIFICATION_PREFS);
      return;
    }

    const prefs = loadPrefs(userId);
    setPreferences(prefs);

    let list = loadList(userId);
    if (list.length === 0) {
      list = seedNotifications();
      saveList(userId, list);
    }
    setNotifications(list);
  }, [userId, authLoading]);

  const persist = useCallback(
    (next: AppNotification[]) => {
      if (!userId) return;
      setNotifications(next);
      saveList(userId, next);
    },
    [userId]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (n.type === 'system' || n.type === 'application') return true;
      const prefKey = TYPE_TO_PREF[n.type];
      if (!prefKey) return true;
      return preferences[prefKey];
    });
  }, [notifications, preferences]);

  const unreadCount = useMemo(
    () => filteredNotifications.filter((n) => !n.read).length,
    [filteredNotifications]
  );

  const markAsRead = useCallback(
    (id: string) => {
      persist(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    },
    [notifications, persist]
  );

  const markAllAsRead = useCallback(() => {
    persist(notifications.map((n) => ({ ...n, read: true })));
  }, [notifications, persist]);

  const dismiss = useCallback(
    (id: string) => {
      persist(notifications.filter((n) => n.id !== id));
    },
    [notifications, persist]
  );

  const addNotification = useCallback(
    (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'> & { read?: boolean }) => {
      const item: AppNotification = {
        ...n,
        id: generateId(),
        read: n.read ?? false,
        createdAt: new Date().toISOString(),
      };
      persist([item, ...notifications].slice(0, 50));
    },
    [notifications, persist]
  );

  const updatePreferences = useCallback(
    (partial: Partial<NotificationPreferences>) => {
      if (!userId) return;
      const next = { ...preferences, ...partial };
      setPreferences(next);
      savePrefs(userId, next);
    },
    [preferences, userId]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications: filteredNotifications,
        unreadCount,
        preferences,
        markAsRead,
        markAllAsRead,
        dismiss,
        addNotification,
        updatePreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
