'use client';

import { cn } from '@/lib/utils';
import type { InterviewPlanAudit } from '@/lib/interview-job-audit';
import { useLocale } from '@/lib/i18n/locale-context';
import { tCategory, tJob } from '@/lib/i18n/interview-labels';
import type { Locale } from '@/lib/i18n/translations';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Info,
  Play,
  ShieldCheck,
  X,
} from 'lucide-react';

interface InterviewStartAuditProps {
  plan: InterviewPlanAudit | null;
  onConfirm: () => void;
  onCancel: () => void;
}

function StatusBadge({ plan }: { plan: InterviewPlanAudit }) {
  const { status } = plan.jobAudit;
  const config = {
    valid: {
      icon: CheckCircle2,
      class: 'text-green-600 bg-[#e8f8ee] dark:bg-[#0a3622]/40 border-green-200 dark:border-green-800',
      label: '审核通过',
    },
    weak: {
      icon: AlertTriangle,
      class: 'text-orange-600 bg-[#fff4e5] dark:bg-[#3d2800]/40 border-orange-200 dark:border-orange-800',
      label: '信息简略',
    },
    invalid: {
      icon: AlertCircle,
      class: 'text-red-600 bg-[#ffebee] dark:bg-[#3d1111]/40 border-red-200 dark:border-red-800',
      label: '无法开始',
    },
    too_short: {
      icon: AlertCircle,
      class: 'text-red-600 bg-[#ffebee] dark:bg-[#3d1111]/40 border-red-200 dark:border-red-800',
      label: '信息不足',
    },
    empty: {
      icon: AlertCircle,
      class: 'text-red-600 bg-[#ffebee] dark:bg-[#3d1111]/40 border-red-200 dark:border-red-800',
      label: '未填写',
    },
  }[status];

  const Icon = config.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border',
        config.class
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

/** 输入框下方实时审核提示 */
export function JobTitleAuditHint({
  plan,
  locale: localeProp,
}: {
  plan: InterviewPlanAudit | null;
  locale?: Locale;
}) {
  const { locale: ctxLocale } = useLocale();
  const locale = localeProp ?? ctxLocale;

  if (!plan || plan.jobAudit.status === 'empty') {
    return (
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-surface-2 text-[12px] text-apple-text-secondary">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-apple-blue" />
        <span>
          {locale === 'zh'
            ? '请输入完整目标岗位（公司 + 方向），系统将审核后匹配 行为 / 情景 / 技术 题库并生成专属面试方案。'
            : 'Enter a full target role (company + function). The system will match Behavioral / Situational / Technical banks and build your plan.'}
        </span>
      </div>
    );
  }

  const isError = plan.jobAudit.status === 'invalid' || plan.jobAudit.status === 'too_short';
  const isWeak = plan.jobAudit.status === 'weak';

  return (
    <div
      className={cn(
        'flex items-start gap-2 px-3 py-2.5 rounded-xl text-[12px] border',
        isError
          ? 'bg-[#ffebee]/60 dark:bg-[#3d1111]/20 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400'
          : isWeak
            ? 'bg-[#fff4e5]/60 dark:bg-[#3d2800]/20 border-orange-200 dark:border-orange-900/40 text-orange-700 dark:text-orange-400'
            : 'bg-[#e8f8ee]/60 dark:bg-[#0a3622]/20 border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-400'
      )}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      ) : isWeak ? (
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
      )}
      <div>
        <p className="font-medium">{plan.jobAudit.message}</p>
        {plan.jobAudit.hint && <p className="mt-0.5 opacity-90">{plan.jobAudit.hint}</p>}
        {plan.jobAudit.status === 'valid' && (
          <p className="mt-0.5 opacity-90">
            {locale === 'zh'
              ? `识别为 ${plan.jobCategory} · 可抽取 ${plan.availableCount} 道相关题`
              : `Detected as ${tJob(plan.jobCategory, locale)} · ${plan.availableCount} questions available`}
          </p>
        )}
      </div>
    </div>
  );
}

