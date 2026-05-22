"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "工作台" },
  { href: "/materials", label: "素材库" },
  { href: "/jd-analyzer", label: "JD 分析" },
  { href: "/resume-builder", label: "简历定制" },
  { href: "/interview", label: "AI 面试官" },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-400",
        scrolled
          ? "bg-[#f5f5f7]/80 dark:bg-black/80 backdrop-blur-xl border-b border-[#d2d2d7]/40 dark:border-[#38383a]/60"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 h-[52px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-apple-blue to-apple-purple flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:shadow-md transition-shadow">
            C
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-apple-text dark:text-white hidden sm:block">
            CareerCraft
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-[#e8e8ed] dark:bg-[#2c2c2e] text-apple-text dark:text-white"
                  : "text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#f0f0f2] dark:hover:bg-[#1c1c1e]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-full flex items-center justify-center text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all duration-200"
              aria-label="切换主题"
            >
              {theme === "dark" ? (
                <Sun className="w-[18px] h-[18px]" />
              ) : (
                <Moon className="w-[18px] h-[18px]" />
              )}
            </button>
          )}
          <AuthButtons />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all duration-200"
            aria-label="菜单"
          >
            {mobileOpen ? (
              <X className="w-[18px] h-[18px]" />
            ) : (
              <Menu className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#d2d2d7]/60 dark:border-[#38383a]/60 bg-[#f5f5f7]/95 dark:bg-black/95 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1 animate-fade-in-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-[#e8e8ed] dark:bg-[#2c2c2e] text-apple-text dark:text-white"
                    : "text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#f0f0f2] dark:hover:bg-[#1c1c1e]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function AuthButtons() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="hidden lg:flex items-center gap-1.5">
        <Link
          href="/login"
          className="px-4 py-2 rounded-full text-[13px] font-medium text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all duration-200"
        >
          登录
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 rounded-full text-[13px] font-medium bg-apple-blue text-white hover:bg-[#0077ed] shadow-[0_1px_4px_rgba(0,113,227,0.3)] transition-all duration-200"
        >
          免费注册
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-1">
      <Link
        href="/settings"
        className="flex items-center gap-2 px-3 py-2 rounded-full text-[13px] font-medium text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all duration-200"
      >
        <User className="w-[16px] h-[16px]" />
        <span>{user.username}</span>
      </Link>
      <button
        onClick={logout}
        className="w-9 h-9 rounded-full flex items-center justify-center text-apple-text-secondary hover:text-apple-red hover:bg-[#ffeaea] dark:hover:bg-[#3d1111] transition-all duration-200"
        title="退出登录"
      >
        <LogOut className="w-[16px] h-[16px]" />
      </button>
    </div>
  );
}
