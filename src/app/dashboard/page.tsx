'use client';

import {
  FileText, Search, FileEdit, MessageCircle, Plus,
  Target, Clock, Briefcase, Code, Trophy, GraduationCap,
  TrendingUp, Star, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useMaterials } from '@/lib/material-context';
import { CATEGORY_LABELS } from '@/types/material';
import type { MaterialCategory } from '@/types/material';
import { useEffect, useState } from 'react';

const CATEGORY_ICON_MAP: Record<MaterialCategory, typeof Briefcase> = {
  internship: Briefcase,
  project: Code,
  competition: Trophy,
  research: FileText,
  campus: GraduationCap,
};

const CATEGORY_COLORS: Record<MaterialCategory, string> = {
  internship: 'from-[#0071e3] to-[#5ac8fa]',
  project: 'from-[#8944ab] to-[#bf5af2]',
  competition: 'from-[#ff9f0a] to-[#ff375f]',
  research: 'from-[#34c759] to-[#30d158]',
  campus: 'from-[#5ac8fa] to-[#64d2ff]',
};

const quickActions = [
  { icon: Plus, label: '新建经历', href: '/materials', color: 'text-apple-blue', bg: 'bg-[#e8f4fd] dark:bg-[#003366]' },
  { icon: Search, label: '分析 JD', href: '/jd-analyzer', color: 'text-apple-purple', bg: 'bg-[#f4f1fa] dark:bg-[#2d1445]' },
  { icon: FileEdit, label: '生成简历', href: '/resume-builder', color: 'text-apple-green', bg: 'bg-[#e8f8ee] dark:bg-[#0a3622]' },
  { icon: MessageCircle, label: '模拟面试', href: '/interview', color: 'text-apple-orange', bg: 'bg-[#fff5e5] dark:bg-[#3d2900]' },
];

export default function DashboardPage() {
  const { materials } = useMaterials();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stats = [
    { icon: FileText, label: '档案总数', value: String(materials.length), caption: '素材库', color: 'from-apple-blue to-[#5ac8fa]' },
    { icon: FileEdit, label: '待生成简历', value: '0', caption: '准备中', color: 'from-apple-purple to-[#bf5af2]' },
    { icon: Search, label: 'JD 分析', value: '0', caption: '待分析', color: 'from-apple-green to-[#30d158]' },
    { icon: MessageCircle, label: '面试练习', value: '0', caption: '待练习', color: 'from-apple-orange to-[#ff375f]' },
  ];

  const categoryBreakdown = (['internship', 'project', 'competition', 'research', 'campus'] as MaterialCategory[]).map(
    cat => ({
      category: cat,
      count: materials.filter(m => m.category === cat).length,
    })
  );

  const isEmpty = materials.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 md:py-14">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-apple-text dark:text-white">
            工作台
          </h1>
          <p className="text-[15px] text-apple-text-secondary mt-1.5">
            一个职业档案，多岗位智能适配
          </p>
        </div>
        <Link
          href="/materials"
          className="group inline-flex items-center gap-2 h-11 px-6 rounded-full bg-apple-blue text-white text-[14px] font-medium hover:bg-[#0077ed] shadow-[0_2px_8px_rgba(0,113,227,0.3)] hover:shadow-[0_4px_16px_rgba(0,113,227,0.4)] transition-all duration-200 active:scale-[0.97]"
        >
          <Plus className="w-4 h-4" />
          添加新经历
          <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
        </Link>
      </div>

      {isEmpty ? (
        /* Empty state */
        <div className={`text-center py-20 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#e8f4fd] to-[#f4f1fa] dark:from-[#003366] dark:to-[#2d1445] flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-apple-blue" />
          </div>
          <h2 className="text-[22px] font-semibold text-apple-text dark:text-white mb-3">
            开始构建你的职业档案
          </h2>
          <p className="text-[15px] text-apple-text-secondary max-w-[420px] mx-auto mb-8 leading-relaxed">
            添加你的第一段经历，AI 将帮你结构化整理，
            为你未来的每一次求职做好准备。
          </p>
          <Link
            href="/materials"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-apple-blue text-white text-[14px] font-medium hover:bg-[#0077ed] transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            添加第一段经历
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="apple-card p-5 group"
                style={{
                  transitionDelay: `${i * 0.1}s`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'all 0.6s cubic-bezier(0.32, 0.72, 0, 1)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[12px] text-apple-text-secondary">{stat.caption}</span>
                </div>
                <div className="text-[28px] font-bold tracking-tight text-apple-text dark:text-white">
                  {stat.value}
                </div>
                <div className="text-[12px] text-apple-text-secondary mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-[19px] font-semibold tracking-tight text-apple-text dark:text-white mb-4">
              快捷操作
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <Link key={action.label} href={action.href}>
                  <div
                    className="apple-card p-5 text-center cursor-pointer group"
                    style={{
                      transitionDelay: `${0.2 + i * 0.1}s`,
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                      transition: 'all 0.6s cubic-bezier(0.32, 0.72, 0, 1)',
                    }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <span className="text-[14px] font-medium text-apple-text dark:text-white">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom grid */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Category Breakdown */}
            <div className="md:col-span-2">
              <div className="apple-card">
                <div className="p-5 md:p-6 border-b border-[#d2d2d7]/60 dark:border-[#38383a]/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-[18px] h-[18px] text-apple-blue" />
                    <h2 className="text-[17px] font-semibold tracking-tight text-apple-text dark:text-white">
                      素材分类概览
                    </h2>
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <div className="space-y-5">
                    {categoryBreakdown.map(({ category, count }) => {
                      const Icon = CATEGORY_ICON_MAP[category];
                      const maxCount = Math.max(...categoryBreakdown.map(c => c.count), 1);
                      const pct = (count / maxCount) * 100;
                      return (
                        <div key={category} className="flex items-center gap-4 group">
                          <div className="w-9 h-9 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                            <Icon className="w-[18px] h-[18px] text-apple-text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[14px] font-medium text-apple-text dark:text-white">
                                {CATEGORY_LABELS[category]}
                              </span>
                              <span className="text-[13px] text-apple-text-secondary">{count} 项</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${CATEGORY_COLORS[category]} transition-all duration-1000 ease-out`}
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

            {/* Skill Recommendations */}
            <div className="apple-card">
              <div className="p-5 md:p-6 border-b border-[#d2d2d7]/60 dark:border-[#38383a]/60">
                <div className="flex items-center gap-2">
                  <Target className="w-[18px] h-[18px] text-apple-orange" />
                  <h2 className="text-[17px] font-semibold tracking-tight text-apple-text dark:text-white">
                    推荐技能
                  </h2>
                </div>
              </div>
              <div className="p-5 md:p-6">
                <div className="space-y-4">
                  {[
                    { skill: 'SQL', level: '建议掌握', urgency: 'high' },
                    { skill: '用户研究', level: '建议学习', urgency: 'medium' },
                    { skill: 'A/B 测试', level: '基础了解', urgency: 'medium' },
                    { skill: '数据可视化', level: '建议提升', urgency: 'low' },
                  ].map((item) => (
                    <div key={item.skill} className="flex items-center justify-between group hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] -mx-2 px-2 py-1.5 rounded-lg transition-colors">
                      <span className="text-[14px] text-apple-text dark:text-white">{item.skill}</span>
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                          item.urgency === 'high'
                            ? 'bg-[#fff5e5] dark:bg-[#3d2900] text-apple-orange'
                            : item.urgency === 'medium'
                              ? 'bg-[#e8f4fd] dark:bg-[#003366] text-apple-blue'
                              : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary'
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
        </>
      )}
    </div>
  );
}
