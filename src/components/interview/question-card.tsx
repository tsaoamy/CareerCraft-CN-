"use client";

import { useEffect, useState } from "react";
import type { InterviewQuestion, InterviewAnswer, AnswerSubmitPayload } from "@/types/interview";
import { getQuestionFormat } from "@/data/interview-questions";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";
import { tCategory, tFormat } from "@/lib/i18n/interview-labels";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Code2,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Square,
  Target,
  XCircle,
} from "lucide-react";

interface QuestionCardProps {
  question: InterviewQuestion;
  index: number;
  total: number;
  answer?: InterviewAnswer;
  onSubmit: (payload: AnswerSubmitPayload) => void;
  onNext: () => void;
  isLast: boolean;
}

export function QuestionCard({
  question,
  index,
  total,
  answer,
  onSubmit,
  onNext,
  isLast,
}: QuestionCardProps) {
  const { locale } = useLocale();
  const format = getQuestionFormat(question);
  const [content, setContent] = useState(answer?.content || question.codeConfig?.starterCode || "");
  const [selected, setSelected] = useState<string[]>(answer?.selectedOptionIds ?? []);
  const [submitted, setSubmitted] = useState(!!answer);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const toggleOption = (id: string) => {
    if (submitted) return;
    if (format === "single_choice") {
      setSelected([id]);
    } else if (format === "multi_choice") {
      setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }
  };

  const canSubmit =
    format === "single_choice" || format === "multi_choice"
      ? selected.length > 0
      : content.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || submitted) return;
    setSubmitted(true);
    onSubmit({
      content: format === "single_choice" || format === "multi_choice" ? selected.join(",") : content,
      selectedOptionIds: format === "single_choice" || format === "multi_choice" ? selected : undefined,
    });
  };

  return (
    <div className="apple-card p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-medium text-apple-text-secondary bg-[#f5f5f7] dark:bg-[#2c2c2e] px-3 py-1 rounded-full">
            第 {index + 1}/{total} 题
          </span>
          <span className="text-[12px] font-medium text-apple-purple bg-apple-purple/10 px-2.5 py-1 rounded-full">
            {tFormat(format, locale)}
          </span>
          <span className="text-[12px] font-medium text-apple-blue bg-apple-blue/10 px-2.5 py-1 rounded-full">
            {tCategory(question.category, locale)}
          </span>
        </div>
        <span className="text-[13px] text-apple-text-secondary tabular-nums">{formatTime(timer)}</span>
      </div>

      <h2 className="text-[19px] md:text-[21px] font-semibold text-apple-text dark:text-white mb-6 leading-relaxed">
        {question.question}
      </h2>

      {format === "multi_choice" && !submitted && (
        <p className="text-[12px] text-apple-text-secondary mb-4 -mt-2">本题为多选题，请选择所有正确选项</p>
      )}

      {question.focusPoints.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Target className="w-3.5 h-3.5 text-apple-text-secondary" />
            <p className="text-[12px] font-semibold text-apple-text-secondary tracking-wide">考察要点</p>
          </div>
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

      {/* 选择题 */}
      {(format === "single_choice" || format === "multi_choice") && question.options && (
        <div className="space-y-2 mb-4">
          {question.options.map((opt) => {
            const isSelected = selected.includes(opt.id);
            const Icon = format === "multi_choice" ? Square : Circle;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={submitted}
                onClick={() => toggleOption(opt.id)}
                className={cn(
                  "w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all",
                  isSelected
                    ? "border-apple-blue bg-apple-blue/5"
                    : "border-transparent bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:border-[#d2d2d7]",
                  submitted && "cursor-default"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 mt-0.5 shrink-0",
                    isSelected ? "text-apple-blue fill-apple-blue/20" : "text-apple-text-secondary"
                  )}
                />
                <span className="text-[14px] text-apple-text dark:text-white leading-relaxed">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 代码题 */}
      {format === "code" && (
        <div className="mb-4">
          {question.codeConfig?.hint && !submitted && (
            <p className="text-[12px] text-apple-text-secondary mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              {question.codeConfig.hint}
            </p>
          )}
          <textarea
            value={content}
            onChange={(e) => !submitted && setContent(e.target.value)}
            disabled={submitted}
            spellCheck={false}
            rows={14}
            className={cn(
              "w-full px-4 py-4 rounded-2xl text-[13px] font-mono leading-relaxed resize-none",
              "bg-[#1e1e1e] text-[#d4d4d4] border-2",
              submitted ? "border-green-700/50 cursor-default" : "border-transparent focus:border-apple-blue focus:outline-none"
            )}
          />
          <p className="text-[11px] text-apple-text-secondary mt-1.5">
            提交后将自动运行 {question.codeConfig?.testCases.length ?? 0} 个测试用例
          </p>
        </div>
      )}

      {/* 简答题 */}
      {format === "essay" && (
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => !submitted && setContent(e.target.value)}
            disabled={submitted}
            placeholder="请详细作答（建议 60 字以上，行为/情景题使用 STAR 结构）"
            rows={6}
            className={cn(
              "w-full px-4 py-4 rounded-2xl text-[15px] leading-relaxed resize-none transition-all",
              "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text dark:text-white placeholder:text-apple-text-secondary/50 border-2",
              submitted ? "border-green-300 dark:border-green-700 cursor-default" : "border-transparent focus:border-apple-blue focus:outline-none"
            )}
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] text-apple-text-secondary">
          {format === "essay" || format === "code"
            ? content.length > 0 && `${content.length} 字`
            : selected.length > 0 && `已选 ${selected.length} 项`}
        </div>
        <div className="flex gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                "inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-[14px] font-semibold transition-all",
                canSubmit ? "bg-apple-blue text-white hover:opacity-90" : "bg-[#e8e8ed] dark:bg-[#2c2c2e] text-apple-text-secondary cursor-not-allowed"
              )}
            >
              <Sparkles className="w-4 h-4" />
              {format === "code" ? "运行测试并提交" : "提交回答"}
            </button>
          ) : (
            <button
              onClick={onNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-apple-blue text-white text-[14px] font-semibold hover:opacity-90"
            >
              {isLast ? "查看结果" : "下一题"}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {submitted && answer && (
        <div className="mt-6 pt-6 border-t border-[#d2d2d7]/40 dark:border-[#38383a]/40 space-y-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-[20px] font-bold px-4 py-2 rounded-xl tabular-nums",
                answer.score >= 85
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : answer.score >= 70
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : answer.score >= 50
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              {answer.score} 分
            </span>
            <div>
              <p className="text-[14px] font-medium text-apple-text dark:text-white">
                {answer.isCorrect !== undefined
                  ? answer.isCorrect
                    ? "回答正确"
                    : "回答有误"
                  : "AI 评分"}
              </p>
              <p className="text-[12px] text-apple-text-secondary">{answer.feedback}</p>
            </div>
          </div>

          {answer.codeTestResults && answer.codeTestResults.length > 0 && (
            <div className="rounded-xl border border-[#d2d2d7]/40 dark:border-[#48484a]/40 overflow-hidden">
              <div className="px-4 py-2.5 bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[12px] font-semibold text-apple-text-secondary">
                测试用例结果
              </div>
              <div className="divide-y divide-[#d2d2d7]/30 dark:divide-[#48484a]/30">
                {answer.codeTestResults.map((tc, i) => (
                  <div key={i} className="px-4 py-3 flex items-start gap-3 text-[12px]">
                    {tc.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-apple-text dark:text-white">{tc.description}</p>
                      {!tc.passed && (
                        <p className="text-apple-text-secondary mt-0.5 font-mono">
                          期望 {tc.expected} · 实际 {tc.actual}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-apple-blue/5 dark:bg-apple-blue/10 border border-apple-blue/20">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-apple-blue" />
              <p className="text-[13px] font-semibold text-apple-blue">改进建议</p>
            </div>
            <p className="text-[14px] text-apple-text-secondary leading-relaxed">{answer.improvement}</p>
          </div>

          {(answer.explanation || question.sampleAnswer) && (
            <div className="p-4 rounded-xl bg-[#e8f8ee]/60 dark:bg-[#0a3622]/20 border border-green-200/50 dark:border-green-900/30">
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <p className="text-[13px] font-semibold text-green-700 dark:text-green-400">正确答案与讲解</p>
              </div>
              {answer.explanation && (
                <p className="text-[14px] text-apple-text-secondary leading-relaxed mb-3">{answer.explanation}</p>
              )}
              {question.sampleAnswer && format === "essay" && (
                <details className="group">
                  <summary className="text-[12px] font-medium text-green-700 dark:text-green-400 cursor-pointer list-none flex items-center gap-1">
                    查看参考范文
                    <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-2 text-[13px] text-apple-text-secondary leading-relaxed pl-1 border-l-2 border-green-300/50">
                    {question.sampleAnswer}
                  </p>
                </details>
              )}
              {format !== "essay" && question.correctOptionIds && question.options && (
                <p className="text-[13px] text-apple-text-secondary">
                  正确答案：
                  {question.correctOptionIds
                    .map((id) => question.options!.find((o) => o.id === id)?.label)
                    .join("；")}
                </p>
              )}
            </div>
          )}

          {format === "essay" && question.referencePoints.length > 0 && (
            <details className="group">
              <summary className="flex items-center gap-1.5 text-[13px] font-medium text-apple-text-secondary cursor-pointer list-none">
                <MessageSquare className="w-3.5 h-3.5" />
                参考答案要点
                <ChevronRight className="w-3.5 h-3.5 ml-auto group-open:rotate-90 transition-transform" />
              </summary>
              <ul className="mt-3 space-y-1.5 pl-5">
                {question.referencePoints.map((p, i) => (
                  <li key={i} className="text-[13px] text-apple-text-secondary list-disc">
                    {p}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
