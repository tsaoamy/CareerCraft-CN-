'use client';

import { useState } from 'react';
import { X, Edit3, Trash2, ChevronDown, ChevronUp, Star, Tag, Award } from 'lucide-react';
import type { Material } from '@/types/material';
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from '@/types/material';
import { useMaterials } from '@/lib/material-context';

interface MaterialCardProps {
  material: Material;
  onEdit: (material: Material) => void;
}

export function MaterialCard({ material, onEdit }: MaterialCardProps) {
  const { deleteMaterial } = useMaterials();
  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = () => {
    deleteMaterial(material.id);
    setShowDelete(false);
  };

  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{CATEGORY_ICONS[material.category]}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[material.category]}`}>
              {CATEGORY_LABELS[material.category]}
            </span>
          </div>
          <h3 className="text-base font-semibold text-foreground truncate">
            {material.title}
          </h3>
          {material.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {material.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(material)}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="编辑"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-muted-foreground hover:text-red-500 transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Skills */}
      {material.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {material.skills.map(skill => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary"
            >
              <Award className="w-3 h-3" />
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {expanded ? '收起详情' : '查看 STAR 拆解及完整内容'}
      </button>

      {/* Expanded STAR View */}
      {expanded && (
        <div className="mt-4 space-y-3 pt-4 border-t border-border">
          {/* Raw Content */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              原始描述
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {material.rawContent}
            </p>
          </div>

          {/* STAR */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              STAR 结构化拆解
            </h4>
            <div className="grid gap-2">
              {[
                { key: 'situation', label: 'S · 情境', value: material.star.situation, color: 'border-l-blue-400 bg-blue-50 dark:bg-blue-950/30' },
                { key: 'task', label: 'T · 任务', value: material.star.task, color: 'border-l-purple-400 bg-purple-50 dark:bg-purple-950/30' },
                { key: 'action', label: 'A · 行动', value: material.star.action, color: 'border-l-emerald-400 bg-emerald-50 dark:bg-emerald-950/30' },
                { key: 'result', label: 'R · 结果', value: material.star.result, color: 'border-l-amber-400 bg-amber-50 dark:bg-amber-950/30' },
              ].map(({ key, label, value, color }) =>
                value ? (
                  <div key={key} className={`pl-3 pr-3 py-2 rounded-r-lg border-l-2 text-sm ${color}`}>
                    <span className="font-semibold text-xs uppercase text-muted-foreground">{label}</span>
                    <p className="mt-0.5 text-foreground/90">{value}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>

          {/* Highlights */}
          {material.highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                高亮要点
              </h4>
              <ul className="list-disc list-inside space-y-0.5">
                {material.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-foreground/80">{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex gap-4 text-xs text-muted-foreground pt-1">
            <span>创建: {new Date(material.createdAt).toLocaleDateString('zh-CN')}</span>
            <span>更新: {new Date(material.updatedAt).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-xl border border-border p-6 shadow-xl max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">确认删除</h3>
                <p className="text-sm text-muted-foreground">此操作不可撤销</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 mb-5">
              确定要删除「{material.title}」吗？删除后无法恢复。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
