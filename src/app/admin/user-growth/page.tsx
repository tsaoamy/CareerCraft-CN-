'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, GitBranch, Target, Sparkles, Clock, Award, BookOpen, ChevronRight } from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/skeleton';
import type { UserGrowthData, GrowthStage } from '@/lib/ai/types';
import { apiFetch } from '@/lib/api-client';

const stageIcons: Record<string, React.ReactNode> = {
  '注册': <BookOpen className="w-4 h-4" />,
  '初次提问': <Sparkles className="w-4 h-4" />,
  '简历初稿': <GitBranch className="w-4 h-4" />,
  'AI 评测': <Target className="w-4 h-4" />,
  '针对性修改': <TrendingUp className="w-4 h-4" />,
  '再次评测': <Target className="w-4 h-4" />,
  '项目挖掘': <Award className="w-4 h-4" />,
  '终版导出': <BookOpen className="w-4 h-4" />,
  '岗位匹配': <Target className="w-4 h-4" />,
  '技能补充': <BookOpen className="w-4 h-4" />,
  '持续优化': <TrendingUp className="w-4 h-4" />,
  '面试模拟': <Target className="w-4 h-4" />,
  '简历生成': <GitBranch className="w-4 h-4" />,
};

const stageColors: Record<string, string> = {
  '注册': '#86868b',
  '初次提问': '#0071e3',
  '简历初稿': '#8944ab',
  'AI 评测': '#ff9500',
  '针对性修改': '#ff375f',
  '再次评测': '#34c759',
  '项目挖掘': '#5856d6',
  '终版导出': '#0071e3',
  '岗位匹配': '#ff9500',
  '技能补充': '#34c759',
  '持续优化': '#ff375f',
  '面试模拟': '#8944ab',
  '简历生成': '#5856d6',
};

