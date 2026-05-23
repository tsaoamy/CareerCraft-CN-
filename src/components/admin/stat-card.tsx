"use client";

// ==========================================
// Stat Card — 简化版，匹配页面使用
// ==========================================

import { motion } from "framer-motion";
import { useAnimatedNumber } from "@/hooks/use-admin";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  change?: number;
  color?: string;
  delay?: number;
  isPercentage?: boolean;
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue:    { bg: '#0071e3', text: '#0071e3', ring: '#0071e3' },
  green:   { bg: '#34c759', text: '#34c759', ring: '#34c759' },
  purple:  { bg: '#5856d6', text: '#5856d6', ring: '#5856d6' },
  orange:  { bg: '#ff9500', text: '#ff9500', ring: '#ff9500' },
  cyan:    { bg: '#5ac8fa', text: '#5ac8fa', ring: '#5ac8fa' },
  indigo:  { bg: '#5856d6', text: '#5856d6', ring: '#5856d6' },
  rose:    { bg: '#ff375f', text: '#ff375f', ring: '#ff375f' },
  emerald: { bg: '#34c759', text: '#34c759', ring: '#34c759' },
};

export function StatCard({ title, value, prefix = '', suffix = '', icon, change, color = 'blue', delay = 0, isPercentage }: StatCardProps) {
  const animatedValue = useAnimatedNumber(value);
  const colors = colorMap[color] || colorMap.blue;

  const displayValue = isPercentage
    ? `${animatedValue}`
    : animatedValue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white dark:bg-[#1c1c1e] rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none border border-[#e8e8ed] dark:border-[#38383a] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-[#86868b]">{title}</span>
        <div
          className="w-9 h-9 rounded-[12px] flex items-center justify-center transition-colors"
          style={{ backgroundColor: colors.bg + '15' }}
        >
          <span style={{ color: colors.text }}>{icon}</span>
        </div>
      </div>

      <div className="text-[28px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums">
        {prefix}
        {displayValue}
        {suffix && <span className="text-sm font-normal ml-1 text-[#86868b]">{suffix}</span>}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <svg
            className={`w-3.5 h-3.5 ${change >= 0 ? 'text-[#34c759]' : 'text-[#ff375f]'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {change >= 0
              ? <><polyline points="18 15 12 9 6 15"/></>
              : <><polyline points="6 9 12 15 18 9"/></>
            }
          </svg>
          <span className={`text-xs font-medium ${change >= 0 ? 'text-[#34c759]' : 'text-[#ff375f]'}`}>
            {change >= 0 ? '+' : ''}{change}% vs 昨日
          </span>
        </div>
      )}
    </motion.div>
  );
}
