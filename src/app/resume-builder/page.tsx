"use client";

import { useState } from "react";
import { FileEdit, Download, RefreshCw, Star, Sparkles, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AICopilotWidget } from "@/components/ai-copilot/copilot-widget";

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
  const [showAITips, setShowAITips] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 md:py-14 animate-fade-in-up">
      {/* AI 简历导师横幅 */}
      <div className="mb-8 bg-gradient-to-r from-[#0071e3]/8 via-[#5856d6]/8 to-[#8944ab]/8 dark:from-[#0071e3]/12 dark:via-[#5856d6]/12 dark:to-[#8944ab]/12 rounded-3xl p-6 border border-[#0071e3]/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#5856d6] flex items-center justify-center shrink-0 shadow-lg shadow-[#0071e3]/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-[19px] font-semibold text-[#1d1d1f] dark:text-white mb-1">
              AI 简历导师已就绪 🎓
            </h2>
            <p className="text-[14px] text-[#86868b] mb-3">
              不是"AI 替你写"，而是"AI 陪你写"。点击右下角 <MessageCircle className="w-4 h-4 inline text-[#0071e3]" /> 随时向我提问！
            </p>
            <div className="flex flex-wrap gap-2">
              {["如何写项目经历？", "STAR法则是什么？", "帮我评测简历", "面试官会问什么？"].map((tip) => (
                <span
                  key={tip}
                  className="px-3 py-1.5 rounded-full bg-white/60 dark:bg-[#2c2c2e]/60 text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] border border-[#e8e8ed]/40 dark:border-[#38383a]/40 cursor-pointer hover:bg-white dark:hover:bg-[#38383a] transition-colors"
                >
                  {tip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[19px] font-semibold tracking-tight text-apple-text dark:text-white">
            我的简历版本
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowAITips(!showAITips)}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
            AI 优化建议
          </Button>
        </div>

        {/* AI Tips Panel */}
        {showAITips && (
          <div className="mb-4 bg-[#0071e3]/5 dark:bg-[#0071e3]/10 rounded-2xl p-5 border border-[#0071e3]/10 animate-fade-in-up">
            <p className="text-[13px] font-medium text-[#0071e3] mb-3">
              💡 AI 简历导师建议你关注以下改进点：
            </p>
            <div className="space-y-2">
              {[
                { icon: "📊", text: "为每个项目添加可量化的数据成果（提升了 X%、服务了 Y 用户）" },
                { icon: "🎯", text: "使用 STAR 法则重组项目描述，突出你的个人贡献" },
                { icon: "🔍", text: "检查关键词覆盖：确保简历中包含目标 JD 的核心技能词汇" },
                { icon: "👁️", text: "优化排版：在每段经历的标题中突出角色和核心成果" },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[14px] shrink-0">{tip.icon}</span>
                  <p className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7]">{tip.text}</p>
                </div>
              ))}
            </div>
            <p className="text-[12px] text-[#86868b] mt-3">
              点击右下角 AI 助手获取详细的个性化建议 →
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {versions.map((v, i) => (
            <div key={i} className="apple-card p-6 group">
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

      {/* AI 职业顾问悬浮助手 */}
      <AICopilotWidget />
    </div>
  );
}
