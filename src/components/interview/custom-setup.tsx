"use client";

import type { InterviewQuickMode, InterviewCategory, JobCategory } from "@/types/interview";
import { getQuestionsByCategory, getQuestionsByJob, filterQuestionsByLanguage } from "@/data/interview-questions";
import type { InterviewLanguage } from "@/data/interview-prep";
import { cn } from "@/lib/utils";
import { useState } from "react";

// ==========================================
// CustomSetup — 自定义选题
// ==========================================

const ALL_CATEGORIES: { value: InterviewCategory; label: string }[] = [
  { value: "自我介绍", label: "自我介绍" },
  { value: "项目追问", label: "项目追问" },
  { value: "行为面试", label: "行为面试" },
  { value: "技术面试", label: "技术面试" },
  { value: "情景问答", label: "情景问答" },
  { value: "案例分析", label: "案例分析" },
  { value: "职业规划", label: "职业规划" },
  { value: "压力面试", label: "压力面试" },
  { value: "团队协作", label: "团队协作" },
  { value: "通用问答", label: "通用问答" },
];

const ALL_JOBS: { value: JobCategory | "通用"; label: string }[] = [
  { value: "通用", label: "通用（不限岗位）" },
  { value: "前端开发", label: "前端开发" },
  { value: "后端开发", label: "后端开发" },
  { value: "算法工程师", label: "算法工程师" },
  { value: "产品经理", label: "产品经理" },
  { value: "运营", label: "运营" },
  { value: "数据分析", label: "数据分析" },
  { value: "UI/UX 设计师", label: "UI/UX 设计师" },
  { value: "项目管理", label: "项目管理" },
];

interface CustomSetupProps {
  onConfirm: (questionIds: string[]) => void;
  onBack: () => void;
  language?: InterviewLanguage;
}

export function CustomSetup({ onConfirm, onBack, language = "zh" }: CustomSetupProps) {
  const [selectedCats, setSelectedCats] = useState<Set<InterviewCategory>>(new Set());
  const [selectedJob, setSelectedJob] = useState<JobCategory | "通用">("通用");
  const [questionCount, setQuestionCount] = useState(5);

  const toggleCat = (cat: InterviewCategory) => {
    const next = new Set(selectedCats);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setSelectedCats(next);
  };

  const handleStart = () => {
    const cats = selectedCats.size > 0 ? Array.from(selectedCats) : undefined;
    let pool = selectedJob === "通用"
      ? getQuestionsByCategory("自我介绍") // fallback
      : getQuestionsByJob(selectedJob as JobCategory);

    if (cats) {
      pool = pool.filter((q) => cats.includes(q.category));
    }

    pool = filterQuestionsByLanguage(pool, language);

    if (pool.length === 0) {
      pool = filterQuestionsByLanguage(getQuestionsByJob("通用" as JobCategory), language);
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, questionCount);
    onConfirm(shuffled.map((q) => q.id));
  };

  const availableCount = (() => {
    const cats = selectedCats.size > 0 ? Array.from(selectedCats) : undefined;
    let pool = selectedJob === "通用"
      ? getQuestionsByCategory("自我介绍")
      : getQuestionsByJob(selectedJob as JobCategory);
    if (cats) pool = pool.filter((q) => cats.includes(q.category));
    pool = filterQuestionsByLanguage(pool, language);
    return pool.length;
  })();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <button
        onClick={onBack}
        className="text-[14px] text-apple-blue hover:underline mb-6 inline-block"
      >
        ← 返回模式选择
      </button>

      <h2 className="text-[28px] font-bold tracking-tight text-apple-text dark:text-white mb-8">
        自定义面试选题
      </h2>

      {/* Job Selection */}
      <div className="apple-card p-6 mb-5">
        <h3 className="text-[16px] font-semibold text-apple-text dark:text-white mb-4">目标岗位</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_JOBS.map((job) => (
            <button
              key={job.value}
              onClick={() => setSelectedJob(job.value)}
              className={cn(
                "text-[13px] px-4 py-2 rounded-xl font-medium transition-all",
                selectedJob === job.value
                  ? "bg-apple-blue text-white"
                  : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]",
              )}
            >
              {job.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="apple-card p-6 mb-5">
        <h3 className="text-[16px] font-semibold text-apple-text dark:text-white mb-4">
          题型选择 <span className="text-[13px] font-normal text-apple-text-secondary">（可多选，不选则包含全部）</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => toggleCat(cat.value)}
              className={cn(
                "text-[13px] px-3.5 py-2 rounded-xl font-medium transition-all",
                selectedCats.has(cat.value)
                  ? "bg-apple-blue text-white"
                  : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Count */}
      <div className="apple-card p-6 mb-6">
        <h3 className="text-[16px] font-semibold text-apple-text dark:text-white mb-4">
          题目数量：{questionCount} 题
        </h3>
        <input
          type="range"
          min={2}
          max={Math.min(availableCount, 12)}
          value={Math.min(questionCount, availableCount)}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          className="w-full accent-apple-blue"
        />
        <p className="text-[12px] text-apple-text-secondary mt-2">
          当前条件下题库共有 {availableCount} 题可用
        </p>
      </div>

      <button
        onClick={handleStart}
        disabled={availableCount === 0}
        className={cn(
          "w-full py-3.5 rounded-xl text-[15px] font-semibold transition-all",
          availableCount > 0
            ? "bg-apple-blue text-white hover:opacity-90"
            : "bg-[#e8e8ed] dark:bg-[#2c2c2e] text-apple-text-secondary cursor-not-allowed",
        )}
      >
        开始面试 🚀 ({Math.min(questionCount, availableCount)} 题)
      </button>
    </div>
  );
}
