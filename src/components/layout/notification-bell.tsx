'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell, FileText, Briefcase, MessageCircle, ClipboardList,
  Sparkles, Megaphone, CheckCheck, Settings, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/lib/notification-context';
import type { NotificationType } from '@/types/notification';
import { useLocale } from '@/lib/i18n/locale-context';
import type { Locale } from '@/lib/i18n/translations';

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  resume: { icon: FileText, color: 'text-apple-green', bg: 'bg-[#e8f8ee] dark:bg-[#0a3622]/40' },
  jd: { icon: Briefcase, color: 'text-volt', bg: 'bg-[var(--accent-soft)]' },
  interview: { icon: MessageCircle, color: 'text-[var(--chip-selected-text)]', bg: 'bg-[var(--chip-selected-bg)]' },
  application: { icon: ClipboardList, color: 'text-apple-orange', bg: 'bg-[#fff5e5] dark:bg-[#3d2900]/40' },
  product: { icon: Megaphone, color: 'text-stone', bg: 'bg-surface-2' },
  system: { icon: Sparkles, color: 'text-volt', bg: 'bg-[var(--accent-soft)]' },
};

function formatTime(iso: string, locale: Locale, t: ReturnType<typeof useLocale>['t']): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t.notifications.justNow;
  if (mins < 60) return t.notifications.minsAgo(mins);
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t.notifications.hoursAgo(hours);
  const days = Math.floor(hours / 24);
  if (days < 7) return t.notifications.daysAgo(days);
  return new Date(iso).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US');
}

export function NotificationBell() {
  const { t, locale } = useLocale();
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismiss } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const labels = t.notifications;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative w-8 h-8 flex items-center justify-center transition-colors duration-200',
          open
            ? 'text-volt'
            : 'text-stone hover:text-white'
        )}
        aria-label={t.common.notifications}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className={cn('w-[17px] h-[17px]', open && 'animate-pulse')} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ff375f] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-[#1c1c1e]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl apple-card shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] animate-scale-in origin-top-right overflow-hidden z-[70]"
          role="menu"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-apple-border/30">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-apple-text dark:text-white">{labels.title}</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#ff375f]/10 text-[#ff375f] font-medium">
                  {unreadCount} {labels.unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="p-1.5 rounded-lg text-stone hover:text-volt hover:bg-[var(--accent-soft)] transition-colors"
                  title={labels.markAll}
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
                title={labels.settings}
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-apple-text-secondary/50" />
                </div>
                <p className="text-[14px] font-medium text-apple-text dark:text-white">{labels.empty}</p>
                <p className="text-[12px] text-apple-text-secondary mt-1.5 leading-relaxed">{labels.emptyHint}</p>
              </div>
            ) : (
              <ul className="py-1">
                {notifications.map((n) => {
                  const cfg = TYPE_CONFIG[n.type];
                  const Icon = cfg.icon;
                  const inner = (
                    <>
                      <div className={cn('w-9 h-9 rounded-xl shrink-0 flex items-center justify-center', cfg.bg)}>
                        <Icon className={cn('w-4 h-4', cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn('text-[13px] font-medium leading-snug', !n.read ? 'text-apple-text dark:text-white' : 'text-apple-text-secondary')}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-volt shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-[12px] text-apple-text-secondary mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-apple-text-secondary/70 mt-1 block">
                          {formatTime(n.createdAt, locale, t)}
                        </span>
                      </div>
                    </>
                  );

                  return (
                    <li key={n.id} className="relative group">
                      {n.href ? (
                        <Link
                          href={n.href}
                          onClick={() => { markAsRead(n.id); setOpen(false); }}
                          className={cn(
                            'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]',
                            !n.read && 'bg-[#0071e3]/[0.03] dark:bg-[#0071e3]/[0.06]'
                          )}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => markAsRead(n.id)}
                          className={cn(
                            'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]',
                            !n.read && 'bg-[#0071e3]/[0.03] dark:bg-[#0071e3]/[0.06]'
                          )}
                        >
                          {inner}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismiss(n.id); }}
                        className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 text-apple-text-secondary hover:text-apple-red hover:bg-[#ffebee] dark:hover:bg-[#3d1111] transition-all"
                        aria-label="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-apple-border/30 bg-[#f5f5f7]/50 dark:bg-[#2c2c2e]/50">
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="text-[12px] text-volt hover:underline"
              >
                {labels.settings} →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
