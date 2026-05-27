"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Moon, Sun, Menu, X, User, LogOut, ChevronDown,
  Settings, LayoutDashboard, FileText, Briefcase,
  MessageSquare, Star, Bell
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "工作台", icon: LayoutDashboard },
  { href: "/materials", label: "素材库", icon: FileText },
  { href: "/jd-analyzer", label: "JD 分析", icon: Briefcase },
  { href: "/resume-builder", label: "简历定制", icon: Star },
  { href: "/interview", label: "AI 面试官", icon: MessageSquare },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] bg-gradient-to-r from-[#0071e3] via-[#5ac8fa] to-[#bf5af2] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#f5f5f7]/80 dark:bg-black/80 backdrop-blur-xl border-b border-[#d2d2d7]/40 dark:border-[#38383a]/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-5 h-[52px] flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#0071e3] to-[#bf5af2] opacity-60 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500" />
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#0071e3] to-[#8944ab] flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                C
              </div>
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-apple-text dark:text-white hidden sm:block group-hover:text-[#0071e3] dark:group-hover:text-[#0a84ff] transition-colors duration-300">
              CareerCraft
            </span>
          </Link>

          {/* Desktop nav - pill indicator style */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-[#f0f0f2]/50 dark:bg-[#2c2c2e]/50 backdrop-blur-sm rounded-full p-1 border border-[#d2d2d7]/20 dark:border-[#38383a]/40">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 flex items-center gap-1.5",
                    isActive
                      ? "text-white shadow-[0_1px_3px_rgba(0,113,227,0.3)]"
                      : "text-apple-text-secondary hover:text-apple-text dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0071e3] to-[#5ac8fa] animate-scale-in" />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Notification bell (decorative) */}
            {mounted && (
              <button
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all duration-200"
                aria-label="通知"
              >
                <Bell className="w-[17px] h-[17px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff375f] border border-white dark:border-black" />
              </button>
            )}

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-full flex items-center justify-center text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all duration-200"
                aria-label="切换主题"
                suppressHydrationWarning
              >
                {theme === "dark" ? (
                  <Sun className="w-[17px] h-[17px]" />
                ) : (
                  <Moon className="w-[17px] h-[17px]" />
                )}
              </button>
            )}

            <AuthSection />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all duration-200"
              aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
            >
              {mobileOpen ? (
                <X className="w-[17px] h-[17px]" />
              ) : (
                <Menu className="w-[17px] h-[17px]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav with backdrop */}
        {mobileOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 top-[52px] bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
              onClick={() => setMobileOpen(false)}
            />
            <div className="lg:hidden relative z-50 border-t border-[#d2d2d7]/60 dark:border-[#38383a]/60 bg-[#f5f5f7]/98 dark:bg-black/98 backdrop-blur-xl">
              <nav className="max-w-7xl mx-auto px-5 py-5 flex flex-col gap-1 animate-fade-in-up">
                {navLinks.map((link, i) => {
                  const isActive = pathname.startsWith(link.href);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 flex items-center gap-3",
                        isActive
                          ? "bg-[#e8e8ed] dark:bg-[#2c2c2e] text-apple-text dark:text-white"
                          : "text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#f0f0f2] dark:hover:bg-[#1c1c1e]"
                      )}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                      {link.label}
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
                      )}
                    </Link>
                  );
                })}
                <div className="apple-divider my-2" />
                <MobileAuthSection />
              </nav>
            </div>
          </>
        )}
      </header>
    </>
  );
}

/* ── Auth Section (Desktop) ── */
function AuthSection() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
          className="px-4 py-2 rounded-full text-[13px] font-medium bg-gradient-to-r from-[#0071e3] to-[#5ac8fa] text-white hover:shadow-[0_4px_12px_rgba(0,113,227,0.35)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
        >
          免费注册
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden lg:block relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full text-[13px] font-medium text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all duration-200"
      >
        {/* Avatar */}
        <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#0071e3] to-[#bf5af2] flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
          {user.username?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <span className="max-w-[80px] truncate">{user.username}</span>
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform duration-200",
          dropdownOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 p-1.5 rounded-2xl apple-card animate-scale-in origin-top-right">
          <div className="px-3 py-2.5 border-b border-[#d2d2d7]/30 dark:border-[#38383a]/40 mb-1">
            <p className="text-[13px] font-semibold text-apple-text dark:text-white">{user.username}</p>
            <p className="text-[11px] text-apple-text-secondary mt-0.5">{user.email || ""}</p>
          </div>
          {[
            { href: "/dashboard", icon: LayoutDashboard, label: "工作台" },
            { href: "/settings", icon: Settings, label: "账号设置" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#f0f0f2] dark:hover:bg-[#2c2c2e] transition-all duration-150"
            >
              <item.icon className="w-[16px] h-[16px]" />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-[#d2d2d7]/30 dark:border-[#38383a]/40 mt-1 pt-1">
            <button
              onClick={() => { setDropdownOpen(false); logout(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#ff375f] hover:bg-[#ffebee] dark:hover:bg-[#3d1111] transition-all duration-150"
            >
              <LogOut className="w-[16px] h-[16px]" />
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Auth Section (Mobile) ── */
function MobileAuthSection() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col gap-2 pt-1">
        <Link
          href="/login"
          className="px-4 py-3 rounded-xl text-[15px] font-medium text-center text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#f0f0f2] dark:hover:bg-[#1c1c1e] transition-all duration-200"
        >
          登录
        </Link>
        <Link
          href="/register"
          className="px-4 py-3 rounded-xl text-[15px] font-medium text-center bg-gradient-to-r from-[#0071e3] to-[#5ac8fa] text-white transition-all duration-200 active:scale-[0.98]"
        >
          免费注册
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 pt-1">
      <div className="px-4 py-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0071e3] to-[#bf5af2] flex items-center justify-center text-white text-xs font-bold">
          {user.username?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-apple-text dark:text-white">{user.username}</p>
          <p className="text-[11px] text-apple-text-secondary">{user.email || ""}</p>
        </div>
      </div>
      <Link
        href="/settings"
        className="px-4 py-3 rounded-xl text-[15px] font-medium text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#f0f0f2] dark:hover:bg-[#1c1c1e] transition-all duration-200 flex items-center gap-3"
      >
        <Settings className="w-[18px] h-[18px]" />
        账号设置
      </Link>
      <button
        onClick={logout}
        className="px-4 py-3 rounded-xl text-[15px] font-medium text-[#ff375f] hover:bg-[#ffebee] dark:hover:bg-[#3d1111] transition-all duration-200 flex items-center gap-3 text-left"
      >
        <LogOut className="w-[18px] h-[18px]" />
        退出登录
      </button>
    </div>
  );
}
