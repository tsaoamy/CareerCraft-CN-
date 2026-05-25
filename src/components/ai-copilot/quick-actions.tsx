'use client';

import React from 'react';
import { FileText, Target, MessageSquare, Compass } from 'lucide-react';
import { QUICK_QUESTIONS } from '@/lib/ai/prompts';

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-3.5 h-3.5" />,
  Target: <Target className="w-3.5 h-3.5" />,
  MessageSquare: <MessageSquare className="w-3.5 h-3.5" />,
  Compass: <Compass className="w-3.5 h-3.5" />,
};

const categoryColors: Record<string, string> = {
  '简历优化': 'text-[#0071e3] bg-[#0071e3]/8',
  '岗位匹配': 'text-[#8944ab] bg-[#8944ab]/8',
  '面试准备': 'text-[#34c759] bg-[#34c759]/8',
  '职业规划': 'text-[#ff9500] bg-[#ff9500]/8',
};

export function CopilotQuickActions({ onSelect }: { onSelect: (question: string) => void }) {
  return (
    <div className="space-y-4 mb-2">
      <p className="text-[13px] text-[#86868b] text-center">
        试试这些问题，快速开始 👇
      </p>
      {QUICK_QUESTIONS.map((group) => (
        <div key={group.category}>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium ${
                categoryColors[group.category] || 'text-[#86868b] bg-[#f5f5f7] dark:bg-[#2c2c2e]'
              }`}
            >
              {iconMap[group.icon]}
              {group.category}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.questions.map((q) => (
              <button
                key={q}
                onClick={() => onSelect(q)}
                className="text-left px-3 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-[#e8e8ed] dark:hover:bg-[#38383a] text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors leading-relaxed"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
