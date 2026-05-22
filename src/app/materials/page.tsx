'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, FolderOpen } from 'lucide-react';
import { MaterialCard } from '@/components/materials/material-card';
import { MaterialForm } from '@/components/materials/material-form';
import { useMaterials } from '@/lib/material-context';
import type { Material, MaterialCategory } from '@/types/material';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/material';

const ALL_CATEGORIES: (MaterialCategory | 'all')[] = ['all', 'internship', 'project', 'competition', 'research', 'campus'];

export default function MaterialsPage() {
  const { materials, getMaterialsByCategory, searchMaterials } = useMaterials();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MaterialCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);

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

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 md:py-14 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-apple-text dark:text-white">
            职业素材库
          </h1>
          <p className="text-[15px] text-apple-text-secondary mt-1.5">
            一次录入经历，AI 自动拆解为 STAR 格式，多岗位智能适配
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-apple-blue text-white text-[14px] font-medium hover:bg-[#0077ed] shadow-[0_2px_8px_rgba(0,113,227,0.3)] transition-all duration-200 active:scale-[0.97]"
        >
          <Plus className="w-4 h-4" />
          新建经历
        </button>
      </div>

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

      {/* Materials List */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(material => (
            <MaterialCard key={material.id} material={material} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
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
              : '点击「新建经历」添加你的第一段职业素材，AI 将自动帮你拆解为 STAR 格式'}
          </p>
          {!search && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-apple-blue text-white text-[14px] font-medium hover:bg-[#0077ed] shadow-[0_2px_8px_rgba(0,113,227,0.3)] transition-all duration-200 active:scale-[0.97]"
            >
              <Plus className="w-4 h-4" />
              新建经历
            </button>
          )}
        </div>
      )}

      {showForm && (
        <MaterialForm material={editMaterial} onClose={handleCloseForm} />
      )}
    </div>
  );
}
