'use client';

/**
 * 职位匹配引擎 (Phase 5)
 * 输入简历 & JD → 输出匹配度、技能缺口、竞争力分析
 */

import { useState, useEffect } from 'react';
import {
  Target, Search, BarChart3, Lightbulb, TrendingUp,
  Shield, ChevronRight, PieChart, ArrowUpRight
} from 'lucide-react';
import EChartsReact from 'echarts-for-react';

interface Position {
  id: string;
  title: string;
  company: string;
  department: string;
  industry: string;
  job_level: string;
  location: string;
  salary_range: string;
  jd_text: string;
  keywords: string;
}

interface MatchResult {
  match_score: number;
  skill_gaps: { skill: string; required_level: number; current_level: number }[];
  keyword_coverage: number;
  competitiveness_score: number;
  optimization_tips: string[];
  top5_positions: { title: string; company: string; match_score: number }[];
  top5_industries: string[];
  growth_path: { step: number; description: string; timeframe: string }[];
}

export default function MatchingPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [resumeContent, setResumeContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [history, setHistory] = useState<(MatchResult & { title: string; company: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPositions();
    fetchHistory();
  }, []);

  async function fetchPositions() {
    try {
      const token = localStorage.getItem('careercraft_token_v2');
      const res = await fetch('/api/talent/matching?type=positions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPositions(data.data);
    } catch (e) { console.error(e); }
  }

  async function fetchHistory() {
    try {
      const token = localStorage.getItem('careercraft_token_v2');
      const res = await fetch('/api/talent/matching', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (e) { console.error(e); }
  }

  async function handleAnalyze() {
    if (!selectedPosition) return;
    setAnalyzing(true);
    try {
      const token = localStorage.getItem('careercraft_token_v2');
      const res = await fetch('/api/talent/matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ positionId: selectedPosition, resumeContent }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
      else alert(data.error);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  }

  const selectedPos = positions.find((p) => p.id === selectedPosition);

  // 技能缺口图表
  const gapChartOption = result ? {
    tooltip: { trigger: 'axis' },
    legend: { data: ['要求水平', '当前水平'], bottom: 0 },
    radar: {
      indicator: result.skill_gaps.map((g) => ({ name: g.skill, max: 10 })),
      center: ['50%', '50%'],
      radius: '60%',
    },
    series: [{
      type: 'radar',
      data: [
        { value: result.skill_gaps.map((g) => g.required_level), name: '要求水平', lineStyle: { color: '#ff6b6b' } },
        { value: result.skill_gaps.map((g) => g.current_level), name: '当前水平', lineStyle: { color: '#5856d6' } },
      ],
    }],
  } : null;

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-2">职位匹配引擎</h1>
        <p className="text-sm text-gray-500 mb-8">AI 驱动的智能岗位匹配分析</p>

        {/* Input Section */}
        <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 选择岗位 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                目标岗位
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索岗位..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {positions
                  .filter((p) => !searchTerm || p.title.includes(searchTerm) || p.company.includes(searchTerm))
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPosition(p.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                        selectedPosition === p.id
                          ? 'bg-[#5856d6]/10 border border-[#5856d6]/30'
                          : 'hover:bg-gray-50 dark:hover:bg-[#3a3a3c] border border-transparent'
                      }`}
                    >
                      <div className="font-medium text-[#1d1d1f] dark:text-white">{p.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {p.company} · {p.department} · {p.salary_range}
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* 简历输入 & JD 预览 */}
            <div>
              {selectedPos && (
                <div className="mb-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">岗位描述</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
                    {selectedPos.jd_text}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {JSON.parse(selectedPos.keywords || '[]').map((k: string, i: number) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                简历内容（可选，留空使用已上传简历）
              </label>
              <textarea
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm resize-none"
                placeholder="粘贴简历内容..."
              />

              <button
                onClick={handleAnalyze}
                disabled={!selectedPosition || analyzing}
                className="mt-4 w-full py-3 rounded-xl bg-[#5856d6] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>分析中...</>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    开始匹配分析
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className="space-y-6">
            {/* 匹配度评分卡 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreCard icon={Target} label="匹配度" value={`${result.match_score}%`} color="text-[#5856d6]" bg="bg-[#5856d6]/10" />
              <ScoreCard icon={BarChart3} label="关键词覆盖" value={`${result.keyword_coverage}%`} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/20" />
              <ScoreCard icon={Shield} label="竞争力" value={`${result.competitiveness_score}%`} color="text-green-500" bg="bg-green-50 dark:bg-green-900/20" />
              <ScoreCard icon={TrendingUp} label="技能缺口" value={`${result.skill_gaps.length}`} color="text-orange-500" bg="bg-orange-50 dark:bg-orange-900/20" suffix="项" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 技能缺口雷达图 */}
              {gapChartOption && (
                <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#5856d6]" />
                    技能缺口分析
                  </h3>
                  <EChartsReact option={gapChartOption} style={{ height: 300 }} />
                </div>
              )}

              {/* 优化建议 */}
              <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  优化建议
                </h3>
                <ul className="space-y-3">
                  {result.optimization_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <ChevronRight className="w-4 h-4 text-[#5856d6] mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Top 5 推荐 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-4">Top 5 推荐岗位</h3>
                <div className="space-y-3">
                  {result.top5_positions.map((pos, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1c1c1e]">
                      <div>
                        <div className="font-medium text-sm text-[#1d1d1f] dark:text-white">{pos.title}</div>
                        <div className="text-xs text-gray-500">{pos.company}</div>
                      </div>
                      <span className="text-sm font-bold text-[#5856d6]">{pos.match_score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-4">成长路线图</h3>
                <div className="space-y-3">
                  {result.growth_path.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#1c1c1e]">
                      <div className="w-7 h-7 rounded-full bg-[#5856d6] text-white text-xs flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#1d1d1f] dark:text-white">{step.description}</div>
                        <div className="text-xs text-gray-500">{step.timeframe}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreCard({ icon: Icon, label, value, color, bg, suffix = '' }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  bg: string;
  suffix?: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-4 border border-gray-100 dark:border-gray-700`}>
      <Icon className={`w-5 h-5 ${color} mb-2`} />
      <div className={`text-2xl font-bold ${color}`}>
        {value}{suffix}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
