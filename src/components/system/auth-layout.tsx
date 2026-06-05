"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem, easeBrand } from "@/components/design-system/motion";
import { BrandLogo } from "@/components/brand-logo";

interface AuthCampaignLayoutProps {
  children: ReactNode;
  headline: string;
  headlineAccent?: string;
  slogan: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function AuthCampaignLayout({
  children,
  headline,
  headlineAccent,
  slogan,
  backHref = "/",
  backLabel = "返回首页",
  className,
}: AuthCampaignLayoutProps) {
  return (
    <div className={cn("auth-campaign min-h-[calc(100vh-56px)] grid lg:grid-cols-2", className)}>
      {/* Left — brand narrative */}
      <div className="auth-campaign-brand relative hidden lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden">
        <div className="auth-campaign-brand-bg" aria-hidden />
        <div className="auth-campaign-noise" aria-hidden />

        <Link
          href={backHref}
          className="relative z-10 inline-flex items-center gap-2 text-caption-md text-stone hover:text-volt transition-colors duration-300 group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          {backLabel}
        </Link>

        <Stagger className="relative z-10 flex-1 flex flex-col justify-center py-16">
          <StaggerItem>
            <BrandLogo size="md" className="mb-10" />
          </StaggerItem>
          <StaggerItem>
            <h1 className="brand-display text-[clamp(3rem,6vw,5.5rem)] text-ink leading-[0.92] max-w-[12ch]">
              {headline}
              {headlineAccent && (
                <>
                  <br />
                  <span className="text-volt">{headlineAccent}</span>
                </>
              )}
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-body-md text-stone max-w-[400px] mt-8 leading-relaxed">
              {slogan}
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-12 flex gap-8">
              {["Future", "Motion", "Precision"].map((word) => (
                <span
                  key={word}
                  className="text-caption-sm uppercase tracking-[0.2em] text-mute"
                >
                  {word}
                </span>
              ))}
            </div>
          </StaggerItem>
        </Stagger>

        <p className="relative z-10 text-caption-sm text-mute">
          © 2026 职航 CareerCraft · AI 求职匹配智能体
        </p>
      </div>

      {/* Right — auth form */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, ease: easeBrand }}
        className="relative flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16 xl:px-20"
      >
        <Link
          href={backHref}
          className="lg:hidden inline-flex items-center gap-2 text-caption-md text-stone hover:text-volt mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
        <div className="w-full max-w-[420px] mx-auto lg:mx-0 lg:max-w-none">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

interface AuthPanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthPanel({ title, subtitle, children, footer }: AuthPanelProps) {
  return (
    <div className="auth-panel">
      <div className="mb-8">
        <h2 className="text-[clamp(1.75rem,4vw,2.25rem)] font-medium text-ink tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-body-md text-stone mt-2">{subtitle}</p>
        )}
      </div>
      {children}
      {footer && <div className="mt-8 pt-6 border-t border-white/[0.06]">{footer}</div>}
    </div>
  );
}

interface AuthTabsProps<T extends string> {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}

export function AuthTabs<T extends string>({ tabs, active, onChange }: AuthTabsProps<T>) {
  return (
    <div className="flex gap-1 mb-8 p-1 rounded-pill bg-white/[0.04] border border-white/[0.06]">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            "flex-1 py-2.5 rounded-pill text-caption-md font-medium transition-all duration-300",
            active === key
              ? "bg-volt text-ink"
              : "text-stone hover:text-white"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function AuthErrorBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 mb-6 rounded-pill-md border border-sale/30 bg-sale/10 text-caption-md text-sale"
    >
      {message}
    </motion.div>
  );
}
