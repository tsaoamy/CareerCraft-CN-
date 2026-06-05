'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Moon, Sun, Menu, X, LogOut, ChevronDown,
  Settings, LayoutDashboard, Languages,
  FileText, Briefcase, MessageCircle, Target, ClipboardList,
} from 'lucide-react';
import { useThemeTransition } from '@/lib/theme/use-theme-transition';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useUserProfile } from '@/lib/user-profile-context';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useLocale } from '@/lib/i18n/locale-context';
import { formatDisplayName, type Locale } from '@/lib/i18n/translations';
import { WorkspaceNav } from '@/components/layout/workspace-nav';
import { NotificationBell } from '@/components/layout/notification-bell';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';

function SystemAction({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn('workspace-action-btn', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const { toggleTheme, theme } = useThemeTransition();
  const { t, toggleLocale, locale } = useLocale();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const navLinks = [
    { href: '/dashboard', label: t.nav.dashboard, title: t.navFull.dashboard, icon: LayoutDashboard },
    { href: '/materials', label: t.nav.materials, title: t.navFull.materials, icon: FileText },
    { href: '/talent/matching', label: t.nav.matching, title: t.navFull.matching, icon: Target },
    { href: '/jd-analyzer', label: t.nav.jdAnalyzer, title: t.navFull.jdAnalyzer, icon: Briefcase },
    { href: '/resume-builder', label: t.nav.resume, title: t.navFull.resume, icon: FileText },
    { href: '/interview', label: t.nav.interview, title: t.navFull.interview, icon: MessageCircle },
    { href: '/applications', label: t.nav.applications, title: t.navFull.applications, icon: ClipboardList },
  ];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 12);
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(total > 0 ? (y / total) * 100 : 0);
        if (y > 80) {
          setHidden(y > lastScrollY.current && y > 120);
        } else {
          setHidden(false);
        }
        lastScrollY.current = y;
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <div
        className="fixed top-0 left-0 z-[60] h-px bg-volt/80 transition-[width] duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-2 transition-transform duration-500 ease-brand',
          hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <div
          className={cn(
            'workspace-toolbar-shell max-w-[1280px] mx-auto flex items-center',
            scrolled && 'workspace-toolbar-shell-active'
          )}
        >
          {/* Left — Brand */}
          <div className="flex-1 flex items-center min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group min-w-0 opacity-90 hover:opacity-100 transition-opacity duration-200"
            >
              <BrandLogo size="sm" />
              <span className="hidden xl:block text-[14px] font-medium tracking-tight text-ink/90 truncate">
                {t.brand}
              </span>
            </Link>
          </div>

          {/* Center — Workspace nav */}
          <WorkspaceNav items={navLinks} locale={locale} />

          {/* Right — System actions */}
          <div className="flex-1 flex items-center justify-end gap-0.5">
            {mounted && (
              <SystemAction onClick={toggleLocale} aria-label={t.common.langAria}>
                <Languages className="w-[15px] h-[15px]" />
                <span className="hidden sm:inline text-[11px] font-medium ml-1.5 opacity-70">
                  {t.common.langToggle}
                </span>
              </SystemAction>
            )}

            {mounted && isAuthenticated && (
              <div className="workspace-action-wrap">
                <NotificationBell />
              </div>
            )}

            {mounted && (
              <SystemAction
                onClick={toggleTheme}
                aria-label={t.common.theme}
                suppressHydrationWarning
              >
                {theme === 'dark' ? (
                  <Sun className="w-[15px] h-[15px]" />
                ) : (
                  <Moon className="w-[15px] h-[15px]" />
                )}
              </SystemAction>
            )}

            <AuthSection t={t} locale={locale} />

            <SystemAction
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t.common.menuClose : t.common.menuOpen}
            >
              {mobileOpen ? <X className="w-[15px] h-[15px]" /> : <Menu className="w-[15px] h-[15px]" />}
            </SystemAction>
          </div>
        </div>

        {mobileOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 top-[4.5rem] bg-[var(--overlay-scrim)] backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="lg:hidden relative z-50 mt-2 mx-0 workspace-toolbar-shell workspace-toolbar-shell-active overflow-hidden">
              <nav className="px-3 py-2 flex flex-col">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium transition-colors duration-200 border-l-2',
                        isActive
                          ? 'border-volt text-ink bg-volt/[0.06]'
                          : 'border-transparent text-stone hover:text-ink hover:bg-[var(--accent-soft)]'
                      )}
                    >
                      <Icon className="w-4 h-4 opacity-60" strokeWidth={1.25} />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="h-px bg-hairline-soft my-2" />
                <MobileAuthSection t={t} />
              </nav>
            </div>
          </>
        )}
      </header>

      <div className="h-[4.5rem]" aria-hidden />
    </>
  );
}

type T = ReturnType<typeof useLocale>['t'];

function AuthSection({ t, locale }: { t: T; locale: Locale }) {
  const { user, logout } = useAuth();
  const { profile } = useUserProfile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rawName = profile.displayName || user?.username || '';
  const displayName = formatDisplayName(rawName, locale);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) {
    return (
      <div className="hidden lg:flex items-center gap-3 ml-2">
        <Link
          href="/login"
          className="text-[12px] font-medium text-stone hover:text-ink transition-colors duration-200"
        >
          {t.auth.login}
        </Link>
        <Link
          href="/register"
          className="text-[12px] font-medium text-volt hover:text-volt/80 transition-colors duration-200"
        >
          {t.auth.register}
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden lg:block relative ml-1" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="workspace-action-btn !px-2 gap-2"
      >
        <UserAvatar
          profile={profile}
          displayName={rawName}
          locale={locale}
          className="w-6 h-6"
          textClassName="text-[10px]"
        />
        <span className="max-w-[72px] truncate text-[12px] font-medium text-ink/80">
          {displayName}
        </span>
        <ChevronDown
          className={cn('w-3 h-3 text-mute transition-transform duration-200', dropdownOpen && 'rotate-180')}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 py-1 workspace-dropdown animate-scale-in origin-top-right">
          <div className="px-3 py-2 border-b border-hairline-soft mb-1">
            <p className="text-[12px] font-medium text-ink truncate">{displayName}</p>
            <p className="text-[10px] text-mute mt-0.5 truncate">{user.email || user.phone || ''}</p>
          </div>
          {[
            { href: '/dashboard', icon: LayoutDashboard, label: t.nav.dashboard },
            { href: '/settings', icon: Settings, label: t.auth.settings },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-stone hover:text-ink hover:bg-[var(--accent-soft)] transition-colors"
            >
              <item.icon className="w-3.5 h-3.5" strokeWidth={1.25} />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-hairline-soft mt-1 pt-1">
            <button
              type="button"
              onClick={() => { setDropdownOpen(false); logout(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-sale hover:bg-sale/5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t.auth.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileAuthSection({ t }: { t: T }) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col gap-1 px-3 pb-2">
        <Link href="/login" className="py-2 text-[13px] font-medium text-stone hover:text-ink">
          {t.auth.login}
        </Link>
        <Link href="/register" className="py-2 text-[13px] font-medium text-volt">
          {t.auth.register}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 px-3 pb-2">
      <Link
        href="/settings"
        className="flex items-center gap-3 py-2.5 text-[13px] font-medium text-stone hover:text-ink"
      >
        <Settings className="w-4 h-4" strokeWidth={1.25} />
        {t.auth.settings}
      </Link>
      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-3 py-2.5 text-[13px] font-medium text-sale text-left"
      >
        <LogOut className="w-4 h-4" strokeWidth={1.25} />
        {t.auth.logout}
      </button>
    </div>
  );
}
