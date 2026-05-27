"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Play, MessageCircle, Star, Send, Bot, User, Zap, Wand2, History } from "lucide-react";
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

// ──── AI Chat Simulation ────
function generateAIResponse(userInput: string, context: string): string {
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
  // 阶段
  const [phase, setPhase] = useState<"landing" | "selecting" | "custom" | "in-progress" | "finished" | "ai-chat">("landing");
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [result, setResult] = useState<InterviewResult | null>(null);
  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState<{ role: "ai" | "user"; content: string }[]>([
    { role: "ai", content: "你好！我是AI面试官。请告诉我你想面试的岗位，以及你最关心的面试方向（如：技术面试、行为面试、项目经历、薪资谈判等），我会针对性地和你练习。你可以随时开始！✨" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMsg, "面试练习");
      setChatMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
    }, 800 + Math.random() * 1200);
  }, [chatInput]);

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
        {/* Hero — Starry Sky */}
        <div className="relative mb-10 overflow-hidden rounded-3xl nebula-hero border border-white/10 p-8 md:p-10">
          <div className="shooting-star" /><div className="shooting-star" /><div className="shooting-star" />
          <div className="constellation-dot" style={{top:'5%',left:'8%'}} />
          <div className="constellation-dot" style={{top:'12%',left:'25%'}} />
          <div className="constellation-dot" style={{top:'8%',left:'50%'}} />
          <div className="constellation-dot" style={{top:'18%',left:'70%'}} />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[12px] text-purple-200">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                星辉面试 · 130+题库
              </div>
              <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-white">
                AI 面试官
              </h1>
              <p className="text-[16px] text-blue-100/80 mt-2">
                基于 JD 和简历的智能模拟面试，在星空中磨练你的回答
              </p>
            </div>
            <img
              src="/images/AI_job_interview_illustration__2026-05-27T02-36-56.png"
              alt="AI 星辉面试"
              className="hidden md:block w-48 h-auto rounded-2xl shadow-[0_0_30px_rgba(160,120,255,0.2)]"
            />
          </div>
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
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setPhase("selecting")}
                  className="text-[12px] text-apple-blue hover:underline font-medium"
                >
                  选择面试模式
                </button>
                <span className="text-apple-text-secondary">·</span>
                <button
                  onClick={() => setPhase("ai-chat")}
                  className="text-[12px] text-apple-purple hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Bot className="w-3 h-3" /> AI自由对话
                </button>
              </div>
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

  // ========================
  // RENDER: AI Chat Mode
  // ========================
  if (phase === "ai-chat") {
    return (
      <div className="max-w-3xl mx-auto px-5 py-8 animate-fade-in-up h-[calc(100vh-200px)] flex flex-col">
        {/* Header — Starry */}
        <div className="relative overflow-hidden rounded-2xl nebula-hero border border-white/10 p-4 mb-4 shrink-0">
          <div className="shooting-star" /><div className="shooting-star" />
          <div className="constellation-dot" style={{top:'5%',left:'10%'}} />
          <div className="constellation-dot" style={{top:'20%',left:'30%'}} />
          <div className="constellation-dot" style={{top:'10%',left:'65%'}} />
          <div className="constellation-dot" style={{top:'25%',left:'85%'}} />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold text-white">AI 面试官 · 星空对话</h2>
                <p className="text-[12px] text-blue-100/70">在星辰中自由练习面试对话</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setChatMessages([{ role: "ai", content: "你好！我是AI面试官。请告诉我你想面试的岗位，以及你最关心的面试方向（如：技术面试、行为面试、项目经历、薪资谈判等），我会针对性地和你练习。你可以随时开始！✨" }]); }}
                className="text-[12px] text-blue-100/60 hover:text-blue-100 transition-colors"
              >
                <History className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPhase("landing")}
                className="text-[13px] text-blue-300 hover:text-white hover:underline transition-colors"
              >
                ← 退出对话
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === "ai" 
                  ? "bg-gradient-to-br from-apple-purple to-[#8944ab]" 
                  : "bg-gradient-to-br from-apple-blue to-[#5ac8fa]"
              }`}>
                {msg.role === "ai" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[75%] p-4 rounded-2xl text-[14px] leading-relaxed ${
                msg.role === "ai"
                  ? "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text dark:text-white rounded-tl-sm"
                  : "bg-apple-blue text-white rounded-tr-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="shrink-0 flex gap-2">
          <Input
            placeholder="输入你的回答或提问..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
            className="flex-1"
          />
          <Button onClick={handleSendChat} disabled={!chatInput.trim()} className="gap-2">
            <Send className="w-4 h-4" /> 发送
          </Button>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-1.5 mt-3 shrink-0">
          {["用STAR法则回答", "给一个具体例子", "追问项目细节", "模拟压力问题"].map((action) => (
            <button
              key={action}
              onClick={() => {
                setChatMessages(prev => [...prev, { role: "user", content: action }]);
                setTimeout(() => {
                  setChatMessages(prev => [...prev, { role: "ai", content: generateAIResponse(action, "面试练习") }]);
                }, 800);
              }}
              className="text-[11px] px-2.5 py-1.5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] hover:text-apple-text dark:hover:text-white transition-colors"
            >
              <Wand2 className="w-3 h-3 inline mr-1" />
              {action}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
