'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, ChevronDown, ChevronUp, FileText, GripVertical, X } from 'lucide-react';
import { useMaterials } from '@/lib/material-context';
import { useUserProfile } from '@/lib/user-profile-context';
import { useAuth } from '@/lib/auth-context';
import { computeResumeProgress } from '@/lib/resume-progress';
import { useDraggableFloat } from '@/hooks/use-draggable-float';

const HIDDEN_PREFIXES = ['/', '/login', '/register', '/privacy', '/terms', '/help', '/contact', '/careers', '/enterprise'];

export function ResumeProgressFloat() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { materials } = useMaterials();
  const { profile, isLoaded } = useUserProfile();
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { nodeRef, style, isDragging, dragHandleProps, consumeDrag } = useDraggableFloat({
    storageKey: 'careercraft_float_resume_progress',
    anchor: 'bottom-left',
    margin: 20,
    topInset: 72,
  });

  const progress = useMemo(
    () => computeResumeProgress(materials, profile),
    [materials, profile]
  );

  const shouldHide =
    authLoading ||
    !isAuthenticated ||
    !isLoaded ||
    dismissed ||
    progress.isComplete ||
    HIDDEN_PREFIXES.some((p) => (p === '/' ? pathname === '/' : pathname.startsWith(p)));

  if (shouldHide) return null;

  const nextStep = progress.steps.find((s) => !s.done);

  const handleExpand = () => {
    if (consumeDrag()) return;
    setExpanded(true);
  };

  return (
    <div
      ref={nodeRef}
      style={{ ...style, zIndex: 90 }}
      className={`max-w-[280px] select-none ${isDragging ? 'opacity-95' : ''}`}
    >
      {expanded ? (
        <div className="rounded-2xl border border-[#d2d2d7]/60 dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] shadow-xl shadow-black/8 overflow-hidden animate-fade-in">
          <div
            {...dragHandleProps}
            className="flex items-center gap-2 px-3 py-3 border-b border-[#d2d2d7]/40 dark:border-[#38383a] bg-[#fafafa]/80 dark:bg-[#111]/80"
          >
            <GripVertical className="w-4 h-4 text-apple-text-secondary/50 shrink-0" />
            <FileText className="w-4 h-4 text-apple-blue shrink-0" />
            <span className="text-[13px] font-semibold text-apple-text dark:text-white flex-1">
              简历完成进度
            </span>
            <span className="text-[12px] font-bold text-apple-blue">{progress.percent}%</span>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="p-1 rounded-lg text-apple-text-secondary hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] cursor-pointer"
              aria-label="收起"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg text-apple-text-secondary hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] cursor-pointer"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 py-2">
            <div className="h-1.5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0071e3] to-[#34c759] transition-all duration-500"
                style={{ width: `${progress.percent}%` }}
              />
            </div>

            <ul className="space-y-2 pb-2">
              {progress.steps.map((step) => (
                <li key={step.id}>
                  <Link
                    href={step.href}
                    className={`flex items-start gap-2.5 p-2 rounded-xl transition-colors ${
                      step.done
                        ? 'bg-[#e8f8ee]/60 dark:bg-[#0a3622]/20'
                        : 'hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]'
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-[#34c759] shrink-0 mt-0.5" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-[#d2d2d7] dark:border-[#48484a] shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div
                        className={`text-[12px] font-medium ${
                          step.done
                            ? 'text-[#34c759]'
                            : 'text-apple-text dark:text-white'
                        }`}
                      >
                        {step.label}
                      </div>
                      {!step.done && (
                        <div className="text-[10px] text-apple-text-secondary mt-0.5 leading-snug">
                          {step.hint}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {nextStep && (
            <div className="px-4 pb-4">
              <Link
                href={nextStep.href}
                className="block w-full h-9 rounded-xl bg-apple-blue text-white text-[12px] font-medium text-center leading-9 hover:bg-[#0077ed] transition-colors"
              >
                继续：{nextStep.label}
              </Link>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleExpand}
          {...dragHandleProps}
          className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-[#d2d2d7]/60 dark:border-[#38383a] shadow-lg shadow-black/8 hover:shadow-xl transition-shadow"
        >
            <div className="relative w-9 h-9 shrink-0">
              <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-[#f5f5f7] dark:text-[#2c2c2e]"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${progress.percent * 0.942} 100`}
                  strokeLinecap="round"
                  className="text-apple-blue"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-apple-blue">
                {progress.percent}%
              </span>
            </div>
            <div className="text-left">
              <div className="text-[12px] font-semibold text-apple-text dark:text-white">
                简历进度
              </div>
              <div className="text-[10px] text-apple-text-secondary">
                {progress.completedCount}/{progress.steps.length} 项已完成
              </div>
            </div>
            <ChevronUp className="w-4 h-4 text-apple-text-secondary ml-1" />
          </button>
      )}
    </div>
  );
}
