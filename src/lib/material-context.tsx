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
import type { Material, MaterialFormData, MaterialCategory } from '@/types/material';
import { useAuth } from '@/lib/auth-context';
import {
  fetchRemoteMaterials,
  syncRemoteMaterials,
  createDebouncedSync,
  mergeMaterialsByTimestamp,
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

interface MaterialContextType {
  materials: Material[];
  addMaterial: (data: MaterialFormData) => void;
  addMaterials: (items: MaterialFormData[]) => void;
  updateMaterial: (id: string, data: Partial<MaterialFormData>) => void;
  deleteMaterial: (id: string) => void;
  getMaterialsByCategory: (category: MaterialCategory) => Material[];
  searchMaterials: (query: string) => Material[];
  filterBySkills: (skills: string[]) => Material[];
}

const LEGACY_STORAGE_KEY = 'careercraft-materials';

const MaterialContext = createContext<MaterialContextType | null>(null);

function storageKeyForUser(userId: string): string {
  return `careercraft-materials-${userId}`;
}

function generateId(): string {
  return `mat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadUserMaterials(userId: string): Material[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = storageKeyForUser(userId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

function saveUserMaterials(userId: string, materials: Material[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKeyForUser(userId), JSON.stringify(materials));
  } catch {
    /* storage full */
  }
}

function clearLegacyDemoData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function MaterialProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const syncRef = useRef(createDebouncedSync(syncRemoteMaterials));

  const userId = user?.id ?? null;

  useEffect(() => {
    if (authLoading) return;

    clearLegacyDemoData();

    if (!userId) {
      setMaterials([]);
      setHydrated(true);
      return;
    }

    let cancelled = false;

    async function hydrate() {
      const local = loadUserMaterials(userId!);
      const remote = await fetchRemoteMaterials();

      if (cancelled) return;

      if (remote && remote.length > 0) {
        setMaterials(remote);
        saveUserMaterials(userId!, remote);
      } else if (local.length > 0) {
        setMaterials(local);
        void syncRemoteMaterials(local);
      } else {
        setMaterials([]);
      }
      setHydrated(true);
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [userId, authLoading]);

  useEffect(() => {
    if (!hydrated || !userId) return;
    saveUserMaterials(userId, materials);
    syncRef.current(materials);
  }, [materials, hydrated, userId]);

  // 多端实时同步：CloudBase watch() 替换轮询
  useEffect(() => {
    if (!hydrated || !userId) return;

    let cancelled = false;
    let watcher: RealtimeWatcher | null = null;

    // 初始化并建立 CloudBase 实时监听
    initCloudBaseWeb().then((ok) => {
      if (cancelled || !ok) return;

      if (!isCloudBaseWebReady()) return;

      watcher = createRealtimeWatcher({
        collection: WEB_COLLECTIONS.materials,
        where: { _id: userId },
        onChange: (snap: WatchSnapshot) => {
          if (cancelled) return;
          // 从 CloudBase 文档中提取 materials payload
          const doc = snap.docs?.[0] as Record<string, unknown> | undefined;
          if (!doc?.payload) return;
          const remoteMaterials = Array.isArray(doc.payload)
            ? (doc.payload as Material[])
            : typeof doc.payload === 'string'
            ? (() => { try { return JSON.parse(doc.payload) as Material[]; } catch { return null; } })()
            : null;
          if (!remoteMaterials) return;

          setMaterials((prev) => {
            const merged = mergeMaterialsByTimestamp(prev, remoteMaterials);
            if (merged === prev) return prev;
            saveUserMaterials(userId, merged);
            return merged;
          });
        },
        onError: (err: Error) => {
          console.warn('[materials] watch 出错:', err.message);
        },
      });
    });

    return () => {
      cancelled = true;
      watcher?.close();
    };
  }, [hydrated, userId]);

  const addMaterial = useCallback((data: MaterialFormData) => {
    const now = new Date().toISOString();
    const material: Material = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setMaterials((prev) => [material, ...prev]);
  }, []);

  const addMaterials = useCallback((items: MaterialFormData[]) => {
    if (items.length === 0) return;
    const now = new Date().toISOString();
    const batch = items.map((data) => ({
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }));
    setMaterials((prev) => [...batch, ...prev]);
  }, []);

  const updateMaterial = useCallback((id: string, data: Partial<MaterialFormData>) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
      )
    );
  }, []);

  const deleteMaterial = useCallback((id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const getMaterialsByCategory = useCallback(
    (category: MaterialCategory) => materials.filter((m) => m.category === category),
    [materials]
  );

  const searchMaterials = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      return materials.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.rawContent.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q)) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      );
    },
    [materials]
  );

  const filterBySkills = useCallback(
    (skills: string[]) =>
      materials.filter((m) => skills.some((s) => m.skills.includes(s))),
    [materials]
  );

  return (
    <MaterialContext.Provider
      value={{
        materials: hydrated ? materials : [],
        addMaterial,
        addMaterials,
        updateMaterial,
        deleteMaterial,
        getMaterialsByCategory,
        searchMaterials,
        filterBySkills,
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
}

export function useMaterials(): MaterialContextType {
  const ctx = useContext(MaterialContext);
  if (!ctx) throw new Error('useMaterials must be used within MaterialProvider');
  return ctx;
}
