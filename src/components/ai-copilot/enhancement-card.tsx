'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Star, HelpCircle, TrendingUp, BarChart3 } from 'lucide-react';
import type { EnhancementResult } from '@/lib/ai/types';

export function EnhancementCard({ data }: { data: EnhancementResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-3"
    >
      {/* Project Goal */}
      {data.projectGoal && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#0071e3]" />
            <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              项目目标
            </span>
          </div>
          <p className="text-[13px] text-[#86868b]">{data.projectGoal}</p>
        </div>
      )}

      {/* Personal Contribution */}
      {data.personalContribution && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-[#8944ab]" />
            <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              个人贡献
            </span>
          </div>
          <p className="text-[13px] text-[#86868b]">{data.personalContribution}</p>
        </div>
      )}

      {/* Data Metrics */}
      {data.dataMetrics.length > 0 && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-[#34c759]" />
            <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              数据成果
            </span>
          </div>
          <div className="space-y-1.5">
            {data.dataMetrics.map((m, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#34c759] mt-0.5">•</span>
                <span className="text-[13px] text-[#86868b]">{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Highlights */}
      {data.techHighlights.length > 0 && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#ff9500]" />
            <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              技术亮点
            </span>
          </div>
          <div className="space-y-1.5">
            {data.techHighlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#ff9500] mt-0.5">•</span>
                <span className="text-[13px] text-[#86868b]">{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STAR Framework */}
      {data.starFramework && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a] border-l-[3px] border-l-[#0071e3]">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-[#0071e3]" />
            <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              STAR 框架拆解
            </span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-[11px] font-semibold text-[#0071e3] uppercase">S · 情境</span>
              <p className="text-[12px] text-[#86868b] mt-0.5">{data.starFramework.situation}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#8944ab] uppercase">T · 任务</span>
              <p className="text-[12px] text-[#86868b] mt-0.5">{data.starFramework.task}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#34c759] uppercase">A · 行动</span>
              <p className="text-[12px] text-[#86868b] mt-0.5">{data.starFramework.action}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#ff9500] uppercase">R · 结果</span>
              <p className="text-[12px] text-[#86868b] mt-0.5">{data.starFramework.result}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Gems */}
      {data.hiddenGems.length > 0 && (
        <div className="bg-[#0071e3]/5 dark:bg-[#0071e3]/10 rounded-2xl p-4 border border-[#0071e3]/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[16px]">💎</span>
            <span className="text-[13px] font-semibold text-[#0071e3]">
              隐藏亮点
            </span>
          </div>
          <div className="space-y-1.5">
            {data.hiddenGems.map((g, i) => (
              <p key={i} className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7]">
                {g}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Coach Questions */}
      {data.coachQuestions.length > 0 && (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[#e8e8ed] dark:border-[#38383a]">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-[#8944ab]" />
            <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              教练式提问
            </span>
          </div>
          <div className="space-y-2">
            {data.coachQuestions.map((q, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-xl px-3 py-2"
              >
                <span className="text-[#8944ab] font-medium text-[13px]">Q{i + 1}.</span>
                <span className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7]">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
