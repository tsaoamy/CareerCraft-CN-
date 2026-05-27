'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, FolderOpen, Lightbulb, BookOpen, ArrowRight, Play, CheckCircle2, Target, Sparkles } from 'lucide-react';
import { MaterialCard } from '@/components/materials/material-card';
import { MaterialForm } from '@/components/materials/material-form';
import { useMaterials } from '@/lib/material-context';
import type { Material, MaterialCategory } from '@/types/material';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/material';

const ALL_CATEGORIES: (MaterialCategory | 'all')[] = ['all', 'internship', 'project', 'competition', 'research', 'campus'];

const WORKFLOW_STEPS = [
  { icon: "1️⃣", title: "录入经历", desc: "将你的实习、项目、竞赛等经历录入素材库", link: "#start" },
  { icon: "2️⃣", title: "AI 结构化", desc: "AI 自动拆解为 STAR 格式，提取技能标签", link: "#ai" },
  { icon: "3️⃣", title: "JD 匹配", desc: "到 JD 解析器查看岗位匹配度", link: "/jd-analyzer" },
  { icon: "4️⃣", title: "生成简历", desc: "一键生成针对岗位优化的定制简历", link: "/resume-builder" },
  { icon: "5️⃣", title: "模拟面试", desc: "AI 面试官基于你的经历出题练习", link: "/interview" },
];

const QUICK_TEMPLATES = [
  {
    category: 'internship' as MaterialCategory,
    title: "实习经历模板",
    template: "【公司名称】· 【岗位】· 【时间：2024.06-2024.09】\n\n负责【XX产品/项目】的功能优化和数据分析。\n- 主导了XX功能改版，提升用户留存 12%\n- 通过A/B测试优化转化流程\n- 输出XX份竞品分析报告",
    icon: "💼",
  },
  {
    category: 'project' as MaterialCategory,
    title: "项目经历模板",
    template: "【项目名称】· 【角色：项目负责人】· 【时间：2023.03-2023.06】\n\n基于【React+Node.js】开发的【XX系统】。\n- 从0到1搭建项目架构，服务XX用户\n- 技术栈：React, Node.js, MongoDB\n- 获得XX奖项或XX%的效率提升",
    icon: "🚀",
  },
  {
    category: 'competition' as MaterialCategory,
    title: "竞赛经历模板",
    template: "【竞赛名称】· 【奖项：全国一等奖/金奖】\n\n团队角色：队长，负责算法设计与答辩。\n- 解决XX问题，准确率达到 XX%\n- 团队协作：带领5人团队完成从方案到交付\n- 技术亮点：使用了XX模型/方法",
    icon: "🏆",
  },
];

