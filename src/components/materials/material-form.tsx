'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X, Plus, Sparkles, Upload, FileText, ChevronDown, ChevronUp,
  Loader2, Lightbulb, Wand2,
} from 'lucide-react';
import type { Material, MaterialFormData, MaterialCategory } from '@/types/material';
import { useMaterials } from '@/lib/material-context';
import { extractSkills, parseResumeFile, type ParsedExperience, RESUME_FILE_ACCEPT } from '@/lib/resume-extract';
import { useLocale } from '@/lib/i18n/locale-context';
import { fillTemplate, resolveErrorMessage } from '@/lib/i18n/error-messages';
import { getCategoryLabels } from '@/lib/i18n/shared-labels';

const EMPTY_FORM: MaterialFormData = {
  title: '',
  category: 'project',
  dateRange: '',
  rawContent: '',
  star: { situation: '', task: '', action: '', result: '' },
  tags: [],
  skills: [],
  highlights: [''],
};

interface MaterialFormProps {
  material?: Material | null;
  onClose: () => void;
  seedContent?: string | null;
}

function applyExperience(form: MaterialFormData, exp: ParsedExperience, skills: string[], tags: string[]): MaterialFormData {
  return {
    ...form,
    title: exp.title || form.title,
    category: exp.category,
    dateRange: exp.dateRange || form.dateRange,
    rawContent: exp.description || form.rawContent,
    highlights: exp.highlights.length > 0 ? exp.highlights : form.highlights,
    skills: skills.length > 0 ? skills : form.skills,
    tags: tags.length > 0 ? tags : form.tags,
  };
}

