"use client";

import type { InterviewResult, InterviewSession } from "@/types/interview";
import { cn } from "@/lib/utils";

// ==========================================
// ResultReport — 面试结果报告
// ==========================================

interface ResultReportProps {
  result: InterviewResult;
  session: InterviewSession;
  onRestart: () => void;
}

export function ResultReport({ result, session, onRestart }: ResultReportProps) {
  const scoreColor =
    result.totalScore >= 85 ? "text-green-600" : result.totalScore >= 70 ? "text-yellow-600" : "text-red-600";
  const scoreBg =
    result.totalScore >= 85
      ? "bg-green-100 dark:bg-green-900/30"
      : result.totalScore >= 70
        ? "bg-yellow-100 dark:bg-yellow-900/30"
        : "bg-red-100 dark:bg-red-900/30";

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header Score */}
      <div className="apple-card p-8 text-center">
        <p className="text-[14px] text-apple-text-secondary mb-3">面试完成！你的综合得分</p>
        <div
          className={cn(
            "inline-flex items-center justify-center w-28 h-28 rounded-full mb-4",
            scoreBg,
          )}
        >
          <span className={cn("text-[36px] font-bold", scoreColor)}>{result.totalScore}</span>
        </div>
        <h2 className="text-[21px] font-semibold text-apple-text dark:text-white mb-2">
          {result.totalScore >= 85
            ? "表现优异，继续加油！"
            : result.totalScore >= 70
              ? "表现良好，仍有进步空间"
              : "再接再厉，每一次练习都是进步"}
        </h2>
        <p className="text-[14px] text-apple-text-secondary">
          岗位：{result.jobTitle} &middot; 共 {result.totalQuestions} 题 &middot;
          用时 {Math.floor(result.duration / 60)} 分 {result.duration % 60} 秒
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="apple-card p-6">
        <h3 className="text-[17px] font-semibold text-apple-text dark:text-white mb-5">📊 分类得分</h3>
        <div className="space-y-4">
          {Object.entries(result.categoryScores).map(([cat, { score, count }]) => {
            const avg = Math.round(score / count);
            const pct = (avg / 100) * 100;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] text-apple-text dark:text-white">{cat}</span>
                  <span className="text-[13px] font-semibold text-apple-text-secondary">
                    {avg} 分 · {count} 题
                  </span>
                </div>
                <div className="w-full h-2 bg-[#e8e8ed] dark:bg-[#2c2c2e] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      avg >= 85 ? "bg-green-500" : avg >= 70 ? "bg-yellow-500" : "bg-red-500",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="apple-card p-6">
          <h3 className="text-[17px] font-semibold text-green-600 dark:text-green-400 mb-4">💪 你的优势</h3>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] text-apple-text-secondary">
                <span className="text-green-500 mt-1 shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="apple-card p-6">
          <h3 className="text-[17px] font-semibold text-orange-600 dark:text-orange-400 mb-4">🎯 需要提升</h3>
          <ul className="space-y-2">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] text-apple-text-secondary">
                <span className="text-orange-500 mt-1 shrink-0">→</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overall Feedback */}
      <div className="apple-card p-6">
        <h3 className="text-[17px] font-semibold text-apple-text dark:text-white mb-4">📝 综合评价</h3>
        <p className="text-[15px] text-apple-text-secondary leading-relaxed">{result.overallFeedback}</p>
      </div>

      {/* Answer Review */}
      <div className="apple-card p-6">
        <h3 className="text-[17px] font-semibold text-apple-text dark:text-white mb-5">📋 逐题回顾</h3>
        <div className="space-y-4">
          {session.questions.map((q, i) => {
            const a = session.answers[q.id];
            const isHigh = a && a.score >= 80;
            return (
              <details key={q.id} className="group border border-[#d2d2d7]/40 dark:border-[#38383a]/40 rounded-2xl p-4">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] text-apple-text-secondary">第 {i + 1} 题</span>
                      <span className="text-[12px] text-apple-blue bg-apple-blue/10 px-2 py-0.5 rounded-full">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-[14px] font-medium text-apple-text dark:text-white line-clamp-2">
                      {q.question}
                    </p>
                  </div>
                  {a && (
                    <span
                      className={cn(
                        "text-[14px] font-bold px-3 py-1.5 rounded-xl shrink-0",
                        isHigh
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                      )}
                    >
                      {a.score}分
                    </span>
                  )}
                </summary>
                {a && (
                  <div className="mt-4 pt-4 border-t border-[#d2d2d7]/40 dark:border-[#38383a]/40 space-y-3">
                    <div>
                      <p className="text-[12px] font-medium text-apple-text-secondary mb-1">你的回答</p>
                      <p className="text-[13px] text-apple-text dark:text-white bg-[#f5f5f7] dark:bg-[#2c2c2e] p-3 rounded-xl leading-relaxed">
                        {a.content || "未作答"}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
                        <p className="text-[12px] font-medium text-apple-text-secondary mb-1">📝 反馈</p>
                        <p className="text-[13px] text-apple-text-secondary">{a.feedback}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-apple-blue/5 dark:bg-apple-blue/10 border border-apple-blue/20">
                        <p className="text-[12px] font-medium text-apple-blue mb-1">🚀 改进建议</p>
                        <p className="text-[13px] text-apple-text-secondary">{a.improvement}</p>
                      </div>
                    </div>
                  </div>
                )}
              </details>
            );
          })}
        </div>
      </div>

      {/* Restart Button */}
      <div className="text-center pb-10">
        <button
          onClick={onRestart}
          className="px-8 py-3 rounded-xl bg-apple-blue text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
        >
          再来一次 🔄
        </button>
      </div>
    </div>
  );
}
