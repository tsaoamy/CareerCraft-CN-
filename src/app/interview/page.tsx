"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Play, MessageCircle, Star, Send, Bot, User, Wand2, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPageHero } from "@/components/ui/glass-page-hero";
import { FeaturePageRoot, FeaturePageShell } from "@/components/layout/feature-page-shell";
import { Input } from "@/components/ui/input";
import type {
  InterviewSession,
  InterviewQuestion,
  InterviewResult,
  InterviewQuickMode,
  InterviewStatus,
} from "@/types/interview";
import { questionBank, filterQuestionsByLanguage, getQuestionBankStats, pickMixedQuestions } from "@/data/interview-questions";
import { evaluateAnswer, calculateResult } from "@/lib/interview-engine";
import {
  buildInterviewPlan,
  buildHistoryInterviewPlan,
  buildAiChatWelcome,
  detectJobCategory,
  type InterviewPlanAudit,
} from "@/lib/interview-job-audit";
import {
  JobTitleAuditHint,
  InterviewStartConfirmPanel,
  InterviewSessionBanner,
} from "@/components/interview/interview-start-audit";
import { ModeSelector } from "@/components/interview/mode-selector";
import { CustomSetup } from "@/components/interview/custom-setup";
import { QuestionCard } from "@/components/interview/question-card";
import { ResultReport } from "@/components/interview/result-report";
import { InterviewPrepLibrary } from "@/components/interview/prep-library";
import { InterviewLangSwitcher } from "@/components/interview/interview-lang-switcher";
import {
  dimensionToCategories,
  getPrepStats,
  type InterviewDimension,
  type InterviewLanguage,
} from "@/data/interview-prep";
import type { InterviewCategory, AnswerSubmitPayload, JobCategory } from "@/types/interview";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";
import { useSystemFeedback } from "@/lib/feedback/use-system-feedback";
import { tDimension } from "@/lib/i18n/interview-labels";

// ──── 历史记录（点击后按岗位 + 模式直接审核，不再跳转通用模式选择） ────
const FULL_SIM_CATEGORIES: InterviewCategory[] = [
  "自我介绍",
  "项目追问",
  "行为面试",
  "情景问答",
  "案例分析",
  "AI 应用",
  "职业规划",
  "通用问答",
  "团队协作",
];

interface HistorySessionItem {
  role: string;
  type: string;
  questions: number;
  score: number;
  date: string;
  topics: string[];
  dimension: InterviewDimension;
  categories?: InterviewCategory[];
}

const historySessions: HistorySessionItem[] = [
  {
    role: "腾讯 AI 产品经理",
    type: "完整模拟",
    questions: 10,
    score: 82,
    date: "2026-05-20",
    topics: ["自我介绍", "项目追问", "行为面试", "产品案例"],
    dimension: "behavioral",
    categories: FULL_SIM_CATEGORIES,
  },
  {
    role: "字节跳动运营岗",
    type: "行为面试",
    questions: 5,
    score: 75,
    date: "2026-05-18",
    topics: ["情景问答", "冲突处理", "团队协作"],
    dimension: "behavioral",
  },
];

