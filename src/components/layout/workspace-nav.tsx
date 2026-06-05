'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { Locale } from '@/lib/i18n/translations';

export interface NavItem {
  href: string;
  label: string;
  title?: string;
  icon: LucideIcon;
}

interface WorkspaceNavProps {
  items: NavItem[];
  locale?: Locale;
  className?: string;
}

export function WorkspaceNav({ items, locale = 'zh', className }: WorkspaceNavProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const isEn = locale === 'en';

  const activeHref =
    items.find((item) => pathname.startsWith(item.href))?.href ?? items[0]?.href;

  const targetHref = hoveredHref ?? activeHref;

  const updateIndicator = useCallback((href: string) => {
    const nav = navRef.current;
    const el = itemRefs.current.get(href);
    if (!nav || !el) return;

    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setIndicator({
      left: elRect.left - navRect.left,
      width: elRect.width,
      opacity: 1,
    });
  }, []);

  useEffect(() => {
    updateIndicator(targetHref);
  }, [targetHref, pathname, updateIndicator, items, isEn]);

  useEffect(() => {
    const handleResize = () => updateIndicator(targetHref);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetHref, updateIndicator]);

  return (
    <nav
      ref={navRef}
      className={cn(
        'relative hidden lg:flex items-center justify-center h-full max-w-[640px] xl:max-w-[720px]',
        className
      )}
      onMouseLeave={() => setHoveredHref(null)}
    >
      <div className="flex items-center gap-0.5 xl:gap-1">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const isHovered = hoveredHref === item.href;
          const highlighted = isActive && !hoveredHref;

          return (
            <Link
              key={item.href}
              ref={(el) => {
                if (el) itemRefs.current.set(item.href, el);
              }}
              href={item.href}
              title={item.title ?? item.label}
              onMouseEnter={() => {
                setHoveredHref(item.href);
                updateIndicator(item.href);
              }}
              className={cn(
                'relative z-10 px-2.5 xl:px-3 py-4 font-medium whitespace-nowrap shrink-0',
                'transition-colors duration-200',
                isEn ? 'text-[14px] xl:text-[15px]' : 'text-[15px] xl:text-[16px]',
                highlighted
                  ? 'text-ink'
                  : isHovered
                    ? 'text-ink/85'
                    : 'text-stone hover:text-ink/75'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <motion.span
        className="absolute bottom-1 h-[2px] rounded-full bg-volt pointer-events-none workspace-nav-glow"
        animate={{
          left: indicator.left,
          width: indicator.width,
          opacity: indicator.opacity,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 38 }}
      />
    </nav>
  );
}