/** 确认开始前的方案审核面板 */
export function InterviewStartConfirmPanel({ plan, onConfirm, onCancel }: InterviewStartAuditProps) {
  const { locale } = useLocale();
  if (!plan) return null;

  return (
    <div className="rounded-2xl border border-[#0071e3]/25 bg-[#f8fbff] dark:bg-[#001a33]/30 overflow-hidden animate-fade-in-up">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#0071e3]/15">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e8f4fd] dark:bg-[#003366]/50 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-apple-blue" />
          </div>
          <div>
            <h4 className="text-[15px] font-semibold tracking-tight text-apple-text dark:text-white">
              面试方案审核
            </h4>
            <p className="text-[11px] text-apple-text-secondary">确认后将按以下方案抽取题目并开始评估</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="关闭"
        >
          <X className="w-4 h-4 text-apple-text-secondary" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge plan={plan} />
          {plan.sessionLabel && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-apple-purple/10 text-apple-purple">
              {plan.sessionLabel}
            </span>
          )}
          <span className="text-[13px] font-medium text-apple-text dark:text-white">
            {plan.jobAudit.normalizedTitle}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: '岗位方向', value: plan.jobCategory },
            { label: '面试维度', value: plan.dimensionLabel },
            { label: '题库语言', value: plan.languageLabel },
            {
              label: '计划题量',
              value: `${plan.plannedCount} 题（可用 ${plan.availableCount} 题）`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-[#1c1c1e]/60 border border-[#d2d2d7]/40 dark:border-[#48484a]/40"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-apple-text-secondary mb-0.5">
                {item.label}
              </p>
              <p className="text-[13px] font-medium text-apple-text dark:text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {plan.categoryBreakdown.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-apple-text-secondary mb-2 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" />
              预计题型分布
            </p>
            <div className="flex flex-wrap gap-1.5">
              {plan.categoryBreakdown.map(({ category, count }) => (
                <span
                  key={category}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--accent-soft)] text-volt font-medium"
                >
                  {tCategory(category, locale)} · {count}{' '}
                  {locale === 'zh' ? '题可选' : 'available'}
                </span>
              ))}
            </div>
          </div>
        )}

        {plan.warnings.length > 0 && (
          <div className="p-3.5 rounded-xl bg-[#fff4e5]/80 dark:bg-[#3d2800]/20 border border-orange-200/60 dark:border-orange-900/30">
            <p className="text-[11px] font-semibold text-orange-700 dark:text-orange-400 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              注意事项
            </p>
            <ul className="space-y-1">
              {plan.warnings.map((w, i) => (
                <li key={i} className="text-[12px] text-orange-800/90 dark:text-orange-300/90">
                  · {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-surface-2">
          <p className="text-[11px] font-semibold text-apple-text-secondary mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            AI 评估说明
          </p>
          <ul className="space-y-1.5">
            {plan.evalReminders.map((r, i) => (
              <li key={i} className="text-[12px] text-apple-text-secondary leading-relaxed">
                · {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-[14px] font-medium bg-[#e8e8ed] dark:bg-[#2c2c2e] text-apple-text-secondary hover:opacity-80 transition-opacity"
          >
            返回修改
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!plan.canStart}
            className={cn(
              'flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-opacity',
              plan.canStart
                ? 'bg-volt text-white hover:opacity-90'
                : 'bg-surface-2 text-apple-text-secondary cursor-not-allowed'
            )}
          >
            <Play className="w-4 h-4" />
            确认开始面试
          </button>
        </div>
      </div>
    </div>
  );
}

/** 面试进行中顶栏提示 */
export function InterviewSessionBanner({
  jobTitle,
  dimensionLabel,
  languageLabel,
  questionIndex,
  total,
}: {
  jobTitle: string;
  dimensionLabel: string;
  languageLabel: string;
  questionIndex: number;
  total: number;
}) {
  return (
    <div className="mb-6 p-4 rounded-2xl bg-[#f8fbff] dark:bg-[#001a33]/30 border border-[#0071e3]/20">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">
          模拟面试进行中
        </span>
        <span className="text-[12px] text-apple-text-secondary">
          第 {questionIndex + 1}/{total} 题
        </span>
      </div>
      <p className="text-[14px] font-medium text-apple-text dark:text-white mb-1">{jobTitle}</p>
      <p className="text-[12px] text-apple-text-secondary">
        {dimensionLabel} · {languageLabel} · 请认真作答，AI 将按考察要点与内容质量评分
      </p>
    </div>
  );
}
