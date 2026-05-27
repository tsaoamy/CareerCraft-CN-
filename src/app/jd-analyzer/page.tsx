"use client";

import { Search, Sparkles, TrendingUp, AlertCircle, Target, Zap, Briefcase, CheckCircle2, History, Download, MessageCircle, BarChart3, ArrowRight, BookOpen, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useCallback } from "react";
import { useMaterials } from "@/lib/material-context";
import { analyzeJD, type JDAnalysisResult } from "@/lib/jd-analyzer";
import Link from "next/link";

const DEMO_JDS = [
  {
    title: "AI产品经理",
    text: "【AI产品经理】负责AI开放平台产品设计与规划，推动产品从0到1落地。要求：3年以上产品经验，熟练使用PRD、竞品分析、用户调研、A/B测试、数据分析、SQL，有B端产品经验优先，良好的沟通和项目管理能力。",
    salary: "30-60K·16薪",
    company: "某头部AI公司"
  },
  {
    title: "数据分析师",
    text: "【数据分析师】负责业务数据监控与分析，搭建数据指标体系。要求：精通SQL、Python、Tableau，熟悉A/B测试和统计分析方法，有用户增长分析经验，能独立完成数据报告撰写，沟通表达能力强。",
    salary: "25-45K·15薪",
    company: "某互联网大厂"
  },
  {
    title: "后端开发工程师",
    text: "【后端开发工程师】负责微服务架构设计和API开发。要求：精通Java/Go，熟悉Spring Boot、MySQL、Redis、Docker、Kubernetes，有分布式系统设计经验，熟悉CI/CD流程，3年以上经验。",
    salary: "35-70K·16薪",
    company: "某独角兽企业"
  },
];

interface AnalysisRecord {
  id: string;
  jd: string;
  result: JDAnalysisResult;
  createdAt: string;
}

const LEARNING_RESOURCES: Record<string, string[]> = {
  "Python": ["Python官方教程", "LeetCode Python专项", "《流畅的Python》"],
  "Java": ["Java菜鸟教程", "Spring官方指南", "《Effective Java》"],
  "SQL": ["SQLZoo在线练习", "LeetCode数据库题库", "《SQL必知必会》"],
  "React": ["React官方文档", "Build UI组件库实战", "《React设计原理》"],
  "Docker": ["Docker从入门到实践", "Play with Docker", "Kubernetes官方教程"],
  "Kubernetes": ["K8s官方教程", "Katacoda互动教程", "CKA认证指南"],
  "数据分析": ["Kaggle入门赛", "《利用Python进行数据分析》", "DataCamp"],
  "A/B测试": ["Udacity A/B测试课程", "《Trustworthy Online Experiments》", "GrowthBook文档"],
  "产品设计": ["《启示录》", "Product School课程", "人人都是产品经理社区"],
  "用户研究": ["Nielsen Norman Group文章", "《 interviewing Users》", "UX Research方法卡片"],
  "项目管理": ["PMP认证指南", "《人月神话》", "Atlassian敏捷指南"],
  "机器学习": ["吴恩达机器学习课程", "Kaggle竞赛", "《Hands-On ML》"],
  "Tableau": ["Tableau Public Gallery", "Tableau官方培训", "《用数据讲故事》"],
  "Go": ["Go by Example", "Go语言官方之旅", "《Go语言设计与实现》"],
};

function getLearningResource(skill: string): string[] {
  for (const [key, resources] of Object.entries(LEARNING_RESOURCES)) {
    if (skill.toLowerCase().includes(key.toLowerCase())) return resources;
  }
  return ["Coursera相关课程", "官方文档&社区", "实际项目练习"];
}

