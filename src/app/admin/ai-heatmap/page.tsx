'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles, Search, Filter, Calendar } from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/skeleton';
import type { AIHeatmapData, HeatmapQuestion } from '@/lib/ai/types';
import { apiFetch } from '@/lib/api-client';

const categoryColors: Record<string, string> = {
  '简历优化': '#0071e3',
  '岗位匹配': '#8944ab',
  '面试准备': '#34c759',
  '职业规划': '#ff9500',
};

export default function AIHeatmapPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AIHeatmapData | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    apiFetch<AIHeatmapData>('/api/ai/analytics?type=heatmap')
      .then((res) => {
        if (res.success && res.data) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminSkeleton type="dashboard" />;
  if (!data) return null;

  // 筛选
  const filteredQuestions = data.questions.filter((q) => {
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
    if (searchQuery && !q.question.includes(searchQuery)) return false;
    return true;
  });

  // 计算分类统计
  const categories = ['简历优化', '面试准备', '岗位匹配', '职业规划'];
  const categoryStats = categories.map((cat) => {
    const items = data.questions.filter((q) => q.category === cat);
    const total = items.reduce((s, q) => s + q.count, 0);
    return { category: cat, total, count: items.length, color: categoryColors[cat] };
  });

  // 找出趋势上升和下降的问题
  const trendingUp = data.questions.filter((q) => q.trend === 'up').slice(0, 5);
  const trendingDown = data.questions.filter((q) => q.trend === 'down').slice(0, 5);

  const maxCount = Math.max(...data.questions.map((q) => q.count));

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
            AI 提问热力图
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            用户最常问什么问题？持续优化你的产品
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-[#86868b]" />
          <span className="text-[#86868b]">统计周期：{data.period}</span>
          <span className="font-semibold text-[#1d1d1f]">
            总提问 {data.totalQuestions.toLocaleString()} 次
          </span>
        </div>
      </div>

      {/* 分类统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categoryStats.map((cat) => (
          <div
            key={cat.category}
            className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setCategoryFilter(categoryFilter === cat.category ? 'all' : cat.category)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-[#86868b]">{cat.category}</span>
              <span className="text-[11px] text-[#86868b]">{cat.count} 类问题</span>
            </div>
            <div className="text-[28px] font-bold" style={{ color: cat.color }}>
              {cat.total.toLocaleString()}
            </div>
            <div className="mt-2 text-[12px] text-[#86868b]">
              占比 {(cat.total / data.questions.reduce((s, q) => s + q.count, 0) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {/* 趋势变化 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 上升趋势 */}
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#34c759]" />
            <h3 className="text-base font-semibold text-[#1d1d1f]">热门上升 🔥</h3>
          </div>
          <div className="space-y-3">
            {trendingUp.map((q, i) => (
              <QuestionRow key={i} question={q} maxCount={maxCount} />
            ))}
          </div>
        </div>

        {/* 下降趋势 */}
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-[#86868b]" />
            <h3 className="text-base font-semibold text-[#1d1d1f]">热度下降 📉</h3>
          </div>
          <div className="space-y-3">
            {trendingDown.map((q, i) => (
              <QuestionRow key={i} question={q} maxCount={maxCount} />
            ))}
          </div>
        </div>
      </div>

      {/* 完整问题列表 */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-[#1d1d1f]">所有问题排行</h3>
          {/* 搜索和筛选 */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#aeaeb2]" />
              <input
                type="text"
                placeholder="搜索问题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-[#f5f5f7] text-[13px] text-[#1d1d1f] placeholder-[#aeaeb2] outline-none focus:ring-2 focus:ring-[#0071e3]/20 w-48"
              />
            </div>
            <div className="flex gap-1.5">
              {[{ value: 'all', label: '全部' }, ...categories.map((c) => ({ value: c, label: c }))].map(
                (f) => (
                  <button
                    key={f.value}
                    onClick={() => setCategoryFilter(f.value)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                      categoryFilter === f.value
                        ? 'bg-[#0071e3] text-white'
                        : 'bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed]'
                    }`}
                  >
                    {f.label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* 热力图表格 */}
        <div className="overflow-hidden">
          {/* 表头 */}
          <div className="grid grid-cols-[1fr_120px_80px_100px_100px] gap-4 px-4 py-3 border-b border-[#f0f0f2] text-[12px] font-medium text-[#86868b]">
            <span>问题</span>
            <span className="text-right">提问次数</span>
            <span className="text-center">趋势</span>
            <span className="text-right">占比</span>
            <span className="text-right">热力</span>
          </div>

          {/* 内容 */}
          <div className="divide-y divide-[#f0f0f2]">
            {filteredQuestions.map((q, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_120px_80px_100px_100px] gap-4 px-4 py-3 items-center hover:bg-[#f5f5f7] transition-colors"
              >
                {/* 问题 */}
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: categoryColors[q.category] || '#86868b' }}
                  />
                  <span className="text-[13px] text-[#1d1d1f] font-medium truncate">{q.question}</span>
                </div>

                {/* 次数 */}
                <span className="text-[13px] font-semibold text-[#1d1d1f] text-right">
                  {q.count.toLocaleString()}
                </span>

                {/* 趋势 */}
                <span className="flex justify-center">
                  {q.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-[#34c759]" />
                  ) : q.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-[#ff375f]" />
                  ) : (
                    <Minus className="w-4 h-4 text-[#86868b]" />
                  )}
                </span>

                {/* 占比 */}
                <span className="text-[13px] text-[#86868b] text-right">{q.percentage}%</span>

                {/* 热力进度条 */}
                <div className="text-right">
                  <div className="h-2 bg-[#f5f5f7] rounded-full overflow-hidden inline-block w-full">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(q.count / maxCount) * 100}%`,
                        backgroundColor: categoryColors[q.category] || '#0071e3',
                        opacity: (q.count / maxCount) * 0.8 + 0.2,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 结论和建议 */}
      <div className="bg-gradient-to-br from-[#0071e3]/5 to-[#5856d6]/5 rounded-3xl p-6 border border-[#0071e3]/10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#0071e3]" />
          <h3 className="text-base font-semibold text-[#1d1d1f]">分析与建议</h3>
        </div>
        <div className="space-y-3 text-[14px] text-[#86868b]">
          <p>
            <strong className="text-[#1d1d1f]">📊 核心发现：</strong>
            「简历优化」类问题占总提问量的 {categoryStats[0].total / data.totalQuestions * 100 | 0}%，用户最需要的是项目经历的写作指导和 STAR 法则的教学。
          </p>
          <p>
            <strong className="text-[#1d1d1f]">💡 建议行动：</strong>
            在简历编辑页面增加 STAR 法则的流程化引导，减少用户对 AI 的依赖，降低 API 调用成本。
          </p>
          <p>
            <strong className="text-[#1d1d1f]">📈 趋势观察：</strong>
            「项目经历量化技巧」类问题持续上升，建议在知识库中优先补充相关内容。
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function QuestionRow({ question, maxCount }: { question: HeatmapQuestion; maxCount: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="px-2 py-0.5 rounded-md text-[10px] font-medium text-white"
            style={{ backgroundColor: categoryColors[question.category] }}
          >
            {question.category}
          </span>
          <span className="text-[13px] text-[#1d1d1f] truncate">{question.question}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(question.count / maxCount) * 100}%`,
                backgroundColor: categoryColors[question.category] || '#0071e3',
              }}
            />
          </div>
          <span className="text-[12px] font-medium text-[#86868b] w-12 text-right">
            {question.count}
          </span>
        </div>
      </div>
    </div>
  );
}
