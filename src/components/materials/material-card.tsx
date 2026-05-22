'use client';

import { useState } from 'react';
import { X, Edit3, Trash2, ChevronDown, ChevronUp, Star, Tag, Award } from 'lucide-react';
import type { Material } from '@/types/material';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/material';
import { useMaterials } from '@/lib/material-context';

interface MaterialCardProps {
  material: Material;
  onEdit: (material: Material) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  internship: 'bg-[#e8f4fd] dark:bg-[#003366] text-apple-blue',
  project: 'bg-[#f4f1fa] dark:bg-[#2d1445] text-apple-purple',
  competition: 'bg-[#fff5e5] dark:bg-[#3d2900] text-apple-orange',
  research: 'bg-[#e8f8ee] dark:bg-[#0a3622] text-apple-green',
  campus: 'bg-[#ffebee] dark:bg-[#3d1111] text-apple-red',
};

const STAR_COLORS: Record<string, string> = {
  situation: 'border-l-[#0071e3] bg-[#e8f4fd] dark:bg-[#003366]/50',
  task: 'border-l-[#8944ab] bg-[#f4f1fa] dark:bg-[#2d1445]/50',
  action: 'border-l-[#34c759] bg-[#e8f8ee] dark:bg-[#0a3622]/50',
  result: 'border-l-[#ff9f0a] bg-[#fff5e5] dark:bg-[#3d2900]/50',
};

export function MaterialCard({ material, onEdit }: MaterialCardProps) {
  const { deleteMaterial } = useMaterials();
  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = () => {
    deleteMaterial(material.id);
    setShowDelete(false);
  };

  return (
    <div className="apple-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{CATEGORY_ICONS[material.category]}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[material.category]}`}>
              {CATEGORY_LABELS[material.category]}
            </span>
          </div>
          <h3 className="text-[16px] font-semibold tracking-tight text-apple-text dark:text-white truncate">
            {material.title}
          </h3>
          {material.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {material.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(material)}
            className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
            title="编辑"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="p-2 rounded-full hover:bg-[#ffebee] dark:hover:bg-[#3d1111] text-apple-text-secondary hover:text-apple-red transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Skills */}
      {material.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {material.skills.map(skill => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#e8f4fd] dark:bg-[#003366] text-apple-blue font-medium"
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
        className="flex items-center gap-1.5 mt-4 text-[12px] text-apple-text-secondary hover:text-apple-blue transition-colors"
      >
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {expanded ? '收起详情' : '查看 STAR 拆解及完整内容'}
      </button>

      {/* Expanded STAR View */}
      {expanded && (
        <div className="mt-4 space-y-4 pt-4 border-t border-[#d2d2d7]/60 dark:border-[#38383a]/60">
          {/* Raw Content */}
          <div>
            <h4 className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider mb-2">
              原始描述
            </h4>
            <p className="text-[13px] text-apple-text dark:text-white leading-relaxed whitespace-pre-wrap">
              {material.rawContent}
            </p>
          </div>

          {/* STAR */}
          <div>
            <h4 className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-apple-orange fill-apple-orange" />
              STAR 结构化拆解
            </h4>
            <div className="grid gap-2">
              {[
                { key: 'situation', label: 'S · 情境', value: material.star.situation },
                { key: 'task', label: 'T · 任务', value: material.star.task },
                { key: 'action', label: 'A · 行动', value: material.star.action },
                { key: 'result', label: 'R · 结果', value: material.star.result },
              ].map(({ key, label, value }) =>
                value ? (
                  <div key={key} className={`pl-3 pr-3 py-2.5 rounded-r-xl border-l-2 text-[13px] ${STAR_COLORS[key]}`}>
                    <span className="font-semibold text-[11px] uppercase text-apple-text-secondary">{label}</span>
                    <p className="mt-0.5 text-apple-text dark:text-white">{value}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>

          {/* Highlights */}
          {material.highlights.length > 0 && (
            <div>
              <h4 className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider mb-2">
                高亮要点
              </h4>
              <ul className="space-y-1">
                {material.highlights.map((h, i) => (
                  <li key={i} className="text-[13px] text-apple-text dark:text-white flex items-start gap-2">
                    <span className="text-apple-blue mt-1">•</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex gap-5 text-[11px] text-apple-text-secondary pt-1">
            <span>创建: {new Date(material.createdAt).toLocaleDateString('zh-CN')}</span>
            <span>更新: {new Date(material.updatedAt).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="apple-card p-7 max-w-[360px] w-full mx-4 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#ffebee] dark:bg-[#3d1111] flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-apple-red" />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-apple-text dark:text-white">确认删除</h3>
                <p className="text-[13px] text-apple-text-secondary">此操作不可撤销</p>
              </div>
            </div>
            <p className="text-[14px] text-apple-text dark:text-white mb-6">
              确定要删除「{material.title}」吗？删除后无法恢复。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDelete(false)}
                className="h-10 px-5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[14px] font-medium text-apple-text dark:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="h-10 px-5 rounded-full bg-apple-red text-white text-[14px] font-medium hover:bg-[#ff2d55] transition-colors"
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
