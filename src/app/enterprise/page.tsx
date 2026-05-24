'use client';

/**
 * 企业招聘版 (Phase 7)
 * HR 批量上传简历 → AI 自动解析、评分、排序、推荐
 */

import { useState } from 'react';
import {
  Upload, FileText, Search, Filter, SortDesc,
  Award, MessageSquare, Download, BarChart3,
  ChevronDown, Star, TrendingUp, Users, Building2
} from 'lucide-react';

interface ResumeResult {
  id: string;
  parsed_data: { name: string; education: string; experience: number; skills: string[] };
  score: number;
  rank: number;
  tags: string[];
  recommendation: string;
  interview_questions: string[];
}

export default function EnterprisePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');
  const [batchName, setBatchName] = useState('');
  const [resumes, setResumes] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ResumeResult[]>([]);
  const [batchId, setBatchId] = useState('');
  const [filters, setFilters] = useState({ minScore: 0, keyword: '', education: '' });

  const handleFileUpload = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 模拟：粘贴多份简历（用分隔符分开）
    const text = e.target.value;
    if (text.trim()) {
      const list = text.split('---').map((r) => r.trim()).filter(Boolean);
      setResumes(list);
    }
  };

  const handleStartAnalysis = async () => {
    if (!batchName || resumes.length === 0) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('careercraft_token_v2');
      const res = await fetch('/api/enterprise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'create_batch',
          batch_name: batchName,
          resumes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBatchId(data.data.batchId);
        // 模拟结果
        setResults(
          resumes.map((_, i) => ({
            id: `r-${i}`,
            parsed_data: {
              name: `候选人${String.fromCharCode(65 + (i % 26))}`,
              education: ['本科', '硕士', '博士'][i % 3],
              experience: Math.floor(Math.random() * 8) + 1,
              skills: ['React', 'TypeScript', 'Python', 'Go'].slice(0, 2 + (i % 3)),
            },
            score: Math.round(60 + Math.random() * 35),
            rank: i + 1,
            tags: ['技术能力', '项目经验', '学历优秀'].slice(0, 1 + (i % 3)),
            recommendation: ['强烈推荐', '推荐面试', '可考虑'][i % 3],
            interview_questions: [
              '请介绍最有挑战性的项目经历',
              `描述${['React', 'TypeScript', 'Python'][i % 3]}相关技术经验`,
            ],
          }))
        );
        setActiveTab('results');
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const filteredResults = results
    .filter((r) => !filters.minScore || r.score >= filters.minScore)
    .filter((r) => !filters.keyword || r.parsed_data.skills.some((s) => s.toLowerCase().includes(filters.keyword.toLowerCase())))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">企业招聘版</h1>
            <p className="text-sm text-gray-500 mt-1">批量简历 AI 智能筛选</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-[#5856d6] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-1" />
              上传简历
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'results'
                  ? 'bg-[#5856d6] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              disabled={results.length === 0}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              分析结果
            </button>
          </div>
        </div>

        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="max-w-2xl mx-auto">
              {/* 批次信息 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  批次名称
                </label>
                <input
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm"
                  placeholder="例：2025秋季校招 - 前端岗位"
                />
              </div>

              {/* 简历输入 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  批量粘贴简历内容
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  每份简历用 "---" 分隔，支持最多100份
                </p>
                <textarea
                  onChange={handleFileUpload}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm font-mono resize-none"
                  placeholder={`张三
前端开发工程师 | 3年经验
技能：React, TypeScript, Vue.js
教育：本科 - 计算机科学
---
李四
后端开发工程师 | 5年经验
技能：Go, Python, Docker, Kubernetes
教育：硕士 - 软件工程`}
                />
              </div>

              {/* 已上传数量 */}
              {resumes.length > 0 && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      已准备 {resumes.length} 份简历
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleStartAnalysis}
                disabled={!batchName || resumes.length === 0 || processing}
                className="w-full py-3 rounded-xl bg-[#5856d6] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  'AI 分析中...'
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    开始 AI 智能筛选 ({resumes.length} 份)
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'results' && results.length > 0 && (
          <div>
            {/* 统计摘要 */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatCard icon={FileText} label="总简历" value={results.length} color="text-blue-500" />
              <StatCard icon={Star} label="平均分" value={Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)} color="text-yellow-500" />
              <StatCard icon={Award} label="推荐面试" value={results.filter((r) => r.recommendation === '强烈推荐').length} color="text-green-500" />
              <StatCard icon={TrendingUp} label="最高分" value={Math.max(...results.map((r) => r.score))} color="text-[#5856d6]" />
            </div>

            {/* 筛选栏 */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filters.minScore}
                  onChange={(e) => setFilters({ ...filters, minScore: parseInt(e.target.value) })}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2c2c2e] text-sm"
                >
                  <option value="0">最低分数</option>
                  <option value="70">70+</option>
                  <option value="80">80+</option>
                  <option value="90">90+</option>
                </select>
              </div>
              <input
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                placeholder="技能关键词..."
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2c2c2e] text-sm w-40"
              />
              <div className="ml-auto text-sm text-gray-500">
                显示 {filteredResults.length} / {results.length} 份
              </div>
            </div>

            {/* 候选人排行榜 */}
            <div className="space-y-3">
              {filteredResults.map((result, i) => (
                <div
                  key={result.id}
                  className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* 排名 */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                      i < 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {i + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-[#1d1d1f] dark:text-white">
                          {result.parsed_data.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          {result.parsed_data.education}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          {result.parsed_data.experience}年经验
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {result.parsed_data.skills.map((skill, j) => (
                          <span key={j} className="px-2 py-0.5 rounded text-[11px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* 面试问题 */}
                      <details className="text-xs text-gray-500">
                        <summary className="cursor-pointer hover:text-[#5856d6] transition-colors flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          推荐面试问题 ({result.interview_questions.length})
                        </summary>
                        <ul className="mt-2 space-y-1 pl-4 list-disc">
                          {result.interview_questions.map((q, j) => (
                            <li key={j}>{q}</li>
                          ))}
                        </ul>
                      </details>
                    </div>

                    {/* 评分 & 推荐 */}
                    <div className="text-right shrink-0">
                      <div className={`text-2xl font-bold ${
                        result.score >= 85 ? 'text-green-500' :
                        result.score >= 70 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {result.score}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">匹配分</div>
                      <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        result.recommendation === '强烈推荐'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : result.recommendation === '推荐面试'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {result.recommendation}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
      <Icon className={`w-5 h-5 ${color} mb-2`} />
      <div className={`text-2xl font-bold text-[#1d1d1f] dark:text-white`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
