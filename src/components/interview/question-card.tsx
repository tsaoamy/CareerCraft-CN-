"use client";

import { useState } from "react";
import type { InterviewQuestion, InterviewAnswer } from "@/types/interview";
import { cn } from "@/lib/utils";

// ==========================================
// QuestionCard — 面试问题卡片
// ==========================================

interface QuestionCardProps {
  question: InterviewQuestion;
  index: number;
  total: number;
  answer?: InterviewAnswer;
  onSubmit: (content: string) => void;
  onNext: () => void;
  isLast: boolean;
}

export function QuestionCard({ question, index, total, answer, onSubmit, onNext, isLast }: QuestionCardProps) {
  const [content, setContent] = useState(answer?.content || "");
  const [submitted, setSubmitted] = useState(!!answer);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // 计时器
  useState(() => {
    if (!submitted) {
      setTimerActive(true);
      const interval = setInterval(() => setTimer((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  });

  const handleSubmit = () => {
    if (!content.trim() || submitted) return;
    setSubmitted(true);
    setTimerActive(false);
    onSubmit(content);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="apple-card p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-apple-text-secondary bg-[#f5f5f7] dark:bg-[#2c2c2e] px-3 py-1 rounded-full">
            第 {index + 1}/{total} 题
          </span>
          <span
            className={cn(
              "text-[12px] font-medium px-2.5 py-1 rounded-full",
              question.difficulty <= 2
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : question.difficulty <= 3
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {"⭐".repeat(question.difficulty)}
          </span>
        </div>
        <span className="text-[13px] text-apple-text-secondary tabular-nums">
          ⏱ {formatTime(timer)}
        </span>
      </div>

      {/* Category tag */}
      <span className="inline-block text-[12px] font-medium text-apple-blue bg-apple-blue/10 px-2.5 py-1 rounded-full mb-4">
        {question.category}
      </span>

      {/* Question */}
      <h2 className="text-[19px] md:text-[21px] font-semibold text-apple-text dark:text-white mb-6 leading-relaxed">
        {question.question}
      </h2>

      {/* Focus Points */}
      {question.focusPoints.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
          <p className="text-[12px] font-medium text-apple-text-secondary mb-2">💡 考察要点</p>
          <div className="flex flex-wrap gap-1.5">
            {question.focusPoints.map((fp) => (
              <span
                key={fp}
                className="text-[11px] text-apple-text-secondary bg-white dark:bg-[#1c1c1e] px-2.5 py-1 rounded-full"
              >
                {fp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Answer Area */}
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => !submitted && setContent(e.target.value)}
          disabled={submitted}
          placeholder="开始输入你的回答……（请尽量详细，AI 会基于内容质量和结构评分）"
          rows={6}
          className={cn(
            "w-full px-4 py-4 rounded-2xl text-[15px] leading-relaxed resize-none transition-all",
            "bg-[#f5f5f7] dark:bg-[#2c2c2e]",
            "text-apple-text dark:text-white placeholder:text-apple-text-secondary/50",
            "border-2",
            submitted
              ? "border-green-300 dark:border-green-700 cursor-default"
              : "border-transparent focus:border-apple-blue focus:outline-none",
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] text-apple-text-secondary">
          {content.length > 0 && `${content.length} 字`}
        </div>
        <div className="flex gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[14px] font-semibold transition-all",
                content.trim()
                  ? "bg-apple-blue text-white hover:opacity-90"
                  : "bg-[#e8e8ed] dark:bg-[#2c2c2e] text-apple-text-secondary cursor-not-allowed",
              )}
            >
              提交回答 ✨
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-6 py-2.5 rounded-xl bg-apple-blue text-white text-[14px] font-semibold hover:opacity-90 transition-opacity"
            >
              {isLast ? "查看结果 📊" : "下一题 →"}
            </button>
          )}
        </div>
      </div>

      {/* Feedback (after submit) */}
      {submitted && answer && (
        <div className="mt-6 pt-6 border-t border-[#d2d2d7]/40 dark:border-[#38383a]/40 space-y-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-[20px] font-bold px-4 py-2 rounded-xl",
                answer.score >= 85
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : answer.score >= 70
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
              )}
            >
              {answer.score} 分
            </span>
            <div>
              <p className="text-[14px] font-medium text-apple-text dark:text-white">AI 评分</p>
              <p className="text-[12px] text-apple-text-secondary">
                {answer.score >= 85 ? "非常出色！" : answer.score >= 70 ? "还不错，继续加油！" : "有提升空间，看看建议吧"}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
            <p className="text-[13px] font-medium text-apple-text dark:text-white mb-2">📝 反馈</p>
            <p className="text-[14px] text-apple-text-secondary leading-relaxed">{answer.feedback}</p>
          </div>

          <div className="p-4 rounded-xl bg-apple-blue/5 dark:bg-apple-blue/10 border border-apple-blue/20">
            <p className="text-[13px] font-medium text-apple-blue mb-2">🚀 改进建议</p>
            <p className="text-[14px] text-apple-text-secondary leading-relaxed">{answer.improvement}</p>
          </div>

          {question.referencePoints.length > 0 && (
            <details className="group">
              <summary className="text-[13px] font-medium text-apple-text-secondary cursor-pointer hover:text-apple-text dark:hover:text-white transition-colors">
                📖 参考答案要点
              </summary>
              <ul className="mt-3 space-y-1.5 pl-5">
                {question.referencePoints.map((p, i) => (
                  <li key={i} className="text-[13px] text-apple-text-secondary list-disc">{p}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
