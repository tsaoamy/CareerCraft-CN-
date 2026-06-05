'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, AlertTriangle } from 'lucide-react';
import {
  filterPrepTopics,
  getPrepStats,
  type InterviewDimension,
  type InterviewLanguage,
} from '@/data/interview-prep';
import type { JobCategory } from '@/types/interview';
import { InterviewLangSwitcher } from '@/components/interview/interview-lang-switcher';
import { FeatureEmpty } from '@/components/system/feature-empty';
import { useLocale } from '@/lib/i18n/locale-context';
import { fillTemplate } from '@/lib/i18n/error-messages';

interface InterviewPrepLibraryProps {
  jobTitle?: string;
  jobCategory?: JobCategory;
  dimension: InterviewDimension;
  language: InterviewLanguage;
  onDimensionChange: (d: InterviewDimension) => void;
  onLanguageChange: (l: InterviewLanguage) => void;
}

export function InterviewPrepLibrary({
  jobTitle,
  jobCategory = '通用',
  dimension,
  language,
  onDimensionChange,
  onLanguageChange,
}: InterviewPrepLibraryProps) {
  const { t, locale } = useLocale();
  const ip = t.interviewPrep;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const topics = filterPrepTopics(dimension, language, jobCategory);
  const stats = getPrepStats(dimension, language, jobCategory);

  const dimShort =
    dimension === 'behavioral'
      ? ip.dimBehavioral
      : dimension === 'situational'
        ? ip.dimSituational
        : ip.dimTechnical;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-volt" />
        <h3 className="font-semibold text-[16px] text-ink">{ip.title}</h3>
        {jobTitle && (
          <span className="text-[12px] text-apple-text-secondary">· {jobTitle}</span>
        )}
      </div>

      <InterviewLangSwitcher
        dimension={dimension}
        language={language}
        onDimensionChange={onDimensionChange}
        onLanguageChange={onLanguageChange}
        stats={stats}
        compact
      />

      <p className="text-[13px] text-apple-text-secondary">
        {ip.filterPrefix}
        <span className="font-medium text-apple-text dark:text-white mx-1">
          {language === 'zh' ? ip.langZh : ip.langEn}
        </span>
        ·
        <span className="font-medium text-apple-text dark:text-white mx-1">{dimShort}</span>
        {fillTemplate(ip.filterSuffix, {
          topics: stats.topicCount,
          questions: stats.questionCount,
        })}
      </p>

      <div className="space-y-3">
        {topics.length === 0 ? (
          <FeatureEmpty page="interview" compact title={ip.empty} description={ip.filterPrefix} />
        ) : (
          topics.map((topic) => {
            const open = expandedId === topic.id;
            return (
              <div key={topic.id} className="apple-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(open ? null : topic.id)}
                  className="w-full text-left p-4 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[14px] text-apple-text dark:text-white">
                        {topic.title}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-soft)] text-volt">
                        {topic.language === 'zh' ? ip.langBadgeZh : ip.langBadgeEn}
                      </span>
                    </div>
                    <p className="text-[12px] text-apple-text-secondary mt-1 line-clamp-2">
                      {topic.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {topic.likelyQuestions.slice(0, 3).map((q, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-volt"
                        >
                          {ip.likelyAsk}{q.slice(0, 24)}…
                        </span>
                      ))}
                    </div>
                  </div>
                  {open ? (
                    <ChevronUp className="w-4 h-4 shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0 mt-1" />
                  )}
                </button>

                {open && (
                  <div className="px-4 pb-4 space-y-4 border-t border-[#d2d2d7]/40 dark:border-[#48484a]/40 pt-4 animate-fade-in-up">
                    <div>
                      <div className="text-[11px] font-semibold text-volt uppercase tracking-wider mb-2">
                        {fillTemplate(ip.highProb, { n: topic.likelyQuestions.length })}
                      </div>
                      <ul className="space-y-1.5">
                        {topic.likelyQuestions.map((q, i) => (
                          <li key={i} className="text-[13px] text-apple-text dark:text-white/90 flex gap-2">
                            <span className="text-volt font-bold shrink-0">{i + 1}.</span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-apple-green flex items-center gap-1 mb-2">
                        <Lightbulb className="w-3.5 h-3.5" /> {ip.answerFramework}
                      </div>
                      <ul className="space-y-1">
                        {topic.answerFramework.map((f, i) => (
                          <li key={i} className="text-[12px] text-apple-text-secondary">
                            • {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[#e8f8ee] dark:bg-[#0a3622]/30">
                        <div className="text-[11px] font-semibold text-apple-green mb-1">{ip.tips}</div>
                        <ul className="space-y-0.5">
                          {topic.tips.map((tip, i) => (
                            <li key={i} className="text-[11px] text-apple-text-secondary">
                              • {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 rounded-xl bg-[#ffebee] dark:bg-[#3d1111]/30">
                        <div className="text-[11px] font-semibold text-apple-red flex items-center gap-1 mb-1">
                          <AlertTriangle className="w-3 h-3" /> {ip.commonMistakes}
                        </div>
                        <ul className="space-y-0.5">
                          {topic.commonMistakes.map((m, i) => (
                            <li key={i} className="text-[11px] text-apple-text-secondary">
                              • {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
