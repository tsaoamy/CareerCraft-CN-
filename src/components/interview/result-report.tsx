"use client";

import type { InterviewResult, InterviewSession } from "@/types/interview";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileText,
  Lightbulb,
  ListChecks,
  MessageSquare,
  RotateCcw,
  Target,
  TrendingUp,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { tCategory } from "@/lib/i18n/interview-labels";
import type { InterviewCategory } from "@/types/interview";
import { fillTemplate } from "@/lib/i18n/error-messages";

interface ResultReportProps {
  result: InterviewResult;
  session: InterviewSession;
  onRestart: () => void;
}

function scoreTier(score: number) {
  if (score >= 85) return { color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", bar: "bg-green-500" };
  if (score >= 70) return { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", bar: "bg-yellow-500" };
  if (score >= 50) return { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30", bar: "bg-orange-500" };
  return { color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", bar: "bg-red-500" };
}

function SectionTitle({
  icon: Icon,
  title,
  iconClass,
  iconBg,
}: {
  icon: LucideIcon;
  title: string;
  iconClass?: string;
  iconBg?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
          iconBg ?? "bg-[#f5f5f7] dark:bg-[#2c2c2e]",
        )}
      >
        <Icon className={cn("w-[18px] h-[18px]", iconClass ?? "text-apple-text-secondary")} />
      </div>
      <h3 className="text-[17px] font-semibold tracking-tight text-apple-text dark:text-white">
        {title}
      </h3>
    </div>
  );
}

function scoreHeadline(
  score: number,
  ir: { scoreExcellent: string; scoreGood: string; scoreFair: string; scoreLow: string },
) {
  if (score >= 85) return ir.scoreExcellent;
  if (score >= 70) return ir.scoreGood;
  if (score >= 50) return ir.scoreFair;
  return ir.scoreLow;
}

export function ResultReport({ result, session, onRestart }: ResultReportProps) {
  const { t, locale } = useLocale();
  const ir = t.interviewResult;
  const totalTier = scoreTier(result.totalScore);
  const mins = Math.floor(result.duration / 60);
  const secs = result.duration % 60;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="apple-card p-8 text-center">
        <p className="text-[13px] font-medium tracking-wide text-apple-text-secondary uppercase mb-4">
          {ir.complete}
        </p>
        <div
          className={cn(
            "inline-flex items-center justify-center w-28 h-28 rounded-full mb-5 ring-4 ring-white/60 dark:ring-black/20",
            totalTier.bg,
          )}
        >
          <span className={cn("text-[36px] font-bold tabular-nums tracking-tight", totalTier.color)}>
            {result.totalScore}
          </span>
        </div>
        <h2 className="text-[21px] font-semibold tracking-tight text-apple-text dark:text-white mb-2">
          {scoreHeadline(result.totalScore, ir)}
        </h2>
        <p className="text-[14px] text-apple-text-secondary">
          {result.jobTitle}
          <span className="mx-2 text-[#d2d2d7]">·</span>
          {fillTemplate(ir.questionsTotal, { n: result.totalQuestions })}
          <span className="mx-2 text-[#d2d2d7]">·</span>
          {fillTemplate(ir.durationUsed, { m: mins, s: secs })}
        </p>
      </div>

      <div className="apple-card p-6">
        <SectionTitle
          icon={BarChart3}
          title={ir.categoryScores}
          iconClass="text-apple-blue"
          iconBg="bg-[#e8f4fd] dark:bg-[#003366]/40"
        />
        <div className="space-y-5">
          {Object.entries(result.categoryScores).map(([cat, { score, count }]) => {
            const avg = Math.round(score / count);
            const tier = scoreTier(avg);
            const catLabel = tCategory(cat as InterviewCategory, locale);
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-medium text-apple-text dark:text-white">{catLabel}</span>
                  <span className="text-[13px] tabular-nums text-apple-text-secondary">
                    <span className={cn("font-semibold", tier.color)}>{avg}</span>
                    <span className="mx-1">{ir.pointsUnit}</span>
                    <span className="text-[#d2d2d7]">·</span>
                    <span className="ml-1">{count} {ir.questionUnit}</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#e8e8ed] dark:bg-[#2c2c2e] rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", tier.bar)}
                    style={{ width: `${avg}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="apple-card p-6">
          <SectionTitle
            icon={TrendingUp}
            title={ir.strengths}
            iconClass="text-green-600 dark:text-green-400"
            iconBg="bg-[#e8f8ee] dark:bg-[#0a3622]/40"
          />
          <ul className="space-y-3">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-apple-text-secondary leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="apple-card p-6">
          <SectionTitle
            icon={Target}
            title={ir.weaknesses}
            iconClass="text-orange-600 dark:text-orange-400"
            iconBg="bg-[#fff4e5] dark:bg-[#3d2800]/40"
          />
          <ul className="space-y-3">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-apple-text-secondary leading-relaxed">
                <ChevronRight className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="apple-card p-6">
        <SectionTitle
          icon={FileText}
          title={ir.overallFeedback}
          iconClass="text-apple-purple"
          iconBg="bg-[#f4f1fa] dark:bg-[#2d1445]/40"
        />
        <p className="text-[15px] text-apple-text-secondary leading-[1.75] pl-12 -mt-1">
          {result.overallFeedback}
        </p>
      </div>

      <div className="apple-card p-6">
        <SectionTitle
          icon={ListChecks}
          title={ir.answerReview}
          iconClass="text-apple-blue"
          iconBg="bg-[#e8f4fd] dark:bg-[#003366]/40"
        />
        <div className="space-y-3">
          {session.questions.map((q, i) => {
            const a = session.answers[q.id];
            const tier = a ? scoreTier(a.score) : null;
            return (
              <details
                key={q.id}
                className="group border border-[#d2d2d7]/40 dark:border-[#38383a]/40 rounded-2xl overflow-hidden"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-3 p-4 hover:bg-[#f5f5f7]/60 dark:hover:bg-[#2c2c2e]/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[12px] font-medium text-apple-text-secondary tabular-nums">
                        {fillTemplate(ir.questionN, { n: i + 1 })}
                      </span>
                      <span className="text-[11px] font-medium text-volt bg-[var(--accent-soft)] px-2 py-0.5 rounded-full">
                        {tCategory(q.category, locale)}
                      </span>
                    </div>
                    <p className="text-[14px] font-medium text-apple-text dark:text-white line-clamp-2 leading-snug">
                      {q.question}
                    </p>
                  </div>
                  {a && tier && (
                    <span
                      className={cn(
                        "text-[14px] font-bold tabular-nums px-3 py-1.5 rounded-xl shrink-0",
                        tier.bg,
                        tier.color,
                      )}
                    >
                      {a.score} {ir.pointsUnit}
                    </span>
                  )}
                </summary>
                {a && (
                  <div className="px-4 pb-4 pt-0 border-t border-[#d2d2d7]/40 dark:border-[#38383a]/40 space-y-3">
                    <div className="pt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-apple-text-secondary mb-2">
                        {ir.yourAnswer}
                      </p>
                      <p className="text-[13px] text-apple-text dark:text-white bg-[#f5f5f7] dark:bg-[#2c2c2e] p-3.5 rounded-xl leading-relaxed">
                        {a.content || ir.noAnswer}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
                        <div className="flex items-center gap-1.5 mb-2">
                          <MessageSquare className="w-3.5 h-3.5 text-apple-text-secondary" />
                          <p className="text-[12px] font-semibold text-apple-text dark:text-white">{ir.feedback}</p>
                        </div>
                        <p className="text-[13px] text-apple-text-secondary leading-relaxed">{a.feedback}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[var(--accent-soft)] border border-[var(--chip-selected-border)]">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Lightbulb className="w-3.5 h-3.5 text-volt" />
                          <p className="text-[12px] font-semibold text-volt">{ir.improvement}</p>
                        </div>
                        <p className="text-[13px] text-apple-text-secondary leading-relaxed">{a.improvement}</p>
                      </div>
                    </div>
                  </div>
                )}
              </details>
            );
          })}
        </div>
      </div>

      <div className="text-center pb-10">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-volt text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="w-4 h-4" />
          {ir.restart}
        </button>
      </div>
    </div>
  );
}
