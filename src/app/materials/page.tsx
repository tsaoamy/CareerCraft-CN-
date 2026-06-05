'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, FolderOpen, Lightbulb, BookOpen, ArrowRight, Play, CheckCircle2, Target, Sparkles, ClipboardList, Brain, FileSearch, FileCheck, MessageSquare, Briefcase, Code2, Trophy, FileText } from 'lucide-react';
import { MaterialCard } from '@/components/materials/material-card';
import { MaterialForm } from '@/components/materials/material-form';
import { CategoryIcon } from '@/components/materials/category-icon';
import { GlassPageHero } from '@/components/ui/glass-page-hero';
import { FeaturePageRoot, FeaturePageShell } from '@/components/layout/feature-page-shell';
import { BrandButton } from '@/components/design-system/brand-button';
import { FeatureEmpty } from '@/components/system/feature-empty';
import { SystemInput } from '@/components/system/system-input';
import { useMaterials } from '@/lib/material-context';
import { useLocale } from '@/lib/i18n/locale-context';
import { getCategoryLabels, getAllCategoryLabel } from '@/lib/i18n/shared-labels';
import type { Material, MaterialCategory } from '@/types/material';

const ALL_CATEGORIES: (MaterialCategory | 'all')[] = ['all', 'internship', 'project', 'competition', 'research', 'campus'];

const WORKFLOW_LINKS = ['#start', '#ai', '/jd-analyzer', '/resume-builder', '/interview'];
const NEXT_STEP_HREFS = ['/jd-analyzer', '/resume-builder', '/interview'];
const NEXT_STEP_ICONS = [FileSearch, FileText, MessageSquare];
const NEXT_STEP_COLORS = ['accent', 'warm', 'success'] as const;

