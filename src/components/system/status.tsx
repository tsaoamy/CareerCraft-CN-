"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { easeBrand } from "@/components/design-system/motion";

export type StatusVariant = "loading" | "success" | "error" | "warning" | "info" | "idle";

const config: Record<
  StatusVariant,
  { icon: typeof Loader2; color: string; glow: string; spin?: boolean }
> = {
  idle: { icon: Info, color: "text-stone", glow: "" },
  loading: { icon: Loader2, color: "text-volt", glow: "shadow-[0_0_40px_rgba(184,230,0,0.15)]", spin: true },
  success: { icon: CheckCircle2, color: "text-volt", glow: "shadow-[0_0_48px_rgba(184,230,0,0.2)]" },
  error: { icon: AlertCircle, color: "text-sale", glow: "shadow-[0_0_40px_rgba(211,0,5,0.15)]" },
  warning: { icon: AlertTriangle, color: "text-volt/80", glow: "shadow-[0_0_40px_rgba(184,230,0,0.1)]" },
  info: { icon: Info, color: "text-stone", glow: "" },
};

interface StatusPanelProps {
  variant: StatusVariant;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function StatusPanel({
  variant,
  title,
  description,
  children,
  className,
}: StatusPanelProps) {
  const { icon: Icon, color, glow, spin } = config[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easeBrand }}
      className={cn("flex flex-col items-center text-center px-6", className)}
    >
      <motion.div
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.1 }}
        className={cn(
          "w-24 h-24 flex items-center justify-center border border-white/10 bg-white/[0.03] mb-8",
          glow
        )}
      >
        <Icon className={cn("w-10 h-10", color, spin && "animate-spin")} strokeWidth={1.25} />
      </motion.div>
      <h2 className="brand-display text-[clamp(2rem,5vw,3rem)] text-white mb-3">{title}</h2>
      {description && (
        <p className="text-body-md text-stone max-w-md leading-relaxed mb-8">{description}</p>
      )}
      {children}
    </motion.div>
  );
}

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
  className?: string;
}

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const { color } = config[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-pill border border-white/10 bg-white/[0.04] text-caption-sm font-medium",
        color,
        className
      )}
    >
      {variant === "loading" && <Loader2 className="w-3 h-3 animate-spin" />}
      {label}
    </span>
  );
}

export function ProcessingOverlay({ label = "Processing Insight…" }: { label?: string }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050505]/80 backdrop-blur-sm">
      <StatusBadge variant="loading" label={label} />
    </div>
  );
}
