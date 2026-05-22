'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Material, MaterialFormData, MaterialCategory } from '@/types/material';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/material';
import { useMaterials } from '@/lib/material-context';

const CATEGORIES: MaterialCategory[] = ['internship', 'project', 'competition', 'research', 'campus'];

interface MaterialFormProps {
  material?: Material | null;
  onClose: () => void;
}

export function MaterialForm({ material, onClose }: MaterialFormProps) {
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
    }
  }, [material]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-2xl mx-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {isEdit ? '编辑经历' : '新建经历'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEdit ? '更新你的职业经历素材' : '录入工作/项目/竞赛等经历，AI 将自动拆解为 STAR 格式'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              经历标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="例如：智能驾驶疲劳检测系统、腾讯产品实习"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-sm"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">分类</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    form.category === cat
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                  }`}
                >
                  {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Raw Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              原始描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.rawContent}
              onChange={e => setForm(f => ({ ...f, rawContent: e.target.value }))}
              placeholder="详细描述这段经历：你做了什么、怎么做的、取得了什么成果..."
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-sm resize-none"
              required
            />
          </div>

          {/* STAR Decomposition */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-amber-500">★</span>
              STAR 拆解
              <span className="text-xs text-muted-foreground font-normal">
                （手动填写或稍后由 AI 自动生成）
              </span>
            </h3>
            <div className="grid gap-3">
              {[
                { key: 'situation' as const, label: 'S · 情境（Situation）', placeholder: '当时背景是什么？面临什么问题？', icon: '🔵' },
                { key: 'task' as const, label: 'T · 任务（Task）', placeholder: '你的目标或需要完成的任务是什么？', icon: '🟣' },
                { key: 'action' as const, label: 'A · 行动（Action）', placeholder: '你具体采取了哪些行动？用了什么方法？', icon: '🟢' },
                { key: 'result' as const, label: 'R · 结果（Result）', placeholder: '取得了什么成果？用数据量化效果。', icon: '🟡' },
              ].map(({ key, label, placeholder, icon }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {icon} {label}
                  </label>
                  <textarea
                    value={form.star[key]}
                    onChange={e => updateStar(key, e.target.value)}
                    placeholder={placeholder}
                    rows={2}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">标签</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="输入标签后按回车"
                className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              <button type="button" onClick={addTag} className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-primary/10 transition-colors text-sm">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                    {tag}
                    <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}>
                      <X className="w-3 h-3 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">涉及技能</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="例如：Python、SQL、用户研究"
                className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              <button type="button" onClick={addSkill} className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-primary/10 transition-colors text-sm">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.skills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {skill}
                    <button type="button" onClick={() => setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }))}>
                      <X className="w-3 h-3 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">高亮要点</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={highlightInput}
                onChange={e => setHighlightInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                placeholder="添加这段经历的亮点"
                className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              <button type="button" onClick={addHighlight} className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-primary/10 transition-colors text-sm">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.highlights.length > 0 && (
              <ul className="space-y-1 mt-2">
                {form.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <span className="text-primary">•</span>
                    {h}
                    <button type="button" onClick={() => setForm(f => ({ ...f, highlights: f.highlights.filter((_, idx) => idx !== i) }))}>
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              {isEdit ? '保存修改' : '保存经历'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
