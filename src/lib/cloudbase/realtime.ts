/**
 * CloudBase 实时数据监听 (watch) 工具模块
 *
 * 基于 CloudBase Web SDK 的 db.collection().watch() API，
 * 实现对数据库集合变更的实时推送，替代 HTTP 轮询。
 *
 * 特性：
 * - 自动重连：连接断开 3 秒后自动重试
 * - 生命周期管理：提供 close() 方法释放资源
 * - 重连回调：通知上层连接状态变化
 */

import {
  getCloudBaseWebDb,
  initCloudBaseWeb,
  isCloudBaseWebReady,
} from './web-client';

/** watch onChange 回调参数（匹配 @cloudbase/js-sdk ISnapshot） */
export interface WatchSnapshot {
  docChanges: Array<{
    id: string | number;
    dataType: string;
    queueType: string;
    doc: Record<string, unknown>;
  }>;
  docs: Record<string, unknown>[];
}

/** watch 回调 */
export type WatchOnChange = (snapshot: WatchSnapshot) => void;
export type WatchOnError = (error: Error) => void;
export type WatchOnReconnect = (attempt: number) => void;

/** watcher 对象 */
export interface RealtimeWatcher {
  /** 关闭监听 */
  close: () => void;
  /** 是否已关闭 */
  readonly closed: boolean;
}

/** 监听选项 */
interface WatchOptions {
  collection: string;
  where?: Record<string, unknown>;
  onChange: WatchOnChange;
  onError?: WatchOnError;
  onReconnect?: WatchOnReconnect;
  /** 重连间隔 ms，默认 3000 */
  reconnectInterval?: number;
  /** 最大重连次数，默认 Infinity */
  maxReconnect?: number;
}

/**
 * 创建实时数据监听
 *
 * 使用示例：
 * ```ts
 * const watcher = createRealtimeWatcher({
 *   collection: 'cv_user_materials',
 *   where: { user_id: 'xxx' },
 *   onChange: (snap) => setData(snap.docs),
 *   onError: (err) => console.error(err),
 * });
 *
 * // 组件卸载时
 * watcher.close();
 * ```
 */
export function createRealtimeWatcher(options: WatchOptions): RealtimeWatcher {
  const {
    collection,
    where,
    onChange,
    onError,
    onReconnect,
    reconnectInterval = 3000,
    maxReconnect = Infinity,
  } = options;

  let closed = false;
  let currentWatcher: { close: () => void } | null = null;
  let reconnectCount = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  function clearReconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function cleanup() {
    clearReconnect();
    if (currentWatcher) {
      try {
        currentWatcher.close();
      } catch {
        /* ignore */
      }
      currentWatcher = null;
    }
  }

  function startWatch() {
    if (closed) return;

    // 确保 SDK 已初始化
    if (!isCloudBaseWebReady()) {
      initCloudBaseWeb()
        .then((ok) => {
          if (ok && !closed) startWatch();
          else if (!ok && !closed && onError) {
            onError(new Error('CloudBase Web SDK 初始化失败'));
          }
        })
        .catch((err) => {
          if (onError) onError(err instanceof Error ? err : new Error(String(err)));
        });
      return;
    }

    try {
      const db = getCloudBaseWebDb();
      const collectionRef = db.collection(collection);
      const query = (where && Object.keys(where).length > 0
        ? collectionRef.where(where)
        : collectionRef) as ReturnType<typeof db.collection>;

      currentWatcher = query.watch({
        onChange: (snapshot: WatchSnapshot) => {
          reconnectCount = 0; // 连接正常，重置计数
          onChange(snapshot);
        },
        onError: (err: Error) => {
          if (onError) onError(err);

          // 自动重连
          if (!closed && reconnectCount < maxReconnect) {
            cleanup();
            reconnectCount++;
            if (onReconnect) onReconnect(reconnectCount);
            reconnectTimer = setTimeout(() => {
              reconnectTimer = null;
              startWatch();
            }, reconnectInterval);
          }
        },
      });
    } catch (err) {
      if (onError) {
        onError(err instanceof Error ? err : new Error(String(err)));
      }

      // 重试
      if (!closed && reconnectCount < maxReconnect) {
        reconnectCount++;
        if (onReconnect) onReconnect(reconnectCount);
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          startWatch();
        }, reconnectInterval);
      }
    }
  }

  startWatch();

  return {
    get closed() {
      return closed;
    },
    close() {
      closed = true;
      cleanup();
    },
  };
}

/**
 * 轮询式实时监听（兼容不支持 watch 的环境，如 CloudBase 未启用匿名登录）
 * 作为 watch 的降级方案，每 intervalMs 毫秒执行一次 fetchFn
 */
export function createPollingWatcher(
  fetchFn: () => Promise<void> | void,
  intervalMs = 5000
): RealtimeWatcher {
  let closed = false;
  const interval = setInterval(() => {
    if (closed) return;
    void fetchFn();
  }, intervalMs);

  // 立即执行一次
  void fetchFn();

  return {
    get closed() {
      return closed;
    },
    close() {
      closed = true;
      clearInterval(interval);
    },
  };
}
