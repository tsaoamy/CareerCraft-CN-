'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ClipboardList, Plus, Search, BarChart3, TrendingUp, Building2,
  Calendar, Trash2, Edit3, ChevronDown, ChevronUp, Filter,
} from 'lucide-react';
import { useApplications } from '@/lib/application-context';
import { GlassPageHero } from '@/components/ui/glass-page-hero';
import { FeaturePageRoot, FeaturePageShell } from '@/components/layout/feature-page-shell';
import { BrandButton } from '@/components/design-system/brand-button';
import { FeatureEmpty } from '@/components/system/feature-empty';
import { SystemInput, SystemSelect, SystemTextarea } from '@/components/system/system-input';
import { useSystemFeedback } from '@/lib/feedback/use-system-feedback';
import { useLocale } from '@/lib/i18n/locale-context';
import { getPlatformLabels, getStatusLabels } from '@/lib/i18n/shared-labels';
import {
  STATUS_COLORS,
  type ApplicationPlatform,
  type ApplicationStatus,
} from '@/types/application';

export default function ApplicationsPage() {
  const { locale, t } = useLocale();
  const a = t.applications;
  const ca = t.commonActions;
  const fb = useSystemFeedback();
  const platformLabels = getPlatformLabels(locale);
  const statusLabels = getStatusLabels(locale);
  const PLATFORMS = Object.keys(platformLabels) as ApplicationPlatform[];
  const STATUSES = Object.keys(statusLabels) as ApplicationStatus[];

  const { applications, addApplication, updateApplication, deleteApplication, addEvent, stats } =
    useApplications();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');
  const [filterPlatform, setFilterPlatform] = useState<ApplicationPlatform | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    company: '',
    title: '',
    platform: 'boss' as ApplicationPlatform,
    status: 'wishlist' as ApplicationStatus,
    salary: '',
    location: '',
    notes: '',
    appliedAt: '',
  });

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || app.company.toLowerCase().includes(q) || app.title.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || app.status === filterStatus;
      const matchPlatform = filterPlatform === 'all' || app.platform === filterPlatform;
      return matchSearch && matchStatus && matchPlatform;
    });
  }, [applications, search, filterStatus, filterPlatform]);

  const activePlatforms = PLATFORMS.filter((p) => stats.byPlatform[p] > 0);

  function handleAdd() {
    if (!form.title.trim()) return;
    addApplication({
      company: form.company.trim() || ca.notFilled,
      title: form.title.trim(),
      platform: form.platform,
      status: form.status,
      salary: form.salary || undefined,
      location: form.location || undefined,
      notes: form.notes || undefined,
      appliedAt: form.appliedAt || undefined,
    });
    setForm({ company: '', title: '', platform: 'boss', status: 'wishlist', salary: '', location: '', notes: '', appliedAt: '' });
    setShowForm(false);
    fb.success('saved');
  }

  function handleAddNote(appId: string) {
    const content = noteInput[appId]?.trim();
    if (!content) return;
    addEvent(appId, { date: new Date().toISOString().slice(0, 10), type: 'note', content });
    setNoteInput((prev) => ({ ...prev, [appId]: '' }));
  }

  return (
    <FeaturePageRoot>
      <GlassPageHero
        badge={
          <>
            <ClipboardList className="w-3.5 h-3.5 text-volt" />
            {a.badge}
          </>
        }
        title={a.title}
        subtitle={a.subtitle}
        icon={ClipboardList}
        footer={
          <BrandButton variant="volt" size="md" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" />
            {a.addRecord}
          </BrandButton>
        }
      />

      <FeaturePageShell tight className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ClipboardList} label={a.statTotal} value={String(stats.total)} />
          <StatCard icon={TrendingUp} label={a.statInterviewRate} value={`${stats.interviewRate}%`} />
          <StatCard icon={BarChart3} label={a.statOfferRate} value={`${stats.offerRate}%`} />
          <StatCard icon={Building2} label={a.statInProgress} value={String(stats.byStatus.interview + stats.byStatus.screening)} />
        </div>

        {activePlatforms.length > 0 && (
          <div className="apple-card p-5">
            <h3 className="text-[14px] font-semibold mb-3">{a.platformBreakdown}</h3>
            <div className="flex flex-wrap gap-3">
              {activePlatforms.map((p) => (
                <div key={p} className="px-4 py-2 rounded-xl feature-panel-muted">
                  <span className="text-[12px] text-apple-text-secondary">{platformLabels[p]}</span>
                  <span className="ml-2 text-[16px] font-bold text-ink">{stats.byPlatform[p]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <SystemInput
              icon={<Search className="w-4 h-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={a.searchPlaceholder}
            />
          </div>
          <SystemSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
            className="sm:w-40"
          >
            <option value="all">{a.allStatus}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </SystemSelect>
          <SystemSelect
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value as ApplicationPlatform | 'all')}
            className="sm:w-40"
          >
            <option value="all">{a.allPlatform}</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {platformLabels[p]}
              </option>
            ))}
          </SystemSelect>
          <BrandButton variant="volt" size="md" className="shrink-0" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" />
            {a.addRecord}
          </BrandButton>
        </div>

        {showForm && (
          <div className="apple-card p-5 space-y-3 animate-fade-in-up">
            <h3 className="font-semibold text-[14px]">{a.addFormTitle}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <SystemInput placeholder={a.companyPlaceholder} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <SystemInput placeholder={a.titlePlaceholder} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <SystemSelect value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as ApplicationPlatform })}>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {platformLabels[p]}
                  </option>
                ))}
              </SystemSelect>
              <SystemSelect value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ApplicationStatus })}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </SystemSelect>
              <SystemInput placeholder={a.salaryPlaceholder} value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
              <SystemInput type="date" value={form.appliedAt} onChange={(e) => setForm({ ...form, appliedAt: e.target.value })} />
            </div>
            <SystemTextarea placeholder={a.notesPlaceholder} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            <div className="flex gap-2">
              <BrandButton variant="volt" size="sm" onClick={handleAdd}>
                {ca.save}
              </BrandButton>
              <BrandButton variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                {ca.cancel}
              </BrandButton>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <FeatureEmpty
            page="applications"
            title={a.emptyTitle}
            description={a.emptyHint}
            primaryLabel={a.jdAnalyzerLink}
            primaryHref="/jd-analyzer"
            secondaryAction={
              <BrandButton variant="outline-dark" size="md" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4" />
                {a.addRecord}
              </BrandButton>
            }
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <div key={app.id} className="apple-card overflow-hidden">
                <div className="p-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-[15px] text-ink">{app.title}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[app.status]}`}>
                        {statusLabels[app.status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-apple-text-secondary">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {app.company}
                      </span>
                      <span>{platformLabels[app.platform]}</span>
                      {app.matchScore != null && <span className="text-volt">{a.matchLabelPrefix} {app.matchScore}%</span>}
                      {app.appliedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {app.appliedAt}
                        </span>
                      )}
                    </div>
                    {app.notes && <p className="text-[12px] text-apple-text-secondary mt-2 line-clamp-2">{app.notes}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplication(app.id, { status: e.target.value as ApplicationStatus })}
                      className="text-[11px] px-2 py-1 rounded-lg border border-apple-border/40 bg-transparent"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)} className="p-2 rounded-lg hover:bg-surface-2">
                      {expandedId === app.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button type="button" onClick={() => deleteApplication(app.id)} className="p-2 rounded-lg hover:bg-[#ffebee] text-apple-red/60 hover:text-apple-red">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedId === app.id && (
                  <div className="px-4 pb-4 border-t border-[#d2d2d7]/40 dark:border-[#48484a]/40 pt-3 animate-fade-in-up">
                    <h4 className="text-[12px] font-semibold mb-2 flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5" />
                      {a.progressLog}
                    </h4>
                    {app.events.length > 0 ? (
                      <ul className="space-y-2 mb-3">
                        {app.events.map((ev) => (
                          <li key={ev.id} className="text-[12px] flex gap-2">
                            <span className="text-apple-text-secondary shrink-0">{ev.date}</span>
                            <span className="text-ink/90">{ev.content}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[12px] text-apple-text-secondary mb-3">{a.noEvents}</p>
                    )}
                    <div className="flex gap-2">
                      <input
                        value={noteInput[app.id] ?? ''}
                        onChange={(e) => setNoteInput({ ...noteInput, [app.id]: e.target.value })}
                        placeholder={a.notePlaceholder}
                        className="flex-1 px-3 py-2 rounded-lg feature-field text-[12px]"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote(app.id)}
                      />
                      <BrandButton variant="volt" size="sm" onClick={() => handleAddNote(app.id)}>
                        {ca.add}
                      </BrandButton>
                    </div>
                    {app.jdText && (
                      <details className="mt-3">
                        <summary className="text-[11px] text-volt cursor-pointer">{a.viewJdSnapshot}</summary>
                        <pre className="mt-2 text-[11px] text-apple-text-secondary whitespace-pre-wrap max-h-32 overflow-y-auto">{app.jdText}</pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </FeaturePageShell>
    </FeaturePageRoot>
  );
}

function StatCard({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color?: string;
  bg?: string;
}) {
  return (
    <div className="system-card system-card-hover p-5">
      <Icon className="w-5 h-5 text-volt mb-2" />
      <div className="font-display text-[1.75rem] leading-none text-ink tabular-nums">{value}</div>
      <div className="text-caption-sm text-stone mt-2">{label}</div>
    </div>
  );
}
