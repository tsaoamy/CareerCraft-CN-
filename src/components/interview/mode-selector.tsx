"use client";

import { cn } from "@/lib/utils";
import type { InterviewQuickMode } from "@/types/interview";
import { quickModes } from "@/data/interview-questions";

// ==========================================
// ModeSelector — 快捷模式选择器
// ==========================================

interface ModeSelectorProps {
  selected: string | null;
  onSelect: (mode: InterviewQuickMode) => void;
  onCustom: () => void;
}

export function ModeSelector({ selected, onSelect, onCustom }: ModeSelectorProps) {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-[28px] md:text-[34px] font-bold tracking-tight text-apple-text dark:text-white mb-3">
          选择面试模式
        </h2>
        <p className="text-[15px] text-apple-text-secondary">
          不同模式包含不同类型的面试题目，选择最适合你需求的
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode)}
            className={cn(
              "text-left apple-card p-5 transition-all hover:shadow-md",
              "border-2",
              selected === mode.id
                ? "border-apple-blue shadow-md"
                : "border-transparent hover:border-apple-blue/30",
            )}
          >
            <span className="text-[28px] mb-3 block">{mode.icon}</span>
            <h3 className="text-[16px] font-semibold text-apple-text dark:text-white mb-2">
              {mode.label}
            </h3>
            <p className="text-[12px] text-apple-text-secondary mb-3">
              {mode.jobCategory} · {mode.questionCount} 题
            </p>
            <div className="flex flex-wrap gap-1">
              {mode.categories.map((c) => (
                <span
                  key={c}
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full",
                    selected === mode.id
                      ? "bg-apple-blue text-white"
                      : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary",
                  )}
                >
                  {c}
                </span>
              ))}
            </div>
          </button>
        ))}

        {/* Custom mode card */}
        <button
          onClick={onCustom}
          className={cn(
            "text-left apple-card p-5 transition-all hover:shadow-md border-2 border-dashed",
            "border-[#d2d2d7] dark:border-[#38383a] hover:border-apple-blue/50",
            selected === "custom"
              ? "border-apple-blue shadow-md"
              : "border-[#d2d2d7] dark:border-[#38383a]",
          )}
        >
          <span className="text-[28px] mb-3 block">🎨</span>
          <h3 className="text-[16px] font-semibold text-apple-text dark:text-white mb-2">
            自定义选题
          </h3>
          <p className="text-[12px] text-apple-text-secondary">
            自由选择题型和题目数量，量身打造面试练习
          </p>
        </button>
      </div>
    </div>
  );
}
