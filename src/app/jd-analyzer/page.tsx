"use client";

import { BrandButton } from "@/components/design-system/brand-button";
import { Search, Sparkles, History, ArrowRight, FileText } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useMaterials } from "@/lib/material-context";
import { analyzeJD, type JDAnalysisResult } from "@/lib/jd-analyzer";
import { materialsToResumeText } from "@/lib/tailored-resume";
import { JobAnalysisHub } from "@/components/talent/job-analysis-hub";
import { FeatureEmpty } from "@/components/system/feature-empty";
import { GlassPageHero } from "@/components/ui/glass-page-hero";
import { FeaturePageRoot, FeaturePageShell } from "@/components/layout/feature-page-shell";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";

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
  const { locale, t } = useLocale();
  const jdt = t.jdAnalyzer;
  const ca = t.commonActions;
  const { materials } = useMaterials();
  const [jd, setJd] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [result, setResult] = useState<JDAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedGap, setSelectedGap] = useState<string | null>(null);

  const materialsResumeText = useMemo(() => materialsToResumeText(materials), [materials]);

  const effectiveResumeContent = useMemo(() => {
    const pasted = resumeContent.trim();
    if (pasted.length >= 20) return pasted;
    return materialsResumeText;
  }, [resumeContent, materialsResumeText]);

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
    if (score >= 85) return { text: jdt.matchHigh, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" };
    if (score >= 65) return { text: jdt.matchMid, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30" };
    return { text: jdt.matchLow, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" };
  };

  return (
    <FeaturePageRoot>
      <GlassPageHero
        badge={
          <>
            <Sparkles className="w-3.5 h-3.5 text-volt" />
            {jdt.badge}
          </>
        }
        title={jdt.title}
        subtitle={jdt.subtitle}
        icon={Search}
        action={
          history.length > 0 ? (
            <BrandButton variant="outline-dark" size="sm" className="gap-1.5 shrink-0" onClick={() => setShowHistory(!showHistory)}>
              <History className="w-3.5 h-3.5" />
              {showHistory ? jdt.hideHistory : `${jdt.historyLabel} (${history.length})`}
            </BrandButton>
          ) : undefined
        }
      />

      <FeaturePageShell>
        {/* History Panel */}
        {showHistory && history.length > 0 && (
          <div className="mt-4 p-4 feature-panel-muted animate-fade-in-up">
            <h3 className="text-[14px] font-semibold text-ink mb-3">📋 {jdt.historyTitle}</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.map((rec) => {
                const label = getScoreLabel(rec.result.matchScore);
                return (
                  <button
                    key={rec.id}
                    onClick={() => handleLoadHistory(rec)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-surface-3 transition-colors"
                  >
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${label.bg} ${label.color}`}>
                      {rec.result.matchScore}{jdt.scoreUnit}
                    </span>
                    <span className="text-[13px] text-ink truncate flex-1">
                      {rec.result.portrait.title} · {rec.result.portrait.level}
                    </span>
                    <span className="text-[11px] text-apple-text-secondary shrink-0">{rec.createdAt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      <div className="jd-workspace">
        <div className="jd-workflow-bar">
          {[
            { label: jdt.pasteJd, active: !result },
            { label: jdt.aiAnalyze, active: analyzing },
            { label: result ? `${result.matchScore}${jdt.scoreUnit}` : jdt.emptyTitle, active: !!result },
          ].map((step) => (
            <span
              key={step.label}
              className={`jd-workflow-step${step.active ? " jd-workflow-step-active" : ""}`}
            >
              {step.label}
            </span>
          ))}
        </div>

        <div className="jd-workspace-body">
          <div className="jd-workspace-input space-y-4" data-lenis-prevent>
            <div>
              <label className="block text-[13px] font-semibold text-ink mb-2">{jdt.pasteJd}</label>
              <textarea
                className="w-full h-36 feature-field text-[14px] resize-y"
                placeholder={jdt.jdPlaceholder}
                value={jd}
                onChange={(e) => { setJd(e.target.value); setResult(null); }}
              />
              <div className="flex gap-2 mt-3">
                <BrandButton variant="volt" size="md" className="flex-1 gap-2" onClick={handleAnalyze} disabled={!jd.trim() || analyzing}>
                  <Sparkles className="w-4 h-4" />
                  {analyzing ? ca.analyzing : jdt.aiAnalyze}
                </BrandButton>
                {jd.trim() && (
                  <BrandButton variant="ghost" size="sm" onClick={() => { setJd(""); setResult(null); }}>
                    {ca.clear}
                  </BrandButton>
                )}
              </div>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-ink mb-2">🔥 {jdt.featuredDemos}</p>
              <div className="space-y-2">
                {DEMO_JDS.map((demo, i) => (
                  <button
                    key={i}
                    onClick={() => handleUseDemo(demo.text)}
                    className="w-full text-left p-3 rounded-xl feature-panel-muted hover:bg-surface-3 hover:border-volt/30 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[13px] font-semibold text-ink group-hover:text-volt transition-colors truncate">
                        {demo.title}
                      </span>
                      <span className="text-[10px] text-stone shrink-0">{demo.salary}</span>
                    </div>
                    <p className="text-[11px] text-stone line-clamp-1">{demo.company}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-ink mb-2">📦 {jdt.materialOverview}</p>
              <div className="flex gap-2">
                <div className="jd-stat-tile">
                  <div className="jd-stat-value">{materialStats.total}</div>
                  <div className="jd-stat-label">{jdt.experienceUnit}</div>
                </div>
                <div className="jd-stat-tile">
                  <div className="jd-stat-value">{materialStats.skills}</div>
                  <div className="jd-stat-label">{jdt.skillUnit}</div>
                </div>
              </div>
              <Link href="/materials" className="mt-2 text-[11px] text-volt hover:underline inline-flex items-center gap-1">
                {jdt.manageLibrary} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[12px] font-semibold text-ink mb-2">
                <FileText className="w-3.5 h-3.5 text-volt" />
                {jdt.resumeSource}
              </label>
              <textarea
                className="w-full h-24 feature-field text-[13px] resize-y"
                placeholder={jdt.resumePlaceholder}
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
              />
              {materialsResumeText && !resumeContent.trim() && (
                <p className="text-[11px] text-stone mt-1.5">
                  {jdt.resumeAutoLoadedPrefix} {materials.length} {jdt.resumeAutoLoadedSuffix}
                </p>
              )}
            </div>
          </div>

          <div className="jd-workspace-output" data-lenis-prevent>
            {!result ? (
              <FeatureEmpty
                page="jd-analyzer"
                title={jdt.emptyTitle}
                description={`${jdt.emptyDesc} ${jdt.emptyHint}`}
              />
            ) : (
              <JobAnalysisHub
                result={result}
                jdText={jd}
                resumeContent={effectiveResumeContent}
                onGapClick={(gap) => setSelectedGap(selectedGap === gap ? null : gap)}
                selectedGap={selectedGap}
                getLearningResource={getLearningResource}
              />
            )}
          </div>
        </div>
      </div>
    </FeaturePageShell>
    </FeaturePageRoot>
  );
}
