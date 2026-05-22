"use client";

import { MessageCircle, Play, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sessions = [
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

export default function InterviewPage() {
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
        {sessions.map((s, i) => (
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
            <Button size="sm" className="gap-1.5">
              <Play className="w-3.5 h-3.5" /> 开始新面试
            </Button>
          </div>
        ))}
      </div>

      {/* Start New Interview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-[18px] h-[18px] text-apple-purple" />
            <CardTitle>开始新面试</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input placeholder="输入目标岗位（如：腾讯AI产品经理）" className="flex-1" />
            <Button className="gap-2">
              <Play className="w-4 h-4" /> 开始
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interview Tips */}
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
