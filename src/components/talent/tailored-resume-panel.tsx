'use client';



import { useState } from 'react';

import {

  FileText, Sparkles, Copy, Download, Check, Loader2, ChevronDown, ChevronUp,

} from 'lucide-react';

import type { TailoredResumeResult } from '@/lib/ai/types';

import { useLocale } from '@/lib/i18n/locale-context';

import { useSystemFeedback } from '@/lib/feedback/use-system-feedback';

import { resolveErrorMessage, fillTemplate } from '@/lib/i18n/error-messages';

import { BrandButton } from '@/components/design-system/brand-button';



export interface TailoredResumePanelProps {

  resumeContent: string;

  jobTitle: string;

  company?: string;

  jdText: string;

  jdKeywords?: string[];

  /** 无简历内容时的提示 */

  emptyHint?: string;

}



export function TailoredResumePanel({

  resumeContent,

  jobTitle,

  company,

  jdText,

  jdKeywords = [],

  emptyHint,

}: TailoredResumePanelProps) {

  const { locale, t } = useLocale();

  const tp = t.tailoredPanel;

  const ca = t.commonActions;

  const fb = useSystemFeedback();

  const [generating, setGenerating] = useState(false);

  const [result, setResult] = useState<TailoredResumeResult | null>(null);

  const [copied, setCopied] = useState(false);

  const [showNotes, setShowNotes] = useState(true);



  const canGenerate =

    resumeContent.trim().length >= 20 && jobTitle.trim().length > 0 && jdText.trim().length >= 10;



  async function handleGenerate() {

    if (!canGenerate) return;

    setGenerating(true);

    setResult(null);

    try {

      const res = await fetch('/api/ai/generate-resume', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({

          resumeContent: resumeContent.trim(),

          jobTitle,

          company,

          jdText,

          jdKeywords,

        }),

      });

      const data = await res.json();

      if (data.success && data.data) {

        setResult(data.data as TailoredResumeResult);

        fb.success('resumeGenerated');

      } else {

        fb.raw.error(resolveErrorMessage(data.error || ca.generateFailed, locale, ca.generateFailed));

      }

    } catch {

      fb.error('networkError');

    } finally {

      setGenerating(false);

    }

  }



  async function handleCopy() {

    if (!result?.fullText) return;

    await navigator.clipboard.writeText(result.fullText);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);

  }



  function handleDownload() {

    if (!result?.fullText) return;

    const blob = new Blob([result.fullText], { type: 'text/markdown;charset=utf-8' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;

    a.download = `${tp.downloadPrefix}-${jobTitle.replace(/[/\\?%*:|"<>]/g, '-')}.md`;

    a.click();

    URL.revokeObjectURL(url);

  }



  const descText = fillTemplate(tp.desc, { jobTitle: jobTitle || '—' });

  const hintText = emptyHint ?? tp.defaultEmptyHint;



  return (

    <div className="apple-card p-6 border border-hairline">

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">

        <div>

          <h3 className="font-semibold text-ink flex items-center gap-2 text-[16px]">

            <Sparkles className="w-5 h-5 text-volt" />

            {tp.title}

          </h3>

          <p className="text-[13px] text-apple-text-secondary mt-1.5 leading-relaxed max-w-xl">

            {descText}

          </p>

        </div>

        <BrandButton

          variant="volt"

          size="md"

          type="button"

          onClick={handleGenerate}

          disabled={!canGenerate || generating}

          className="shrink-0 gap-2"

        >

          {generating ? (

            <>

              <Loader2 className="w-4 h-4 animate-spin" />

              {tp.generating}

            </>

          ) : (

            <>

              <FileText className="w-4 h-4" />

              {tp.generate}

            </>

          )}

        </BrandButton>

      </div>



      {!canGenerate && !result && (

        <p className="match-callout-warn">{hintText}</p>

      )}



      {result && (

        <div className="space-y-4 animate-fade-in-up">

          <div className="flex flex-wrap items-center gap-3">

            <span className="match-keyword-chip text-[12px] px-3 py-1">

              {tp.keywordCoverage} {result.keywordCoverage}%

            </span>

            {result.targetCompany && (

              <span className="text-[12px] text-apple-text-secondary">

                {tp.target}: {result.targetCompany} · {result.targetTitle}

              </span>

            )}

            <div className="flex gap-2 ml-auto">

              <button

                type="button"

                onClick={handleCopy}

                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium feature-chip hover:text-ink"

              >

                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}

                {copied ? tp.copied : tp.copy}

              </button>

              <button

                type="button"

                onClick={handleDownload}

                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium feature-chip hover:text-ink"

              >

                <Download className="w-3.5 h-3.5" />

                {tp.downloadMd}

              </button>

            </div>

          </div>



          {result.tailoringNotes.length > 0 && (

            <div className="feature-panel-muted overflow-hidden">

              <button

                type="button"

                onClick={() => setShowNotes(!showNotes)}

                className="w-full flex items-center justify-between px-4 py-3 text-[13px] font-medium text-ink"

              >

                {fillTemplate(tp.notesTitle, { n: result.tailoringNotes.length })}

                {showNotes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}

              </button>

              {showNotes && (

                <ul className="px-4 pb-4 space-y-2">

                  {result.tailoringNotes.map((note, i) => (

                    <li key={i} className="text-[12px] text-apple-text-secondary flex items-start gap-2">

                      <span className="text-volt shrink-0">•</span>

                      {note}

                    </li>

                  ))}

                </ul>

              )}

            </div>

          )}



          <div className="feature-panel overflow-hidden">

            <div className="px-4 py-2.5 border-b border-hairline bg-surface-2">

              <span className="text-[11px] font-semibold text-stone uppercase tracking-wider">

                {tp.preview}

              </span>

            </div>

            <pre className="max-h-[480px] overflow-y-auto p-5 text-[13px] text-ink/90 whitespace-pre-wrap leading-relaxed font-sans custom-scrollbar">

              {result.fullText}

            </pre>

          </div>

        </div>

      )}

    </div>

  );

}


