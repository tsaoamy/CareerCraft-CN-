import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { Reveal } from "@/components/design-system/motion";

interface FeaturePageRootProps {
  children: ReactNode;
  className?: string;
}

/** 功能页根容器 — 深色品牌背景 */
export function FeaturePageRoot({ children, className }: FeaturePageRootProps) {
  return (
    <div className={cn("system-page min-h-screen", className)}>
      {children}
    </div>
  );
}

interface FeaturePageShellProps {
  children: ReactNode;
  className?: string;
  /** 紧接 Hero 时使用，减少顶部 padding */
  tight?: boolean;
}

/** 功能页内容区 — 统一宽度与节奏 */
export function FeaturePageShell({ children, className, tight = true }: FeaturePageShellProps) {
  return (
    <div
      className={cn(
        "system-content brand-editorial-width pb-section-lg",
        tight ? "pt-3 md:pt-4" : "pt-section-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SystemSectionProps {
  children: ReactNode;
  className?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  delay?: number;
}

/** 功能页区块 — 统一 section 节奏 */
export function SystemSection({
  children,
  className,
  label,
  title,
  subtitle,
  delay = 0,
}: SystemSectionProps) {
  return (
    <Reveal delay={delay} className={cn("system-section", className)}>
      {(label || title) && (
        <div className="mb-8 md:mb-10 max-w-2xl">
          {label && (
            <span className="system-badge inline-flex mb-3">{label}</span>
          )}
          {title && (
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-medium text-ink tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-body-md text-stone mt-3 leading-relaxed">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </Reveal>
  );
}

interface PageCTAProps {
  title: string;
  subtitle?: string;
  action: ReactNode;
}

export function PageCTA({ title, subtitle, action }: PageCTAProps) {
  return (
    <SystemSection className="system-cta border-t border-[var(--border-default)] mt-section">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-section-sm">
        <div>
          <h2 className="text-heading-xl text-ink font-medium">{title}</h2>
          {subtitle && <p className="text-body-md text-stone mt-2">{subtitle}</p>}
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    </SystemSection>
  );
}
