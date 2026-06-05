"use client";

import {
  LayoutDashboard,
  FolderOpen,
  Target,
  Search,
  FileEdit,
  MessageCircle,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode } from "react";
import { EmptyState } from "./empty-state";

export type FeaturePageKey =
  | "dashboard"
  | "materials"
  | "materials-search"
  | "matching"
  | "matching-positions"
  | "jd-analyzer"
  | "resume-builder"
  | "applications"
  | "interview";

interface PresetConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

const PRESETS: Record<FeaturePageKey, PresetConfig> = {
  dashboard: {
    icon: LayoutDashboard,
    title: "你的职业档案尚未启动",
    description: "录入第一段经历，AI 将为你构建可复用的职业知识库。",
    action: { label: "初始化档案", href: "/materials" },
  },
  materials: {
    icon: FolderOpen,
    title: "知识库等待写入",
    description: "每一次项目、实习与竞赛，都是未来简历的原始数据。",
    action: { label: "录入第一段经历", href: "#" },
  },
  "materials-search": {
    icon: Search,
    title: "未找到匹配素材",
    description: "换个关键词，或录入新的经历扩展你的档案库。",
    action: { label: "新建经历", href: "#" },
  },
  matching: {
    icon: Target,
    title: "选择目标岗位",
    description: "从左侧列表选中岗位，系统将开始匹配度分析。",
  },
  "matching-positions": {
    icon: Target,
    title: "暂无匹配岗位",
    description: "调整行业筛选或搜索关键词，发现更多机会。",
  },
  "jd-analyzer": {
    icon: Search,
    title: "等待 JD 输入",
    description: "粘贴岗位描述，系统将解析核心要求并量化匹配差距。",
    action: { label: "完善素材库", href: "/materials" },
  },
  "resume-builder": {
    icon: FileEdit,
    title: "简历引擎待启动",
    description: "输入目标岗位，AI 将从你的档案库检索最相关经历并生成定制简历。",
    action: { label: "完善素材库", href: "/materials" },
  },
  applications: {
    icon: ClipboardList,
    title: "投递追踪尚未开始",
    description: "在 JD 分析后保存岗位，或手动添加记录，构建你的求职 pipeline。",
    action: { label: "分析岗位", href: "/jd-analyzer" },
  },
  interview: {
    icon: MessageCircle,
    title: "面试模拟待开启",
    description: "基于目标岗位生成针对性问题，在真实场景中演练。",
    action: { label: "开始模拟", href: "/interview" },
  },
};

export function FeatureEmpty({
  page,
  title,
  description,
  primaryLabel,
  onPrimary,
  primaryHref,
  secondaryAction,
  compact,
}: {
  page: FeaturePageKey;
  title?: string;
  description?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryHref?: string;
  secondaryAction?: ReactNode;
  compact?: boolean;
}) {
  const preset = PRESETS[page];
  const label = primaryLabel ?? preset.action?.label;
  const href = primaryHref ?? preset.action?.href;

  const action =
    onPrimary && label
      ? { label, onClick: onPrimary }
      : href && label
        ? { label, href }
        : undefined;

  return (
    <EmptyState
      icon={preset.icon}
      title={title ?? preset.title}
      description={description ?? preset.description}
      compact={compact}
      action={action}
      secondaryAction={secondaryAction}
    />
  );
}
