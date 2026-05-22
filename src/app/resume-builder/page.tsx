"use client";

import { FileEdit, Download, RefreshCw, Star } from "lucide-react";
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
  { item: "关键词匹配", score: 90 },
  { item: "技能覆盖", score: 82 },
  { item: "结构规范", score: 95 },
  { item: "可读性", score: 87 },
  { item: "综合评分", score: 88 },
];

export default function ResumeBuilderPage() {
  return (
    <div className="max-w-7xl mx-auto px-5 py-10 md:py-14 animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-apple-text dark:text-white">
          AI 简历定制
        </h1>
        <p className="text-[15px] text-apple-text-secondary mt-1.5">
          一个职业档案，多岗位智能适配
        </p>
      </div>

      {/* Version List */}
      <div className="mb-10">
        <h2 className="text-[19px] font-semibold tracking-tight text-apple-text dark:text-white mb-5">
          我的简历版本
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {versions.map((v, i) => (
            <div key={i} className="apple-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[17px] font-semibold tracking-tight text-apple-text dark:text-white">
                    {v.role}
                  </h3>
                  <p className="text-[12px] text-apple-text-secondary mt-1">{v.time}</p>
                </div>
                <Badge variant={v.score >= 80 ? "success" : "warning"}>{v.score}分</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Download className="w-3.5 h-3.5" /> PDF
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Download className="w-3.5 h-3.5" /> DOCX
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> 重新生成
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ATS Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="w-[18px] h-[18px] text-apple-orange" />
            <CardTitle>ATS 评分系统</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {atsScores.map((item) => (
              <div key={item.item}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-medium text-apple-text dark:text-white">
                    {item.item}
                  </span>
                  <span className="text-[15px] font-semibold text-apple-blue">{item.score}</span>
                </div>
                <div className="h-2 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-apple-blue to-apple-purple transition-all duration-1000"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Generate CTA */}
      <div className="mt-10 text-center p-10 apple-card">
        <FileEdit className="w-10 h-10 text-apple-blue mx-auto mb-4" />
        <h3 className="text-[19px] font-semibold tracking-tight text-apple-text dark:text-white mb-2">
          还没有简历？开始你的第一份 AI 简历
        </h3>
        <p className="text-[14px] text-apple-text-secondary mb-5">
          选择目标岗位，AI 自动从你的素材库生成针对性简历
        </p>
        <Button size="lg" className="gap-2">
          <FileEdit className="w-5 h-5" />
          生成新简历
        </Button>
      </div>
    </div>
  );
}
