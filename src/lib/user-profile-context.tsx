'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import {
  EMPTY_PROFILE,
  type UserProfileSettings,
} from '@/types/user-profile';
import { useAuth } from '@/lib/auth-context';
import {
  fetchRemoteProfile,
  syncRemoteProfile,
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

interface UserProfileContextType {
  profile: UserProfileSettings;
  isLoaded: boolean;
  saveProfile: (partial: Partial<UserProfileSettings>) => void;
  resetProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

function storageKey(userId: string): string {
  return `careercraft-profile-${userId}`;
}

function loadProfile(userId: string): UserProfileSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

function saveProfileToStorage(userId: string, profile: UserProfileSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

function profileFromAuth(user: {
  username?: string;
  phone?: string;
  nickname?: string;
}): UserProfileSettings {
  const name = user.nickname || user.username || '';
  return {
    ...EMPTY_PROFILE,
    displayName: name,
    avatarChar: name.charAt(0).toUpperCase() || '',
    phone: user.phone || '',
  };
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const storageUserId = userId ?? 'guest';
  const [profile, setProfile] = useState<UserProfileSettings>(EMPTY_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const syncRef = useRef(createDebouncedSync(syncRemoteProfile));

  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      const saved = loadProfile('guest');
      setProfile(saved ?? EMPTY_PROFILE);
      setIsLoaded(true);
      return;
    }

    let cancelled = false;

    async function hydrate() {
      const local = loadProfile(userId!);
      const remote = await fetchRemoteProfile();

      if (cancelled) return;

      if (remote) {
        const merged = { ...profileFromAuth(user!), ...remote };
        setProfile(merged);
        saveProfileToStorage(userId!, merged);
      } else if (local) {
        setProfile(local);
        void syncRemoteProfile(local);
      } else if (user) {
        const base = profileFromAuth(user);
        setProfile(base);
        void syncRemoteProfile(base);
      } else {
        setProfile(EMPTY_PROFILE);
      }
      setIsLoaded(true);
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [userId, user, authLoading]);

  // 多端实时同步：CloudBase watch() 监听资料变更
  useEffect(() => {
    if (!isLoaded || !userId) return;

    let cancelled = false;
    let watcher: RealtimeWatcher | null = null;

    initCloudBaseWeb().then((ok) => {
      if (cancelled || !ok) return;
      if (!isCloudBaseWebReady()) return;

      watcher = createRealtimeWatcher({
        collection: WEB_COLLECTIONS.profiles,
        where: { _id: userId },
        onChange: (snap: WatchSnapshot) => {
          if (cancelled) return;
          const doc = snap.docs?.[0] as Record<string, unknown> | undefined;
          if (!doc?.payload) return;
          const remoteProfile =
            typeof doc.payload === 'string'
              ? (() => { try { return JSON.parse(doc.payload) as UserProfileSettings; } catch { return null; } })()
              : (doc.payload as UserProfileSettings);
          if (!remoteProfile) return;

          setProfile((prev) => {
            const prevTime = prev.updatedAt ? new Date(prev.updatedAt).getTime() : 0;
            const remoteTime = remoteProfile.updatedAt ? new Date(remoteProfile.updatedAt).getTime() : 0;
            if (remoteTime > prevTime) {
              const merged = { ...prev, ...remoteProfile };
              saveProfileToStorage(storageUserId, merged);
              return merged;
            }
            return prev;
          });
        },
        onError: (err: Error) => {
          console.warn('[profile] watch 出错:', err.message);
        },
      });
    });

    return () => {
      cancelled = true;
      watcher?.close();
    };
  }, [isLoaded, userId, storageUserId]);

  const saveProfile = useCallback(
    (partial: Partial<UserProfileSettings>) => {
      setProfile((prev) => {
        const next: UserProfileSettings = {
          ...prev,
          ...partial,
          updatedAt: new Date().toISOString(),
        };
        saveProfileToStorage(storageUserId, next);
        if (userId) {
          syncRef.current(next);
        }
        return next;
      });
    },
    [userId, storageUserId]
  );

  const resetProfile = useCallback(() => {
    const base = user ? profileFromAuth(user) : EMPTY_PROFILE;
    setProfile(base);
    saveProfileToStorage(storageUserId, base);
    if (userId) {
      void syncRemoteProfile(base);
    }
  }, [user, userId, storageUserId]);

  return (
    <UserProfileContext.Provider value={{ profile, isLoaded, saveProfile, resetProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}
