'use client';

import {
  FileText,
  Search,
  FileEdit,
  MessageCircle,
  Plus,
  Target,
  Clock,
  Briefcase,
  Code,
  Trophy,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';
import { useMaterials } from '@/lib/material-context';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/material';
import type { MaterialCategory } from '@/types/material';

const CATEGORY_ICON_MAP: Record<MaterialCategory, typeof Briefcase> = {
  internship: Briefcase,
  project: Code,
  competition: Trophy,
  research: FileText,
  campus: GraduationCap,
};

const quickActions = [
  { icon: Plus, label: '新建经历', href: '/materials', color: 'text-primary-500 bg-primary-50 dark:bg-primary-950' },
  { icon: Search, label: '分析 JD', href: '/jd-analyzer', color: 'text-accent-500 bg-accent-50 dark:bg-accent-950' },
  { icon: FileEdit, label: '生成简历', href: '/resume-builder', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950' },
  { icon: MessageCircle, label: '模拟面试', href: '/interview', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950' },
];

export default function DashboardPage() {
  const { materials } = useMaterials();

  const stats = [
    { icon: FileText, label: '档案总数', value: String(materials.length), change: '素材库', trend: 'up' as const },
    { icon: FileEdit, label: '待生成简历', value: '0', change: '准备中', trend: 'up' as const },
    { icon: Search, label: 'JD 分析', value: '0', change: '待分析', trend: 'up' as const },
    { icon: MessageCircle, label: '面试练习', value: '0', change: '待练习', trend: 'up' as const },
  ];

  const categoryBreakdown = (['internship', 'project', 'competition', 'research', 'campus'] as MaterialCategory[]).map(
    cat => {
      const count = materials.filter(m => m.category === cat).length;
      return { category: cat, count };
    }
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            工作台
          </h1>
          <p className="text-muted-foreground mt-1">一个职业档案，多岗位智能适配</p>
        </div>
        <Link
          href="/materials"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm shadow-lg shadow-primary/25"
        >
          <Plus className="w-4 h-4" /> 添加新经历
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary-500" />
              </div>
              <span className="text-xs text-muted-foreground">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <Link key={action.label} href={action.href}>
              <div className="rounded-xl border border-border bg-card p-5 text-center hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-3`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Category Breakdown + Skill Gap */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-border bg-card">
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-semibold">素材分类概览</h2>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {categoryBreakdown.map(({ category, count }) => {
                  const Icon = CATEGORY_ICON_MAP[category];
                  const maxCount = Math.max(...categoryBreakdown.map(c => c.count), 1);
                  const pct = (count / maxCount) * 100;
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
                          </span>
                          <span className="text-sm text-muted-foreground">{count} 项</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Skill Gap */}
        <div className="rounded-xl border border-border bg-card">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold">推荐技能</h2>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {[
                { skill: 'SQL', level: '建议掌握', urgency: 'high' },
                { skill: '用户研究', level: '建议学习', urgency: 'medium' },
                { skill: 'A/B 测试', level: '基础了解', urgency: 'medium' },
                { skill: '数据可视化', level: '建议提升', urgency: 'low' },
              ].map(item => (
                <div key={item.skill} className="flex items-center justify-between">
                  <span className="text-sm">{item.skill}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.urgency === 'high'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        : item.urgency === 'medium'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
