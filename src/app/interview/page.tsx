"use client";

import { MessageCircle, Play, Star, ThumbsUp, Send } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">AI 面试官</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">基于 JD 和简历的智能模拟面试</p>
      </div>

      {/* Sessions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {sessions.map((s, i) => (
          <Card key={i} className="hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{s.role}</h3>
                  <p className="text-xs text-slate-400 mt-1">{s.date} · {s.questions} 题</p>
                </div>
                <Badge variant={s.score >= 80 ? "success" : "warning"}>{s.score}分</Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {s.topics.map((t) => (
                  <Badge key={t} variant="accent" className="text-[10px]">{t}</Badge>
                ))}
              </div>
              <Button size="sm" className="gap-1">
                <Play className="w-3 h-3" /> 开始新面试
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Start New Interview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-accent-500" />
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
    </div>
  );
}
