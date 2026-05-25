'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Eye, Lightbulb } from 'lucide-react';
import type { ReviewResult } from '@/lib/ai/types';

export function ReviewCard({ data }: { data: ReviewResult }) {
  const scoreColor =
    data.overallScore >= 80
      ? 'text-[#34c759]'
      : data.overallScore >= 60
      ? 'text-[#ff9500]'
      : 'text-[#ff375f]';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-3"
    >
      {/* Score */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
            📊 综合评分
          </span>
          <span className={`text-[28px] font-bold ${scoreColor}`}>
            {data.overallScore}
          </span>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <p className="text-[13px] text-[#86868b]">{data.summary}</p>
        </div>
      )}

      {/* Highlights */}
      {data.highlights.length > 0 && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#34c759]" />
            <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              亮点分析
            </span>
          </div>
          <div className="space-y-2">
            {data.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-[#34c759] mt-0.5 shrink-0">•</span>
                <div>
                  <p className="text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {h.title}
                  </p>
                  <p className="text-[12px] text-[#86868b] mt-0.5">{h.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {data.risks.length > 0 && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#ff9500]" />
            <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              风险分析
            </span>
          </div>
          <div className="space-y-2">
            {data.risks.map((r, i) => (
              <div key={i} className="flex gap-2">
                <span
                  className={`mt-0.5 shrink-0 ${
                    r.severity === 'high'
                      ? 'text-[#ff375f]'
                      : r.severity === 'medium'
                      ? 'text-[#ff9500]'
                      : 'text-[#86868b]'
                  }`}
                >
                  {r.severity === 'high' ? '🔴' : r.severity === 'medium' ? '🟡' : '⚪'}
                </span>
                <div>
                  <p className="text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {r.title}
                  </p>
                  <p className="text-[12px] text-[#86868b] mt-0.5">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HR Readability */}
      {data.hrReadability && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-[#0071e3]" />
            <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              HR 阅读体验
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-[12px] text-[#86868b]">
              <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">第一印象：</span>
              {data.hrReadability.firstImpression}
            </p>
            <p className="text-[12px] text-[#86868b]">
              <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">快速浏览：</span>
              {data.hrReadability.scanTime}
            </p>
            <p className="text-[12px] text-[#86868b]">
              <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">排版建议：</span>
              {data.hrReadability.layoutFeedback}
            </p>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {data.suggestions.length > 0 && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-[#8944ab]" />
            <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              修改建议
            </span>
          </div>
          <div className="space-y-3">
            {data.suggestions.map((s, i) => (
              <div key={i} className="border-b border-[#f0f0f2] dark:border-[#2c2c2e] last:border-0 pb-2 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] font-medium">
                    {s.category}
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      s.priority === 'high'
                        ? 'text-[#ff375f]'
                        : s.priority === 'medium'
                        ? 'text-[#ff9500]'
                        : 'text-[#86868b]'
                    }`}
                  >
                    {s.priority === 'high' ? '高优先' : s.priority === 'medium' ? '中优先' : '低优先'}
                  </span>
                </div>
                {s.original && (
                  <p className="text-[12px] text-[#ff375f]/60 line-through mb-1">{s.original}</p>
                )}
                <p className="text-[12px] text-[#1d1d1f] dark:text-[#f5f5f7]">{s.suggestion}</p>
                <p className="text-[11px] text-[#86868b] mt-0.5">{s.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
