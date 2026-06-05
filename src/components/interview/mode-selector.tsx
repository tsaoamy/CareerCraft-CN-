"use client";

import { cn } from "@/lib/utils";
import type { InterviewQuickMode } from "@/types/interview";
import { quickModes } from "@/data/interview-questions";
import { useLocale } from "@/lib/i18n/locale-context";
import { tCategory, tJob, tQuickMode } from "@/lib/i18n/interview-labels";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  Code2,
  Globe,
  LayoutGrid,
  MessageSquare,
  Palette,
  Target,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ModeSelectorProps {
  selected: string | null;
  jobTitle?: string;
  onSelect: (mode: InterviewQuickMode) => void;
  onCustom: () => void;
}

const MODE_ICONS: Record<string, LucideIcon> = {
  full: Target,
  situational: MessageSquare,
  behavior: Briefcase,
  "technical-frontend": Code2,
  "technical-backend": Code2,
  product: LayoutGrid,
  "data-analyst": BarChart3,
  english: Globe,
  pressure: Zap,
  design: Palette,
  custom: Palette,
};

export function ModeSelector({ selected, jobTitle, onSelect, onCustom }: ModeSelectorProps) {
  const { locale, t } = useLocale();
  const ip = t.interviewPage;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-[28px] md:text-[34px] font-bold tracking-tight text-ink mb-3">
          {ip.selectModeTitle}
        </h2>
        <p className="text-[15px] text-stone">{ip.selectModeSubtitle}</p>
      </div>

      {locale === "en" && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-[var(--accent-soft)] border border-[var(--chip-selected-border)] text-[12px] text-volt">
          {ip.enBankActive}
        </div>
      )}

      {jobTitle && (
        <div className="mb-6 p-4 rounded-xl feature-panel-muted border border-[var(--chip-selected-border)]">
          <p className="text-[12px] text-stone mb-1">{ip.currentJob}</p>
          <p className="text-[15px] font-semibold text-ink">{jobTitle}</p>
          <p className="text-[12px] text-stone mt-1">{ip.currentJobHint}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickModes.map((mode) => {
          const Icon = MODE_ICONS[mode.id] ?? Bot;
          const label = tQuickMode(mode.id, mode.label, locale);
          const isSelected = selected === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onSelect(mode)}
              className={cn(
                "interview-mode-card group",
                isSelected && "interview-mode-card-selected"
              )}
            >
              <div className="interview-mode-card-top">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] border border-[var(--chip-selected-border)] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-volt" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-ink leading-tight">{label}</h3>
                </div>
                <span className="interview-mode-card-score">
                  {mode.questionCount} {ip.questionsUnit}
                </span>
              </div>

              <div className="interview-mode-card-middle flex-1">
                <p className="text-[12px] text-stone mb-2.5">
                  {jobTitle ? ip.perJob : tJob(mode.jobCategory, locale)}
                </p>
                <div className="flex flex-wrap gap-1">
                  {mode.categories.slice(0, 4).map((c) => (
                    <span key={c} className="interview-mode-tag">
                      {tCategory(c, locale)}
                    </span>
                  ))}
                  {mode.categories.length > 4 && (
                    <span className="text-[10px] text-stone px-1 self-center">
                      +{mode.categories.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="interview-mode-card-bottom flex items-center justify-between pt-1 border-t border-hairline-soft">
                <span className="text-[11px] text-stone">{ip.auditPlan}</span>
                <ArrowRight className="w-3.5 h-3.5 text-volt opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </button>
          );
        })}

        <button
          onClick={onCustom}
          className={cn(
            "interview-mode-card border-dashed",
            selected === "custom" && "interview-mode-card-selected"
          )}
        >
          <div className="interview-mode-card-top">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-hairline flex items-center justify-center">
                <Palette className="w-5 h-5 text-stone" />
              </div>
              <h3 className="text-[15px] font-semibold text-ink">{ip.customTitle}</h3>
            </div>
          </div>
          <p className="text-[12px] text-stone flex-1">{ip.customDesc}</p>
          <div className="interview-mode-card-bottom flex items-center justify-end pt-1 border-t border-hairline-soft">
            <ArrowRight className="w-3.5 h-3.5 text-volt" />
          </div>
        </button>
      </div>
    </div>
  );
}
