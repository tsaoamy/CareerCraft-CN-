'use client';

/**
 * 职航 — 智能岗位匹配分析
 */

import { useState, useEffect, useMemo } from 'react';
import { BrandButton } from '@/components/design-system/brand-button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { AUTH_TOKEN_KEY } from '@/lib/auth/constants';
import {
  Target, Search, BarChart3, Lightbulb, TrendingUp,
  Shield, ChevronRight, PieChart, Sparkles, Zap,
  MapPin, Building2, Upload, FileText, Loader2,
} from 'lucide-react';
import EChartsReact from 'echarts-for-react';
import { JOB_POSITIONS_SEED, getPositionById } from '@/data/job-positions';
import { buildPositionMatchResult } from '@/lib/match-engine';
import { readResumeFile, RESUME_FILE_ACCEPT } from '@/lib/resume-extract';
import { TailoredResumePanel } from '@/components/talent/tailored-resume-panel';
import { GlassPageHero } from '@/components/ui/glass-page-hero';
import { FeaturePageRoot, FeaturePageShell } from '@/components/layout/feature-page-shell';
import { FilterChip } from '@/components/system/system-card';
import { FeatureEmpty } from '@/components/system/feature-empty';
import { SystemInput } from '@/components/system/system-input';
import { useSystemFeedback } from '@/lib/feedback/use-system-feedback';
import { useLocale } from '@/lib/i18n/locale-context';
import { getJobIndustries, getIndustryLabel, getDefaultIndustryFilter, resolveIndustryFilter } from '@/lib/i18n/shared-labels';
import { resolveErrorMessage } from '@/lib/i18n/error-messages';
import type { MatchResult } from '@/lib/db/repositories/matching';

interface Position {
  id: string;
  title: string;
  company: string;
  department: string;
  industry: string;
  job_level: string;
  location: string;
  salary_range: string;
  jd_text: string;
  keywords: string;
}

