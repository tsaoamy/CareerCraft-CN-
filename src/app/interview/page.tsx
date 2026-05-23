"use client";

import { useState, useCallback } from "react";
import { Play, MessageCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  InterviewSession,
  InterviewQuestion,
  InterviewResult,
  InterviewQuickMode,
  InterviewStatus,
} from "@/types/interview";
import { questionBank, getQuestionsByCategory, getQuestionsByJob } from "@/data/interview-questions";
import { evaluateAnswer, calculateResult } from "@/lib/interview-engine";
import { ModeSelector } from "@/components/interview/mode-selector";
import { CustomSetup } from "@/components/interview/custom-setup";
import { QuestionCard } from "@/components/interview/question-card";
import { ResultReport } from "@/components/interview/result-report";

// ──── 历史记录 ────
const historySessions = [
  {
    role: "腾讯 AI 产品经理",
    type: "完整模拟",
    questions: 10,
    score: 82,
    date: "2026-05-20",
    topics: ["自我介绍", "项目追问", "行为面试", "产品案例"],
  },
  {
    role: "字节跳动运营岗",
    type: "行为面试",
    questions: 5,
    score: 75,
    date: "2026-05-18",
    topics: ["情景问答", "冲突处理", "团队协作"],
  },
];

// ──── 页面 ────

