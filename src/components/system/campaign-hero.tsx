"use client";

import { motion } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { easeBrand, Stagger, StaggerItem } from "@/components/design-system/motion";

export type CampaignHeroVariant = "workspace" | "campaign" | "compact";

export interface CampaignHeroProps {
  badge?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  /** @deprecated Use variant="compact" */
  compact?: boolean;
  variant?: CampaignHeroVariant;
  className?: string;
  icon?: LucideIcon;
  visual?: ReactNode;
  scrollHint?: boolean;
}

export function CampaignHero({
  badge,
  title,
  subtitle,
  action,
  footer,
  compact = false,
  variant,
  className,
  icon: Icon,
  visual,
  scrollHint,
}: CampaignHeroProps) {
  const resolvedVariant: CampaignHeroVariant =
    variant ?? (compact ? "compact" : "workspace");

  if (resolvedVariant === "compact") {
    return (
      <div className={cn("feature-page-header-compact", className)}>
        <div className="brand-editorial-width pb-3 md:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              {badge && (
                <div className="system-badge mb-2 inline-flex items-center gap-2">{badge}</div>
              )}
              <h1 className="text-heading-lg text-ink font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="text-caption-md text-stone mt-1">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      </div>
    );
  }

  if (resolvedVariant === "workspace") {
    return (
      <section className={cn("feature-page-header", className)}>
        <div className="brand-editorial-width pb-3 md:pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {Icon && (
                <div className="feature-icon-box w-10 h-10 shrink-0 hidden sm:flex">
                  <Icon className="w-5 h-5" strokeWidth={1.25} />
                </div>
              )}
              <div className="min-w-0">
                {badge && (
                  <div className="system-badge mb-2 inline-flex items-center gap-2">{badge}</div>
                )}
                <h1 className="text-[clamp(1.375rem,2.8vw,1.75rem)] font-semibold tracking-tight text-ink leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-caption-md text-stone mt-1.5 max-w-2xl leading-relaxed line-clamp-2">
                    {subtitle}
                  </p>
                )}
                {footer && <div className="mt-3">{footer}</div>}
              </div>
            </div>
            {(action || visual) && (
              <div className="flex flex-wrap items-center gap-2 shrink-0 lg:pl-4">
                {visual}
                {action}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  const showScrollHint = scrollHint ?? true;

  return (
    <section
      className={cn(
        "campaign-hero campaign-hero-landing relative flex flex-col justify-end overflow-hidden",
        className
      )}
    >
      <div className="campaign-hero-bg" aria-hidden />
      <div className="campaign-hero-noise" aria-hidden />
      <div className="campaign-hero-glow" aria-hidden />

      <div className="brand-editorial-width relative z-10 w-full pb-12 md:pb-16 pt-28 md:pt-32">
        <Stagger className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-end">
          <div className="min-w-0">
            <StaggerItem>
              {badge && (
                <div className="system-badge mb-6 inline-flex items-center gap-2">{badge}</div>
              )}
            </StaggerItem>
            <StaggerItem>
              <h1 className="brand-display text-display-campaign text-ink max-w-[min(100%,20rem)]">
                {title}
              </h1>
            </StaggerItem>
            {subtitle && (
              <StaggerItem>
                <p className="text-body-md text-stone max-w-[480px] mt-6 leading-relaxed">
                  {subtitle}
                </p>
              </StaggerItem>
            )}
            {footer && (
              <StaggerItem>
                <div className="mt-8">{footer}</div>
              </StaggerItem>
            )}
          </div>

          <StaggerItem>
            <div className="flex flex-col items-start lg:items-end gap-6">
              {visual && <div className="w-full max-w-md">{visual}</div>}
              {action && <div className="w-full lg:w-auto">{action}</div>}
              {Icon && !visual && (
                <div className="hidden lg:flex w-32 h-32 items-center justify-center border border-hairline bg-[var(--surface-3)]">
                  <Icon className="w-14 h-14 text-volt" strokeWidth={1} />
                </div>
              )}
            </div>
          </StaggerItem>
        </Stagger>
      </div>

      {showScrollHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-stone z-10"
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-scroll-hint" />
        </motion.div>
      )}
    </section>
  );
}
