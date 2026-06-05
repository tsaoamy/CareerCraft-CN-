'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Target, Zap, AlertCircle, CheckCircle2, TrendingUp, BookOpen,
  FileText, MessageCircle, ClipboardList, Sparkles, Plus, ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { JDAnalysisResult } from '@/lib/jd-analyzer';
import { TailoredResumePanel } from '@/components/talent/tailored-resume-panel';
import { useApplications } from '@/lib/application-context';
import {
  getLikelyQuestionsForJob,
  prepTopics,
  DIMENSION_LABELS,
  type InterviewDimension,
  type InterviewLanguage,
} from '@/data/interview-prep';
import { useLocale } from '@/lib/i18n/locale-context';
import { getPlatformLabels, getStatusLabels } from '@/lib/i18n/shared-labels';

type HubTab = 'analysis' | 'resume' | 'interview' | 'track';

import type { ApplicationPlatform, ApplicationStatus } from '@/types/application';

const RESUME_TEMPLATE_IDS = ['modern', 'classic', 'tech'] as const;

interface JobAnalysisHubProps {
  result: JDAnalysisResult;
  jdText: string;
  resumeContent: string;
  jobTitle?: string;
  company?: string;
  onGapClick?: (gap: string) => void;
  selectedGap?: string | null;
  getLearningResource?: (skill: string) => string[];
}

