'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MousePointerClick, ArrowDown, TrendingDown } from 'lucide-react';
import { TrendChart, PieChart } from '@/components/admin/charts';
import { AdminSkeleton } from '@/components/admin/skeleton';
import { adminDataService } from '@/lib/admin/data-service';
import type { UserBehaviorData, TrendDataPoint } from '@/types/admin';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [behavior, setBehavior] = useState<UserBehaviorData | null>(null);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);

  useEffect(() => {
    const load = async () => {
      const [b, t] = await Promise.all([
        adminDataService.getUserBehavior(),
        adminDataService.getTrendData('30d'),
      ]);
      setBehavior(b);
      setTrendData(t);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <AdminSkeleton type="dashboard" />;

  // 漏斗数据
  const funnelSteps = [
    { label: '首页访问', value: 2847, color: '#0071e3' },
    { label: '上传简历', value: 1823, color: '#5856d6' },
    { label: 'AI 分析', value: 1256, color: '#34c759' },
    { label: '生成优化', value: 892, color: '#ff9500' },
    { label: '导出 PDF', value: 534, color: '#ff3b30' },
  ];
  const maxFunnel = funnelSteps[0].value;

  const sankeyFlows = [
    { from: '首页', to: '上传简历', value: 1823 },
    { from: '首页', to: '素材库', value: 624 },
    { from: '首页', to: '模拟面试', value: 400 },
    { from: '上传简历', to: 'AI 分析', value: 1256 },
    { from: 'AI 分析', to: '生成优化', value: 892 },
    { from: '生成优化', to: '导出 PDF', value: 534 },
    { from: '素材库', to: 'AI 分析', value: 310 },
    { from: '模拟面试', to: '导出 PDF', value: 150 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* 页头 */}
      <div>
        <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
          用户行为分析
        </h1>
        <p className="text-sm text-[#86868b] mt-1">
          了解用户如何使用平台功能
        </p>
      </div>

      {/* 漏斗图 */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#0071e3]/10 flex items-center justify-center">
            <ArrowDown className="w-5 h-5 text-[#0071e3]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1d1d1f]">转化漏斗</h3>
            <p className="text-sm text-[#86868b]">用户从进入平台到导出简历的转化路径</p>
          </div>
        </div>
        <div className="space-y-3 max-w-2xl mx-auto">
          {funnelSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs text-[#86868b] w-16 text-right">{step.label}</span>
              <div className="flex-1 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(step.value / maxFunnel) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                  className="h-10 rounded-xl flex items-center justify-between px-4"
                  style={{ backgroundColor: step.color + '20' }}
                >
                  <span className="text-sm font-medium" style={{ color: step.color }}>
                    {step.value.toLocaleString()}
                  </span>
                  {i > 0 && (
                    <span className="text-xs flex items-center gap-1" style={{ color: step.color }}>
                      <TrendingDown className="w-3 h-3" />
                      {Math.round((1 - step.value / funnelSteps[i - 1].value) * 100)}%
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 用户路径 + 行为分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sankey Flow 简化版 */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#5856d6]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#5856d6]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f]">用户访问路径</h3>
              <p className="text-sm text-[#86868b]">主要页面跳转流向</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['首页 → 上传简历', '上传简历 → AI分析', 'AI分析 → 生成优化', '素材库 → AI分析', '生成优化 → 导出PDF', '模拟面试 → 导出PDF'].map((flow, i) => {
              const data = sankeyFlows.find(f => `${f.from} → ${f.to}` === flow);
              return (
                <div
                  key={i}
                  className="bg-[#f5f5f7] rounded-2xl p-4 text-center hover:bg-[#e8e8ed] transition-colors cursor-default"
                >
                  <p className="text-xs text-[#86868b] mb-2 truncate">{flow}</p>
                  <p className="text-2xl font-semibold text-[#1d1d1f]">
                    {data ? data.value.toLocaleString() : '-'}
                  </p>
                  <p className="text-xs text-[#aeaeb2] mt-1">次访问</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 功能使用频率 */}
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#34c759]/10 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-[#34c759]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f]">功能使用频率</h3>
              <p className="text-sm text-[#86868b]">各功能点击统计</p>
            </div>
          </div>
          <PieChart
            data={[
              { name: '简历优化', value: 35, color: '#0071e3' },
              { name: 'AI 分析', value: 28, color: '#5856d6' },
              { name: '模拟面试', value: 20, color: '#34c759' },
              { name: '素材库', value: 12, color: '#ff9500' },
              { name: '导出 PDF', value: 5, color: '#ff3b30' },
            ]}
            height={240}
          />
        </div>
      </div>

      {/* 页面停留时间 */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e8e8ed]">
          <h3 className="text-base font-semibold text-[#1d1d1f]">页面停留时间</h3>
          <p className="text-sm text-[#86868b]">用户在各页面的平均停留时长</p>
        </div>
        <div className="divide-y divide-[#f5f5f7]">
          {[
            { page: '简历定制', duration: '4:32', percent: 85 },
            { page: 'JD 分析器', duration: '3:18', percent: 62 },
            { page: 'AI 面试官', duration: '2:55', percent: 55 },
            { page: '素材库', duration: '2:10', percent: 40 },
            { page: 'Dashboard', duration: '1:45', percent: 33 },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f5f5f7]/50 transition-colors">
              <span className="text-sm text-[#1d1d1f] w-24 font-medium">{item.page}</span>
              <div className="flex-1 h-2 rounded-full bg-[#f5f5f7] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#0071e3] to-[#5856d6]"
                />
              </div>
              <span className="text-sm font-medium text-[#1d1d1f] w-16 text-right">{item.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
