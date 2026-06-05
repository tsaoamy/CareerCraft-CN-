"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BrandButton } from "@/components/design-system/brand-button";
import { easeBrand } from "@/components/design-system/motion";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: easeBrand }}
      className={cn(
        "flex flex-col items-center text-center",
        compact ? "py-12 px-4" : "py-20 px-6",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 24 }}
        className={cn(
          "relative flex items-center justify-center border border-white/[0.08] bg-white/[0.02] mb-6 overflow-hidden",
          compact ? "w-16 h-16" : "w-20 h-20"
        )}
      >
        <motion.div
          className="absolute inset-0 bg-volt/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className={cn("text-volt relative z-10", compact ? "w-7 h-7" : "w-9 h-9")} strokeWidth={1.25} />
        </motion.div>
      </motion.div>
      <h3 className={cn("font-medium text-white tracking-tight mb-2", compact ? "text-heading-md" : "text-heading-lg")}>
        {title}
      </h3>
      {description && (
        <p className="text-body-md text-stone max-w-[400px] leading-relaxed mb-8">
          {description}
        </p>
      )}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {action && action.onClick && (
          <BrandButton variant="volt" size="md" onClick={action.onClick}>
            {action.label}
          </BrandButton>
        )}
        {action && action.href && !action.onClick && (
          <BrandButton href={action.href} variant="volt" size="md">
            {action.label}
          </BrandButton>
        )}
        {secondaryAction}
      </div>
    </motion.div>
  );
}

interface EmptyStateInlineProps {
  message: string;
  hint?: string;
  action?: { label: string; href: string };
}

export function EmptyStateInline({ message, hint, action }: EmptyStateInlineProps) {
  return (
    <div className="system-card p-10 text-center">
      <p className="text-body-md text-white font-medium mb-1">{message}</p>
      {hint && <p className="text-caption-md text-stone mb-6">{hint}</p>}
      {action && (
        <Link
          href={action.href}
          className="text-caption-md text-volt hover:underline underline-offset-4"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
