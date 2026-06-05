"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  Briefcase,
  FileText,
  FolderOpen,
  MessageCircle,
  Search,
  Sparkles,
  Target,
  Upload,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { CategoryIcon } from "@/components/materials/category-icon";
import { easeBrand } from "@/components/design-system/motion";
import { useLocale } from "@/lib/i18n/locale-context";
import { formatDisplayName } from "@/lib/i18n/translations";
import { getCategoryLabels } from "@/lib/i18n/shared-labels";
import { useUserProfile } from "@/lib/user-profile-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import type { Material, MaterialCategory } from "@/types/material";
import type { JobApplication } from "@/types/application";

interface WorkspaceCommandCenterProps {
  materials: Material[];
  materialsCount: number;
  applications: JobApplication[];
  applicationsTotal: number;
  interviewRate: number;
  avgMatch: string;
  wishlistCount: number;
  categoryBreakdown: { category: MaterialCategory; count: number }[];
  recommendedSkills: { skill: string; level: string; urgency: "high" | "medium" | "low" }[];
}

function fillTemplate(template: string, vars: Record<string, string | number>) {
  return Object.entries(vars).reduce(
    (acc, [key, val]) => acc.replace(new RegExp(`\\{${key}\\}`, "g"), String(val)),
    template
  );
}

function getGreetingKey(hour: number) {
  if (hour < 12) return "workspaceGreetingMorning" as const;
  if (hour < 18) return "workspaceGreetingAfternoon" as const;
  return "workspaceGreetingEvening" as const;
}

function computeProfileProgress(materialsCount: number, applicationsTotal: number) {
  const base = Math.min(Math.round((materialsCount / 8) * 70), 70);
  const apps = applicationsTotal > 0 ? Math.min(applicationsTotal * 3, 30) : 0;
  return Math.min(base + apps, 100);
}

function computeHealthScore(
  materialsCount: number,
  applicationsTotal: number,
  interviewRate: number,
  avgMatchNum: number | null
) {
  const m = Math.min(materialsCount / 8, 1) * 35;
  const a = Math.min(applicationsTotal / 10, 1) * 25;
  const i = (interviewRate / 100) * 25;
  const match = avgMatchNum != null ? (avgMatchNum / 100) * 15 : 0;
  return Math.round(m + a + i + match);
}

