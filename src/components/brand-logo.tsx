'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const SIZES = {
  xs: { box: 28, img: 24 },
  sm: { box: 36, img: 30 },
  md: { box: 40, img: 34 },
  lg: { box: 56, img: 48 },
  xl: { box: 72, img: 62 },
} as const;

type BrandLogoSize = keyof typeof SIZES;

interface BrandLogoProps {
  size?: BrandLogoSize;
  href?: string;
  showGlow?: boolean;
  className?: string;
  imageClassName?: string;
}

export function BrandLogo({
  size = 'md',
  href,
  showGlow = false,
  className,
  imageClassName,
}: BrandLogoProps) {
  const { box, img } = SIZES[size];

  const content = (
    <div
      className={cn('relative shrink-0 group/logo', className)}
      style={{ width: box, height: box }}
    >
      {showGlow && (
        <div
          className="absolute inset-0 rounded-[22%] bg-gradient-to-br from-[#0071e3]/40 to-[#8944ab]/40 opacity-60 blur-md group-hover/logo:opacity-90 transition-opacity duration-300"
          aria-hidden
        />
      )}
      <div
        className={cn(
          'relative w-full h-full rounded-[22%] overflow-hidden',
          'bg-[#3a3a3c] shadow-[0_2px_12px_rgba(0,0,0,0.18)]',
          'ring-1 ring-black/10 dark:ring-white/10',
          'group-hover/logo:scale-105 transition-transform duration-300 ease-out'
        )}
      >
        <Image
          src="/images/brand-icon.png"
          alt="CareerVoyage"
          width={img}
          height={img}
          className={cn(
            'w-full h-full object-cover object-center scale-[1.08]',
            imageClassName
          )}
          priority={size === 'md' || size === 'lg'}
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0" aria-label="CareerVoyage Home">
        {content}
      </Link>
    );
  }

  return content;
}

export const BRAND_ICON_PATH = '/images/brand-icon.png';