export default function JDAnalyzerPage() {
  const { materials } = useMaterials();
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<JDAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedGap, setSelectedGap] = useState<string | null>(null);

  const handleAnalyze = useCallback(() => {
    if (!jd.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const analysis = analyzeJD(jd, materials);
      setResult(analysis);
      setAnalyzing(false);
      const record: AnalysisRecord = {
        id: `ana_${Date.now()}`,
        jd: jd.trim().slice(0, 200),
        result: analysis,
        createdAt: new Date().toLocaleString(),
      };
      setHistory(prev => [record, ...prev].slice(0, 10));
    }, 800);
  }, [jd, materials]);

  const handleUseDemo = useCallback((demoJd: string) => {
    setJd(demoJd);
    setAnalyzing(true);
    setTimeout(() => {
      const analysis = analyzeJD(demoJd, materials);
      setResult(analysis);
      setAnalyzing(false);
    }, 800);
  }, [materials]);

  const handleLoadHistory = useCallback((record: AnalysisRecord) => {
    setJd(record.jd);
    setResult(record.result);
    setShowHistory(false);
  }, []);

  const materialStats = useMemo(() => ({
    total: materials.length,
    skills: [...new Set(materials.flatMap(m => m.skills))].length,
  }), [materials]);

  const getScoreLabel = (score: number) => {
    if (score >= 85) return { text: "高匹配", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" };
    if (score >= 65) return { text: "中等匹配", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30" };
    return { text: "低匹配", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" };
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 md:py-14 animate-fade-in-up">
      {/* Hero Banner — Starry Sky */}
      <div className="relative mb-10 overflow-hidden rounded-3xl nebula-hero border border-white/10 p-6 md:p-8">
        <div className="shooting-star" /><div className="shooting-star" />
        <div className="constellation-dot" style={{top:'10%',left:'15%'}} />
        <div className="constellation-dot" style={{top:'20%',left:'35%'}} />
        <div className="constellation-dot" style={{top:'12%',left:'60%'}} />
        <div className="constellation-dot" style={{top:'25%',left:'78%'}} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[12px] text-blue-200">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              星光解析 · 智能匹配
            </div>
            <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-white">
              JD 智能解析
            </h1>
            <p className="text-[15px] text-blue-100/80 mt-1.5">
              粘贴岗位描述，AI 深度分析与你的素材库匹配度
            </p>
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0 bg-white/10 border-white/15 text-white hover:bg-white/20" onClick={() => setShowHistory(!showHistory)}>
              <History className="w-3.5 h-3.5" />
              {showHistory ? "收起历史" : `历史记录 (${history.length})`}
            </Button>
          )}
        </div>
      </div>

        {/* History Panel */}
        {showHistory && history.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-[#d2d2d7]/40 dark:border-[#38383a]/40 animate-fade-in-up">
            <h3 className="text-[14px] font-semibold text-apple-text dark:text-white mb-3">📋 分析历史</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.map((rec) => {
                const label = getScoreLabel(rec.result.matchScore);
                return (
                  <button
                    key={rec.id}
                    onClick={() => handleLoadHistory(rec)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-[#2c2c2e] transition-colors"
                  >
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${label.bg} ${label.color}`}>
                      {rec.result.matchScore}分
                    </span>
                    <span className="text-[13px] text-apple-text dark:text-white truncate flex-1">
                      {rec.result.portrait.title} · {rec.result.portrait.level}
                    </span>
                    <span className="text-[11px] text-apple-text-secondary shrink-0">{rec.createdAt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left: JD Input & Tools */}
        <div className="md:col-span-2 space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>📝 粘贴 JD</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-52 p-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:border-apple-blue placeholder:text-apple-text-secondary transition-colors"
                placeholder="在此粘贴岗位描述（Job Description）...&#10;&#10;支持：完整JD文本、岗位要求、技能清单"
                value={jd}
                onChange={(e) => { setJd(e.target.value); setResult(null); }}
              />
              <div className="flex gap-2 mt-3">
                <Button className="flex-1 gap-2" onClick={handleAnalyze} disabled={!jd.trim() || analyzing}>
                  <Sparkles className="w-4 h-4" />
                  {analyzing ? "分析中..." : "AI 智能分析"}
                </Button>
                {jd.trim() && (
                  <Button variant="ghost" size="sm" onClick={() => { setJd(""); setResult(null); }}>
                    清空
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Featured Demo JDs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[15px]">🔥 热门岗位体验</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {DEMO_JDS.map((demo, i) => (
                <button
                  key={i}
                  onClick={() => handleUseDemo(demo.text)}
                  className="w-full text-left p-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] hover:bg-white dark:hover:bg-[#2c2c2e] hover:border-apple-blue/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-semibold text-apple-text dark:text-white group-hover:text-apple-blue transition-colors">
                      {demo.title}
                    </span>
                    <span className="text-[11px] text-apple-text-secondary">{demo.salary}</span>
                  </div>
                  <p className="text-[12px] text-apple-text-secondary line-clamp-2">{demo.text}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[11px] text-apple-blue/60">{demo.company}</span>
                    <ArrowRight className="w-3 h-3 text-apple-blue/40 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Materials Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[15px]">📦 素材库概览</CardTitle>
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
              <Link href="/materials" className="mt-3 text-[12px] text-apple-blue hover:underline inline-flex items-center gap-1">
                管理素材库 <ArrowRight className="w-3 h-3" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right: Analysis Result */}
        <div className="md:col-span-3">
          {!result ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[450px]">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#e8f4fd] to-[#f4f1fa] dark:from-[#003366] dark:to-[#2d1445] flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-apple-blue" />
              </div>
              <p className="text-[16px] font-medium text-apple-text dark:text-white mb-2">开始分析岗位匹配度</p>
              <p className="text-[14px] text-apple-text-secondary mb-2">在左侧粘贴 JD 并点击分析</p>
              <p className="text-[13px] text-apple-text-secondary/60">或选择一个热门岗位快速体验</p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {["AI分析技能要求", "ATS关键词提取", "素材匹配度", "学习建议"].map((f) => (
                  <span key={f} className="text-[12px] px-3 py-1.5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary">
                    ✨ {f}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in-up">
              {/* Match Score Hero */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#e8f4fd] via-[#f0f0fa] to-[#f4f1fa] dark:from-[#003366] dark:via-[#1a1a3e] dark:to-[#2d1445] border border-[#0071e3]/10 dark:border-[#0071e3]/20 p-6 md:p-8">
                <div className="flex items-start gap-5 flex-wrap">
                  {/* Score Circle */}
                  <div className="relative shrink-0">
                    <svg className="w-[96px] h-[96px]" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className="text-[#d2d2d7]/30 dark:text-[#48484a]/30" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke="url(#scoreGrad2)" strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.matchScore / 100)}`}
                        className="origin-center -rotate-90"
                      />
                      <defs>
                        <linearGradient id="scoreGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0071e3" />
                          <stop offset="100%" stopColor="#8944ab" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[26px] font-bold text-apple-blue dark:text-[#409cff] leading-none">{result.matchScore}</span>
                      <span className="text-[11px] text-apple-blue/60">分</span>
                    </span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[13px] font-semibold px-3 py-1 rounded-full ${getScoreLabel(result.matchScore).bg} ${getScoreLabel(result.matchScore).color}`}>
                        {getScoreLabel(result.matchScore).text}
                      </span>
                      <span className="text-[12px] text-apple-text-secondary">{result.portrait.industry}</span>
                    </div>
                    <p className="text-[20px] font-semibold text-apple-text dark:text-white">
                      {result.portrait.title} · {result.portrait.level}
                    </p>
                    <p className="text-[14px] text-apple-text-secondary mt-1.5">
                      {result.matchScore >= 80 ? '🎯 匹配度较高，建议立即投递！' :
                       result.matchScore >= 65 ? '👍 有一定匹配度，可针对性补充技能后投递' :
                       result.matchScore >= 50 ? '📚 匹配度一般，建议积累相关经验后再投递' :
                       '⚠️ 匹配度较低，需大幅补充相关技能和经验'}
                    </p>
                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link href={`/interview?job=${encodeURIComponent(result.portrait.title)}`}>
                        <Button size="sm" className="gap-1.5 text-[12px]" variant="outline">
                          <MessageCircle className="w-3.5 h-3.5" /> 生成面试题
                        </Button>
                      </Link>
                      <Link href="/resume-builder">
                        <Button size="sm" className="gap-1.5 text-[12px]" variant="outline">
                          <Download className="w-3.5 h-3.5" /> 生成简历
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Background decoration */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#0071e3]/5 dark:bg-[#0071e3]/8 blur-3xl pointer-events-none" />
              </div>

              {/* Skills Radar Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-[17px] h-[17px] text-apple-purple" />
                      <CardTitle className="text-[15px]">核心技能要求</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.skills.length > 0 ? result.skills.map((s) => (
                        <Badge key={s} variant="primary" className="cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedGap(selectedGap === s ? null : s)}>
                          {s}
                        </Badge>
                      )) : (
                        <span className="text-[13px] text-apple-text-secondary">未检测到明确技能关键词</span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-[17px] h-[17px] text-apple-orange" />
                      <CardTitle className="text-[15px]">ATS 高频关键词</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.atsKeywords.length > 0 ? result.atsKeywords.map((k) => (
                        <Badge key={k} variant="warning">{k}</Badge>
                      )) : (
                        <span className="text-[13px] text-apple-text-secondary">从JD中提取关键词</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skill Gaps with Learning Resources */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-[17px] h-[17px] text-apple-red" />
                      <CardTitle className="text-[15px]">技能缺口分析 ({result.gaps.length}项)</CardTitle>
                    </div>
                    {result.gaps.length > 0 && (
                      <span className="text-[12px] text-apple-text-secondary">点击技能查看学习资源</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {result.gaps.length === 0 ? (
                    <div className="flex items-center gap-3 p-5 rounded-xl bg-[#e8f8ee] dark:bg-[#0a3622]">
                      <CheckCircle2 className="w-5 h-5 text-apple-green shrink-0" />
                      <div>
                        <span className="text-[14px] font-medium text-apple-green">所有核心技能均已覆盖</span>
                        <p className="text-[12px] text-apple-green/70 mt-0.5">你的素材库准备得很好！可以针对性地准备面试。</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {result.gaps.map((gap, i) => {
                        const resources = getLearningResource(gap);
                        const isSelected = selectedGap === gap;
                        return (
                          <div key={i}>
                            <div
                              className={`flex items-center justify-between p-4 rounded-xl bg-[#ffebee] dark:bg-[#3d1111] cursor-pointer hover:bg-[#ffcdd2] dark:hover:bg-[#4d1515] transition-colors ${isSelected ? 'ring-2 ring-apple-red/30' : ''}`}
                              onClick={() => setSelectedGap(isSelected ? null : gap)}
                            >
                              <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-apple-red shrink-0" />
                                <div>
                                  <span className="text-[14px] font-medium text-apple-red">{gap}</span>
                                  <p className="text-[12px] text-apple-red/70 mt-0.5">建议补充相关经历或学习资源</p>
                                </div>
                              </div>
                              <BookOpen className={`w-4 h-4 text-apple-red/50 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                            </div>
                            {isSelected && (
                              <div className="mt-1 p-4 rounded-xl bg-[#fff5e5] dark:bg-[#3d2900] border border-[#ff9f0a]/20 animate-fade-in-up">
                                <p className="text-[12px] font-semibold text-apple-orange mb-2 flex items-center gap-1.5">
                                  <Lightbulb className="w-3.5 h-3.5" /> 推荐学习资源
                                </p>
                                <ul className="space-y-1.5">
                                  {resources.map((r, ri) => (
                                    <li key={ri} className="text-[13px] text-apple-text dark:text-white flex items-start gap-2">
                                      <span className="text-[11px] text-apple-orange shrink-0 mt-0.5">▸</span>
                                      {r}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Matched Materials */}
              {result.matchedMaterials.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-[17px] h-[17px] text-apple-green" />
                        <CardTitle className="text-[15px]">匹配的素材 ({result.matchedMaterials.length}段)</CardTitle>
                      </div>
                      <span className="text-[12px] text-apple-text-secondary">
                        这些经历可用于此岗位的简历
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2.5">
                      {result.matchedMaterials.map((m) => (
                        <div key={m.id} className="flex items-start gap-3 p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-[#e8f8ee] dark:hover:bg-[#0a3622] transition-colors group">
                          <CheckCircle2 className="w-5 h-5 text-apple-green shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[14px] font-medium text-apple-text dark:text-white">{m.title}</span>
                            <p className="text-[12px] text-apple-text-secondary mt-1 line-clamp-2">{m.star.situation}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {m.skills.slice(0, 5).map(s => (
                                <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-[#e8f4fd] dark:bg-[#003366] text-apple-blue font-medium">
                                  {s}
                                </span>
                              ))}
                              {m.skills.length > 5 && (
                                <span className="text-[11px] text-apple-text-secondary">+{m.skills.length - 5}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Matched Materials Hint */}
              {result.matchedMaterials.length === 0 && (
                <div className="flex items-center gap-3 p-5 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#d2d2d7]/40 dark:border-[#38383a]/40">
                  <BarChart3 className="w-5 h-5 text-apple-text-secondary shrink-0" />
                  <div>
                    <p className="text-[14px] text-apple-text dark:text-white">暂无直接匹配的素材</p>
                    <p className="text-[12px] text-apple-text-secondary mt-0.5">
                      <Link href="/materials" className="text-apple-blue hover:underline">添加更多经历</Link> 以提高匹配度
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
