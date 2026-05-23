'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Eye, TrendingUp, Clock, Target, Download, Sparkles } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { TrendChart, PieChart } from '@/components/admin/charts';
import { AdminSkeleton } from '@/components/admin/skeleton';
import { adminDataService } from '@/lib/admin/data-service';
import type { DashboardStats, TrendDataPoint } from '@/types/admin';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);

  useEffect(() => {
    const load = async () => {
      const [s, t] = await Promise.all([
        adminDataService.getDashboardStats(),
        adminDataService.getTrendData('7d'),
      ]);
      setStats(s);
      setTrendData(t);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <AdminSkeleton type="dashboard" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
            数据总览
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            欢迎回来，这是最新的平台数据
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#86868b]">
          <div className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
          实时数据
        </div>
      </div>

      {/* 统计卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="总用户数"
          value={stats?.totalUsers ?? 0}
          change={12.5}
          icon={<Users className="w-5 h-5" />}
          color="blue"
          delay={0}
        />
        <StatCard
          title="今日新增"
          value={stats?.newUsersToday ?? 0}
          change={8.2}
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="简历生成"
          value={stats?.resumesGenerated ?? 0}
          change={-3.1}
          icon={<FileText className="w-5 h-5" />}
          color="purple"
          delay={0.2}
        />
        <StatCard
          title="AI 分析次数"
          value={stats?.aiAnalysisCount ?? 0}
          change={22.4}
          icon={<Sparkles className="w-5 h-5" />}
          color="orange"
          delay={0.3}
        />
      </div>

      {/* 第二行统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="总访问量 (PV)"
          value={stats?.totalPV ?? 0}
          change={15.7}
          icon={<Eye className="w-5 h-5" />}
          color="cyan"
          delay={0.15}
        />
        <StatCard
          title="独立访客 (UV)"
          value={stats?.totalUV ?? 0}
          change={10.3}
          icon={<Users className="w-5 h-5" />}
          color="indigo"
          delay={0.25}
        />
        <StatCard
          title="平均停留"
          value={`${stats?.avgDuration ?? 0}`}
          suffix="分钟"
          change={-1.5}
          icon={<Clock className="w-5 h-5" />}
          color="rose"
          delay={0.35}
        />
        <StatCard
          title="转化率"
          value={stats?.conversionRate ?? 0}
          suffix="%"
          change={5.2}
          icon={<Target className="w-5 h-5" />}
          color="emerald"
          delay={0.45}
          isPercentage
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 趋势图 */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <h3 className="text-base font-semibold text-[#1d1d1f] mb-2">
            访问趋势
          </h3>
          <p className="text-sm text-[#86868b] mb-6">最近 7 天的访问量变化</p>
          <TrendChart data={trendData} height={280} />
        </div>

        {/* 饼图 */}
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <h3 className="text-base font-semibold text-[#1d1d1f] mb-2">
            功能使用分布
          </h3>
          <p className="text-sm text-[#86868b] mb-6">各功能使用占比</p>
          <PieChart
            data={[
              { name: '简历优化', value: 45, color: '#0071e3' },
              { name: 'AI 分析', value: 30, color: '#5856d6' },
              { name: '模拟面试', value: 15, color: '#34c759' },
              { name: '素材库', value: 10, color: '#ff9500' },
            ]}
            height={240}
          />
        </div>
      </div>

      {/* 最近活动 */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#1d1d1f]">
              最近活动
            </h3>
            <p className="text-sm text-[#86868b]">用户最近的操作记录</p>
          </div>
          <button className="text-sm text-[#0071e3] hover:text-[#0077ed] font-medium transition-colors">
            查看全部
          </button>
        </div>
        <div className="space-y-1">
          {[
            { user: '张三', action: '上传了简历并完成 AI 分析', time: '2 分钟前', type: 'resume' },
            { user: '李四', action: '生成了一份定制化简历', time: '15 分钟前', type: 'generate' },
            { user: '王五', action: '完成了模拟面试练习', time: '28 分钟前', type: 'interview' },
            { user: '赵六', action: '注册了新账号', time: '42 分钟前', type: 'register' },
            { user: '孙七', action: '导出了 PDF 简历', time: '1 小时前', type: 'export' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[#f5f5f7] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  item.type === 'resume' ? 'bg-[#0071e3]' :
                  item.type === 'generate' ? 'bg-[#5856d6]' :
                  item.type === 'interview' ? 'bg-[#34c759]' :
                  item.type === 'register' ? 'bg-[#ff9500]' :
                  'bg-[#86868b]'
                }`} />
                <span className="text-sm font-medium text-[#1d1d1f]">{item.user}</span>
                <span className="text-sm text-[#86868b]">{item.action}</span>
              </div>
              <span className="text-xs text-[#aeaeb2]">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