function getScoreLabel(score: number, hub: { matchHigh: string; matchMid: string; matchLow: string }) {
  if (score >= 85) return { text: hub.matchHigh, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
  if (score >= 65) return { text: hub.matchMid, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
  return { text: hub.matchLow, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
}

export function JobAnalysisHub({
  result,
  jdText,
  resumeContent,
  jobTitle,
  company,
  onGapClick,
  selectedGap,
  getLearningResource,
}: JobAnalysisHubProps) {
  const { locale, t } = useLocale();
  const hub = t.jobHub;
  const platformLabels = getPlatformLabels(locale);
  const statusLabels = getStatusLabels(locale);
  const [tab, setTab] = useState<HubTab>('analysis');
  const [template, setTemplate] = useState<string>('modern');
  const [prepDimension, setPrepDimension] = useState<InterviewDimension>('behavioral');
  const [prepLang, setPrepLang] = useState<InterviewLanguage>('zh');
  const { addApplication } = useApplications();

  const title = jobTitle ?? result.portrait.title;
  const scoreLabel = getScoreLabel(result.matchScore, hub);
  const likelyQuestions = getLikelyQuestionsForJob(title, prepDimension, prepLang);

  const resumeTemplates = RESUME_TEMPLATE_IDS.map((id) => ({
    id,
    label: hub.resumeTemplates[id].label,
    desc: hub.resumeTemplates[id].desc,
  }));

  const [trackForm, setTrackForm] = useState({
    company: company ?? '',
    title,
    platform: 'boss' as ApplicationPlatform,
    status: 'wishlist' as ApplicationStatus,
    notes: '',
  });
  const [trackSaved, setTrackSaved] = useState(false);

  const tabs: { id: HubTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'analysis', label: hub.tabAnalysis, icon: Target },
    { id: 'resume', label: hub.tabResume, icon: FileText },
    { id: 'interview', label: hub.tabInterview, icon: MessageCircle },
    { id: 'track', label: hub.tabTrack, icon: ClipboardList },
  ];

  function handleSaveTrack() {
    addApplication({
      company: trackForm.company || hub.notFilledCompany,
      title: trackForm.title,
      platform: trackForm.platform,
      status: trackForm.status,
      jdText: jdText.slice(0, 2000),
      matchScore: result.matchScore,
      notes: trackForm.notes,
      appliedAt: trackForm.status !== 'wishlist' ? new Date().toISOString().slice(0, 10) : undefined,
    });
    setTrackSaved(true);
    setTimeout(() => setTrackSaved(false), 3000);
  }

  const interviewUrl = `/interview?job=${encodeURIComponent(title)}&dimension=${prepDimension}&lang=${prepLang}`;

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Score hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accent-soft)] via-surface-2 to-surface-3 border border-[var(--chip-selected-border)] p-5 md:p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="relative shrink-0">
            <svg className="w-[88px] h-[88px]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className="text-[#d2d2d7]/30" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="url(#hubGrad)" strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.matchScore / 100)}`}
                className="origin-center -rotate-90"
              />
              <defs>
                <linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f54e00" />
                  <stop offset="100%" stopColor="#ff6224" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[24px] font-bold text-volt leading-none">{result.matchScore}</span>
              <span className="text-[10px] text-stone">{hub.scoreUnit}</span>
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${scoreLabel.bg} ${scoreLabel.color}`}>
                {scoreLabel.text}
              </span>
              <span className="text-[12px] text-apple-text-secondary">{result.portrait.industry}</span>
            </div>
            <p className="text-[18px] font-semibold text-apple-text dark:text-white">
              {title}{company ? ` · ${company}` : ''} · {result.portrait.level}
            </p>
            <p className="text-[13px] text-apple-text-secondary mt-1.5">
              {hub.hubSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex flex-wrap gap-2 p-1 rounded-xl bg-surface-2 border border-hairline-soft">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
              tab === id
                ? 'feature-chip feature-chip-active shadow-sm'
                : 'feature-chip'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'analysis' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="apple-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-volt" />
                <h4 className="font-semibold text-[14px]">{hub.coreSkills}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.skills.map((s) => (
                  <Badge key={s} variant="primary">{s}</Badge>
                ))}
              </div>
            </div>
            <div className="apple-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-apple-orange" />
                <h4 className="font-semibold text-[14px]">{hub.atsKeywords}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.atsKeywords.map((k) => (
                  <Badge key={k} variant="warning">{k}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="apple-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-apple-red" />
              <h4 className="font-semibold text-[14px]">{hub.skillGaps} ({result.gaps.length} {hub.skillGapsUnit})</h4>
            </div>
            {result.gaps.length === 0 ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#e8f8ee] dark:bg-[#0a3622]/40">
                <CheckCircle2 className="w-5 h-5 text-apple-green" />
                <span className="text-[14px] text-apple-green">{hub.allSkillsCovered}</span>
              </div>
            ) : (
              <div className="space-y-2">
                {result.gaps.map((gap) => (
                  <div key={gap}>
                    <button
                      type="button"
                      onClick={() => onGapClick?.(gap)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl bg-[#ffebee] dark:bg-[#3d1111]/60 text-left transition-colors hover:bg-[#ffcdd2] dark:hover:bg-[#4d1515] ${selectedGap === gap ? 'ring-2 ring-apple-red/30' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-apple-red" />
                        <span className="text-[14px] font-medium text-apple-red">{gap}</span>
                      </div>
                      <BookOpen className="w-4 h-4 text-apple-red/50" />
                    </button>
                    {selectedGap === gap && getLearningResource && (
                      <div className="mt-1 p-3 rounded-xl bg-[#fff5e5] dark:bg-[#3d2900]/40 text-[12px]">
                        <p className="font-semibold text-apple-orange mb-1">{hub.recommendedLearning}</p>
                        <ul className="space-y-1">
                          {getLearningResource(gap).map((r, i) => (
                            <li key={i} className="text-apple-text-secondary">▸ {r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {result.matchedMaterials.length > 0 && (
            <div className="apple-card p-5">
              <h4 className="font-semibold text-[14px] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-apple-green" />
                {hub.matchedMaterials} ({result.matchedMaterials.length})
              </h4>
              <div className="space-y-2">
                {result.matchedMaterials.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
                    <div className="font-medium text-[13px]">{m.title}</div>
                    <div className="text-[11px] text-apple-text-secondary mt-1 line-clamp-2">{m.star.situation || m.rawContent}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="volt" onClick={() => setTab('resume')} className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {hub.nextResume}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setTab('interview')} className="gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> {hub.nextInterview}
            </Button>
          </div>
        </div>
      )}

      {tab === 'resume' && (
        <div className="space-y-4">
          <div className="apple-card p-4">
            <h4 className="text-[13px] font-semibold mb-3">{hub.templateStyle}</h4>
            <div className="grid sm:grid-cols-3 gap-2">
              {resumeTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplate(tpl.id)}
                  className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                    template === tpl.id
                      ? 'border-[var(--chip-selected-border)] bg-[var(--chip-selected-bg)]'
                      : 'border-transparent bg-surface-2 hover:border-[var(--chip-selected-border)]'
                  }`}
                >
                  <div className="text-[13px] font-semibold">{tpl.label}</div>
                  <div className="text-[11px] text-apple-text-secondary mt-0.5">{tpl.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <TailoredResumePanel
            resumeContent={resumeContent}
            jobTitle={title}
            company={company}
            jdText={jdText}
            jdKeywords={[...result.skills, ...result.atsKeywords]}
            emptyHint={hub.tailoredEmptyHint}
          />
          <p className="text-[11px] text-apple-text-secondary text-center">
            {resumeTemplates.find((tpl) => tpl.id === template)?.label} — {hub.templateHint}
          </p>
        </div>
      )}

      {tab === 'interview' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(Object.entries(DIMENSION_LABELS) as [InterviewDimension, string][]).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPrepDimension(key)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
                  prepDimension === key ? 'feature-chip feature-chip-active' : 'feature-chip'
                }`}
              >
                {label}
              </button>
            ))}
            <span className="w-px h-6 bg-[#d2d2d7] self-center mx-1" />
            {(['zh', 'en'] as InterviewLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setPrepLang(lang)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
                  prepLang === lang ? 'feature-chip feature-chip-active' : 'feature-chip'
                }`}
              >
                {lang === 'zh' ? '中文' : 'English'}
              </button>
            ))}
          </div>

          <div className="apple-card p-5">
            <h4 className="font-semibold text-[14px] mb-3">{hub.likelyQuestions}</h4>
            <ul className="space-y-2">
              {likelyQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-apple-text-secondary">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--accent-soft)] text-volt text-[11px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {prepTopics
              .filter((p) => p.dimension === prepDimension && p.language === prepLang)
              .slice(0, 4)
              .map((topic) => (
                <div key={topic.id} className="apple-card p-4">
                  <h5 className="font-semibold text-[13px] mb-2">{topic.title}</h5>
                  <p className="text-[12px] text-apple-text-secondary line-clamp-2 mb-2">{topic.description}</p>
                  <div className="text-[11px] text-volt font-medium">{hub.answerFramework}</div>
                  <ul className="mt-1 space-y-0.5">
                    {topic.answerFramework.slice(0, 3).map((f, i) => (
                      <li key={i} className="text-[11px] text-apple-text-secondary">• {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>

          <Link href={interviewUrl}>
            <Button variant="volt" className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              {hub.startMock} {DIMENSION_LABELS[prepDimension]} ({prepLang === 'zh' ? '中文' : 'English'})
            </Button>
          </Link>
        </div>
      )}

      {tab === 'track' && (
        <div className="space-y-4">
          <p className="text-[13px] text-apple-text-secondary">{hub.trackDesc}</p>
          <div className="apple-card p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-medium text-apple-text-secondary">{hub.company}</label>
                <input
                  value={trackForm.company}
                  onChange={(e) => setTrackForm({ ...trackForm, company: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-apple-border/60 bg-surface-3 text-[13px]"
                  placeholder={hub.companyPlaceholder}
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-apple-text-secondary">{hub.role}</label>
                <input
                  value={trackForm.title}
                  onChange={(e) => setTrackForm({ ...trackForm, title: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-apple-border/60 bg-surface-3 text-[13px]"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-apple-text-secondary">{hub.platform}</label>
                <select
                  value={trackForm.platform}
                  onChange={(e) => setTrackForm({ ...trackForm, platform: e.target.value as ApplicationPlatform })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-apple-border/60 bg-surface-3 text-[13px]"
                >
                  {Object.entries(platformLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-medium text-apple-text-secondary">{hub.status}</label>
                <select
                  value={trackForm.status}
                  onChange={(e) => setTrackForm({ ...trackForm, status: e.target.value as ApplicationStatus })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-apple-border/60 bg-surface-3 text-[13px]"
                >
                  {Object.entries(statusLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-apple-text-secondary">{hub.notes}</label>
              <textarea
                value={trackForm.notes}
                onChange={(e) => setTrackForm({ ...trackForm, notes: e.target.value })}
                rows={3}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-apple-border/60 bg-surface-3 text-[13px] resize-y min-h-[80px] focus:outline-none focus:border-volt/50 focus:ring-2 focus:ring-volt/20 transition-all"
                placeholder={hub.notesPlaceholder}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="volt" onClick={handleSaveTrack} className="gap-1.5">
                <Plus className="w-4 h-4" />
                {hub.saveTrack}
              </Button>
              {trackSaved && (
                <span className="text-[12px] text-apple-green flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {hub.saved}
                </span>
              )}
              <Link href="/applications" className="text-[12px] text-volt hover:underline ml-auto">
                {hub.viewAllApps}
              </Link>
            </div>
            <p className="text-[11px] text-apple-text-secondary">
              {hub.matchScore} {result.matchScore}% · {hub.matchAutoLink}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