export default function MaterialsPage() {
  const { locale, t } = useLocale();
  const m = t.materials;
  const ca = t.commonActions;
  const categoryLabels = getCategoryLabels(locale);
  const allLabel = getAllCategoryLabel(locale);
  const { materials, getMaterialsByCategory } = useMaterials();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MaterialCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [seedTemplate, setSeedTemplate] = useState<string | null>(null);

  const workflowSteps = useMemo(
    () =>
      m.workflowSteps.map((step, i) => ({
        ...step,
        icon: [ClipboardList, Brain, FileSearch, FileCheck, MessageSquare][i],
        link: WORKFLOW_LINKS[i],
      })),
    [m.workflowSteps]
  );

  const nextSteps = useMemo(
    () =>
      m.nextStepsItems.map((step, i) => ({
        ...step,
        href: NEXT_STEP_HREFS[i],
        icon: NEXT_STEP_ICONS[i],
        color: NEXT_STEP_COLORS[i],
      })),
    [m.nextStepsItems]
  );

  const quickTemplates = useMemo(
    () => [
      {
        category: 'internship' as MaterialCategory,
        title: m.templateInternship,
        template: m.templateInternshipBody,
        icon: Briefcase,
      },
      {
        category: 'project' as MaterialCategory,
        title: m.templateProject,
        template: m.templateProjectBody,
        icon: Code2,
      },
      {
        category: 'competition' as MaterialCategory,
        title: m.templateCompetition,
        template: m.templateCompetitionBody,
        icon: Trophy,
      },
    ],
    [m]
  );

  const filtered = useMemo(() => {
    let result = activeCategory === 'all' ? materials : getMaterialsByCategory(activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.rawContent.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          item.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return result;
  }, [materials, activeCategory, search, getMaterialsByCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: materials.length };
    for (const cat of ALL_CATEGORIES) {
      if (cat !== 'all') counts[cat] = getMaterialsByCategory(cat).length;
    }
    return counts;
  }, [materials, getMaterialsByCategory]);

  const handleEdit = (material: Material) => {
    setEditMaterial(material);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditMaterial(null);
  };

  const handleUseTemplate = (template: string) => {
    setSeedTemplate(template);
    setShowForm(true);
  };

  const isEmpty = materials.length === 0;
  const stepIconColor = {
    accent: 'text-volt bg-[var(--accent-soft)] border border-[var(--chip-selected-border)]',
    warm: 'text-[var(--chip-selected-text)] bg-[var(--chip-selected-bg)] border border-[var(--chip-selected-border)]',
    success: 'text-[var(--color-success)] bg-[var(--color-success-soft)] border border-[var(--color-success)]/20',
  };

  return (
    <FeaturePageRoot>
      <GlassPageHero
        badge={
          <>
            <Sparkles className="w-3.5 h-3.5 text-volt" />
            {m.badge}
          </>
        }
        title={m.title}
        subtitle={m.subtitle}
        icon={FolderOpen}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <BrandButton variant="outline-dark" size="md" onClick={() => setShowGuide(!showGuide)}>
              <BookOpen className="w-4 h-4" />
              {showGuide ? m.hideGuide : m.showGuide}
            </BrandButton>
            <BrandButton
              variant="volt"
              size="md"
              onClick={() => {
                setSeedTemplate(null);
                setShowForm(true);
              }}
            >
              <Plus className="w-4 h-4" />
              {m.newMaterial}
            </BrandButton>
          </div>
        }
      />

      <FeaturePageShell>
      {showGuide && (
        <div className="mb-8 p-6 feature-callout animate-fade-in-up">
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb className="w-5 h-5 text-volt" />
            <h2 className="text-[17px] font-semibold text-ink">{m.workflowTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {workflowSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl feature-panel">
                <step.icon className="w-5 h-5 shrink-0 text-volt" />
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-ink">{step.title}</p>
                  <p className="text-[12px] text-apple-text-secondary mt-0.5">{step.desc}</p>
                  {step.link.startsWith('/') && (
                    <a href={step.link} className="text-[11px] text-volt hover:underline inline-flex items-center gap-1 mt-1.5">
                      <Play className="w-3 h-3" /> {ca.start}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isEmpty && (
        <div className="mb-8 p-6 feature-panel-muted">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-apple-orange" />
            <h2 className="text-[17px] font-semibold text-ink">{m.quickTemplatesTitle}</h2>
          </div>
          <p className="text-[13px] text-apple-text-secondary mb-4">{m.quickTemplatesDesc}</p>
          <div className="grid md:grid-cols-3 gap-3">
            {quickTemplates.map((tpl) => (
              <button
                key={tpl.title}
                onClick={() => handleUseTemplate(tpl.template)}
                className="text-left p-4 rounded-xl feature-panel hover:border-volt/40 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-2 border border-hairline flex items-center justify-center mb-3 group-hover:bg-accent-soft transition-colors">
                  <tpl.icon className="w-5 h-5 text-stone group-hover:text-volt transition-colors" />
                </div>
                <p className="text-[14px] font-semibold text-ink group-hover:text-volt transition-colors">{tpl.title}</p>
                <p className="text-[11px] text-apple-text-secondary mt-1.5 line-clamp-3 whitespace-pre-line">{tpl.template.slice(0, 100)}...</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
              activeCategory === cat ? 'feature-chip feature-chip-active' : 'feature-chip'
            }`}
          >
            <CategoryIcon category={cat} size="sm" />
            <span>{cat === 'all' ? allLabel : categoryLabels[cat]}</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                activeCategory === cat
                  ? 'bg-[var(--chip-selected-border)] text-[var(--chip-selected-text)]'
                  : 'bg-surface-1 text-stone'
              }`}
            >
              {categoryCounts[cat] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-8 max-w-md">
        <SystemInput
          icon={<Search className="w-[18px] h-[18px]" />}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={m.searchPlaceholder}
        />
      </div>

      {!isEmpty && (
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-apple-green" />
            <span className="text-[13px] text-apple-text-secondary">
              {m.progressPrefix}{' '}
              <span className="font-semibold text-ink">{materials.length}</span> {m.progressMid}{' '}
              <span className="font-semibold text-ink">
                {ALL_CATEGORIES.filter((c) => c !== 'all' && (categoryCounts[c] ?? 0) > 0).length}
              </span>{' '}
              {m.progressSuffix}
            </span>
          </div>
          <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden max-w-[200px]">
            <div className="h-full rounded-full bg-gradient-to-r from-volt to-[var(--accent-bright)] transition-all" style={{ width: `${Math.min((materials.length / 10) * 100, 100)}%` }} />
          </div>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((material) => (
            <MaterialCard key={material.id} material={material} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <FeatureEmpty
          page={search ? 'materials-search' : 'materials'}
          title={search ? m.notFound : m.emptyTitle}
          description={search ? m.notFoundHint : m.emptyHint}
          primaryLabel={m.newMaterial}
          onPrimary={() => {
            setSeedTemplate(null);
            setShowForm(true);
          }}
          secondaryAction={
            !search ? (
              <BrandButton variant="outline-dark" size="md" onClick={() => setShowGuide(true)}>
                <BookOpen className="w-4 h-4" />
                {m.viewGuide}
              </BrandButton>
            ) : undefined
          }
        />
      )}

      {!isEmpty && filtered.length > 0 && (
        <div className="mt-10 p-6 feature-panel-muted">
          <h3 className="text-[16px] font-semibold text-ink mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-apple-green" />
            {m.nextSteps}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {nextSteps.map((step) => (
              <a
                key={step.href}
                href={step.href}
                className="flex items-center gap-3 p-4 rounded-xl feature-panel hover:shadow-md transition-all group hover:border-volt/30"
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stepIconColor[step.color]}`}>
                  <step.icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-ink">{step.title}</p>
                  <p className="text-[12px] text-apple-text-secondary">{step.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-apple-text-secondary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}

      {showForm && <MaterialForm material={editMaterial} onClose={handleCloseForm} seedContent={seedTemplate} />}
      </FeaturePageShell>
    </FeaturePageRoot>
  );
}
