'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';
import type { Material, MaterialFormData, MaterialCategory } from '@/types/material';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/material';
import { useMaterials } from '@/lib/material-context';

const CATEGORIES: MaterialCategory[] = ['internship', 'project', 'competition', 'research', 'campus'];

interface MaterialFormProps {
  material?: Material | null;
  onClose: () => void;
  seedContent?: string | null;
}

export function MaterialForm({ material, onClose, seedContent }: MaterialFormProps) {
  const { addMaterial, updateMaterial } = useMaterials();
  const isEdit = !!material;

  const [form, setForm] = useState<MaterialFormData>({
    title: '',
    category: 'project',
    rawContent: '',
    star: { situation: '', task: '', action: '', result: '' },
    tags: [],
    skills: [],
    highlights: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => {
    if (material) {
      setForm({
        title: material.title,
        category: material.category,
        rawContent: material.rawContent,
        star: material.star,
        tags: material.tags,
        skills: material.skills,
        highlights: material.highlights,
      });
    } else if (seedContent) {
      setForm(f => ({ ...f, rawContent: seedContent }));
    }
  }, [material, seedContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.rawContent.trim()) return;
    if (isEdit) {
      updateMaterial(material.id, form);
    } else {
      addMaterial(form);
    }
    onClose();
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(f => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput('');
  };

  const addHighlight = () => {
    const h = highlightInput.trim();
    if (h && !form.highlights.includes(h)) {
      setForm(f => ({ ...f, highlights: [...f.highlights, h] }));
    }
    setHighlightInput('');
  };

  const updateStar = (field: keyof MaterialFormData['star'], value: string) => {
    setForm(f => ({ ...f, star: { ...f.star, [field]: value } }));
  };

  const STAR_FIELDS = [
    { key: 'situation' as const, label: 'S · 情境', placeholder: '当时背景是什么？面临什么问题？', accent: 'border-[#0071e3] text-[#0071e3]' },
    { key: 'task' as const, label: 'T · 任务', placeholder: '你的目标或需要完成的任务是什么？', accent: 'border-[#8944ab] text-[#8944ab]' },
    { key: 'action' as const, label: 'A · 行动', placeholder: '你具体采取了哪些行动？用了什么方法？', accent: 'border-[#34c759] text-[#34c759]' },
    { key: 'result' as const, label: 'R · 结果', placeholder: '取得了什么成果？用数据量化效果。', accent: 'border-[#ff9f0a] text-[#ff9f0a]' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] bg-black/30 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="apple-card shadow-2xl w-full max-w-[640px] mx-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#d2d2d7]/60 dark:border-[#38383a]/60">
          <div>
            <h2 className="text-[20px] font-bold tracking-tight text-apple-text dark:text-white">
              {isEdit ? '编辑经历' : '新建经历'}
            </h2>
            <p className="text-[13px] text-apple-text-secondary mt-1">
              {isEdit ? '更新你的职业经历素材' : '录入工作/项目/竞赛等经历，AI 将自动拆解为 STAR 格式'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-apple-text-secondary hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] hover:text-apple-text dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-apple-text dark:text-white">
              经历标题 <span className="text-apple-red">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="例如：智能驾驶疲劳检测系统、腾讯产品实习"
              className="w-full h-12 px-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[15px] text-apple-text dark:text-white placeholder:text-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:border-apple-blue transition-colors"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-apple-text dark:text-white">分类</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                    form.category === cat
                      ? 'bg-apple-blue text-white shadow-[0_2px_8px_rgba(0,113,227,0.3)]'
                      : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'
                  }`}
                >
                  {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Raw Content */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-apple-text dark:text-white">
              原始描述 <span className="text-apple-red">*</span>
            </label>
            <textarea
              value={form.rawContent}
              onChange={e => setForm(f => ({ ...f, rawContent: e.target.value }))}
              placeholder="详细描述这段经历：你做了什么、怎么做的、取得了什么成果..."
              rows={4}
              className="w-full p-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white placeholder:text-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:border-apple-blue transition-colors resize-none"
              required
            />
          </div>

          {/* STAR Decomposition */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-apple-orange" />
              <h3 className="text-[13px] font-semibold text-apple-text dark:text-white">
                STAR 拆解
              </h3>
              <span className="text-[11px] text-apple-text-secondary">
                （手动填写或稍后由 AI 自动生成）
              </span>
            </div>
            <div className="grid gap-3">
              {STAR_FIELDS.map(({ key, label, placeholder, accent }) => (
                <div key={key}>
                  <label className={`text-[12px] font-medium ${accent.split(' ')[1]} mb-1.5 block`}>
                    {label}
                  </label>
                  <textarea
                    value={form.star[key]}
                    onChange={e => updateStar(key, e.target.value)}
                    placeholder={placeholder}
                    rows={2}
                    className={`w-full px-4 py-2.5 rounded-xl border-l-2 ${accent.split(' ')[0]} border-t border-r border-b border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[13px] text-apple-text dark:text-white placeholder:text-apple-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-apple-blue/40 transition-colors resize-none`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-apple-text dark:text-white">标签</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="输入标签后按回车"
                className="flex-1 h-10 px-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white placeholder:text-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:border-apple-blue transition-colors"
              />
              <button
                type="button"
                onClick={addTag}
                className="w-10 h-10 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full bg-[#e8f4fd] dark:bg-[#003366] text-apple-blue font-medium">
                    {tag}
                    <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))} className="hover:text-apple-red">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-apple-text dark:text-white">涉及技能</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="例如：Python、SQL、用户研究"
                className="flex-1 h-10 px-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white placeholder:text-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:border-apple-blue transition-colors"
              />
              <button
                type="button"
                onClick={addSkill}
                className="w-10 h-10 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.skills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full bg-[#e8f4fd] dark:bg-[#003366] text-apple-blue font-medium">
                    {skill}
                    <button type="button" onClick={() => setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }))} className="hover:text-apple-red">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-apple-text dark:text-white">高亮要点</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={highlightInput}
                onChange={e => setHighlightInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                placeholder="添加这段经历的亮点"
                className="flex-1 h-10 px-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white placeholder:text-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:border-apple-blue transition-colors"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="w-10 h-10 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center text-apple-text-secondary hover:text-apple-text dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.highlights.length > 0 && (
              <ul className="space-y-1.5 mt-2">
                {form.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2 text-[14px] text-apple-text dark:text-white">
                    <span className="text-apple-blue">•</span>
                    {h}
                    <button type="button" onClick={() => setForm(f => ({ ...f, highlights: f.highlights.filter((_, idx) => idx !== i) }))} className="ml-auto text-apple-text-secondary hover:text-apple-red transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-[#d2d2d7]/60 dark:border-[#38383a]/60">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[14px] font-medium text-apple-text dark:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-full bg-apple-blue text-white text-[14px] font-medium hover:bg-[#0077ed] shadow-[0_2px_8px_rgba(0,113,227,0.3)] transition-all duration-200"
            >
              {isEdit ? '保存修改' : '保存经历'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
