"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { springBrand } from "@/components/design-system/motion";

interface SystemCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export function SystemCard({
  children,
  className,
  href,
  hover = true,
  padding = "md",
}: SystemCardProps) {
  const classes = cn("system-card", paddingMap[padding], hover && "system-card-hover", className);

  const inner = (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={springBrand}
      className={classes}
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

interface FilterChipProps {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function FilterChip({ active, children, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "system-chip",
        active && "system-chip-active",
        className
      )}
    >
      {children}
    </button>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  caption?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, caption, icon }: MetricCardProps) {
  return (
    <SystemCard padding="md">
      <div className="flex items-start justify-between mb-3">
        {icon && <div className="text-volt">{icon}</div>}
        {caption && <span className="text-caption-sm text-mute ml-auto">{caption}</span>}
      </div>
      <div className="font-display text-[2.5rem] leading-none text-white tabular-nums">
        {value}
      </div>
      <div className="text-caption-sm text-stone mt-2">{label}</div>
    </SystemCard>
  );
}