export default function UserGrowthPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserGrowthData[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ users: UserGrowthData[] }>('/api/ai/analytics?type=growth')
      .then((res) => {
        if (res.success && res.data) setUsers(res.data.users);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminSkeleton type="dashboard" />;

  // 统计漏斗数据
  const totalUsers = users.length;
  const stages = ['初次提问', '简历初稿', 'AI 评测', '针对性修改', '再次评测', '终版导出'];
  const funnelData = stages.map((stage) => {
    const count = users.filter((u) => u.stages.some((s) => s.stage === stage)).length;
    return { stage, count, rate: totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(0) : '0' };
  });

  const avgAIInteractions =
    users.reduce((sum, u) => {
      return sum + u.stages.reduce((s, st) => s + st.aiInteractions, 0);
    }, 0) / (users.length || 1);

  const avgVersions =
    users.reduce((sum, u) => {
      const last = u.stages[u.stages.length - 1];
      return sum + (last?.resumeVersion || 0);
    }, 0) / (users.length || 1);

  // 完成率
  const completionRate =
    totalUsers > 0
      ? users.filter((u) => u.stages.some((s) => s.stage === '终版导出')).length / totalUsers
      : 0;

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
            用户成长轨迹
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            从第一次提问到最终简历，观察用户成长路径
          </p>
        </div>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#0071e3]" />
            <span className="text-[13px] text-[#86868b]">平均 AI 交互次数</span>
          </div>
          <div className="text-[28px] font-bold text-[#1d1d1f]">{avgAIInteractions.toFixed(1)}</div>
          <p className="text-[12px] text-[#86868b] mt-1">每位用户</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-[#8944ab]" />
            <span className="text-[13px] text-[#86868b]">平均简历版本</span>
          </div>
          <div className="text-[28px] font-bold text-[#1d1d1f]">{avgVersions.toFixed(1)}</div>
          <p className="text-[12px] text-[#86868b] mt-1">每个用户</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#34c759]" />
            <span className="text-[13px] text-[#86868b]">完成率</span>
          </div>
          <div className="text-[28px] font-bold text-[#34c759]">{(completionRate * 100).toFixed(0)}%</div>
          <p className="text-[12px] text-[#86868b] mt-1">到达最终导出</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#ff9500]" />
            <span className="text-[13px] text-[#86868b]">平均用时</span>
          </div>
          <div className="text-[28px] font-bold text-[#1d1d1f]">-</div>
          <p className="text-[12px] text-[#86868b] mt-1">需接入实时数据</p>
        </div>
      </div>

      {/* 转换漏斗 */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
        <h3 className="text-base font-semibold text-[#1d1d1f] mb-6">用户成长漏斗</h3>
        <div className="flex items-end gap-4 h-48">
          {funnelData.map((d, i) => (
            <div key={d.stage} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[16px] font-bold text-[#1d1d1f]">{d.count}</span>
              <div
                className="w-full rounded-t-xl transition-all duration-700 flex items-end justify-center pb-2"
                style={{
                  height: `${Math.max(Number(d.rate), 10)}%`,
                  backgroundColor: stageColors[d.stage] || '#0071e3',
                  opacity: 0.3 + (i / funnelData.length) * 0.7,
                }}
              >
                <span className="text-[11px] font-semibold text-white">{d.rate}%</span>
              </div>
              <span className="text-[11px] text-[#86868b] text-center">{d.stage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 用户成长路径 */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
        <h3 className="text-base font-semibold text-[#1d1d1f] mb-6">用户成长路径</h3>
        <div className="space-y-6">
          {users.map((user) => (
            <div
              key={user.userId}
              className={`rounded-2xl transition-all ${
                expandedUser === user.userId
                  ? 'bg-[#f5f5f7] p-5 border border-[#e8e8ed]'
                  : 'p-0'
              }`}
            >
              {/* 用户头部 */}
              <div
                className="flex items-center justify-between cursor-pointer px-5 py-3"
                onClick={() =>
                  setExpandedUser(expandedUser === user.userId ? null : user.userId)
                }
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0071e3] to-[#5856d6] flex items-center justify-center text-white text-sm font-semibold">
                    {user.username[0]}
                  </div>
                  <div>
                    <span className="text-[14px] font-medium text-[#1d1d1f]">{user.username}</span>
                    <span className="text-[12px] text-[#86868b] ml-2">
                      {user.stages.length} 个阶段
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[12px] text-[#86868b]">
                    最终版本 v{user.stages[user.stages.length - 1]?.resumeVersion || 0}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-[#86868b] transition-transform ${
                      expandedUser === user.userId ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* 成长路径展开 */}
              {expandedUser === user.userId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 ml-12"
                >
                  {/* 时间线 */}
                  <div className="relative pl-8 border-l-2 border-[#e8e8ed]">
                    {user.stages.map((stage, i) => (
                      <div key={i} className="relative pb-6 last:pb-0">
                        {/* 节点 */}
                        <div
                          className="absolute -left-[calc(1rem+3px)] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: stageColors[stage.stage] || '#86868b' }}
                        />
                        {/* 内容 */}
                        <div className="bg-white rounded-xl p-4 border border-[#e8e8ed] shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {stageIcons[stage.stage]}
                              <span
                                className="text-[13px] font-semibold"
                                style={{ color: stageColors[stage.stage] || '#1d1d1f' }}
                              >
                                {stage.stage}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#86868b]">
                              {new Date(stage.timestamp).toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                          <p className="text-[13px] text-[#86868b]">{stage.action}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-[11px] text-[#aeaeb2]">
                              🤖 AI 交互 {stage.aiInteractions} 次
                            </span>
                            <span className="text-[11px] text-[#aeaeb2]">
                              📄 简历版本 v{stage.resumeVersion}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 阶段统计 */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-3 text-center border border-[#e8e8ed]">
                      <div className="text-[20px] font-bold" style={{ color: stageColors['AI 评测'] }}>
                        {user.stages.filter((s) => s.stage.includes('评测')).length}
                      </div>
                      <div className="text-[11px] text-[#86868b]">评测次数</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-[#e8e8ed]">
                      <div className="text-[20px] font-bold" style={{ color: stageColors['针对性修改'] }}>
                        {user.stages.reduce((s, st) => s + st.aiInteractions, 0)}
                      </div>
                      <div className="text-[11px] text-[#86868b]">AI 交互</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-[#e8e8ed]">
                      <div className="text-[20px] font-bold" style={{ color: stageColors['终版导出'] }}>
                        {user.stages.some((s) => s.stage === '终版导出') ? '✅' : '🔄'}
                      </div>
                      <div className="text-[11px] text-[#86868b]">完成状态</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
