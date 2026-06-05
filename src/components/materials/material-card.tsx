'use client';

import { useState } from 'react';
import { X, Edit3, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { Material } from '@/types/material';
import { CategoryIcon, CATEGORY_ACCENT } from '@/components/materials/category-icon';
import { useMaterials } from '@/lib/material-context';
import { useLocale } from '@/lib/i18n/locale-context';
import { getCategoryLabels } from '@/lib/i18n/shared-labels';
import { cn } from '@/lib/utils';

interface MaterialCardProps {
  material: Material;
  onEdit: (material: Material) => void;
}

const STAR_COLORS: Record<string, string> = {
  situation: 'border-l-[#0071e3] bg-[#e8f4fd] dark:bg-[#003366]/50',
  task: 'border-l-[#8944ab] bg-[#f4f1fa] dark:bg-[#2d1445]/50',
  action: 'border-l-[#34c759] bg-[#e8f8ee] dark:bg-[#0a3622]/50',
  result: 'border-l-[#ff9f0a] bg-[#fff5e5] dark:bg-[#3d2900]/50',
};

export function MaterialCard({ material, onEdit }: MaterialCardProps) {
  const { deleteMaterial } = useMaterials();
  const { locale, t } = useLocale();
  const mc = t.materialCard;
  const ca = t.commonActions;
  const categoryLabels = getCategoryLabels(locale);
  const dateLocale = locale === 'en' ? 'en-US' : 'zh-CN';
  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = () => {
    deleteMaterial(material.id);
    setShowDelete(false);
  };

  return (
    <div className="apple-card p-5 group hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2.5">
            <CategoryIcon category={material.category} size="md" />
            <span
              className={cn(
                'text-[11px] px-2.5 py-0.5 rounded-full font-medium',
                CATEGORY_ACCENT[material.category]
              )}
            >
              {categoryLabels[material.category]}
            </span>
          </div>
          <h3 className="text-[16px] font-semibold tracking-tight text-apple-text dark:text-white leading-snug">
            {material.title}
          </h3>
          {material.dateRange && (
            <p className="text-[12px] text-apple-text-secondary mt-1">{material.dateRange}</p>
          )}
          {material.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {material.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(material)}
            className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
            title={mc.edit}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="p-2 rounded-full hover:bg-[#ffebee] dark:hover:bg-[#3d1111] text-apple-text-secondary hover:text-apple-red transition-colors"
            title={mc.delete}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {material.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#d2d2d7]/40 dark:border-[#38383a]/40">
          {material.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#e8f4fd] dark:bg-[#003366]/60 text-apple-blue font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 mt-4 text-[12px] text-apple-text-secondary hover:text-apple-blue transition-colors"
      >
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {expanded ? mc.collapseDetail : mc.expandDetail}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 pt-4 border-t border-[#d2d2d7]/60 dark:border-[#38383a]/60">
          <div>
            <h4 className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider mb-2">
              {mc.rawDescription}
            </h4>
            <p className="text-[13px] text-apple-text dark:text-white leading-relaxed whitespace-pre-wrap">
              {material.rawContent}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-apple-orange" />
              {mc.starBreakdown}
            </h4>
            <div className="grid gap-2">
              {(
                [
                  { key: 'situation', label: mc.starFull.situation, value: material.star.situation },
                  { key: 'task', label: mc.starFull.task, value: material.star.task },
                  { key: 'action', label: mc.starFull.action, value: material.star.action },
                  { key: 'result', label: mc.starFull.result, value: material.star.result },
                ] as const
              ).map(({ key, label, value }) =>
                value ? (
                  <div
                    key={key}
                    className={cn('pl-3 pr-3 py-2.5 rounded-r-xl border-l-2 text-[13px]', STAR_COLORS[key])}
                  >
                    <span className="font-semibold text-[11px] uppercase text-apple-text-secondary">
                      {label}
                    </span>
                    <p className="mt-0.5 text-apple-text dark:text-white">{value}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>

          {material.highlights.length > 0 && (
            <div>
              <h4 className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider mb-2">
                {mc.achievements}
              </h4>
              <ul className="space-y-1">
                {material.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="text-[13px] text-apple-text dark:text-white flex items-start gap-2"
                  >
                    <span className="text-apple-blue mt-1 text-[10px]">—</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-5 text-[11px] text-apple-text-secondary pt-1">
            <span>{mc.created}: {new Date(material.createdAt).toLocaleDateString(dateLocale)}</span>
            <span>{mc.updated}: {new Date(material.updatedAt).toLocaleDateString(dateLocale)}</span>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="apple-card p-7 max-w-[360px] w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#ffebee] dark:bg-[#3d1111] flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-apple-red" />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-apple-text dark:text-white">{mc.confirmDeleteTitle}</h3>
                <p className="text-[13px] text-apple-text-secondary">{mc.confirmDeleteHint}</p>
              </div>
            </div>
            <p className="text-[14px] text-apple-text dark:text-white mb-6">
              {mc.confirmDeleteBodyPrefix}{material.title}{mc.confirmDeleteBodySuffix}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDelete(false)}
                className="h-10 px-5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[14px] font-medium text-apple-text dark:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors"
              >
                {ca.cancel}
              </button>
              <button
                onClick={handleDelete}
                className="h-10 px-5 rounded-full bg-apple-red text-white text-[14px] font-medium hover:bg-[#ff2d55] transition-colors"
              >
                {ca.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
