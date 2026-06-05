"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles, Briefcase, Copy, Check, Loader2, Target, Lightbulb,
  ChevronDown, ChevronUp, FileEdit, Plus, ArrowRight, Zap, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPageHero } from "@/components/ui/glass-page-hero";
import { FeaturePageRoot, FeaturePageShell } from "@/components/layout/feature-page-shell";
import { FeatureEmpty } from "@/components/system/feature-empty";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMaterials } from "@/lib/material-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { generateResumeAIWithApi, type ResumeAIResult } from "@/lib/resume-ai-engine";

interface ResumeSection {
  id: string;
  label: string;
  content: string;
}

export default function ResumeBuilderPage() {
  const { locale, t } = useLocale();
  const rb = t.resumeBuilder;
  const ca = t.commonActions;
  const { materials } = useMaterials();

  const [jobTitle, setJobTitle] = useState("");
  const [jdExtra, setJdExtra] = useState("");
  const [showJd, setShowJd] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<(ResumeAIResult & { source?: "ai" | "local" }) | null>(null);
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!jobTitle.trim()) return;
    setGenerating(true);
    try {
      const aiResult = await generateResumeAIWithApi({
        jobTitle: jobTitle.trim(),
        jdExtra: jdExtra.trim() || undefined,
        materials,
        locale,
      });
      setResult(aiResult);
      setSections(aiResult.sections);
      setEditMode(false);
    } finally {
      setGenerating(false);
    }
  }, [jobTitle, jdExtra, materials, locale]);

  const handleCopyAll = () => {
    const fullText = sections
      .filter((s) => s.content.trim())
      .map((s) => `## ${s.label}\n${s.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const hasResult = sections.length > 0;

  return (
    <FeaturePageRoot>
      <GlassPageHero
        badge={
          <>
            <Sparkles className="w-3.5 h-3.5 text-volt" />
            {rb.step1} → {rb.step2} → {rb.step3}
          </>
        }
        title={rb.title}
        subtitle={rb.subtitle}
        icon={FileEdit}
      />

      <FeaturePageShell>
      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 text-[13px]">
        {[rb.step1, rb.step2, rb.step3].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${
                (i === 0 && jobTitle) || (i === 1 && hasResult) || (i === 2 && hasResult)
                  ? "bg-apple-blue text-white"
                  : "feature-panel-muted text-apple-text-secondary"
              }`}
            >
              {i + 1}
            </span>
            <span className="text-apple-text-secondary hidden sm:inline">{step}</span>
            {i < 2 && <ArrowRight className="w-4 h-4 text-apple-text-secondary/40 mx-1" />}
          </div>
        ))}
      </div>

      {/* Input card */}
      <div className="apple-card p-6 md:p-8 mb-6">
        <label className="block text-[14px] font-semibold text-ink mb-2 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-apple-blue" />
          {rb.targetRole}
        </label>
        <Input
          placeholder={rb.targetRolePlaceholder}
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="mb-4 h-12 text-[15px]"
          onKeyDown={(e) => e.key === "Enter" && void handleGenerate()}
        />

        <button
          type="button"
          onClick={() => setShowJd(!showJd)}
          className="flex items-center gap-1.5 text-[13px] text-apple-blue hover:underline mb-3"
        >
          {showJd ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {rb.jdOptional}
        </button>
        {showJd && (
          <textarea
            value={jdExtra}
            onChange={(e) => setJdExtra(e.target.value)}
            placeholder={rb.jdOptionalPlaceholder}
            rows={3}
            className="w-full mb-4 p-3.5 feature-field text-[14px] resize-none"
          />
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="volt"
            size="lg"
            className="flex-1 gap-2 h-12 text-[15px]"
            disabled={!jobTitle.trim() || generating}
            onClick={() => void handleGenerate()}
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {rb.generating}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {rb.generateBtn}
              </>
            )}
          </Button>
          <div className="text-[12px] text-apple-text-secondary text-center sm:text-left shrink-0">
            {materials.length > 0 ? (
              <span>
                {materials.length} {rb.experiences} {rb.materialsReady}
              </span>
            ) : (
              <Link href="/materials" className="text-apple-blue hover:underline inline-flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {rb.goLibrary}
              </Link>
            )}
          </div>
        </div>

        {materials.length === 0 && (
          <p className="mt-4 text-[13px] text-apple-orange bg-[#fff5e5] dark:bg-[#3d2900]/30 px-4 py-3 rounded-xl">
            {rb.noMaterials}
          </p>
        )}
      </div>

      {/* Results */}
      {hasResult && result && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Score bar */}
          <div className="flex flex-wrap items-center gap-4 p-5 rounded-2xl feature-callout">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-apple-blue" />
              <div>
                <div className="text-[24px] font-bold text-apple-blue">{result.matchScore}%</div>
                <div className="text-[12px] text-apple-text-secondary">{rb.matchScore}</div>
              </div>
            </div>
            <div className="w-px h-10 bg-[#d2d2d7]/60 hidden sm:block" />
            <div>
              <div className="text-[24px] font-bold text-apple-purple">{result.keywordCoverage}%</div>
              <div className="text-[12px] text-apple-text-secondary">{rb.keywordCoverage}</div>
            </div>
            <Badge variant="accent" className="ml-auto">
              {result.source === "ai" ? rb.sourceAi : rb.sourceLocal}
            </Badge>
          </div>

          <p className="text-[14px] text-apple-text-secondary">{rb.resultReady}</p>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCopyAll}>
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? ca.copied : rb.copyAll}
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setEditMode(!editMode)}>
              <FileEdit className="w-3.5 h-3.5" />
              {editMode ? rb.hideAdvanced : rb.advancedEdit}
            </Button>
            <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => void handleGenerate()} disabled={generating}>
              <Zap className="w-3.5 h-3.5" />
              {rb.regenerate}
            </Button>
          </div>

          {/* Resume preview */}
          <div className="apple-card divide-y divide-hairline">
            <div className="p-6 md:p-8 bg-gradient-to-r from-[#0071e3]/5 via-transparent to-transparent">
              <h2 className="text-[26px] font-bold text-ink">{jobTitle}</h2>
            </div>
            {sections.map((section) => (
              <div key={section.id} className="p-6 md:p-8">
                <h3 className="text-[15px] font-semibold text-ink mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-apple-blue" />
                  {section.label}
                </h3>
                {editMode ? (
                  <textarea
                    value={section.content}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((s) => (s.id === section.id ? { ...s, content: e.target.value } : s))
                      )
                    }
                    className="w-full min-h-[100px] p-3.5 feature-field text-[14px] resize-y"
                    rows={5}
                  />
                ) : (
                  <p className="text-[14px] text-ink leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* AI notes */}
          {result.tailoringNotes.length > 0 && (
            <div className="apple-card p-5">
              <h3 className="text-[15px] font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-apple-blue" />
                {rb.tailoringNotesTitle}
              </h3>
              <ul className="space-y-2">
                {result.tailoringNotes.map((note, i) => (
                  <li key={i} className="text-[13px] text-apple-text-secondary flex items-start gap-2">
                    <span className="text-apple-blue mt-0.5">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="apple-card p-5">
              <h3 className="text-[15px] font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-apple-orange" />
                {rb.suggestionsTitle}
              </h3>
              <div className="space-y-3">
                {result.suggestions.map((s) => (
                  <div
                    key={s.id}
                    className={`p-4 rounded-xl border ${
                      s.priority === "high"
                        ? "border-apple-orange/30 bg-[#fff5e5]/50 dark:bg-[#3d2900]/20"
                        : "border-hairline feature-panel-muted"
                    }`}
                  >
                    <p className="text-[14px] font-medium text-ink">{s.title}</p>
                    <p className="text-[12px] text-apple-text-secondary mt-1">{s.description}</p>
                    {s.actionLabel && (
                      <Link href="/materials" className="text-[12px] text-apple-blue hover:underline mt-2 inline-flex items-center gap-1">
                        {s.actionLabel} <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested experiences */}
          {result.suggestedExperiences.length > 0 && (
            <div className="apple-card p-5">
              <h3 className="text-[15px] font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-apple-green" />
                {rb.suggestedExpTitle}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {result.suggestedExperiences.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-xl feature-panel-muted">
                    <p className="text-[14px] font-semibold text-ink">{exp.title}</p>
                    <p className="text-[12px] text-apple-text-secondary mt-1">{exp.reason}</p>
                    <pre className="text-[11px] text-apple-text-secondary mt-3 whitespace-pre-wrap line-clamp-4 font-sans">
                      {exp.template}
                    </pre>
                    <Link
                      href="/materials"
                      className="mt-3 inline-flex items-center gap-1 text-[12px] text-apple-blue hover:underline"
                    >
                      {rb.useTemplate} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state before generate */}
      {!hasResult && !generating && (
        <FeatureEmpty
          page="resume-builder"
          description={rb.preGenerateHint}
          primaryLabel={rb.useTemplate}
          primaryHref="/materials"
        />
      )}
    </FeaturePageShell>
    </FeaturePageRoot>
  );
}