export default function InterviewPage() {
  // 阶段
  const [phase, setPhase] = useState<"landing" | "selecting" | "custom" | "in-progress" | "finished">("landing");
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [result, setResult] = useState<InterviewResult | null>(null);

  // ──── 快捷模式选择 ────
  const handleSelectMode = useCallback((mode: InterviewQuickMode) => {
    startSession(mode.label, mode.jobCategory, mode.questionCount, mode.categories);
  }, []);

  // ──── 自定义模式 ────
  const handleCustomMode = useCallback(() => {
    setPhase("custom");
  }, []);

  // ──── 自定义确认 ────
  const handleCustomConfirm = useCallback((questionIds: string[]) => {
    const selected = questionBank.filter((q) => questionIds.includes(q.id));
    if (selected.length === 0) return;
    const title = customJobTitle.trim() || "自定义面试";
    const newSession: InterviewSession = {
      id: `sess_${Date.now()}`,
      jobTitle: title,
      jobCategory: "通用",
      questions: selected,
      answers: {},
      currentIndex: 0,
      status: "in-progress",
      startedAt: new Date().toISOString(),
    };
    setSession(newSession);
    setPhase("in-progress");
  }, [customJobTitle]);

  // ──── 快速输入开始 ────
  const handleQuickStart = useCallback(() => {
    if (!customJobTitle.trim()) return;
    const pool = getQuestionsByJob("通用");
    const pool2 = getQuestionsByCategory("自我介绍");
    const allQuestions = [...pool, ...pool2].filter(
      (q, i, arr) => arr.findIndex((x) => x.id === q.id) === i,
    );
    const selected = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 8);
    const newSession: InterviewSession = {
      id: `sess_${Date.now()}`,
      jobTitle: customJobTitle.trim(),
      jobCategory: "通用",
      questions: selected,
      answers: {},
      currentIndex: 0,
      status: "in-progress",
      startedAt: new Date().toISOString(),
    };
    setSession(newSession);
    setPhase("in-progress");
  }, [customJobTitle]);

  // ──── 核心：开始面试会话 ────
  const startSession = (title: string, jobCategory: string, count: number, categories?: string[]) => {
    let pool = jobCategory === "通用"
      ? [...questionBank]
      : questionBank.filter((q) => q.jobs.length === 0 || q.jobs.includes(jobCategory as any));

    if (categories && categories.length > 0) {
      pool = pool.filter((q) => categories.includes(q.category));
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    const newSession: InterviewSession = {
      id: `sess_${Date.now()}`,
      jobTitle: title,
      jobCategory: jobCategory as any,
      questions: selected,
      answers: {},
      currentIndex: 0,
      status: "in-progress",
      startedAt: new Date().toISOString(),
    };

    setSession(newSession);
    setPhase("in-progress");
  };

  // ──── 提交答案 ────
  const handleSubmitAnswer = useCallback((content: string) => {
    if (!session) return;
    const q = session.questions[session.currentIndex];
    const ans = evaluateAnswer(q, content);
    const newAnswers = { ...session.answers, [q.id]: ans };
    setSession((prev) => prev ? { ...prev, answers: newAnswers } : null);
  }, [session]);

  // ──── 下一题 / 完成 ────
  const handleNext = useCallback(() => {
    if (!session) return;
    const nextIndex = session.currentIndex + 1;
    if (nextIndex >= session.questions.length) {
      // 完成：计算结果
      const finished = {
        ...session,
        currentIndex: nextIndex,
        status: "finished" as InterviewStatus,
        finishedAt: new Date().toISOString(),
      };
      const res = calculateResult(finished);
      setSession(finished);
      setResult(res);
      setPhase("finished");
    } else {
      setSession((prev) => prev ? { ...prev, currentIndex: nextIndex } : null);
    }
  }, [session]);

  // ──── 重新开始 ────
  const handleRestart = useCallback(() => {
    setPhase("landing");
    setSession(null);
    setResult(null);
    setCustomJobTitle("");
  }, []);

  // ========================
  // RENDER: Landing Page
  // ========================
  if (phase === "landing") {
    return (
      <div className="max-w-7xl mx-auto px-5 py-10 md:py-14 animate-fade-in-up">
        <div className="mb-10">
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-apple-text dark:text-white">
            AI 面试官
          </h1>
          <p className="text-[15px] text-apple-text-secondary mt-1.5">
            基于 JD 和简历的智能模拟面试
          </p>
        </div>

        {/* Session History */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {historySessions.map((s, i) => (
            <div key={i} className="apple-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[17px] font-semibold tracking-tight text-apple-text dark:text-white">
                    {s.role}
                  </h3>
                  <p className="text-[12px] text-apple-text-secondary mt-1">
                    {s.date} &middot; {s.type} &middot; {s.questions} 题
                  </p>
                </div>
                <Badge variant={s.score >= 80 ? "success" : "warning"}>{s.score}分</Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {s.topics.map((t) => (
                  <Badge key={t} variant="accent" className="text-[11px]">{t}</Badge>
                ))}
              </div>
              <Button size="sm" className="gap-1.5" onClick={() => setPhase("selecting")}>
                <Play className="w-3.5 h-3.5" /> 开始新面试
              </Button>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-[18px] h-[18px] text-apple-purple" />
              <CardTitle>开始新面试</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Input
                  placeholder="输入目标岗位（如：腾讯AI产品经理）"
                  className="flex-1"
                  value={customJobTitle}
                  onChange={(e) => setCustomJobTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuickStart()}
                />
                <Button className="gap-2" onClick={handleQuickStart} disabled={!customJobTitle.trim()}>
                  <Play className="w-4 h-4" /> 开始
                </Button>
              </div>
              <p className="text-[12px] text-apple-text-secondary text-center">
                或者{" "}
                <button
                  onClick={() => setPhase("selecting")}
                  className="text-apple-blue hover:underline font-medium"
                >
                  选择面试模式
                </button>
                ，使用完整题库
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            {
              title: "真实场景模拟",
              desc: "AI 根据真实 JD 和你的简历自动生成面试问题，模拟真实面试流程。",
              color: "text-apple-blue",
              bg: "bg-[#e8f4fd] dark:bg-[#003366]",
            },
            {
              title: "即时评分反馈",
              desc: "每题回答后获得即时评分和改进建议，帮助你快速提升面试表现。",
              color: "text-apple-purple",
              bg: "bg-[#f4f1fa] dark:bg-[#2d1445]",
            },
            {
              title: "多轮深度对话",
              desc: "支持追问和深度探讨，涵盖行为面试、技术面试、情景问答等。",
              color: "text-apple-green",
              bg: "bg-[#e8f8ee] dark:bg-[#0a3622]",
            },
          ].map((tip) => (
            <div key={tip.title} className="apple-card p-6">
              <div className={`w-10 h-10 rounded-xl ${tip.bg} flex items-center justify-center mb-4`}>
                <Star className={`w-5 h-5 ${tip.color}`} />
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight text-apple-text dark:text-white mb-2">
                {tip.title}
              </h3>
              <p className="text-[13px] text-apple-text-secondary leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ========================
  // RENDER: Selecting Mode
  // ========================
  if (phase === "selecting") {
    return (
      <div className="max-w-7xl mx-auto px-5 py-10 md:py-14">
        <button
          onClick={() => setPhase("landing")}
          className="text-[14px] text-apple-blue hover:underline mb-6 inline-block"
        >
          ← 返回
        </button>
        <ModeSelector
          selected={null}
          onSelect={handleSelectMode}
          onCustom={handleCustomMode}
        />
      </div>
    );
  }

  // ========================
  // RENDER: Custom Setup
  // ========================
  if (phase === "custom") {
    return (
      <div className="max-w-7xl mx-auto px-5 py-10 md:py-14">
        <CustomSetup
          onConfirm={handleCustomConfirm}
          onBack={() => setPhase("selecting")}
        />
      </div>
    );
  }

  // ========================
  // RENDER: In Progress
  // ========================
  if (phase === "in-progress" && session) {
    const q = session.questions[session.currentIndex];
    if (!q) return null;

    return (
      <div className="max-w-3xl mx-auto px-5 py-10 md:py-14">
        <button
          onClick={() => setPhase("landing")}
          className="text-[14px] text-apple-blue hover:underline mb-6 inline-block"
        >
          ← 退出面试
        </button>
        <QuestionCard
          key={q.id}
          question={q}
          index={session.currentIndex}
          total={session.questions.length}
          answer={session.answers[q.id]}
          onSubmit={handleSubmitAnswer}
          onNext={handleNext}
          isLast={session.currentIndex >= session.questions.length - 1}
        />
      </div>
    );
  }

  // ========================
  // RENDER: Finished
  // ========================
  if (phase === "finished" && session && result) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-10 md:py-14">
        <ResultReport result={result} session={session} onRestart={handleRestart} />
      </div>
    );
  }

  return null;
}
