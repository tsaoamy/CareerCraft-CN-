'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, FileText, TrendingUp, Lightbulb, ExternalLink, Sparkles } from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/skeleton';
import type { KnowledgeRecommendation } from '@/lib/ai/types';

export default function KnowledgeBasePage() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<KnowledgeRecommendation[]>([]);

  useEffect(() => {
    fetch('/api/ai/analytics?type=knowledge')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setRecommendations(res.data.recommendations);
      })
      .finally(() => setLoading(false));
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
            AI 推荐知识库
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            基于用户高频提问，自动推荐教程、案例和视频内容——降低 AI 调用成本
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#34c759]/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
          <span className="text-[13px] font-medium text-[#34c759]">自动推荐引擎已启用</span>
        </div>
      </div>

      {/* 统计摘要 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-[#ff9500]" />
            <span className="text-[13px] text-[#86868b]">待创建内容</span>
          </div>
          <div className="text-[28px] font-bold text-[#1d1d1f]">{recommendations.length}</div>
          <p className="text-[12px] text-[#86868b] mt-1">知识条目</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#34c759]" />
            <span className="text-[13px] text-[#86868b]">热门上升</span>
          </div>
          <div className="text-[28px] font-bold text-[#34c759]">
            {recommendations.filter((r) => r.trend === 'up').length}
          </div>
          <p className="text-[12px] text-[#86868b] mt-1">个主题热度上升</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#0071e3]" />
            <span className="text-[13px] text-[#86868b]">可节省预估</span>
          </div>
          <div className="text-[28px] font-bold text-[#0071e3]">
            {recommendations.reduce((s, r) => s + r.questionCount, 0).toLocaleString()}
          </div>
          <p className="text-[12px] text-[#86868b] mt-1">次 AI 调用/月</p>
        </div>
      </div>

      {/* 推荐内容列表 */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-5">
              {/* 主题图标 */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0071e3]/10 to-[#5856d6]/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-7 h-7 text-[#0071e3]" />
              </div>

              <div className="flex-1 min-w-0">
                {/* 头部 */}
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{rec.topic}</h3>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-[#86868b] bg-[#f5f5f7] rounded-full px-3 py-1">
                    提问 {rec.questionCount} 次
                  </div>
                  {rec.trend === 'up' && (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-[#34c759]">
                      <TrendingUp className="w-3 h-3" /> 上升
                    </div>
                  )}
                </div>

                {/* 建议内容 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {rec.suggestedContent.tutorial && (
                    <div className="flex items-center gap-2 bg-[#f5f5f7] rounded-xl px-4 py-3 hover:bg-[#e8e8ed] transition-colors cursor-pointer group">
                      <FileText className="w-4 h-4 text-[#0071e3] shrink-0" />
                      <div>
                        <p className="text-[11px] text-[#86868b]">教程文档</p>
                        <p className="text-[13px] font-medium text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                          {rec.suggestedContent.tutorial}
                        </p>
                      </div>
                    </div>
                  )}
                  {rec.suggestedContent.example && (
                    <div className="flex items-center gap-2 bg-[#f5f5f7] rounded-xl px-4 py-3 hover:bg-[#e8e8ed] transition-colors cursor-pointer group">
                      <Lightbulb className="w-4 h-4 text-[#ff9500] shrink-0" />
                      <div>
                        <p className="text-[11px] text-[#86868b]">案例库</p>
                        <p className="text-[13px] font-medium text-[#1d1d1f] group-hover:text-[#ff9500] transition-colors">
                          {rec.suggestedContent.example}
                        </p>
                      </div>
                    </div>
                  )}
                  {rec.suggestedContent.video && (
                    <div className="flex items-center gap-2 bg-[#f5f5f7] rounded-xl px-4 py-3 hover:bg-[#e8e8ed] transition-colors cursor-pointer group">
                      <Play className="w-4 h-4 text-[#8944ab] shrink-0" />
                      <div>
                        <p className="text-[11px] text-[#86868b]">视频教程</p>
                        <p className="text-[13px] font-medium text-[#1d1d1f] group-hover:text-[#8944ab] transition-colors">
                          {rec.suggestedContent.video}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0071e3] text-white text-[13px] font-medium hover:bg-[#0077ed] transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                    创建内容
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f5f5f7] text-[#86868b] text-[13px] font-medium hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-colors">
                    标记为低优先
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f5f5f7] text-[#86868b] text-[13px] font-medium hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-colors">
                    忽略推荐
                  </button>
                </div>
              </div>

              {/* 右侧：推荐理由 */}
              <div className="hidden lg:block w-56 shrink-0">
                <div className="bg-[#f5f5f7] rounded-2xl p-4">
                  <p className="text-[11px] font-semibold text-[#86868b] uppercase mb-2">推荐理由</p>
                  <p className="text-[12px] text-[#1d1d1f] leading-relaxed">
                    该主题在过去 30 天内被提问 {rec.questionCount} 次
                    {rec.trend === 'up' ? '，且热度持续上升。建议优先创建内容，预计可减少 40% 相关 AI 调用。' : '。'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 内容模板 */}
      <div className="bg-gradient-to-br from-[#8944ab]/5 to-[#ff375f]/5 rounded-3xl p-6 border border-[#8944ab]/10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#8944ab]" />
          <h3 className="text-base font-semibold text-[#1d1d1f]">内容自动生成</h3>
        </div>
        <p className="text-[14px] text-[#86868b] mb-4">
          选择以下模板，AI 将自动基于知识库内容生成教程和案例。生成后可在「内容管理」中编辑和发布。
        </p>
        <div className="flex gap-3">
          {['STAR 法则教程模板', '项目量化案例模板', '面试问答模板'].map((t) => (
            <button
              key={t}
              className="px-5 py-3 rounded-2xl bg-white dark:bg-[#2c2c2e] border border-[#e8e8ed] text-[13px] font-medium text-[#1d1d1f] hover:border-[#8944ab] hover:text-[#8944ab] transition-all"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
