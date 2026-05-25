'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, AlertCircle, TrendingUp, Search, HelpCircle } from 'lucide-react';
import type { MatchResult } from '@/lib/ai/types';

export function MatchCard({ data }: { data: MatchResult }) {
  const scoreColor =
    data.matchScore >= 80
      ? 'from-[#34c759] to-[#30d158]'
      : data.matchScore >= 60
      ? 'from-[#ff9500] to-[#ff9f0a]'
      : 'from-[#ff375f] to-[#ff453a]';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-3"
    >
      {/* Match Score */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-5 border border-[#e8e8ed] dark:border-[#38383a] text-center">
        <span className="text-[13px] text-[#86868b]">岗位匹配度</span>
        <div className="mt-2 flex items-center justify-center">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${scoreColor} flex items-center justify-center`}>
            <span className="text-[28px] font-bold text-white">{data.matchScore}%</span>
          </div>
        </div>
        <p className="mt-3 text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
          竞争力：{data.competitiveness.level}
        </p>
        <p className="text-[12px] text-[#86868b] mt-1">{data.competitiveness.suggestion}</p>
      </div>

      {/* Skill Analysis */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-[#0071e3]" />
          <span className="text-[13px] font-semibold">技能分析</span>
        </div>

        {data.skillAnalysis.matched.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34c759]" />
              <span className="text-[12px] font-medium text-[#34c759]">已匹配</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.skillAnalysis.matched.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded-lg bg-[#34c759]/10 text-[#34c759] text-[11px] font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.skillAnalysis.missing.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#ff375f]" />
              <span className="text-[12px] font-medium text-[#ff375f]">缺失</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.skillAnalysis.missing.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded-lg bg-[#ff375f]/10 text-[#ff375f] text-[11px] font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keyword Match */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-[#8944ab]" />
          <span className="text-[13px] font-semibold">关键词覆盖</span>
          <span className="ml-auto text-[13px] font-bold text-[#8944ab]">
            {data.keywordMatch.coverage}%
          </span>
        </div>
        <div className="h-1.5 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8944ab] to-[#ff375f] transition-all duration-700"
            style={{ width: `${data.keywordMatch.coverage}%` }}
          />
        </div>
        {data.keywordMatch.missing.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.keywordMatch.missing.map((k, i) => (
              <span key={i} className="px-2 py-0.5 rounded-lg bg-[#ff375f]/10 text-[#ff375f] text-[11px]">
                {k}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Strengths and Weaknesses */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#ff9500]" />
          <span className="text-[13px] font-semibold">优劣势分析</span>
        </div>
        {data.competitiveness.strengths.length > 0 && (
          <div className="mb-2">
            <span className="text-[11px] font-semibold text-[#34c759]">优势</span>
            {data.competitiveness.strengths.map((s, i) => (
              <p key={i} className="text-[12px] text-[#86868b]">• {s}</p>
            ))}
          </div>
        )}
        {data.competitiveness.weaknesses.length > 0 && (
          <div>
            <span className="text-[11px] font-semibold text-[#ff375f]">短板</span>
            {data.competitiveness.weaknesses.map((w, i) => (
              <p key={i} className="text-[12px] text-[#86868b]">• {w}</p>
            ))}
          </div>
        )}
      </div>

      {/* Missing Skills with Learning Path */}
      {data.missingSkills.length > 0 && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[16px]">📚</span>
            <span className="text-[13px] font-semibold">建议补充技能</span>
          </div>
          <div className="space-y-2">
            {data.missingSkills.map((ms, i) => (
              <div key={i} className="bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium">{ms.skill}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    ms.importance === 'high' ? 'bg-[#ff375f]/10 text-[#ff375f]' :
                    ms.importance === 'medium' ? 'bg-[#ff9500]/10 text-[#ff9500]' :
                    'bg-[#86868b]/10 text-[#86868b]'
                  }`}>
                    {ms.importance === 'high' ? '高优先' : ms.importance === 'medium' ? '中优先' : '低优先'}
                  </span>
                </div>
                <p className="text-[12px] text-[#86868b] mt-1">{ms.suggestion}</p>
                {ms.learningPath && (
                  <p className="text-[11px] text-[#0071e3] mt-0.5">{ms.learningPath}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HR Top Questions */}
      {data.hrTopQuestions.length > 0 && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-[#ff9500]" />
            <span className="text-[13px] font-semibold">HR 最可能问的 3 个问题</span>
          </div>
          <div className="space-y-2">
            {data.hrTopQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-2 bg-[#fff8f0] dark:bg-[#2c2018] rounded-xl px-3 py-2">
                <span className="text-[#ff9500] font-bold text-[12px]">Q{i + 1}</span>
                <span className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7]">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Additions */}
      {data.suggestedAdditions.length > 0 && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[16px]">💡</span>
            <span className="text-[13px] font-semibold">补充建议</span>
          </div>
          <div className="space-y-1.5">
            {data.suggestedAdditions.map((a, i) => (
              <p key={i} className="text-[12px] text-[#86868b]">• {a}</p>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
