"use client";

// ==========================================
// Charts — 简化导出，匹配页面使用
// ==========================================

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell as RechartsCell,
  Legend,
} from "recharts";
import type { TrendDataPoint } from "@/types/admin";

const GRID_COLOR = "#e8e8ed";

// ──── 趋势面积图 ────
export function TrendChart({
  data,
  color = "#0071e3",
  height = 240,
}: {
  data: TrendDataPoint[];
  color?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradient-trend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#86868b" }} dy={8} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#86868b" }} dx={-4} />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #e8e8ed",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            fontSize: 13,
          }}
          labelStyle={{ color: "#86868b", marginBottom: 4 }}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#gradient-trend)" dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: color }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ──── 饼图 ────
export function PieChart({
  data,
  height = 260,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          stroke="none"
        >
          {data.map((entry, idx) => (
            <RechartsCell key={idx} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #e8e8ed",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            fontSize: 13,
          }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#86868b", paddingTop: 12 }} />
      </RePieChart>
    </ResponsiveContainer>
  );
}