export default function MatchingPage() {
  const { locale, t } = useLocale();
  const mp = t.matching;
  const ca = t.commonActions;
  const fb = useSystemFeedback();
  const industries = getJobIndustries(locale);
  const { resolvedTheme } = useTheme();
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [resumeContent, setResumeContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState(getDefaultIndustryFilter(locale));

  useEffect(() => {
    setIndustryFilter(getDefaultIndustryFilter(locale));
  }, [locale]);

  useEffect(() => {
    fetchPositions();
  }, []);

  async function fetchPositions() {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const res = await fetch('/api/talent/matching?type=positions', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setPositions(data.data as Position[]);
      } else {
        setPositions(JOB_POSITIONS_SEED as unknown as Position[]);
      }
    } catch {
      setPositions(JOB_POSITIONS_SEED as unknown as Position[]);
    }
  }

  async function handleResumeUpload(file: File) {
    setUploading(true);
    try {
      const text = await readResumeFile(file);
      setResumeContent(text);
      fb.success('uploadComplete');
    } catch (err) {
      fb.raw.error(resolveErrorMessage(err instanceof Error ? err.message : ca.uploadFailed, locale, ca.uploadFailed));
    } finally {
      setUploading(false);
    }
  }

  async function handleAnalyze() {
    if (!selectedPosition) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const res = await fetch('/api/talent/matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ positionId: selectedPosition, resumeContent }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        fb.success('analysisComplete');
      } else if (res.status === 401) {
        setResult(generateLocalResult(selectedPosition, resumeContent));
        fb.success('analysisComplete');
      } else {
        fb.raw.error(resolveErrorMessage(data.error || ca.analysisFailed, locale, ca.analysisFailed));
      }
    } catch {
      setResult(generateLocalResult(selectedPosition, resumeContent));
    } finally {
      setAnalyzing(false);
    }
  }

  const filteredPositions = useMemo(() => {
    const resolvedFilter = resolveIndustryFilter(locale, industryFilter);
    const allKey = industries[0];
    return positions.filter((p) => {
      const matchIndustry = industryFilter === allKey || p.industry === resolvedFilter;
      const q = searchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        getIndustryLabel(locale, p.industry).toLowerCase().includes(q);
      return matchIndustry && matchSearch;
    });
  }, [positions, industryFilter, searchTerm, locale, industries]);

  const selectedPos = positions.find((p) => p.id === selectedPosition);

  const chartAccent = resolvedTheme === 'dark' ? '#ff6224' : '#f54e00';

  const gapChartOption = result
    ? {
        tooltip: { trigger: 'axis' as const },
        legend: {
          data: [mp.requiredLevel, mp.currentLevel],
          bottom: 0,
          textStyle: { fontSize: 11, color: resolvedTheme === 'dark' ? '#c4c8d0' : '#6b6b6b' },
        },
        radar: {
          indicator: result.skill_gaps.map((g) => ({ name: g.skill, max: 10 })),
          center: ['50%', '50%'],
          radius: '62%',
          axisName: { color: resolvedTheme === 'dark' ? '#8b919e' : '#6b6b6b' },
          splitLine: { lineStyle: { color: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.08)' } },
          axisLine: { lineStyle: { color: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(26,26,26,0.12)' } },
        },
        series: [
          {
            type: 'radar' as const,
            data: [
              {
                value: result.skill_gaps.map((g) => g.required_level),
                name: mp.requiredLevel,
                lineStyle: { color: '#ff375f' },
                areaStyle: { color: 'rgba(255,55,95,0.12)' },
              },
              {
                value: result.skill_gaps.map((g) => g.current_level),
                name: mp.currentLevel,
                lineStyle: { color: chartAccent },
                areaStyle: { color: resolvedTheme === 'dark' ? 'rgba(155,184,50,0.18)' : 'rgba(122,158,18,0.15)' },
              },
            ],
          },
        ],
      }
    : null;

  return (
    <FeaturePageRoot>
      <GlassPageHero
        badge={
          <>
            <Sparkles className="w-3.5 h-3.5 text-volt" />
            {mp.badgePrefix} {positions.length} {mp.badgeSuffix}
          </>
        }
        title={mp.title}
        subtitle={mp.subtitle}
        icon={Target}
      />

      <FeaturePageShell tight>
        <div className="flex flex-wrap gap-2 mb-6">
          {industries.map((ind) => (
            <FilterChip
              key={ind}
              active={industryFilter === ind}
              onClick={() => setIndustryFilter(ind)}
            >
              {ind}
            </FilterChip>
          ))}
        </div>

        <div className="apple-card p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 岗位选择 */}
            <div>
              <label className="block text-[14px] font-semibold text-ink mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-volt" />
                {mp.targetRole}
                <span className="text-[12px] font-normal text-apple-text-secondary">
                  {mp.availableCountOpen}{filteredPositions.length}{mp.availableCountClose}
                </span>
              </label>
              <div className="mb-3">
                <SystemInput
                  icon={<Search className="w-4 h-4" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={mp.searchPlaceholder}
                />
              </div>
              <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredPositions.length === 0 ? (
                  <FeatureEmpty page="matching-positions" compact title={mp.noPositions} />
                ) : (
                  filteredPositions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPosition(p.id)}
                      className={cn(
                        'w-full text-left px-4 py-4 rounded-xl text-sm transition-all duration-200 border',
                        selectedPosition === p.id
                          ? 'match-item-selected'
                          : 'border-transparent hover:bg-surface-2'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-[14px] text-ink leading-snug">
                            {p.title}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-[12px] text-volt font-medium">
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            {p.company}
                          </div>
                          <div className="text-[11px] text-apple-text-secondary mt-1 line-clamp-1">
                            {p.department}
                          </div>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-2 border border-hairline text-stone shrink-0">
                          {getIndustryLabel(locale, p.industry)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-apple-text-secondary">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {p.location || ca.tbd}
                        </span>
                        <span>{p.job_level}</span>
                        <span className="text-apple-green font-medium">{p.salary_range}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* JD + 简历 */}
            <div>
              {selectedPos ? (
                <div className="mb-5 p-5 rounded-2xl feature-panel-muted">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[11px] font-semibold text-volt uppercase tracking-wider">
                      {mp.jdLabel}
                    </div>
                    <span className="text-[11px] text-apple-text-secondary">{selectedPos.job_level}</span>
                  </div>
                  <div className="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                    <pre className="text-[13px] text-ink/90 whitespace-pre-wrap leading-relaxed font-sans">
                      {selectedPos.jd_text}
                    </pre>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-hairline">
                    {parseKeywords(selectedPos.keywords).map((k, i) => (
                      <span
                        key={i}
                        className="match-keyword-chip"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-5">
                  <FeatureEmpty page="matching" compact title={mp.selectRoleHint} />
                </div>
              )}

              <label className="block text-[14px] font-semibold text-ink mb-3">
                {mp.resumeContent}
              </label>
              <div className="flex gap-2 mb-3">
                <label className="inline-flex items-center gap-2 h-9 px-4 rounded-full text-[12px] font-medium feature-chip cursor-pointer hover:text-ink">
                  {uploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  {mp.uploadResume}
                  <input
                    type="file"
                    accept={RESUME_FILE_ACCEPT}
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleResumeUpload(f);
                      e.target.value = '';
                    }}
                  />
                </label>
                <span className="text-[11px] text-apple-text-secondary self-center flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {mp.orPaste}
                </span>
              </div>
              <textarea
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 feature-field text-[14px] resize-none"
                placeholder={mp.resumePlaceholder}
              />

              <BrandButton
                variant="volt"
                size="md"
                type="button"
                onClick={handleAnalyze}
                disabled={!selectedPosition || analyzing}
                className="mt-4 w-full gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {mp.aiAnalyzing}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {mp.startAnalysis}
                  </>
                )}
              </BrandButton>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreCard icon={Target} label={mp.matchScore} value={`${result.match_score}%`} tone="purple" />
              <ScoreCard icon={BarChart3} label={mp.keywordCoverage} value={`${result.keyword_coverage}%`} tone="info" />
              <ScoreCard icon={Shield} label={mp.competitiveness} value={`${result.competitiveness_score}%`} tone="success" />
              <ScoreCard icon={TrendingUp} label={mp.skillGaps} value={`${result.skill_gaps.length}`} tone="warn" suffix={mp.gapUnit} />
            </div>

            {gapChartOption && (
              <div className="apple-card p-6 max-w-2xl mx-auto w-full">
                <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-volt" />
                  {mp.gapChart}
                </h3>
                <EChartsReact option={gapChartOption} style={{ height: 320 }} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="apple-card p-6">
                <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-apple-orange" />
                  {mp.optimizationTips}
                </h3>
                <ul className="space-y-3">
                  {result.optimization_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] text-apple-text-secondary leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-volt mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="apple-card p-6">
                <h3 className="font-semibold text-ink mb-4">{mp.recommendedRoles}</h3>
                <div className="space-y-2.5">
                  {result.top5_positions.map((pos, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 rounded-xl feature-panel-muted">
                      <div>
                        <div className="font-medium text-[14px] text-ink">{pos.title}</div>
                        <div className="text-[12px] text-apple-text-secondary">{pos.company}</div>
                      </div>
                      <span className="text-[15px] font-bold text-volt">{pos.match_score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="apple-card p-6">
              <h3 className="font-semibold text-ink mb-5">{mp.growthPath}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.growth_path.map((step) => (
                  <div key={step.step} className="p-4 rounded-2xl feature-panel-muted">
                    <div className="match-step-num mb-3">
                      {step.step}
                    </div>
                    <div className="text-[14px] font-medium text-ink mb-1 leading-snug">
                      {step.description}
                    </div>
                    <div className="text-[12px] text-apple-text-secondary">{step.timeframe}</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPos && (
              <TailoredResumePanel
                resumeContent={resumeContent}
                jobTitle={selectedPos.title}
                company={selectedPos.company}
                jdText={selectedPos.jd_text}
                jdKeywords={parseKeywords(selectedPos.keywords)}
                emptyHint={mp.tailoredEmptyHint}
              />
            )}
          </div>
        )}
      </FeaturePageShell>
    </FeaturePageRoot>
  );
}

function parseKeywords(raw: string | unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function generateLocalResult(positionId: string, resumeContent: string): MatchResult {
  const position = getPositionById(positionId);
  return buildPositionMatchResult(positionId, resumeContent, position, JOB_POSITIONS_SEED);
}

function ScoreCard({
  icon: Icon,
  label,
  value,
  tone,
  suffix = '',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: 'volt' | 'info' | 'success' | 'warn' | 'purple';
  suffix?: string;
}) {
  return (
    <div className={cn('match-stat', `match-stat-${tone}`)}>
      <Icon className="match-stat-icon w-5 h-5 mb-3" />
      <div className="match-stat-value text-[28px] font-bold leading-none">
        {value}
        {suffix}
      </div>
      <div className="match-stat-label">{label}</div>
    </div>
  );
}
