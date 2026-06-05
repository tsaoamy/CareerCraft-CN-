'use client';

import { Lightbulb, ArrowRight } from 'lucide-react';

interface ProfileHintCardProps {
  label: string;
  suggestion: string;
  onApply?: () => void;
}

/** 参考提示卡片 — 需用户主动点击才填入，不会自动写入 */
export function ProfileHintCard({ label, suggestion, onApply }: ProfileHintCardProps) {
  return (
    <div className="mt-2 p-3 rounded-xl bg-[#fff9e6] dark:bg-[#3d2900]/30 border border-[#ffcc00]/25">
      <div className="flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-apple-orange shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-apple-orange mb-1">
            参考建议 · {label}
          </p>
          <p className="text-[12px] text-apple-text-secondary leading-relaxed">
            {suggestion}
          </p>
          {onApply && (
            <button
              type="button"
              onClick={onApply}
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-apple-blue hover:underline"
            >
              采用此建议
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProfileHintsPanelProps {
  hints: {
    hasData: boolean;
    experienceCount: number;
    skillCount: number;
    topSkills: string[];
    experienceTitles: string[];
    bioSuggestion: string | null;
    targetRoleSuggestion: string | null;
    locationSuggestion: string | null;
  };
  onApplyBio?: () => void;
  onApplyRole?: () => void;
  onApplyLocation?: () => void;
}

export function ProfileHintsPanel({
  hints,
  onApplyBio,
  onApplyRole,
  onApplyLocation,
}: ProfileHintsPanelProps) {
  if (!hints.hasData) {
    return (
      <div className="p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-dashed border-[#d2d2d7]/60 dark:border-[#48484a]">
        <p className="text-[13px] text-apple-text-secondary">
          暂无素材库数据。在
          <a href="/materials" className="text-apple-blue hover:underline mx-1">素材库</a>
          上传简历或添加经历后，这里会显示参考建议（不会自动填入表单）。
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-[#f5f5f7]/80 dark:bg-[#2c2c2e]/80 border border-[#d2d2d7]/40 dark:border-[#48484a]/40 space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-apple-orange" />
        <span className="text-[13px] font-semibold text-apple-text dark:text-white">
          基于你的素材库 · 参考建议
        </span>
      </div>
      <p className="text-[11px] text-apple-text-secondary">
        已识别 {hints.experienceCount} 段经历、{hints.skillCount} 项技能。以下为 AI 参考，需你确认后手动采用。
      </p>
      {hints.topSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {hints.topSkills.map((s) => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[#0071e3]/10 text-apple-blue">
              {s}
            </span>
          ))}
        </div>
      )}
      {hints.experienceTitles.length > 0 && (
        <p className="text-[12px] text-apple-text-secondary">
          相关经历：{hints.experienceTitles.join('、')}
        </p>
      )}
      {hints.bioSuggestion && onApplyBio && (
        <ProfileHintCard label="个人简介" suggestion={hints.bioSuggestion} onApply={onApplyBio} />
      )}
      {hints.targetRoleSuggestion && onApplyRole && (
        <ProfileHintCard label="目标岗位" suggestion={hints.targetRoleSuggestion} onApply={onApplyRole} />
      )}
      {hints.locationSuggestion && onApplyLocation && (
        <ProfileHintCard label="所在地" suggestion={hints.locationSuggestion} onApply={onApplyLocation} />
      )}
    </div>
  );
}
