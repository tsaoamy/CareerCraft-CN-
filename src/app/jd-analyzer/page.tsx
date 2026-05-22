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
    // Simulate AI analysis delay
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
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">JD 智能解析</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">粘贴岗位描述，智能分析与你的素材库匹配度</p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left: JD Input */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>粘贴 JD</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-48 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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

          {/* Demo JDs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">快速体验</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {DEMO_JDS.map((demo, i) => (
                <button
                  key={i}
                  onClick={() => handleUseDemo(demo)}
                  className="w-full text-left p-3 rounded-lg text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors line-clamp-2"
                >
                  {demo}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Material stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">素材库概览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 text-sm">
                <div className="flex-1 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
                  <div className="text-2xl font-bold text-blue-600">{materialStats.total}</div>
                  <div className="text-xs text-slate-500">段经历</div>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-center">
                  <div className="text-2xl font-bold text-purple-600">{materialStats.skills}</div>
                  <div className="text-xs text-slate-500">项技能</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Analysis Result */}
        <div className="md:col-span-3">
          {!result ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400">
              <Search className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-sm">在左侧粘贴 JD 并点击分析</p>
              <p className="text-xs mt-1">或选择一个示例 JD 快速体验</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Match Score */}
              <div className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800">
                <div className="relative">
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="url(#grade)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.matchScore / 100)}`}
                      className="origin-center -rotate-90"
                    />
                    <defs>
                      <linearGradient id="grade" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400">
                    {result.matchScore}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-lg">匹配度评分</p>
                  <p className="text-sm text-slate-500">{result.portrait.title} · {result.portrait.level} · {result.portrait.industry}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {result.matchScore >= 80 ? '匹配度较高，建议立即投递！' :
                     result.matchScore >= 60 ? '有一定匹配度，可针对性补充技能' :
                     '匹配度较低，建议积累相关经验后再投递'}
                  </p>
                </div>
              </div>

              {/* Core Skills */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-500" />
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
                    <Zap className="w-4 h-4 text-amber-500" />
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
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <CardTitle>技能缺口 ({result.gaps.length}项)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {result.gaps.length === 0 ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-600 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      所有核心技能均已覆盖，你的素材库准备得很好！
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {result.gaps.map((gap, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30">
                          <TrendingUp className="w-4 h-4 text-red-400 shrink-0" />
                          <div>
                            <span className="text-sm font-medium">{gap}</span>
                            <p className="text-xs text-slate-500 mt-0.5">建议在职业素材库中补充相关经历</p>
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
                      <Briefcase className="w-4 h-4 text-green-500" />
                      <CardTitle>匹配的素材 ({result.matchedMaterials.length}段)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.matchedMaterials.map((m) => (
                        <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          <div>
                            <span className="text-sm font-medium">{m.title}</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {m.skills.slice(0, 4).map(s => (
                                <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
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
