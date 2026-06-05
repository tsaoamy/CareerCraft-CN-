'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';

export interface FloatPosition {
  x: number;
  y: number;
}

interface UseDraggableFloatOptions {
  /** localStorage 键，记住拖动位置 */
  storageKey?: string;
  /** 默认锚点（首次加载无缓存时） */
  anchor?: 'bottom-left' | 'bottom-right';
  /** 距边缘默认间距 */
  margin?: number;
  /** 顶部留白（避开固定导航栏） */
  topInset?: number;
}

function readStoredPosition(key: string): FloatPosition | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FloatPosition;
    if (typeof parsed.x === 'number' && typeof parsed.y === 'number') return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function defaultPosition(
  anchor: 'bottom-left' | 'bottom-right',
  margin: number,
  width: number,
  height: number
): FloatPosition {
  const x =
    anchor === 'bottom-left'
      ? margin
      : Math.max(margin, window.innerWidth - width - margin);
  const y = Math.max(margin, window.innerHeight - height - margin);
  return { x, y };
}

function clampPosition(
  pos: FloatPosition,
  width: number,
  height: number,
  topInset: number
): FloatPosition {
  const maxX = Math.max(8, window.innerWidth - width - 8);
  const maxY = Math.max(topInset, window.innerHeight - height - 8);
  return {
    x: Math.min(Math.max(8, pos.x), maxX),
    y: Math.min(Math.max(topInset, pos.y), maxY),
  };
}

export function useDraggableFloat(
  options: UseDraggableFloatOptions = {}
) {
  const {
    storageKey,
    anchor = 'bottom-right',
    margin = 20,
    topInset = 64,
  } = options;

  const nodeRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

  const [position, setPosition] = useState<FloatPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 初始化位置
  useEffect(() => {
    const init = () => {
      const el = nodeRef.current;
      if (!el) return;

      const stored = storageKey ? readStoredPosition(storageKey) : null;
      const w = el.offsetWidth || 56;
      const h = el.offsetHeight || 56;
      const base = stored ?? defaultPosition(anchor, margin, w, h);
      setPosition(clampPosition(base, w, h, topInset));
    };

    init();
    requestAnimationFrame(init);
  }, [storageKey, anchor, margin, topInset]);

  // 窗口缩放时保持在视口内
  useEffect(() => {
    const onResize = () => {
      const el = nodeRef.current;
      if (!el || !position) return;
      setPosition(
        clampPosition(position, el.offsetWidth, el.offsetHeight, topInset)
      );
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [position, topInset]);

  const persist = useCallback(
    (pos: FloatPosition) => {
      if (!storageKey) return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(pos));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (e.button !== 0 || !position) return;
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        originX: position.x,
        originY: position.y,
        moved: false,
      };
      setIsDragging(true);
    },
    [position]
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) {
        dragRef.current.moved = true;
      }
      const el = nodeRef.current;
      const w = el?.offsetWidth ?? 0;
      const h = el?.offsetHeight ?? 0;
      const next = clampPosition(
        { x: dragRef.current.originX + dx, y: dragRef.current.originY + dy },
        w,
        h,
        topInset
      );
      setPosition(next);
    },
    [topInset]
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent) => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      setIsDragging(false);
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      if (position) persist(position);
    },
    [persist, position]
  );

  const consumeDrag = useCallback(() => {
    const moved = dragRef.current.moved;
    dragRef.current.moved = false;
    return moved;
  }, []);

  const dragHandleProps = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
    style: { touchAction: 'none' as const, cursor: isDragging ? 'grabbing' : 'grab' },
  };

  const style: CSSProperties | undefined = position
    ? { position: 'fixed', left: position.x, top: position.y, zIndex: 90 }
    : { position: 'fixed', visibility: 'hidden' };

  return {
    nodeRef,
    style,
    isDragging,
    dragHandleProps,
    consumeDrag,
  };
}