// ──── AI Chat Simulation ────
function generateAIResponse(userInput: string, context: string, language: InterviewLanguage): string {
  if (language === 'en') {
    const responses = [
      `Great answer! You mentioned "${userInput.slice(0, 30)}..." Could you elaborate on your specific role and contribution in this process?`,
      `I noticed you emphasized teamwork. Can you give a concrete example of how you handled disagreements within the team?`,
      `Your answer shows great depth. What was the biggest challenge during "${userInput.slice(0, 30)}..." and how did you overcome it?`,
      `That's a solid approach. If you could do it again, what would you do differently and why?`,
      `Got it. What were the outcomes of this project? Can you quantify your contributions with specific data?`,
      `Excellent! What you said about "${userInput.slice(0, 30)}..." shows strong proactivity and learning ability. What's the most important thing you learned from it?`,
      `That's an impressive experience. What's your view on future trends in "${context}"?`,
      `You mentioned a key skill. How do you measure your proficiency in it? Do you have a concrete improvement plan?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  const responses = [
    `很好的回答！你提到了「${userInput.slice(0, 15)}...」，能否具体展开说说你在这个过程中的角色和贡献？`,
    `我注意到你强调了团队协作，能举一个具体的例子，说明你如何处理团队内部的分歧吗？`,
    `你的回答很有深度。在「${userInput.slice(0, 15)}...」这个过程中，你遇到的最大挑战是什么？你是如何克服的？`,
    `这是一个不错的思路。如果现在让你重新做一次，你会做出哪些不同的决策？为什么？`,
    `了解了。那这个项目的成果是什么？能否用具体的数据来量化你的贡献？`,
    `很好！你说的「${userInput.slice(0, 15)}...」体现了很强的主动性和学习能力。你从中学到的最重要的东西是什么？`,
    `这个经历很精彩。你对「${context}」这个领域的未来趋势有什么看法？`,
    `你提到了一个关键能力，那你怎么衡量自己在这个能力上的水平？有没有具体的改进计划？`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// ──── 页面 ────

export default function InterviewPage() {
  const { locale, setLocale, t } = useLocale();
  const ip = t.interviewPage;
  const fb = useSystemFeedback();
  const [phase, setPhase] = useState<"landing" | "selecting" | "custom" | "in-progress" | "finished" | "ai-chat">("landing");
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [interviewDimension, setInterviewDimension] = useState<InterviewDimension>("behavioral");
  const [interviewLanguage, setInterviewLanguage] = useState<InterviewLanguage>("zh");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [confirmPlan, setConfirmPlan] = useState<InterviewPlanAudit | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const job = params.get("job");
    const dimension = params.get("dimension") as InterviewDimension | null;
    const lang = params.get("lang") as InterviewLanguage | null;
    if (job) setCustomJobTitle(decodeURIComponent(job));
    if (dimension && ["behavioral", "situational", "technical"].includes(dimension)) setInterviewDimension(dimension);
    if (lang === "zh" || lang === "en") {
      setInterviewLanguage(lang);
      setLocale(lang);
    }
  }, [setLocale]);

  /** 与顶部 EN/中文 全局切换同步 */
  useEffect(() => {
    setInterviewLanguage(locale);
    setConfirmPlan(null);
  }, [locale]);

  const handleInterviewLanguageChange = useCallback(
    (lang: InterviewLanguage) => {
      setInterviewLanguage(lang);
      setLocale(lang);
      setConfirmPlan(null);
    },
    [setLocale]
  );
  
  // AI Chat state
  const getDefaultChatMessage = () =>
    interviewLanguage === 'en'
      ? "Hello, I'm your AI Interviewer. Please fill in your target role above and pass the audit, then enter free chat mode."
      : "你好，我是 AI 面试官。请先在上方填写目标岗位并通过审核，再进入自由对话模式。";
  const [chatMessages, setChatMessages] = useState<{ role: "ai" | "user"; content: string }[]>([
    { role: "ai", content: getDefaultChatMessage() },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const quickStartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMsg, "面试练习", interviewLanguage);
      setChatMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
    }, 800 + Math.random() * 1200);
  }, [chatInput]);

  // ──── 快捷模式选择（保留岗位上下文） ────
  const handleSelectMode = useCallback((mode: InterviewQuickMode) => {
    const title = customJobTitle.trim() || mode.label;
    const jobCat: JobCategory = customJobTitle.trim()
      ? detectJobCategory(customJobTitle)
      : mode.jobCategory;

    let pool =
      jobCat === "通用"
        ? [...questionBank]
        : questionBank.filter((q) => q.jobs.length === 0 || q.jobs.includes(jobCat));
    pool = filterQuestionsByLanguage(pool, interviewLanguage);
    if (mode.categories?.length) {
      pool = pool.filter((q) => mode.categories.includes(q.category));
    }
    if (pool.length === 0) {
      fb.raw.warning(ip.noEnQuestions);
      return;
    }

    startSession(title, jobCat, mode.questionCount, mode.categories, interviewLanguage);
  }, [customJobTitle, interviewLanguage, ip.noEnQuestions]);

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

  // ──── 快速输入：先审核再确认 ────
  const currentPlan = buildInterviewPlan(customJobTitle, interviewDimension, interviewLanguage);

  const handleQuickStart = useCallback(() => {
    const plan = buildInterviewPlan(customJobTitle, interviewDimension, interviewLanguage);
    if (!plan.canStart) return;
    setConfirmPlan(plan);
  }, [customJobTitle, interviewDimension, interviewLanguage]);

  const handleConfirmStart = useCallback(() => {
    if (!confirmPlan?.canStart) return;
    startSession(
      confirmPlan.jobAudit.normalizedTitle,
      confirmPlan.jobCategory,
      confirmPlan.plannedCount,
      confirmPlan.categories,
      confirmPlan.language
    );
    setConfirmPlan(null);
  }, [confirmPlan]);

  /** 历史卡片：预填岗位并弹出审核方案，不再跳转通用模式页 */
  const handleHistoryRestart = useCallback(
    (item: HistorySessionItem) => {
      setCustomJobTitle(item.role);
      setInterviewDimension(item.dimension);
      setConfirmPlan(null);

      const plan = buildHistoryInterviewPlan(item.role, interviewLanguage, {
        dimension: item.dimension,
        questionCount: item.questions,
        sessionLabel: item.type,
        categories: item.categories,
      });

      setConfirmPlan(plan);
      setPhase("landing");

      requestAnimationFrame(() => {
        quickStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [interviewLanguage]
  );

  const handleEnterAiChat = useCallback(() => {
    setChatMessages([
      { role: "ai", content: buildAiChatWelcome(customJobTitle, interviewDimension, interviewLanguage) },
    ]);
    setPhase("ai-chat");
  }, [customJobTitle, interviewDimension, interviewLanguage]);

  // ──── 核心：开始面试会话 ────
  const startSession = (
    title: string,
    jobCategory: string,
    count: number,
    categories?: string[],
    language: InterviewLanguage = interviewLanguage
  ) => {
    let pool =
      jobCategory === "通用"
        ? [...questionBank]
        : questionBank.filter((q) => q.jobs.length === 0 || q.jobs.includes(jobCategory as any));

    pool = filterQuestionsByLanguage(pool, language);

    if (categories && categories.length > 0) {
      pool = pool.filter((q) => categories.includes(q.category));
    }

    const shuffled = pickMixedQuestions(pool, Math.min(count, pool.length));
    if (shuffled.length === 0) {
      fb.raw.warning(ip.noEnQuestions);
      return;
    }
    const selected = shuffled;

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
  const handleSubmitAnswer = useCallback((payload: AnswerSubmitPayload) => {
    if (!session) return;
    const q = session.questions[session.currentIndex];
    const ans = evaluateAnswer(q, payload.content, payload.selectedOptionIds);
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
    setConfirmPlan(null);
  }, []);

  // ========================
  // RENDER: Landing Page
  // ========================
  if (phase === "landing") {
    const jobCat = detectJobCategory(customJobTitle || "") as any;
    const prepStats = getPrepStats(interviewDimension, interviewLanguage, jobCat);
    const bankStats = getQuestionBankStats(interviewLanguage);

    return (
      <FeaturePageRoot>
        <GlassPageHero
          badge={
            <>
              <MessageCircle className="w-3.5 h-3.5 text-volt" />
              {questionBank.length}+ 题库 · {interviewLanguage === "zh" ? "中文" : "English"} {bankStats.total} 题可用
            </>
          }
          title="AI 面试官"
          subtitle={ip.heroSubtitle}
          icon={MessageCircle}
        />

        <FeaturePageShell>
        {/* Session History */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {historySessions.map((s, i) => (
            <div key={i} className="apple-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[17px] font-semibold tracking-tight text-ink">
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
              <Button variant="volt" size="sm" className="gap-1.5" onClick={() => handleHistoryRestart(s)}>
                <Play className="w-3.5 h-3.5" /> {ip.againSimulate}
              </Button>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div ref={quickStartRef} id="interview-quick-start">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-[18px] h-[18px] text-apple-purple" />
              <CardTitle>{ip.quickStart}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {locale === "en" && (
                <div className="px-3 py-2 rounded-xl bg-[var(--accent-soft)] border border-[var(--chip-selected-border)] text-[12px] text-volt">
                  {ip.enBankActive}
                </div>
              )}

              <InterviewLangSwitcher
                dimension={interviewDimension}
                language={interviewLanguage}
                onDimensionChange={setInterviewDimension}
                onLanguageChange={handleInterviewLanguageChange}
                stats={prepStats}
              />
              <div className="flex gap-3">
                <Input
                  placeholder={ip.jobPlaceholder}
                  className="flex-1"
                  value={customJobTitle}
                  onChange={(e) => {
                    setCustomJobTitle(e.target.value);
                    setConfirmPlan(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && currentPlan.canStart && handleQuickStart()}
                />
                <Button
                  variant="volt"
                  className="gap-2"
                  onClick={handleQuickStart}
                  disabled={!currentPlan.canStart}
                >
                  <Play className="w-4 h-4" />
                  {ip.auditPlan}
                </Button>
              </div>

              <JobTitleAuditHint plan={currentPlan} locale={locale} />

              {confirmPlan && (
                <InterviewStartConfirmPanel
                  plan={confirmPlan}
                  onConfirm={handleConfirmStart}
                  onCancel={() => setConfirmPlan(null)}
                />
              )}

              <p className="text-[12px] text-apple-text-secondary">
                {ip.mixedFormats} · {currentPlan.availableCount}{" "}
                {locale === "zh" ? "题可用" : "available"}
                {bankStats.ai > 0 &&
                  (locale === "zh"
                    ? ` · 含 AI 专题 ${bankStats.ai} 题`
                    : ` · ${bankStats.ai} AI questions`)}
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setPhase("selecting")}
                  className="text-[12px] text-volt hover:underline font-medium"
                >
                  {ip.selectOtherMode}
                </button>
                <span className="text-apple-text-secondary">·</span>
                <button
                  onClick={handleEnterAiChat}
                  className="text-[12px] font-medium inline-flex items-center gap-1 text-volt hover:underline"
                >
                  <Bot className="w-3 h-3" /> {ip.aiFreeChat}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Prep Library */}
        <div className="mt-10">
          <InterviewPrepLibrary
            jobTitle={customJobTitle || undefined}
            jobCategory={jobCat}
            dimension={interviewDimension}
            language={interviewLanguage}
            onDimensionChange={setInterviewDimension}
            onLanguageChange={handleInterviewLanguageChange}
          />
        </div>

        {/* Tips */}
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            {
              title: "真实场景模拟",
              desc: "AI 根据真实 JD 和你的简历自动生成面试问题，模拟真实面试流程。",
              color: "text-volt",
              bg: "bg-[var(--accent-soft)]",
            },
            {
              title: "即时评分反馈",
              desc: "每题回答后获得即时评分和改进建议，帮助你快速提升面试表现。",
              color: "text-[var(--chip-selected-text)]",
              bg: "bg-[var(--chip-selected-bg)]",
            },
            {
              title: "多轮深度对话",
              desc: "支持追问和深度探讨，涵盖行为面试、技术面试、情景问答等。",
              color: "text-[var(--color-success)]",
              bg: "bg-[var(--color-success-soft)]",
            },
          ].map((tip) => (
            <div key={tip.title} className="apple-card p-6">
              <div className={`w-10 h-10 rounded-xl ${tip.bg} flex items-center justify-center mb-4`}>
                <Star className={`w-5 h-5 ${tip.color}`} />
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight text-ink mb-2">
                {tip.title}
              </h3>
              <p className="text-[13px] text-apple-text-secondary leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </FeaturePageShell>
      </FeaturePageRoot>
    );
  }

  // ========================
  // RENDER: Selecting Mode
  // ========================
  if (phase === "selecting") {
    return (
      <FeaturePageRoot>
      <div className="brand-editorial-width py-10 md:py-14">
        <button
          onClick={() => setPhase("landing")}
          className="text-[14px] text-volt hover:underline mb-6 inline-block"
        >
          ← {ip.back}
        </button>
        <ModeSelector
          selected={null}
          jobTitle={customJobTitle.trim() || undefined}
          onSelect={handleSelectMode}
          onCustom={handleCustomMode}
        />
      </div>
      </FeaturePageRoot>
    );
  }

  // ========================
  // RENDER: Custom Setup
  // ========================
  if (phase === "custom") {
    return (
      <FeaturePageRoot>
      <div className="brand-editorial-width py-10 md:py-14">
        <CustomSetup
          onConfirm={handleCustomConfirm}
          onBack={() => setPhase("selecting")}
          language={interviewLanguage}
        />
      </div>
      </FeaturePageRoot>
    );
  }

  // ========================
  // RENDER: In Progress
  // ========================
  if (phase === "in-progress" && session) {
    const q = session.questions[session.currentIndex];
    if (!q) return null;

    return (
      <FeaturePageRoot>
      <div className="brand-editorial-width max-w-3xl py-10 md:py-14">
        <button
          onClick={() => setPhase("landing")}
          className="text-[14px] text-volt hover:underline mb-6 inline-block"
        >
          ← 退出面试
        </button>
        <InterviewSessionBanner
          jobTitle={session.jobTitle}
          dimensionLabel={tDimension(interviewDimension, locale)}
          languageLabel={locale === "zh" ? "中文题库" : "English Bank"}
          questionIndex={session.currentIndex}
          total={session.questions.length}
        />
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
      </FeaturePageRoot>
    );
  }

  // ========================
  // RENDER: Finished
  // ========================
  if (phase === "finished" && session && result) {
    return (
      <FeaturePageRoot>
      <div className="brand-editorial-width py-10 md:py-14">
        <ResultReport result={result} session={session} onRestart={handleRestart} />
      </div>
      </FeaturePageRoot>
    );
  }

  // ========================
  // RENDER: AI Chat Mode
  // ========================
  if (phase === "ai-chat") {
    return (
      <FeaturePageRoot>
      <div className="brand-editorial-width max-w-3xl py-8 animate-fade-in-up h-[calc(100vh-200px)] flex flex-col">
        <GlassPageHero
          compact
          className="mb-4 shrink-0"
          title="AI 面试官 · 自由对话"
          subtitle="基于目标岗位进行开放式练习"
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setChatMessages([
                    {
                      role: "ai",
                      content: buildAiChatWelcome(customJobTitle, interviewDimension, interviewLanguage),
                    },
                  ]);
                }}
                className="text-[12px] text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
                title="重新开始对话"
              >
                <History className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPhase("landing")}
                className="text-[13px] text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
              >
                ← 退出对话
              </button>
            </div>
          }
        />

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === "ai"
                  ? "bg-[var(--accent-soft)] border border-[var(--chip-selected-border)]"
                  : "bg-volt"
              }`}>
                {msg.role === "ai" ? <Bot className="w-4 h-4 text-volt" /> : <User className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[75%] p-4 rounded-2xl text-[14px] leading-relaxed ${
                msg.role === "ai"
                  ? "bg-[var(--surface-3)] border border-volt/30 text-ink rounded-tl-sm shadow-sm"
                  : "bg-volt text-white rounded-tr-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="shrink-0 mb-2 px-3 py-2 rounded-xl feature-panel-muted text-[11px] text-apple-text-secondary">
          请用完整句子回答 · 敷衍或过短回复无法获得有效练习反馈 · 行为/情景题建议使用 STAR 结构
        </div>
        <div className="shrink-0 flex gap-2">
          <Input
            placeholder="输入你的回答或提问..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
            className="flex-1"
          />
          <Button variant="volt" onClick={handleSendChat} disabled={!chatInput.trim()} className="gap-2">
            <Send className="w-4 h-4" /> 发送
          </Button>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-1.5 mt-3 shrink-0">
          {(interviewLanguage === 'en'
            ? ["Answer with STAR", "Give a concrete example", "Dig into project details", "Simulate pressure question"]
            : ["用STAR法则回答", "给一个具体例子", "追问项目细节", "模拟压力问题"]
          ).map((action) => (
            <button
              key={action}
              onClick={() => {
                setChatMessages(prev => [...prev, { role: "user", content: action }]);
                setTimeout(() => {
                  setChatMessages(prev => [...prev, { role: "ai", content: generateAIResponse(action, "面试练习", interviewLanguage) }]);
                }, 800);
              }}
              className="text-[11px] px-2.5 py-1.5 rounded-full feature-chip hover:text-ink transition-colors"
            >
              <Wand2 className="w-3 h-3 inline mr-1" />
              {action}
            </button>
          ))}
        </div>
      </div>
      </FeaturePageRoot>
    );
  }

  return null;
}
