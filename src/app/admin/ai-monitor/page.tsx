'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, AlertTriangle, Clock, Cpu, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { TrendChart } from '@/components/admin/charts';
import { AdminSkeleton } from '@/components/admin/skeleton';
import { adminDataService } from '@/lib/admin/data-service';
import type { AIUsageStats, TrendDataPoint } from '@/types/admin';

export default function AIMonitorPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AIUsageStats | null>(null);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);

  useEffect(() => {
    const load = async () => {
      const [s, t] = await Promise.all([
        adminDataService.getAIUsage(),
        adminDataService.getTrendData('30d'),
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
      className="space-y-6"
    >
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
            AI 调用监控
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            实时监控 GPT API 调用情况
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm text-[#34c759]">
            <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
            系统正常
          </span>
          <button className="h-9 w-9 rounded-full border border-[#d2d2d7] bg-white flex items-center justify-center hover:bg-[#f5f5f7] active:scale-95 transition-all">
            <RefreshCw className="w-4 h-4 text-[#86868b]" />
          </button>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="API 调用次数"
          value={stats?.totalCalls ?? 0}
          change={18.3}
          icon={<Activity className="w-5 h-5" />}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Token 消耗"
          value={stats?.totalTokens ?? 0}
          change={12.7}
          icon={<Cpu className="w-5 h-5" />}
          color="purple"
          delay={0.1}
        />
        <StatCard
          title="成功率"
          value={stats?.successRate ?? 0}
          suffix="%"
          change={0.5}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="green"
          delay={0.2}
          isPercentage
        />
        <StatCard
          title="平均响应时间"
          value={stats?.avgResponseTime ?? 0}
          suffix="ms"
          change={-8.2}
          icon={<Zap className="w-5 h-5" />}
          color="orange"
          delay={0.3}
        />
      </div>

      {/* 趋势图 + 最近日志 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Token 消耗趋势 */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <h3 className="text-base font-semibold text-[#1d1d1f] mb-2">Token 消耗趋势</h3>
          <p className="text-sm text-[#86868b] mb-6">最近 30 天的 Token 使用量</p>
          <TrendChart data={trendData} height={280} />
        </div>

        {/* 请求状态概览 */}
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <h3 className="text-base font-semibold text-[#1d1d1f] mb-2">请求状态</h3>
          <p className="text-sm text-[#86868b] mb-6">最近 24 小时</p>
          <div className="space-y-4">
            {[
              { label: '成功请求', value: stats?.totalCalls ? Math.round(stats.totalCalls * (stats.successRate / 100)) : 0, color: '#34c759' },
              { label: '失败请求', value: stats?.totalCalls ? Math.round(stats.totalCalls * ((100 - stats.successRate) / 100)) : 0, color: '#ff3b30' },
              { label: '超时', value: stats?.errorLogs?.filter(e => e.type === 'timeout').length ?? 0, color: '#ff9500' },
              { label: '速率限制', value: stats?.errorLogs?.filter(e => e.type === 'rate_limit').length ?? 0, color: '#5856d6' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[#1d1d1f]">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-[#1d1d1f]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 错误日志 */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e8e8ed]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f]">错误日志</h3>
              <p className="text-sm text-[#86868b]">最近的 API 调用错误</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-8 px-3 rounded-lg bg-[#ff3b30]/10 text-[#ff3b30] text-xs font-medium hover:bg-[#ff3b30]/15 transition-colors">
                查看全部 ({stats?.errorLogs?.length ?? 0})
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-[#f5f5f7]">
          {(stats?.errorLogs ?? []).slice(0, 5).map((log, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f5f5f7]/50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                log.type === 'timeout' ? 'bg-[#ff9500]/10' :
                log.type === 'rate_limit' ? 'bg-[#5856d6]/10' : 'bg-[#ff3b30]/10'
              }`}>
                {log.type === 'timeout' ? (
                  <Clock className="w-4 h-4 text-[#ff9500]" />
                ) : log.type === 'rate_limit' ? (
                  <AlertTriangle className="w-4 h-4 text-[#5856d6]" />
                ) : (
                  <XCircle className="w-4 h-4 text-[#ff3b30]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1d1d1f] truncate">{log.message}</p>
                <p className="text-xs text-[#aeaeb2] mt-0.5">{log.model} · {log.endpoint}</p>
              </div>
              <span className="text-xs text-[#aeaeb2] whitespace-nowrap">{log.timestamp}</span>
            </div>
          ))}
          {(stats?.errorLogs ?? []).length === 0 && (
            <div className="py-12 text-center text-sm text-[#86868b]">
              <CheckCircle2 className="w-8 h-8 text-[#34c759] mx-auto mb-3" />
              暂无错误日志，系统运行正常
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
