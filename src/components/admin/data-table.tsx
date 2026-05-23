"use client";

// ==========================================
// DataTable — 简化版，匹配页面使用
// ==========================================

import { motion } from "framer-motion";

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column<Record<string, React.ReactNode>>[];
  data: Record<string, React.ReactNode>[];
}

export function DataTable({ columns, data }: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-[#86868b]">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#e8e8ed]">
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#86868b]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f5f5f7]">
          {data.map((row, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="hover:bg-[#f5f5f7]/50 transition-colors"
            >
              {columns.map((col, j) => (
                <td key={j} className="px-6 py-3.5 text-sm text-[#1d1d1f]">
                  {row[col.key as string] ?? '-'}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
