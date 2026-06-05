"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "outline-dark" | "volt" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-on hover:bg-accent-hover",
  secondary:
    "bg-surface-2 text-ink border border-hairline hover:bg-surface-3 hover:border-hairline-soft",
  outline:
    "bg-transparent border border-hairline text-ink hover:bg-accent-soft hover:border-accent/30",
  "outline-dark":
    "bg-transparent border border-hairline text-ink hover:bg-surface-2",
  volt: "bg-accent text-accent-on hover:bg-accent-hover font-medium",
  ghost: "bg-transparent text-stone hover:text-ink hover:bg-surface-2",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-caption-sm gap-1.5",
  md: "h-10 px-5 text-body-md gap-2 font-medium",
  lg: "h-11 px-6 text-body-md gap-2 font-medium",
};

interface BrandButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

export function BrandButton({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  type = "button",
  disabled,
  onClick,
}: BrandButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-button",
    "transition-[background-color,border-color,color,opacity] duration-brand ease-brand select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)]",
    "disabled:opacity-40 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