export default function MaterialsPage() {
  const { materials, getMaterialsByCategory, searchMaterials } = useMaterials();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MaterialCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [seedTemplate, setSeedTemplate] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = activeCategory === 'all' ? materials : getMaterialsByCategory(activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.rawContent.toLowerCase().includes(q) ||
          m.tags.some(t => t.toLowerCase().includes(q)) ||
          m.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    return result;
  }, [materials, activeCategory, search, getMaterialsByCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: materials.length };
    for (const cat of ALL_CATEGORIES) {
      if (cat !== 'all') counts[cat] = getMaterialsByCategory(cat).length;
    }
    return counts;
  }, [materials, getMaterialsByCategory]);

  const handleEdit = (material: Material) => {
    setEditMaterial(material);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditMaterial(null);
  };

  const handleUseTemplate = (template: string) => {
    setSeedTemplate(template);
    setShowForm(true);
  };

  const isEmpty = materials.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 md:py-14 animate-fade-in-up">
      {/* Header — Starry Sky */}
      <div className="relative mb-8 overflow-hidden rounded-3xl nebula-hero border border-white/10 p-6 md:p-8">
        <div className="shooting-star" /><div className="shooting-star" />
        <div className="constellation-dot" style={{top:'6%',left:'12%'}} />
        <div className="constellation-dot" style={{top:'16%',left:'30%'}} />
        <div className="constellation-dot" style={{top:'10%',left:'55%'}} />
        <div className="constellation-dot" style={{top:'22%',left:'72%'}} />
        <div className="constellation-dot" style={{top:'8%',left:'88%'}} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[12px] text-blue-200">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              星辰素材 · STAR拆解
            </div>
            <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-white">
              职业素材库
            </h1>
            <p className="text-[15px] text-blue-100/80 mt-1.5 max-w-lg">
              一次录入经历，AI 自动拆解为 STAR 格式，多岗位智能适配
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-[13px] font-medium bg-white/10 border border-white/10 text-blue-100 hover:bg-white/20 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              {showGuide ? "收起指南" : "使用指南"}
            </button>
            <button
              onClick={() => { setSeedTemplate(null); setShowForm(true); }}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[14px] font-medium hover:from-blue-400 hover:to-purple-400 shadow-[0_2px_16px_rgba(100,80,255,0.35)] transition-all duration-200 active:scale-[0.97]"
            >
              <Plus className="w-4 h-4" />
              新建经历
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Guide */}
      {showGuide && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#e8f4fd] to-[#f4f1fa] dark:from-[#003366] dark:to-[#2d1445] border border-[#0071e3]/10 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb className="w-5 h-5 text-apple-blue" />
            <h2 className="text-[17px] font-semibold text-apple-text dark:text-white">💡 素材库工作流</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/60 dark:bg-[#1c1c1e]/60">
                <span className="text-[20px] shrink-0">{step.icon}</span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-apple-text dark:text-white">{step.title}</p>
                  <p className="text-[12px] text-apple-text-secondary mt-0.5">{step.desc}</p>
                  {step.link.startsWith('/') && (
                    <a href={step.link} className="text-[11px] text-apple-blue hover:underline inline-flex items-center gap-1 mt-1.5">
                      <Play className="w-3 h-3" /> 开始
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Templates for empty state */}
      {isEmpty && (
        <div className="mb-8 p-6 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-[#d2d2d7]/40 dark:border-[#38383a]/40">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-apple-orange" />
            <h2 className="text-[17px] font-semibold text-apple-text dark:text-white">📋 快速开始模板</h2>
          </div>
          <p className="text-[13px] text-apple-text-secondary mb-4">
            选择下方模板快速创建第一段经历，AI 将帮你自动结构化整理
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {QUICK_TEMPLATES.map((tpl) => (
              <button
                key={tpl.title}
                onClick={() => handleUseTemplate(tpl.template)}
                className="text-left p-4 rounded-xl bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7]/40 dark:border-[#38383a]/40 hover:border-apple-blue/50 hover:shadow-md transition-all group"
              >
                <span className="text-[24px] mb-2 block">{tpl.icon}</span>
                <p className="text-[14px] font-semibold text-apple-text dark:text-white group-hover:text-apple-blue transition-colors">
                  {tpl.title}
                </p>
                <p className="text-[11px] text-apple-text-secondary mt-1.5 line-clamp-3 whitespace-pre-line">
                  {tpl.template.slice(0, 100)}...
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-apple-blue text-white shadow-[0_2px_8px_rgba(0,113,227,0.3)]'
                : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'
            }`}
          >
            <span>{cat === 'all' ? '📂' : CATEGORY_ICONS[cat]}</span>
            <span>{cat === 'all' ? '全部' : CATEGORY_LABELS[cat]}</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
              activeCategory === cat
                ? 'bg-white/20 text-white'
                : 'bg-[#e8e8ed] dark:bg-[#3a3a3c] text-apple-text-secondary'
            }`}>
              {categoryCounts[cat] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-apple-text-secondary" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索经历标题、内容、标签或技能..."
          className="w-full max-w-md h-12 pl-11 pr-5 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white placeholder:text-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:border-apple-blue transition-colors"
        />
      </div>

      {/* Progress indicator */}
      {!isEmpty && (
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-apple-green" />
            <span className="text-[13px] text-apple-text-secondary">
              已建立 <span className="font-semibold text-apple-text dark:text-white">{materials.length}</span> 段经历，
              覆盖 <span className="font-semibold text-apple-text dark:text-white">{Object.values(categoryCounts).filter(Boolean).length - 1}</span> 个分类
            </span>
          </div>
          <div className="flex-1 h-1.5 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-full overflow-hidden max-w-[200px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-apple-blue to-apple-purple transition-all"
              style={{ width: `${Math.min((materials.length / 10) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Materials List */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(material => (
            <MaterialCard key={material.id} material={material} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center">
            {search ? (
              <Search className="w-10 h-10 text-apple-text-secondary/40" />
            ) : (
              <FolderOpen className="w-10 h-10 text-apple-text-secondary/40" />
            )}
          </div>
          <h3 className="text-[19px] font-semibold tracking-tight text-apple-text dark:text-white mb-2">
            {search ? '未找到匹配的经历' : '素材库还是空的'}
          </h3>
          <p className="text-[14px] text-apple-text-secondary mb-6 max-w-sm mx-auto">
            {search
              ? '试试其他关键词或切换分类'
              : '点击上方「新建经历」或选择一个快速模板开始吧！'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { setSeedTemplate(null); setShowForm(true); }}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-apple-blue text-white text-[14px] font-medium hover:bg-[#0077ed] shadow-[0_2px_8px_rgba(0,113,227,0.3)] transition-all duration-200 active:scale-[0.97]"
            >
              <Plus className="w-4 h-4" />
              新建经历
            </button>
            <button
              onClick={() => setShowGuide(true)}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary text-[14px] font-medium hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-all"
            >
              <BookOpen className="w-4 h-4" />
              查看指南
            </button>
          </div>
        </div>
      )}

      {/* Next Steps */}
      {!isEmpty && filtered.length > 0 && (
        <div className="mt-10 p-6 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-[#d2d2d7]/40 dark:border-[#38383a]/40">
          <h3 className="text-[16px] font-semibold text-apple-text dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-apple-green" />
            接下来你可以：
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            <a href="/jd-analyzer" className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#2c2c2e] hover:shadow-md transition-all group">
              <span className="text-[24px]">🔍</span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-apple-text dark:text-white">分析 JD 匹配度</p>
                <p className="text-[12px] text-apple-text-secondary">查看素材与岗位匹配情况</p>
              </div>
              <ArrowRight className="w-4 h-4 text-apple-text-secondary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="/resume-builder" className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#2c2c2e] hover:shadow-md transition-all group">
              <span className="text-[24px]">📄</span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-apple-text dark:text-white">生成定制简历</p>
                <p className="text-[12px] text-apple-text-secondary">一键生成岗位优化简历</p>
              </div>
              <ArrowRight className="w-4 h-4 text-apple-text-secondary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="/interview" className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#2c2c2e] hover:shadow-md transition-all group">
              <span className="text-[24px]">💬</span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-apple-text dark:text-white">开始模拟面试</p>
                <p className="text-[12px] text-apple-text-secondary">基于你的经历出题练习</p>
              </div>
              <ArrowRight className="w-4 h-4 text-apple-text-secondary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      )}

      {showForm && (
        <MaterialForm material={editMaterial} onClose={handleCloseForm} seedContent={seedTemplate} />
      )}
    </div>
  );
}
