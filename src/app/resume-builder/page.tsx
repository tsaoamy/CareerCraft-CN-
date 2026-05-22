"use client";

import { FileEdit, Download, RefreshCw, Star, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const versions = [
  { role: "腾讯 AI 产品经理版", score: 83, status: "已生成", time: "2 小时前" },
  { role: "阿里数据分析师版", score: 78, status: "已生成", time: "5 小时前" },
  { role: "字节跳动运营版", score: 81, status: "生成中", time: "进行中..." },
  { role: "美团产品经理版", score: 76, status: "已生成", time: "昨天" },
];

const atsScores = [
  { item: "关键词匹配", score: 90, bar: "w-[90%]" },
  { item: "技能覆盖", score: 82, bar: "w-[82%]" },
  { item: "结构规范", score: 95, bar: "w-[95%]" },
  { item: "可读性", score: 87, bar: "w-[87%]" },
  { item: "综合评分", score: 88, bar: "w-[88%]" },
];

export default function ResumeBuilderPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">AI 简历定制</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">一个职业档案，多岗位智能适配</p>
      </div>

      {/* Version List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">我的简历版本</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {versions.map((v, i) => (
            <Card key={i} className="hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{v.role}</h3>
                    <p className="text-xs text-slate-400 mt-1">{v.time}</p>
                  </div>
                  <Badge variant={v.score >= 80 ? "success" : "warning"}>{v.score}分</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="w-3 h-3" /> PDF
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="w-3 h-3" /> DOCX
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1">
                    <RefreshCw className="w-3 h-3" /> 重新生成
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ATS Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <CardTitle>ATS 评分系统</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {atsScores.map((item) => (
              <div key={item.item}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm">{item.item}</span>
                  <span className="text-sm font-semibold text-primary-500">{item.score}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-1000 ${item.bar}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