export function MaterialForm({ material, onClose, seedContent }: MaterialFormProps) {
  const { addMaterial, addMaterials, updateMaterial } = useMaterials();
  const { t, locale } = useLocale();
  const mf = t.materialForm;
  const ca = t.commonActions;
  const categoryLabels = getCategoryLabels(locale);

  const isEdit = !!material;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<MaterialFormData>(EMPTY_FORM);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadHint, setUploadHint] = useState('');
  const [uploadError, setUploadError] = useState(false);
  const [formError, setFormError] = useState('');
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [pendingImports, setPendingImports] = useState<ParsedExperience[]>([]);

  const categories: { value: MaterialCategory; label: string }[] = (
    ['internship', 'project', 'competition', 'research', 'campus'] as MaterialCategory[]
  ).map((value) => ({ value, label: categoryLabels[value] }));

  useEffect(() => {
    // 弹窗打开时锁定页面滚动，防止背后页面跟着滚
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    if (material) {
      setForm({
        title: material.title,
        category: material.category,
        dateRange: material.dateRange || '',
        rawContent: material.rawContent,
        star: material.star,
        tags: material.tags,
        skills: material.skills,
        highlights: material.highlights.length > 0 ? material.highlights : [''],
      });
    } else if (seedContent) {
      setForm((f) => ({ ...f, rawContent: seedContent }));
    }
  }, [material, seedContent]);

  const updateHighlight = (index: number, value: string) => {
    setForm((f) => {
      const next = [...f.highlights];
      next[index] = value;
      return { ...f, highlights: next };
    });
  };

  const addHighlightRow = () => {
    setForm((f) => ({ ...f, highlights: [...f.highlights, ''] }));
  };

  const removeHighlightRow = (index: number) => {
    setForm((f) => ({
      ...f,
      highlights: f.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleResumeUpload = async (file: File) => {
    setUploading(true);
    setUploadHint('');
    setUploadError(false);
    try {
      const { text, keywords, skills, tags, experiences, contact } = await parseResumeFile(file);
      setExtractedKeywords(keywords);

      const prefix = contact?.name ? `${contact.name} · ` : '';

      if (experiences?.length > 0) {
        setForm((f) => applyExperience(f, experiences[0], skills, tags));
        if (experiences.length > 1) {
          setPendingImports(experiences.slice(1));
          setUploadHint(
            fillTemplate(mf.hintMulti, {
              prefix,
              total: experiences.length,
              rest: experiences.length - 1,
            })
          );
        } else {
          setPendingImports([]);
          setUploadHint(
            fillTemplate(mf.hintSingle, { prefix, count: keywords.length })
          );
        }
      } else {
        setForm((f) => ({
          ...f,
          rawContent: text.slice(0, 1200),
          skills,
          tags,
        }));
        setUploadHint(fillTemplate(mf.hintFullText, { count: keywords.length }));
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : ca.uploadFailed;
      setUploadHint(resolveErrorMessage(raw, locale, ca.uploadFailed));
      setUploadError(true);
    } finally {
      setUploading(false);
    }
  };

  const importAllPending = () => {
    if (pendingImports.length === 0) return;
    const items: MaterialFormData[] = pendingImports.map((exp) => ({
      title: exp.title,
      category: exp.category,
      dateRange: exp.dateRange,
      rawContent: exp.description,
      star: { situation: '', task: '', action: '', result: '' },
      tags: extractedKeywords.slice(0, 5),
      skills: extractSkills(exp.description),
      highlights: exp.highlights.length > 0 ? exp.highlights : [''],
    }));
    addMaterials(items);
    setPendingImports([]);
    setUploadHint(fillTemplate(mf.batchImported, { n: items.length }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const highlights = form.highlights.map((h) => h.trim()).filter(Boolean);
    const description = form.rawContent.trim() || highlights.join('\n');
    if (!form.title.trim() || !description) {
      setFormError(mf.validationError);
      return;
    }

    const autoSkills = form.skills.length > 0 ? form.skills : extractSkills(description);
    const payload: MaterialFormData = {
      ...form,
      rawContent: description,
      highlights,
      skills: autoSkills,
      tags: form.tags.length > 0 ? form.tags : autoSkills.slice(0, 5),
    };

    if (isEdit) {
      updateMaterial(material.id, payload);
    } else {
      addMaterial(payload);
    }
    onClose();
  };

  const updateStar = (field: keyof MaterialFormData['star'], value: string) => {
    setForm((f) => ({ ...f, star: { ...f.star, [field]: value } }));
  };

  const starFields = [
    ['situation', mf.starSituation, mf.starPhSituation],
    ['task', mf.starTask, mf.starPhTask],
    ['action', mf.starAction, mf.starPhAction],
    ['result', mf.starResult, mf.starPhResult],
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[6vh] bg-black/30 backdrop-blur-sm overflow-hidden">
      <div className="apple-card shadow-2xl w-full max-w-[560px] mx-4 my-8 max-h-[88vh] flex flex-col overflow-hidden rounded-2xl">
        {/* Header - 固定顶部 */}
        <div className="flex items-center justify-between p-6 pb-3 border-b border-[#d2d2d7]/60 dark:border-[#38383a]/60 shrink-0">
          <div>
            <h2 className="text-[20px] font-bold tracking-tight text-apple-text dark:text-white">
              {isEdit ? mf.editTitle : mf.newTitle}
            </h2>
            <p className="text-[13px] text-apple-text-secondary mt-1">{mf.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-apple-text-secondary hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
            aria-label={ca.cancel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* 可滚动内容区 */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6 pb-4 space-y-5">
          {!isEdit && (
            <div className="rounded-2xl border border-dashed border-[#0071e3]/30 bg-[#0071e3]/[0.04] p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0071e3]/10 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5 text-apple-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-apple-text dark:text-white">{mf.uploadTitle}</p>
                  <p className="text-[12px] text-apple-text-secondary mt-1 leading-relaxed">{mf.uploadDesc}</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept={RESUME_FILE_ACCEPT}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleResumeUpload(file);
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="mt-3 inline-flex items-center gap-2 h-9 px-4 rounded-full text-[13px] font-medium bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7]/60 dark:border-[#48484a] text-apple-text dark:text-white hover:border-apple-blue/50 transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    {uploading ? mf.parsing : mf.selectFile}
                  </button>
                  {uploadHint && (
                    <p
                      className={`text-[12px] mt-2 flex items-center gap-1 ${
                        uploadError ? 'text-apple-red' : 'text-apple-blue'
                      }`}
                    >
                      <Wand2 className="w-3.5 h-3.5 shrink-0" />
                      {uploadHint}
                    </p>
                  )}
                  {pendingImports.length > 0 && (
                    <button
                      type="button"
                      onClick={importAllPending}
                      className="mt-2 text-[12px] font-medium text-apple-blue hover:underline"
                    >
                      {fillTemplate(mf.importRest, { n: pendingImports.length })}
                    </button>
                  )}
                </div>
              </div>
              {extractedKeywords.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#0071e3]/10">
                  <p className="text-[11px] font-medium text-apple-text-secondary mb-2">{mf.extractedKeywords}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedKeywords.slice(0, 12).map((kw) => (
                      <span
                        key={kw}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-[#1c1c1e] text-apple-blue border border-[#0071e3]/15"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
            <Lightbulb className="w-4 h-4 text-apple-orange shrink-0 mt-0.5" />
            <p className="text-[12px] text-apple-text-secondary leading-relaxed">{mf.tipGuidance}</p>
          </div>

          {formError && (
            <p className="text-[13px] text-apple-red px-1">{formError}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-apple-text dark:text-white">{mf.categoryLabel}</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as MaterialCategory }))}
                className="w-full h-11 px-3 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue/40"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-apple-text dark:text-white">{mf.dateRangeLabel}</label>
              <input
                type="text"
                value={form.dateRange || ''}
                onChange={(e) => setForm((f) => ({ ...f, dateRange: e.target.value }))}
                placeholder={mf.dateRangePlaceholder}
                className="w-full h-11 px-3 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white placeholder:text-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-apple-text dark:text-white">
              {mf.titleLabel} <span className="text-apple-red">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder={mf.titlePlaceholder}
              className="w-full h-11 px-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white placeholder:text-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/40"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-apple-text dark:text-white">{mf.descLabel}</label>
            <textarea
              value={form.rawContent}
              onChange={(e) => setForm((f) => ({ ...f, rawContent: e.target.value }))}
              placeholder={mf.descPlaceholder}
              rows={3}
              className="w-full p-3.5 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white placeholder:text-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/40 resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-apple-text dark:text-white">{mf.highlightsLabel}</label>
              <button
                type="button"
                onClick={addHighlightRow}
                className="text-[12px] font-medium text-apple-blue hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {mf.addHighlight}
              </button>
            </div>
            <div className="space-y-2">
              {form.highlights.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => updateHighlight(i, e.target.value)}
                    placeholder={fillTemplate(mf.highlightPh, { n: i + 1 })}
                    className="flex-1 h-10 px-3 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[13px] text-apple-text dark:text-white placeholder:text-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/40"
                  />
                  {form.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlightRow(i)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-apple-text-secondary hover:text-apple-red hover:bg-[#ffebee] dark:hover:bg-[#3d1111] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-[13px] font-medium text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4 text-apple-orange" />
              {mf.starOptional}
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showAdvanced && (
              <div className="mt-3 grid gap-2.5">
                {starFields.map(([key, label, ph]) => (
                  <div key={key}>
                    <label className="text-[11px] font-medium text-apple-text-secondary mb-1 block">{label}</label>
                    <textarea
                      value={form.star[key]}
                      onChange={(e) => updateStar(key, e.target.value)}
                      placeholder={ph}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-apple-blue/40"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>{/* 可滚动内容区结束 */}

          {/* 按钮区 - 固定在底部 */}
          <div className="flex gap-3 p-6 pt-3 border-t border-[#d2d2d7]/60 dark:border-[#38383a]/60 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] text-[14px] font-medium text-apple-text dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
            >
              {mf.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-apple-blue text-white text-[14px] font-semibold hover:bg-[#0077ed] shadow-[0_2px_12px_rgba(0,113,227,0.25)] transition-all active:scale-[0.98]"
            >
              {isEdit ? mf.saveChanges : mf.addToProfile}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
