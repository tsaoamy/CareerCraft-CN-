'use client';

/**
 * 增强版 Admin 数据驾驶舱 (Phase 6)
 * 集成 ECharts 趋势图、漏斗图、热力图
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Users, TrendingUp, Activity, FileText, Download,
  Brain, DollarSign, RefreshCw, Filter
} from 'lucide-react';
import EChartsReact from 'echarts-for-react';
import { AUTH_TOKEN_KEY } from '@/lib/auth/constants';

interface DashboardData {
  summary: {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    totalEvents: number;
    resumeGenerated: number;
    resumeDownloaded: number;
    aiCalls: number;
    avgDuration: number;
  };
  dailyTrend: {
    stat_date: string;
    dau: number;
    new_users: number;
    resume_generated: number;
    resume_downloaded: number;
    ai_calls: number;
  }[];
  eventBreakdown: { event_type: string; count: number }[];
  skillDistribution: { name: string; value: number }[];
  funnel: { name: string; value: number }[];
}

export default function EnhancedDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'today' | 'week' | 'month' | 'year'>('week');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const res = await fetch(`/api/dashboard?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-gray-400">加载驾驶舱数据...</div>
      </div>
    );
  }

  const { summary, dailyTrend, eventBreakdown, skillDistribution, funnel } = data;

  // 趋势图配置
  const trendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['DAU', '新用户', '生成简历', 'AI调用'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dailyTrend.map((d) => d.stat_date),
      axisLabel: { rotate: 45, fontSize: 10 },
    },
    yAxis: { type: 'value' },
    series: [
      { name: 'DAU', type: 'line', data: dailyTrend.map((d) => d.dau), smooth: true, lineStyle: { color: '#5856d6' }, itemStyle: { color: '#5856d6' } },
      { name: '新用户', type: 'bar', data: dailyTrend.map((d) => d.new_users), itemStyle: { color: 'rgba(88,86,214,0.3)' } },
      { name: '生成简历', type: 'line', data: dailyTrend.map((d) => d.resume_generated), smooth: true, lineStyle: { color: '#34c759' }, itemStyle: { color: '#34c759' } },
      { name: 'AI调用', type: 'line', data: dailyTrend.map((d) => d.ai_calls), smooth: true, lineStyle: { color: '#ff9500' }, itemStyle: { color: '#ff9500' } },
    ],
  };

  // 漏斗图配置
  const funnelOption = {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'funnel',
      left: '10%',
      width: '80%',
      sort: 'descending',
      gap: 2,
      label: { show: true, position: 'inside', fontSize: 12 },
      data: funnel.map((f) => ({ name: f.name, value: f.value })),
      itemStyle: { borderColor: '#fff', borderWidth: 1 },
    }],
  };

  // 事件分布饼图
  const pieOption = {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '55%'],
      data: eventBreakdown.map((e) => ({ name: e.event_type, value: e.count })),
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
      },
      label: { fontSize: 10 },
    }],
  };

  // 技能分布柱状图
  const barOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: {
      type: 'category',
      data: skillDistribution.map((s) => s.name),
      axisLabel: { fontSize: 10 },
    },
    series: [{
      type: 'bar',
      data: skillDistribution.map((s) => s.value),
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#5856d6' },
            { offset: 1, color: '#ff2d55' },
          ],
        },
        borderRadius: [0, 4, 4, 0],
      },
    }],
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">数据驾驶舱</h1>
          <p className="text-sm text-gray-500 mt-1">全平台运营数据概览</p>
        </div>
        <div className="flex items-center gap-2">
          {(['today', 'week', 'month', 'year'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                range === r
                  ? 'bg-[#5856d6] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {r === 'today' ? '今日' : r === 'week' ? '本周' : r === 'month' ? '本月' : '全年'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Users} label="总用户" value={summary.totalUsers} change="+12%" color="#5856d6" />
        <KpiCard icon={Activity} label="活跃用户" value={summary.activeUsers} change="+8%" color="#34c759" />
        <KpiCard icon={FileText} label="生成简历" value={summary.resumeGenerated} change="+25%" color="#ff9500" />
        <KpiCard icon={Brain} label="AI调用" value={summary.aiCalls} change="+18%" color="#007aff" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 趋势图 */}
        <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-4">核心指标趋势</h3>
          <EChartsReact option={trendOption} style={{ height: 380 }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 转化漏斗 */}
        <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-4">转化漏斗</h3>
          <EChartsReact option={funnelOption} style={{ height: 280 }} />
        </div>

        {/* 事件分布 */}
        <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-4">事件分布</h3>
          <EChartsReact option={pieOption} style={{ height: 280 }} />
        </div>

        {/* 技能分布 */}
        <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-4">热门技能 Top 10</h3>
          <EChartsReact option={barOption} style={{ height: 280 }} />
        </div>
      </div>

      {/* 二级指标 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MiniStat label="日均使用时长" value={`${summary.avgDuration}min`} />
        <MiniStat label="今日新增" value={summary.newUsersToday} />
        <MiniStat label="下载次数" value={summary.resumeDownloaded} />
        <MiniStat label="转化率" value="18.5%" />
        <MiniStat label="留存率" value="72.3%" />
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, change, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  change: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-[#1d1d1f] dark:text-white">{value.toLocaleString()}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-center">
      <div className="text-lg font-bold text-[#1d1d1f] dark:text-white">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
