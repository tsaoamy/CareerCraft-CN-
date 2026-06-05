/**
 * 简历完成进度 — 仅根据实际填写内容判定，访问页面不算完成
 */

import type { Material } from '@/types/material';
import type { UserProfileSettings } from '@/types/user-profile';

function filled(text: string | undefined, min: number): boolean {
  return (text?.trim().length ?? 0) >= min;
}

export interface ResumeProgressStep {
  id: string;
  label: string;
  hint: string;
  href: string;
  done: boolean;
}

export interface ResumeProgress {
  percent: number;
  steps: ResumeProgressStep[];
  isComplete: boolean;
  completedCount: number;
}

/** 经历：标题 + 描述均有实质内容 */
function hasValidExperience(materials: Material[]): boolean {
  return materials.some(
    (m) => filled(m.title, 2) && filled(m.rawContent, 20)
  );
}

/** 成果：STAR 行动/成果或亮点至少一项 */
function hasValidAchievement(materials: Material[]): boolean {
  return materials.some(
    (m) =>
      filled(m.star.result, 10) ||
      filled(m.star.action, 10) ||
      m.highlights.some((h) => filled(h, 5))
  );
}

/** 技能：至少一个非空技能标签 */
function hasValidSkills(materials: Material[]): boolean {
  return materials.some((m) => m.skills.some((s) => s.trim().length > 0));
}

/** 求职意向：目标岗位 + 个人简介 */
function hasValidIntent(profile: UserProfileSettings): boolean {
  return filled(profile.targetRole, 2) && filled(profile.bio, 10);
}

export function computeResumeProgress(
  materials: Material[],
  profile: UserProfileSettings
): ResumeProgress {
  const steps: ResumeProgressStep[] = [
    {
      id: 'experience',
      label: '录入经历',
      hint: '至少一段，含标题与 20 字以上描述',
      href: '/materials',
      done: hasValidExperience(materials),
    },
    {
      id: 'achievement',
      label: '成果亮点',
      hint: '填写 STAR 成果/行动或亮点',
      href: '/materials',
      done: hasValidAchievement(materials),
    },
    {
      id: 'skills',
      label: '技能标签',
      hint: '为经历添加技能关键词',
      href: '/materials',
      done: hasValidSkills(materials),
    },
    {
      id: 'intent',
      label: '求职意向',
      hint: '在设置中填写目标岗位与个人简介',
      href: '/settings',
      done: hasValidIntent(profile),
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const percent = Math.round((completedCount / steps.length) * 100);

  return {
    percent,
    steps,
    isComplete: completedCount === steps.length,
    completedCount,
  };
}
