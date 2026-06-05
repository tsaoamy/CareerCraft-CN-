import {
  Briefcase,
  Code2,
  Trophy,
  FlaskConical,
  GraduationCap,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import type { MaterialCategory } from '@/types/material';
import { cn } from '@/lib/utils';

export const CATEGORY_ICON_MAP: Record<MaterialCategory, LucideIcon> = {
  internship: Briefcase,
  project: Code2,
  competition: Trophy,
  research: FlaskConical,
  campus: GraduationCap,
};

export const CATEGORY_ACCENT: Record<MaterialCategory, string> = {
  internship: 'text-[#0071e3] bg-[#0071e3]/10',
  project: 'text-[#8944ab] bg-[#8944ab]/10',
  competition: 'text-[#ff9f0a] bg-[#ff9f0a]/10',
  research: 'text-[#34c759] bg-[#34c759]/10',
  campus: 'text-[#5ac8fa] bg-[#5ac8fa]/10',
};

const ALL_ICON = Layers;

interface CategoryIconProps {
  category: MaterialCategory | 'all';
  size?: 'sm' | 'md';
  className?: string;
  showBackground?: boolean;
}

export function CategoryIcon({
  category,
  size = 'sm',
  className,
  showBackground = true,
}: CategoryIconProps) {
  const Icon = category === 'all' ? ALL_ICON : CATEGORY_ICON_MAP[category];
  const accent = category === 'all' ? 'text-apple-blue bg-[#0071e3]/10' : CATEGORY_ACCENT[category];
  const dim = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const box = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';

  if (!showBackground) {
    return <Icon className={cn(dim, className)} />;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-lg shrink-0',
        box,
        accent,
        className
      )}
    >
      <Icon className={dim} strokeWidth={1.75} />
    </span>
  );
}