function RadialScore({
  value,
  max = 100,
  size = 88,
  stroke = 6,
  gradientId,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  gradientId: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(value, max) / max);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-[var(--border-subtle)]"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="origin-center -rotate-90"
        style={{ transformOrigin: "center" }}
      />
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f54e00" />
          <stop offset="100%" stopColor="#ff6224" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PanelLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function QuickChip({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link href={href} className="workspace-quick-chip">
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
      {label}
    </Link>
  );
}

export function WorkspaceCommandCenter({
  materials,
  materialsCount,
  applications,
  applicationsTotal,
  interviewRate,
  avgMatch,
  wishlistCount,
  categoryBreakdown,
  recommendedSkills,
}: WorkspaceCommandCenterProps) {
  const { locale, t } = useLocale();
  const d = t.dashboard;
  const categoryLabels = getCategoryLabels(locale);
  const { profile } = useUserProfile();
  const { user } = useAuth();
  const router = useRouter();

  const displayName = formatDisplayName(
    profile.displayName || user?.username || (locale === "zh" ? "求职者" : "there"),
    locale
  );

  const [hour, setHour] = useState(10);
  useEffect(() => setHour(new Date().getHours()), []);

  const greeting = fillTemplate(d[getGreetingKey(hour)], { name: displayName });

  const profileProgress = computeProfileProgress(materialsCount, applicationsTotal);
  const avgMatchNum = avgMatch.endsWith("%") ? parseInt(avgMatch, 10) : null;
  const healthScore = computeHealthScore(
    materialsCount,
    applicationsTotal,
    interviewRate,
    avgMatchNum
  );

  const healthLabel =
    healthScore >= 70
      ? d.workspaceHealthStrong
      : healthScore >= 40
        ? d.workspaceHealthGrowing
        : d.workspaceHealthStart;

  const previewMaterials = useMemo(
    () => [...materials].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4),
    [materials]
  );

  const timelineItems = useMemo(() => {
    const items: { title: string; time: string; type: string }[] = [];

    materials.slice(0, 2).forEach((m) => {
      items.push({
        title: `${m.title} · ${d.workspaceTimelineMaterial}`,
        time: new Date(m.updatedAt).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US"),
        type: "material",
      });
    });

    applications.slice(0, 2).forEach((app) => {
      items.push({
        title: `${app.title} @ ${app.company} · ${d.workspaceTimelineApplication}`,
        time: app.updatedAt?.slice(0, 10) ?? app.appliedAt ?? "—",
        type: "app",
      });
    });

    if (items.length < 4) {
      items.push({
        title: d.feedAnalysis,
        time: d.recentAnalysis,
        type: "analysis",
      });
    }
    if (items.length < 4) {
      items.push({
        title: d.feedInterview,
        time: "2h",
        type: "interview",
      });
    }

    return items.slice(0, 5);
  }, [materials, applications, d, locale]);

  const weekBars = useMemo(() => {
    const base = Math.max(materialsCount, 1);
    return [0.45, 0.62, 0.38, 0.71, 0.55, 0.82, 0.68].map((f, i) =>
      Math.round(f * base * (i === 6 ? 1.1 : 1))
    );
  }, [materialsCount]);

  const maxBar = Math.max(...weekBars, 1);
  const activeCategories = categoryBreakdown.filter((c) => c.count > 0);
  const matchPreview = avgMatchNum ?? 87;
  const gapSkills = recommendedSkills.filter((s) => s.urgency === "high").slice(0, 3);

  const workflowSteps =
    locale === "zh"
      ? ["素材", "分析", "定制", "投递"]
      : ["Materials", "Analyze", "Tailor", "Apply"];

  const activeStep = applicationsTotal > 0 ? 3 : materialsCount >= 3 ? 2 : materialsCount > 0 ? 1 : 0;

  return (
    <div className="workspace-command">
      <div className="workspace-command-inner">
        {/* Hero workspace */}
        <section className="workspace-hero">
          <div className="workspace-hero-glow" aria-hidden />
          <div className="workspace-hero-grid">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-stone mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-volt animate-pulse" />
                {d.badge}
              </p>
              <h1 className="workspace-title">{d.workspaceCommandTitle}</h1>
              <p className="workspace-greeting">{greeting}</p>

              <div className="workspace-meta-row">
                <span>
                  <FolderOpen className="w-3.5 h-3.5 text-volt" />
                  {fillTemplate(d.workspaceEmbeddedApps, { count: applicationsTotal })}
                </span>
                <span>
                  <Target className="w-3.5 h-3.5 text-volt" />
                  {fillTemplate(d.workspaceEmbeddedInterview, { rate: interviewRate })}
                </span>
                <span>
                  <Zap className="w-3.5 h-3.5 text-volt" />
                  {fillTemplate(d.workspaceEmbeddedMatch, { match: avgMatch })}
                </span>
              </div>

              <div className="workspace-progress-block">
                <div className="workspace-progress-label">
                  <span>{d.workspaceProgress}</span>
                  <span className="tabular-nums font-medium text-ink">{profileProgress}%</span>
                </div>
                <div className="workspace-progress-track">
                  <motion.div
                    className="workspace-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${profileProgress}%` }}
                    transition={{ duration: 0.8, ease: easeBrand }}
                  />
                </div>
              </div>

              <div className="workspace-ai-status">
                <Brain className="w-3.5 h-3.5" strokeWidth={1.5} />
                {d.workspaceAiActive}
              </div>
            </div>

            <div className="workspace-insight-panel">
              <div className="workspace-insight-orbit" aria-hidden>
                <div className="workspace-insight-orbit-ring">
                  <span className="workspace-insight-orbit-dot" />
                </div>
              </div>
              <div>
                <p className="workspace-insight-title">{d.workspaceLiveInsight}</p>
                <p className="workspace-insight-body">{d.feedRecommend}</p>
              </div>
              <div className="workspace-insight-actions">
                <QuickChip href="/resume-builder" icon={Sparkles} label={d.workspaceQuickResume} />
                <QuickChip href="/jd-analyzer" icon={Search} label={d.workspaceQuickAnalyze} />
                <QuickChip href="/interview" icon={MessageCircle} label={d.workspaceQuickInterview} />
                <QuickChip href="/materials" icon={Upload} label={d.workspaceQuickUpload} />
              </div>
            </div>
          </div>
        </section>

        {/* Main grid 8 + 4 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
          <main className="xl:col-span-8 space-y-6">
            {/* Resume Studio — dominant panel */}
            <PanelLink href="/resume-builder" className="workspace-panel workspace-panel-hero block group">
              <div className="workspace-panel-header">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="workspace-icon-shell w-11 h-11">
                    <Sparkles className="w-5 h-5" strokeWidth={1.25} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="workspace-card-title">{d.workspaceResumeStudio}</h2>
                    <p className="workspace-card-desc">{d.workspaceResumeStudioDesc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone group-hover:text-volt group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-1" />
              </div>
              <div className="workspace-panel-body">
                <div className="workspace-workflow-viz">
                  {workflowSteps.map((step, i) => (
                    <div
                      key={step}
                      className={`workspace-workflow-step${i <= activeStep ? " workspace-workflow-step-active" : ""}`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <p className="text-[13px] text-stone mt-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-volt animate-pulse" />
                  {materialsCount > 0 ? d.workspaceAiProcessing : d.workspaceAiReady}
                  <span className="text-ink font-medium ml-1">
                    · {materialsCount} {locale === "zh" ? "段经历" : "experiences"}
                  </span>
                </p>
              </div>
            </PanelLink>

            {/* JD Intelligence */}
            <PanelLink href="/jd-analyzer" className="workspace-panel block group">
              <div className="workspace-panel-header">
                <div className="flex items-start gap-3">
                  <div className="workspace-icon-shell w-10 h-10">
                    <Search className="w-4 h-4" strokeWidth={1.25} />
                  </div>
                  <div>
                    <h2 className="workspace-card-title">{d.workspaceJdIntelligence}</h2>
                    <p className="workspace-card-desc">{d.workspaceJdIntelligenceDesc}</p>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-volt shrink-0">{d.workspaceRunAnalysis}</span>
              </div>
              <div className="workspace-panel-body">
                <div className="workspace-jd-split">
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-2 border border-hairline-soft">
                    <div className="workspace-match-ring">
                      <RadialScore value={matchPreview} gradientId="ws-match" />
                      <div className="workspace-match-value">
                        {matchPreview}
                        <span className="text-[10px] text-stone font-normal">%</span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink">{d.workspaceMatchPreview}</p>
                      <p className="text-[12px] text-stone mt-0.5">{d.feedAnalysis}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-2 border border-hairline-soft">
                    <p className="text-[12px] font-medium text-ink mb-2">{d.workspaceGapDetected}</p>
                    <div className="workspace-gap-list">
                      {gapSkills.length > 0 ? (
                        gapSkills.map((s) => (
                          <span key={s.skill} className="workspace-gap-tag">
                            {s.skill}
                          </span>
                        ))
                      ) : (
                        recommendedSkills.slice(0, 3).map((s) => (
                          <span key={s.skill} className="workspace-gap-tag">
                            {s.skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </PanelLink>

            {/* Career Timeline */}
            <div className="workspace-panel">
              <div className="workspace-panel-header">
                <div className="flex items-center gap-3">
                  <div className="workspace-icon-shell w-10 h-10">
                    <Activity className="w-4 h-4" strokeWidth={1.25} />
                  </div>
                  <h2 className="workspace-card-title">{d.workspaceTimeline}</h2>
                </div>
              </div>
              <div className="workspace-panel-body pt-0">
                <div className="workspace-timeline">
                  {timelineItems.map((item, i) => (
                    <div key={`${item.type}-${i}`} className="workspace-timeline-item">
                      <span className="workspace-timeline-dot" />
                      <p className="workspace-timeline-text">{item.title}</p>
                      <p className="workspace-timeline-time">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Material preview */}
            <div className="workspace-panel">
              <div className="workspace-panel-header">
                <div className="flex items-center gap-3">
                  <div className="workspace-icon-shell w-10 h-10">
                    <FolderOpen className="w-4 h-4" strokeWidth={1.25} />
                  </div>
                  <h2 className="workspace-card-title">{d.workspaceMaterialPreview}</h2>
                </div>
                <Link href="/materials" className="text-[12px] font-medium text-volt hover:underline shrink-0">
                  {d.workspaceViewAll}
                </Link>
              </div>
              <div className="workspace-panel-body pt-0">
                {previewMaterials.map((m) => (
                  <div key={m.id} className="workspace-material-row">
                    <CategoryIcon category={m.category} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-ink truncate">{m.title}</p>
                      <p className="text-[11px] text-stone">
                        {categoryLabels[m.category]}
                        {m.skills.length > 0 && ` · ${m.skills.slice(0, 2).join(", ")}`}
                      </p>
                    </div>
                    <span className="text-[11px] text-stone tabular-nums shrink-0">
                      {m.skills.length} {locale === "zh" ? "技能" : "skills"}
                    </span>
                  </div>
                ))}
                {activeCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-hairline-soft">
                    {activeCategories.map((c) => (
                      <span
                        key={c.category}
                        className="text-[11px] px-2 py-1 rounded-pill bg-surface-2 border border-hairline-soft text-stone"
                      >
                        {categoryLabels[c.category]} <span className="text-ink font-medium">{c.count}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* AI Intelligence sidebar */}
          <aside className="xl:col-span-4 workspace-sidebar">
            <p className="workspace-sidebar-label">{d.workspaceIntelligenceCenter}</p>

            <div className="workspace-panel p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-ink">{d.activityFeed}</span>
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-volt uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-volt animate-pulse" />
                  Live
                </span>
              </div>
              <div>
                {[
                  { icon: Search, title: d.feedAnalysis, time: d.recentAnalysis, highlight: true },
                  { icon: Sparkles, title: d.feedRecommend, time: d.aiRecommendations },
                  { icon: MessageCircle, title: d.feedInterview, time: "2h" },
                  {
                    icon: Activity,
                    title: fillTemplate(d.feedSystem, { count: materialsCount }),
                    time: d.systemStatus,
                  },
                ].map((item, i) => (
                  <div key={i} className="workspace-feed-item">
                    <div
                      className={`workspace-icon-shell w-8 h-8${item.highlight ? "" : " !bg-surface-2 !border-hairline-soft !text-stone"}`}
                    >
                      <item.icon className="w-3.5 h-3.5" strokeWidth={1.25} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-ink leading-snug">{item.title}</p>
                      <p className="text-[11px] text-stone mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="workspace-panel p-4 text-center">
              <p className="text-[13px] font-medium text-ink mb-1">{d.workspaceCareerHealth}</p>
              <div className="workspace-health-ring">
                <RadialScore value={healthScore} gradientId="ws-health" size={96} stroke={7} />
                <div className="workspace-health-value">
                  <span className="workspace-health-score">{healthScore}</span>
                  <span className="workspace-health-caption">{healthLabel}</span>
                </div>
              </div>
              <p className="text-[11px] text-stone">
                {fillTemplate(d.workspaceEmbeddedMatch, { match: avgMatch })}
              </p>
            </div>

            <div className="workspace-panel p-4">
              <p className="text-[13px] font-medium text-ink">{d.workspaceWeeklyProgress}</p>
              <p className="text-[11px] text-stone mt-0.5">{d.workspaceWeekLabel}</p>
              <div className="workspace-week-bars">
                {weekBars.map((h, i) => (
                  <div
                    key={i}
                    className={`workspace-week-bar${i === 6 ? " workspace-week-bar-active" : ""}`}
                    style={{ height: `${Math.max(12, (h / maxBar) * 100)}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="workspace-panel p-4">
              <p className="text-[13px] font-medium text-ink mb-3">{d.quickActions}</p>
              <div className="workspace-sidebar-actions">
                <Link href="/materials" className="workspace-sidebar-action">
                  <Upload className="w-4 h-4 text-volt" strokeWidth={1.25} />
                  {d.workspaceQuickUpload}
                </Link>
                <Link href="/jd-analyzer" className="workspace-sidebar-action">
                  <Briefcase className="w-4 h-4 text-volt" strokeWidth={1.25} />
                  {d.workspaceQuickAnalyze}
                </Link>
                <Link href="/interview" className="workspace-sidebar-action">
                  <MessageCircle className="w-4 h-4 text-volt" strokeWidth={1.25} />
                  {d.workspaceQuickInterview}
                </Link>
                <Link href="/resume-builder" className="workspace-sidebar-action">
                  <FileText className="w-4 h-4 text-volt" strokeWidth={1.25} />
                  {d.workspaceQuickResume}
                </Link>
              </div>
              {wishlistCount > 0 && (
                <p className="text-[11px] text-stone mt-3 text-center">
                  {wishlistCount} {d.statWishlistCaption}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use WorkspaceCommandCenter */
export function DashboardConsole(props: WorkspaceCommandCenterProps) {
  return <WorkspaceCommandCenter {...props} />;
}

export type { WorkspaceCommandCenterProps as DashboardConsoleProps };
