'use client';

import React, { useState } from 'react';
import {
  FileText, Target, MessageSquare, Compass,
  ChevronRight, Upload, Sparkles,
} from 'lucide-react';
import { getQuickQuestions } from '@/lib/ai/prompts';
import { useLocale } from '@/lib/i18n/locale-context';
import type { Locale } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Target,
  MessageSquare,
  Compass,
};

const categoryStyle: Record<string, { tab: string; icon: string }> = {
  '简历优化': { tab: 'text-[#0071e3]', icon: 'bg-[#0071e3]/10 text-[#0071e3]' },
  Resume: { tab: 'text-[#0071e3]', icon: 'bg-[#0071e3]/10 text-[#0071e3]' },
  '岗位匹配': { tab: 'text-[#8944ab]', icon: 'bg-[#8944ab]/10 text-[#8944ab]' },
  'Job Match': { tab: 'text-[#8944ab]', icon: 'bg-[#8944ab]/10 text-[#8944ab]' },
  '面试准备': { tab: 'text-[#34c759]', icon: 'bg-[#34c759]/10 text-[#34c759]' },
  Interview: { tab: 'text-[#34c759]', icon: 'bg-[#34c759]/10 text-[#34c759]' },
  '职业规划': { tab: 'text-[#ff9500]', icon: 'bg-[#ff9500]/10 text-[#ff9500]' },
  Career: { tab: 'text-[#ff9500]', icon: 'bg-[#ff9500]/10 text-[#ff9500]' },
};

const VISIBLE_PER_TAB = 3;

export function CopilotQuickActions({
  locale,
  onSelect,
  onUploadResume,
}: {
  locale: Locale;
  onSelect: (question: string) => void;
  onUploadResume: () => void;
}) {
  const { t } = useLocale();
  const c = t.copilot;
  const groups = getQuickQuestions(locale);
  const [activeIdx, setActiveIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const active = groups[activeIdx];
  const ActiveIcon = iconMap[active?.icon] ?? FileText;
  const style = categoryStyle[active?.category ?? ''] ?? { tab: 'text-[#0071e3]', icon: 'bg-[#0071e3]/10' };
  const visibleQuestions = expanded
    ? active?.questions ?? []
    : (active?.questions ?? []).slice(0, VISIBLE_PER_TAB);

  const starQuestion = locale === 'zh'
    ? 'STAR法则是什么，怎么用？'
    : 'What is the STAR method?';
  const matchQuestion = locale === 'zh'
    ? '我的简历和目标岗位匹配度如何？'
    : 'How well does my resume match this role?';

  return (
    <div className="flex flex-col gap-3 pb-1">
      {/* 简介 */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0071e3]/8 to-[#5856d6]/8 dark:from-[#0071e3]/15 dark:to-[#5856d6]/15 px-3.5 py-3 border border-[#0071e3]/10">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0071e3] to-[#5856d6] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <p className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed pt-0.5">
            {c.intro}
          </p>
        </div>
      </div>

      {/* 三大快捷入口 */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onUploadResume}
          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-[#0071e3]/10 dark:hover:bg-[#0071e3]/15 border border-transparent hover:border-[#0071e3]/20 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0071e3]/10 flex items-center justify-center">
            <Upload className="w-4 h-4 text-[#0071e3]" />
          </div>
          <span className="text-[11px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] text-center leading-tight">
            {c.actionUpload}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onSelect(starQuestion)}
          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-[#8944ab]/10 dark:hover:bg-[#8944ab]/15 border border-transparent hover:border-[#8944ab]/20 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-[#8944ab]/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#8944ab]" />
          </div>
          <span className="text-[11px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] text-center leading-tight">
            {c.actionStar}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onSelect(matchQuestion)}
          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-[#34c759]/10 dark:hover:bg-[#34c759]/15 border border-transparent hover:border-[#34c759]/20 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-[#34c759]/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-[#34c759]" />
          </div>
          <span className="text-[11px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] text-center leading-tight">
            {c.actionMatch}
          </span>
        </button>
      </div>

      {/* 分类 Tab */}
      <div>
        <p className="text-[11px] font-medium text-[#86868b] uppercase tracking-wide mb-2 px-0.5">
          {c.quickStart}
        </p>
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none -mx-0.5 px-0.5">
          {groups.map((g, i) => {
            const Icon = iconMap[g.icon] ?? FileText;
            const isActive = i === activeIdx;
            const s = categoryStyle[g.category];
            return (
              <button
                key={g.category}
                type="button"
                onClick={() => { setActiveIdx(i); setExpanded(false); }}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap shrink-0 transition-all',
                  isActive
                    ? `${s?.tab} bg-white dark:bg-[#2c2c2e] shadow-sm ring-1 ring-[#d2d2d7]/60 dark:ring-[#48484a]`
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]'
                )}
              >
                <Icon className="w-3 h-3" />
                {g.category}
              </button>
            );
          })}
        </div>
      </div>

      {/* 问题列表 */}
      <div className="rounded-xl border border-[#e8e8ed] dark:border-[#38383a] overflow-hidden divide-y divide-[#e8e8ed] dark:divide-[#38383a]">
        <div className={cn('flex items-center gap-2 px-3 py-2', style.icon)}>
          <ActiveIcon className="w-3.5 h-3.5" />
          <span className="text-[12px] font-semibold">{active?.category}</span>
        </div>
        {visibleQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors group"
          >
            <span className="flex-1 text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] leading-snug line-clamp-2">
              {q}
            </span>
            <ChevronRight className="w-4 h-4 text-[#c7c7cc] group-hover:text-[#0071e3] shrink-0 transition-colors" />
          </button>
        ))}
        {(active?.questions.length ?? 0) > VISIBLE_PER_TAB && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full px-3 py-2 text-[12px] text-[#0071e3] font-medium hover:bg-[#0071e3]/5 transition-colors"
          >
            {expanded
              ? (locale === 'zh' ? '收起' : 'Show less')
              : `${c.moreInCategory} (${(active?.questions.length ?? 0) - VISIBLE_PER_TAB})`}
          </button>
        )}
      </div>
    </div>
  );
}
