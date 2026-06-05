'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale-context';
import { tDimension } from '@/lib/i18n/interview-labels';
import { fillTemplate } from '@/lib/i18n/error-messages';
import type { InterviewDimension, InterviewLanguage } from '@/data/interview-prep';

export interface InterviewSwitchStats {
  topicCount: number;
  questionCount: number;
}

interface InterviewLangSwitcherProps {
  dimension: InterviewDimension;
  language: InterviewLanguage;
  onDimensionChange: (d: InterviewDimension) => void;
  onLanguageChange: (l: InterviewLanguage) => void;
  stats?: InterviewSwitchStats;
  compact?: boolean;
}

const LANG_LABELS: Record<InterviewLanguage, Record<'zh' | 'en', string>> = {
  zh: { zh: '中文题库', en: 'Chinese Bank' },
  en: { zh: 'English 题库', en: 'English Bank' },
};

export function InterviewLangSwitcher({
  dimension,
  language,
  onDimensionChange,
  onLanguageChange,
  stats,
  compact = false,
}: InterviewLangSwitcherProps) {
  const { locale, setLocale, t } = useLocale();
  const [toast, setToast] = useState<string | null>(null);
  const skipToastRef = useRef(true);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    if (skipToastRef.current) {
      skipToastRef.current = false;
      return;
    }
    if (!stats) return;
    const dimLabel = tDimension(dimension, locale);
    const langLabel = LANG_LABELS[language][locale];
    showToast(
      fillTemplate(t.interviewPrep.switchToast, {
        lang: langLabel,
        dim: dimLabel,
        topics: stats.topicCount,
        questions: stats.questionCount,
      })
    );
  }, [language, dimension, stats?.topicCount, stats?.questionCount, locale]);

  const handleLang = (lang: InterviewLanguage) => {
    if (lang === language) return;
    setLocale(lang);
    onLanguageChange(lang);
  };

  const handleDim = (dim: InterviewDimension) => {
    if (dim === dimension) return;
    onDimensionChange(dim);
  };

  const dimEntries: [InterviewDimension, string][] = (
    ['behavioral', 'situational', 'technical'] as InterviewDimension[]
  ).map((d) => [d, tDimension(d, locale)]);

  return (
    <div className="space-y-3">
      {/* 当前状态条 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-soft)] text-volt text-[11px] font-semibold">
          <Globe className="w-3 h-3" />
          {LANG_LABELS[language][locale]}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-2 text-[11px] font-medium text-apple-text dark:text-white">
          {tDimension(dimension, locale)}
        </span>
        {stats && (
          <span className="text-[11px] text-apple-text-secondary">
            {stats.topicCount} {t.interviewPrep.topicsUnit} · {stats.questionCount}{' '}
            {t.interviewPrep.questionsUnit}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {dimEntries.map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => handleDim(k)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
              dimension === k
                ? 'bg-volt text-white shadow-sm ring-2 ring-volt/30'
                : 'bg-surface-2 text-apple-text-secondary hover:text-apple-text'
            }`}
          >
            {dimension === k && <Check className="w-3 h-3 inline mr-1 -mt-0.5" />}
            {v}
          </button>
        ))}
        <span className="w-px h-6 bg-[#d2d2d7] self-center" />
        {(['zh', 'en'] as InterviewLanguage[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => handleLang(lang)}
            aria-pressed={language === lang}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
              language === lang
                ? 'bg-volt text-white shadow-sm ring-2 ring-volt/30'
                : 'bg-surface-2 text-apple-text-secondary hover:text-apple-text'
            }`}
          >
            {language === lang && <Check className="w-3 h-3 inline mr-1 -mt-0.5" />}
            {lang === 'zh' ? t.interviewPrep.langZh : t.interviewPrep.langEn}
          </button>
        ))}
      </div>

      {/* 切换成功提示 */}
      {toast && !compact && (
        <div
          role="status"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#e8f4fd] dark:bg-[#003366]/40 border border-[#0071e3]/20 text-[12px] text-apple-blue animate-fade-in"
        >
          <Check className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
