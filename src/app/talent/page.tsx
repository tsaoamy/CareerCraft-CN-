'use client';

/**
 * AI 人才画像系统 (Phase 4)
 * 展示：雷达图、技能树、职业路径图、岗位匹配度评分
 */

import { useState, useEffect } from 'react';
import { Radar, Compass, TrendingUp, AlertTriangle, Award, Target, Zap, Brain } from 'lucide-react';
import EChartsReact from 'echarts-for-react';

interface TalentData {
  skill_structure: {
    technical: { name: string; level: number }[];
    soft: { name: string; level: number }[];
    tools: { name: string; proficiency: number }[];
  };
  career_direction: string;
  career_path: { role: string; years: number; description: string }[];
  job_match_score: number;
  capability_tags: string[];
  growth_potential: number;
  career_risk_score: number;
  career_risk_factors: string[];
  education_level: string;
  work_years: number;
  industry: string;
}

export default function TalentProfilePage() {
  const [profile, setProfile] = useState<TalentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem('careercraft_token_v2');
      const res = await fetch('/api/talent', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(JSON.parse(
          typeof data.data.skill_structure === 'string'
            ? data.data.analysis_raw || '{}'
            : JSON.stringify({
                skill_structure: data.data.skill_structure,
                career_direction: data.data.career_direction,
                career_path: JSON.parse(data.data.career_path || '[]'),
                job_match_score: data.data.job_match_score,
                capability_tags: JSON.parse(data.data.capability_tags || '[]'),
                growth_potential: data.data.growth_potential,
                career_risk_score: data.data.career_risk_score,
                career_risk_factors: JSON.parse(data.data.career_risk_factors || '[]'),
                education_level: data.data.education_level,
                work_years: data.data.work_years,
                industry: data.data.industry,
              })
        ));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-gray-400">加载人才画像...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-2">尚未生成人才画像</h2>
          <p className="text-gray-500 mb-6">上传简历后系统将自动分析并生成您的专属人才画像</p>
          <a
            href="/resume-builder"
            className="inline-flex px-6 py-3 bg-[#5856d6] text-white rounded-xl font-medium hover:opacity-90"
          >
            立即创建简历
          </a>
        </div>
      </div>
    );
  }

  // 雷达图配置
  const radarOption = {
    tooltip: {},
    legend: { data: ['技能评分'], bottom: 0 },
    radar: {
      indicator: profile.skill_structure.technical.map((s) => ({
        name: s.name,
        max: 10,
      })),
      center: ['50%', '55%'],
      radius: '65%',
    },
    series: [{
      type: 'radar',
      data: [{
        value: profile.skill_structure.technical.map((s) => s.level),
        name: '技能评分',
        areaStyle: { color: 'rgba(88, 86, 214, 0.15)' },
        lineStyle: { color: '#5856d6', width: 2 },
        itemStyle: { color: '#5856d6' },
      }],
    }],
  };

  // 成长潜力仪表盘
  const gaugeOption = {
    series: [{
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      center: ['50%', '60%'],
      radius: '85%',
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          color: [
            [0.3, '#ff6b6b'],
            [0.7, '#ffd93d'],
            [1, '#6bcb77'],
          ],
        },
      },
      pointer: { icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z', length: '55%' },
      detail: {
        formatter: '{value}%',
        offsetCenter: [0, '60%'],
        fontSize: 24,
        fontWeight: 'bold',
      },
      title: { offsetCenter: [0, '85%'], fontSize: 13 },
      data: [{ value: profile.growth_potential, name: '成长潜力' }],
    }],
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 头部信息 */}
        <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">人才画像</h1>
              <p className="text-sm text-gray-500 mt-1">AI 驱动的多维度能力评估</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-gradient-to-br from-[#5856d6]/10 to-[#ff2d55]/10 rounded-xl">
                <div className="text-2xl font-bold text-[#5856d6]">{profile.job_match_score}%</div>
                <div className="text-xs text-gray-500">岗位匹配度</div>
              </div>
              <div className="text-center px-4 py-2 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{profile.work_years}年</div>
                <div className="text-xs text-gray-500">工作年限</div>
              </div>
            </div>
          </div>

          {/* 能力标签 */}
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.capability_tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#5856d6]/10 to-[#ff2d55]/10 text-[#5856d6] dark:text-[#8b8aff]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 技能雷达图 */}
          <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Radar className="w-5 h-5 text-[#5856d6]" />
              <h3 className="font-semibold text-[#1d1d1f] dark:text-white">技能雷达图</h3>
            </div>
            <EChartsReact option={radarOption} style={{ height: 350 }} />
          </div>

          {/* 成长潜力 */}
          <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-[#1d1d1f] dark:text-white">成长潜力评估</h3>
            </div>
            <EChartsReact option={gaugeOption} style={{ height: 300 }} />

            {/* 职业风险 */}
            {profile.career_risk_factors.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                    职业风险评分: {profile.career_risk_score}/100
                  </span>
                </div>
                <ul className="text-xs text-orange-600 dark:text-orange-500 space-y-1">
                  {profile.career_risk_factors.map((factor, i) => (
                    <li key={i}>• {factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 职业路径图 */}
        <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <Compass className="w-5 h-5 text-[#5856d6]" />
            <h3 className="font-semibold text-[#1d1d1f] dark:text-white">
              职业发展路径 · {profile.career_direction}
            </h3>
          </div>
          <div className="relative">
            {profile.career_path.map((step, i) => (
              <div key={i} className="flex items-start gap-4 mb-6 last:mb-0">
                {/* Timeline dot & line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    i === 0 ? 'bg-[#5856d6]' : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    {i + 1}
                  </div>
                  {i < profile.career_path.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <h4 className="font-medium text-[#1d1d1f] dark:text-white">{step.role}</h4>
                  <p className="text-xs text-gray-400 mt-1">{step.years ? `${step.years}年经验` : ''}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 软技能和工具 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 软技能 */}
          <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-[#1d1d1f] dark:text-white">软技能评估</h3>
            </div>
            <div className="space-y-3">
              {profile.skill_structure.soft?.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{skill.name}</span>
                    <span className="font-medium text-[#1d1d1f] dark:text-white">{skill.level}/10</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
                      style={{ width: `${(skill.level / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 工具熟练度 */}
          <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-[#1d1d1f] dark:text-white">工具熟练度</h3>
            </div>
            <div className="space-y-3">
              {profile.skill_structure.tools?.map((tool, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{tool.name}</span>
                    <span className="font-medium text-[#1d1d1f] dark:text-white">{tool.proficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                      style={{ width: `${tool.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
