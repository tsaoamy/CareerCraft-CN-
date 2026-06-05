"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";
import { themeTokens } from "./tokens";

const TRANSITION_MS = themeTokens.motion.themeTransitionMs;

function enableThemeTransition() {
  document.documentElement.classList.add("theme-transitioning");
  window.setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
  }, TRANSITION_MS);
}

/** 平滑主题切换 — 仅用户主动切换时过渡，避免首屏 hydration 触发全局 transition */
export function useThemeTransition() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const setThemeSmooth = useCallback(
    (next: string) => {
      enableThemeTransition();
      setTheme(next);
    },
    [setTheme]
  );

  const toggleTheme = useCallback(() => {
    const current = resolvedTheme ?? theme ?? "dark";
    setThemeSmooth(current === "dark" ? "light" : "dark");
  }, [resolvedTheme, theme, setThemeSmooth]);

  return {
    theme: resolvedTheme ?? theme,
    setTheme: setThemeSmooth,
    toggleTheme,
  };
}

/** 挂载于 AppProviders — 初始化 color-scheme */
export function ThemeTransitionInit() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const mode = resolvedTheme === "light" ? "light" : "dark";
    document.documentElement.style.colorScheme = mode;
  }, [resolvedTheme]);

  return null;
}
