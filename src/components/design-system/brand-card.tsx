"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { springBrand } from "./motion";

type CardVariant = "product" | "editorial" | "campaign" | "glass";

const cardStyles: Record<CardVariant, string> = {
  product:
    "bg-surface-3 border border-hairline rounded-card overflow-hidden shadow-[var(--shadow-card)] hover:border-hairline-soft hover:shadow-[var(--shadow-float)] transition-[box-shadow,border-color] duration-brand",
  editorial: "bg-cloud border border-transparent rounded-none",
  campaign: "bg-ink text-white rounded-none overflow-hidden",
  glass:
    "bg-white/5 backdrop-blur-md border border-white/10 rounded-none",
};

interface BrandCardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  href?: string;
  hover?: boolean;
}

export function BrandCard({
  children,
  className,
  variant = "product",
  href,
  hover = true,
}: BrandCardProps) {
  const base = cn(
    "relative transition-colors duration-400 ease-brand",
    cardStyles[variant],
    hover && "group",
    className
  );

  const inner = (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={base}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }

  return inner;
}

interface ProductCardProps {
  image: ReactNode;
  badge?: string;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  href?: string;
  className?: string;
}

export function ProductCard({
  image,
  badge,
  title,
  subtitle,
  meta,
  href,
  className,
}: ProductCardProps) {
  return (
    <BrandCard variant="product" href={href} className={className}>
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-[var(--surface-2)] border-b border-[var(--border-default)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-2)] via-[var(--surface-3)]/40 to-[var(--surface-3)]" aria-hidden />
        <div className="relative z-[1] h-full w-full">{image}</div>
        {badge && (
          <span className="absolute top-3 left-3 z-[2] landing-tag text-[11px] py-0.5 px-2.5">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5 space-y-1 bg-[var(--surface-3)]">
        <h3 className="text-body-md font-medium text-ink">{title}</h3>
        {subtitle && <p className="text-caption-md text-stone">{subtitle}</p>}
        {meta}
      </div>
    </BrandCard>
  );
}

interface CampaignTileProps {
  children: ReactNode;
  title: string;
  cta?: { label: string; href: string };
  className?: string;
  dark?: boolean;
}

export function CampaignTile({
  children,
  title,
  cta,
  className,
  dark = true,
}: CampaignTileProps) {
  return (
    <div
      className={cn(
        "relative min-h-[420px] md:min-h-[520px] overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0">{children}</div>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t via-transparent to-transparent",
          dark ? "from-black/80 via-black/20" : "from-black/40"
        )}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-14">
        <h2
          className={cn(
            "font-display text-display-campaign uppercase max-w-[14ch]",
            dark ? "text-white" : "text-ink"
          )}
        >
          {title}
        </h2>
        {cta && (
          <Link
            href={cta.href}
            className="mt-6 inline-flex w-fit h-12 px-8 items-center rounded-pill bg-canvas text-ink text-body-md font-medium hover:bg-cloud transition-colors duration-300"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </div>
  );
}
