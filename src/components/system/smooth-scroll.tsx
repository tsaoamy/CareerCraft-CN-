"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, type ReactNode } from "react";

/** 是否使用原生滚动（移动端 / 减少动效偏好） */
function shouldUseNativeScroll() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 767px)").matches
  );
}

/** 桌面端：Linear / Notion / Vercel 式轻量平滑 — 高响应、低惯性 */
function createLenisOptions(): ConstructorParameters<typeof Lenis>[0] {
  return {
    // lerp 优先于 duration；更高 = 更快收敛、更少滑行
    lerp: 0.21,
    wheelMultiplier: 1.18,
    touchMultiplier: 0.75,
    smoothWheel: true,
    syncTouch: false,
    infinite: false,
    autoResize: true,
    overscroll: true,
    prevent: (node: HTMLElement) => {
      if (
        node.closest(
          "[data-lenis-prevent], [data-native-scroll], .custom-scrollbar"
        )
      ) {
        return true;
      }
      const tag = node.tagName;
      if (tag === "TEXTAREA" || tag === "SELECT" || tag === "INPUT") return true;
      return false;
    },
  };
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (shouldUseNativeScroll()) return;

    const lenis = new Lenis(createLenisOptions());

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

/** 供 scrollTo / anchor 等场景读取的推荐参数 */
export const SCROLL_LERP = 0.21;
