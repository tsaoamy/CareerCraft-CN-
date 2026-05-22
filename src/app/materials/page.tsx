'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, FileText, FolderOpen } from 'lucide-react';
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

  // Filter materials
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

  // Category counts
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
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            职业素材库
          </h1>
          <p className="text-muted-foreground mt-1">
            一次录入经历，AI 自动拆解为 STAR 格式，多岗位智能适配
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm shadow-lg shadow-primary/25"
        >
          <Plus className="w-4 h-4" />
          新建经历
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-sm ${
              activeCategory === cat
                ? 'border-primary bg-primary/10 text-primary font-medium shadow-sm'
                : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
            }`}
          >
            <span className="text-base">{cat === 'all' ? '📂' : CATEGORY_ICONS[cat]}</span>
            <span className="truncate">{cat === 'all' ? '全部' : CATEGORY_LABELS[cat]}</span>
            <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${
              activeCategory === cat ? 'bg-primary/20' : 'bg-secondary'
            }`}>
              {categoryCounts[cat] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索经历标题、内容、标签或技能..."
          className="w-full max-w-md pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-sm"
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
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            {search ? (
              <Search className="w-10 h-10 text-primary/60" />
            ) : (
              <FolderOpen className="w-10 h-10 text-primary/60" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {search ? '未找到匹配的经历' : '素材库还是空的'}
          </h3>
          <p className="text-muted-foreground text-sm mb-5 max-w-sm mx-auto">
            {search
              ? '试试其他关键词或切换分类'
              : '点击「新建经历」添加你的第一段职业素材，AI 将自动帮你拆解为 STAR 格式'}
          </p>
          {!search && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              新建经历
            </button>
          )}
        </div>
      )}

      {/* Material Form Modal */}
      {showForm && (
        <MaterialForm material={editMaterial} onClose={handleCloseForm} />
      )}
    </div>
  );
}
