"use client";

import { Search, Sparkles, TrendingUp, AlertCircle, Target, Zap, Briefcase, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useMaterials } from "@/lib/material-context";
import { analyzeJD, type JDAnalysisResult } from "@/lib/jd-analyzer";

const DEMO_JDS = [
  "【AI产品经理】负责AI开放平台产品设计与规划，推动产品从0到1落地。要求：3年以上产品经验，熟练使用PRD、竞品分析、用户调研、A/B测试、数据分析、SQL，有B端产品经验优先，良好的沟通和项目管理能力。",
  "【数据分析师】负责业务数据监控与分析，搭建数据指标体系。要求：精通SQL、Python、Tableau，熟悉A/B测试和统计分析方法，有用户增长分析经验，能独立完成数据报告撰写，沟通表达能力强。",
  "【后端开发工程师】负责微服务架构设计和API开发。要求：精通Java/Go，熟悉Spring Boot、MySQL、Redis、Docker、Kubernetes，有分布式系统设计经验，熟悉CI/CD流程，3年以上经验。",
];

export default function JDAnalyzerPage() {
  const { materials } = useMaterials();
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<JDAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!jd.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const analysis = analyzeJD(jd, materials);
      setResult(analysis);
      setAnalyzing(false);
    }, 800);
  };

  const handleUseDemo = (demoJd: string) => {
    setJd(demoJd);
    setAnalyzing(true);
    setTimeout(() => {
      const analysis = analyzeJD(demoJd, materials);
      setResult(analysis);
      setAnalyzing(false);
    }, 800);
  };

  const materialStats = useMemo(() => ({
    total: materials.length,
    skills: [...new Set(materials.flatMap(m => m.skills))].length,
  }), [materials]);

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 md:py-14 animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-apple-text dark:text-white">
          JD 智能解析
        </h1>
        <p className="text-[15px] text-apple-text-secondary mt-1.5">
          粘贴岗位描述，智能分析与你的素材库匹配度
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left: JD Input */}
        <div className="md:col-span-2 space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>粘贴 JD</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-48 p-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:border-apple-blue placeholder:text-apple-text-secondary transition-colors"
                placeholder="在此粘贴岗位描述（Job Description）..."
                value={jd}
                onChange={(e) => { setJd(e.target.value); setResult(null); }}
              />
              <Button className="w-full mt-4 gap-2" onClick={handleAnalyze} disabled={!jd.trim() || analyzing}>
                <Sparkles className="w-4 h-4" />
                {analyzing ? "分析中..." : "AI 分析"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[15px]">快速体验</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {DEMO_JDS.map((demo, i) => (
                <button
                  key={i}
                  onClick={() => handleUseDemo(demo)}
                  className="w-full text-left p-3.5 rounded-xl text-[12px] border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] hover:bg-white dark:hover:bg-[#2c2c2e] transition-colors line-clamp-2 text-apple-text-secondary"
                >
                  {demo}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[15px]">素材库概览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 text-sm">
                <div className="flex-1 p-4 rounded-xl bg-[#e8f4fd] dark:bg-[#003366] text-center">
                  <div className="text-[28px] font-bold text-apple-blue">{materialStats.total}</div>
                  <div className="text-[12px] text-apple-blue/70 mt-1">段经历</div>
                </div>
                <div className="flex-1 p-4 rounded-xl bg-[#f4f1fa] dark:bg-[#2d1445] text-center">
                  <div className="text-[28px] font-bold text-apple-purple">{materialStats.skills}</div>
                  <div className="text-[12px] text-apple-purple/70 mt-1">项技能</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Analysis Result */}
        <div className="md:col-span-3">
          {!result ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <Search className="w-14 h-14 mb-5 text-apple-text-secondary/20" />
              <p className="text-[15px] text-apple-text-secondary">在左侧粘贴 JD 并点击分析</p>
              <p className="text-[13px] text-apple-text-secondary/60 mt-1.5">或选择一个示例 JD 快速体验</p>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in-up">
              {/* Match Score */}
              <div className="flex items-center gap-5 p-6 rounded-2xl bg-gradient-to-r from-[#e8f4fd] to-[#f4f1fa] dark:from-[#003366] dark:to-[#2d1445] border border-[#0071e3]/10 dark:border-[#0071e3]/20">
                <div className="relative shrink-0">
                  <svg className="w-[88px] h-[88px]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className="text-[#d2d2d7] dark:text-[#48484a]" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="url(#scoreGrad)" strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.matchScore / 100)}`}
                      className="origin-center -rotate-90"
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0071e3" />
                        <stop offset="100%" stopColor="#8944ab" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[24px] font-bold text-apple-blue dark:text-[#409cff]">
                    {result.matchScore}
                  </span>
                </div>
                <div>
                  <p className="text-[19px] font-semibold text-apple-text dark:text-white">匹配度评分</p>
                  <p className="text-[14px] text-apple-text-secondary mt-0.5">
                    {result.portrait.title} &middot; {result.portrait.level} &middot; {result.portrait.industry}
                  </p>
                  <p className="text-[13px] text-apple-text-secondary/70 mt-1.5">
                    {result.matchScore >= 80 ? '🎯 匹配度较高，建议立即投递！' :
                     result.matchScore >= 60 ? '👍 有一定匹配度，可针对性补充技能' :
                     '📚 匹配度较低，建议积累相关经验后再投递'}
                  </p>
                </div>
              </div>

              {/* Core Skills */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="w-[18px] h-[18px] text-apple-purple" />
                    <CardTitle>核心技能要求</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map((s) => (
                      <Badge key={s} variant="primary">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ATS Keywords */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="w-[18px] h-[18px] text-apple-orange" />
                    <CardTitle>ATS 高频关键词</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.atsKeywords.map((k) => (
                      <Badge key={k} variant="warning">{k}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skill Gaps */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-[18px] h-[18px] text-apple-red" />
                    <CardTitle>技能缺口 ({result.gaps.length}项)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {result.gaps.length === 0 ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-[#e8f8ee] dark:bg-[#0a3622]">
                      <CheckCircle2 className="w-5 h-5 text-apple-green shrink-0" />
                      <span className="text-[14px] text-apple-green">所有核心技能均已覆盖，你的素材库准备得很好！</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {result.gaps.map((gap, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#ffebee] dark:bg-[#3d1111]">
                          <TrendingUp className="w-5 h-5 text-apple-red shrink-0" />
                          <div>
                            <span className="text-[14px] font-medium text-apple-red">{gap}</span>
                            <p className="text-[12px] text-apple-red/70 mt-0.5">建议在职业素材库中补充相关经历</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Matched Materials */}
              {result.matchedMaterials.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-[18px] h-[18px] text-apple-green" />
                      <CardTitle>匹配的素材 ({result.matchedMaterials.length}段)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2.5">
                      {result.matchedMaterials.map((m) => (
                        <div key={m.id} className="flex items-center gap-3 p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
                          <CheckCircle2 className="w-5 h-5 text-apple-green shrink-0" />
                          <div>
                            <span className="text-[14px] font-medium text-apple-text dark:text-white">{m.title}</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {m.skills.slice(0, 4).map(s => (
                                <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-[#e8f4fd] dark:bg-[#003366] text-apple-blue font-medium">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
