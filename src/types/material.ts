export type MaterialCategory = 'internship' | 'project' | 'competition' | 'research' | 'campus';

export interface STAR {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface Material {
  id: string;
  title: string;
  category: MaterialCategory;
  dateRange?: string;
  rawContent: string;
  star: STAR;
  tags: string[];
  skills: string[];
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MaterialFormData {
  title: string;
  category: MaterialCategory;
  dateRange?: string;
  rawContent: string;
  star: STAR;
  tags: string[];
  skills: string[];
  highlights: string[];
}

export const CATEGORY_LABELS: Record<MaterialCategory, string> = {
  internship: '实习经历',
  project: '项目经历',
  competition: '竞赛经历',
  research: '科研经历',
  campus: '校园经历',
};

export const CATEGORY_COLORS: Record<MaterialCategory, string> = {
  internship: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  project: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  competition: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  research: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  campus: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};
