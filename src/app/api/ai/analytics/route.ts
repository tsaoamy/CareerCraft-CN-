/**
 * GET /api/ai/analytics — AI 分析数据（管理后台用，需管理员权限）
 */
import { NextRequest, NextResponse } from 'next/server';
import type { AIHeatmapData, UserGrowthData, KnowledgeRecommendation } from '@/lib/ai/types';
import { requireAdmin } from '@/lib/api/middleware';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'heatmap';

  switch (type) {
    case 'heatmap':
      return NextResponse.json(generateHeatmapData());
    case 'growth':
      return NextResponse.json(generateGrowthData());
    case 'knowledge':
      return NextResponse.json(generateKnowledgeData());
    default:
      return NextResponse.json({ success: false, error: '未知的分析类型' }, { status: 400 });
  }
}

function generateHeatmapData(): { success: boolean; data: AIHeatmapData } {
  const data: AIHeatmapData = {
    totalQuestions: 2847,
    period: '近30天',
    questions: [
      { category: '简历优化', question: '项目经历怎么写才能突出亮点？', count: 386, trend: 'up', percentage: 13.6 },
      { category: '简历优化', question: 'STAR法则是什么，怎么用？', count: 312, trend: 'up', percentage: 11.0 },
      { category: '简历优化', question: '自我评价应该怎么写？', count: 275, trend: 'stable', percentage: 9.7 },
      { category: '简历优化', question: '实习经历要怎么描述？', count: 248, trend: 'up', percentage: 8.7 },
      { category: '面试准备', question: '面试官看到我的简历会问什么？', count: 221, trend: 'up', percentage: 7.8 },
      { category: '岗位匹配', question: '我的简历和目标岗位匹配度如何？', count: 198, trend: 'stable', percentage: 7.0 },
      { category: '简历优化', question: '没有实习经验怎么办？', count: 176, trend: 'up', percentage: 6.2 },
      { category: '面试准备', question: '怎么用STAR法则介绍项目？', count: 165, trend: 'stable', percentage: 5.8 },
      { category: '岗位匹配', question: '哪些技能最值得我现在补充？', count: 152, trend: 'up', percentage: 5.3 },
      { category: '职业规划', question: '我现在应该优先提升什么能力？', count: 143, trend: 'stable', percentage: 5.0 },
      { category: '面试准备', question: '如何回答职业规划问题？', count: 138, trend: 'stable', percentage: 4.8 },
      { category: '岗位匹配', question: '转行/转岗简历怎么写？', count: 125, trend: 'up', percentage: 4.4 },
      { category: '简历优化', question: '技能应该如何排序和展示？', count: 112, trend: 'stable', percentage: 3.9 },
      { category: '职业规划', question: '大厂和创业公司怎么选？', count: 98, trend: 'down', percentage: 3.4 },
      { category: '面试准备', question: '薪资期望怎么回答？', count: 98, trend: 'down', percentage: 3.4 },
    ],
  };
  return { success: true, data };
}

function generateGrowthData(): { success: boolean; data: { users: UserGrowthData[] } } {
  const users: UserGrowthData[] = [
    {
      userId: 'user_001',
      username: '张同学',
      stages: [
        { stage: '初次提问', timestamp: '2025-05-15T10:30:00', action: '咨询"项目经历怎么写"', aiInteractions: 1, resumeVersion: 0 },
        { stage: '简历初稿', timestamp: '2025-05-16T14:20:00', action: '完成第一版简历', aiInteractions: 3, resumeVersion: 1 },
        { stage: 'AI 评测', timestamp: '2025-05-18T09:15:00', action: '提交简历评测，获得 72 分', aiInteractions: 2, resumeVersion: 1 },
        { stage: '针对性修改', timestamp: '2025-05-20T16:00:00', action: '根据建议修改简历', aiInteractions: 5, resumeVersion: 2 },
        { stage: '再次评测', timestamp: '2025-05-22T11:30:00', action: '再次评测获得 85 分', aiInteractions: 1, resumeVersion: 2 },
        { stage: '项目挖掘', timestamp: '2025-05-23T15:45:00', action: '使用项目增强功能', aiInteractions: 4, resumeVersion: 3 },
        { stage: '终版导出', timestamp: '2025-05-25T10:00:00', action: '导出最终简历并投递', aiInteractions: 1, resumeVersion: 3 },
      ],
    },
    {
      userId: 'user_002',
      username: '李同学',
      stages: [
        { stage: '注册', timestamp: '2025-05-10T08:00:00', action: '注册并完成信息填写', aiInteractions: 0, resumeVersion: 0 },
        { stage: '初次提问', timestamp: '2025-05-10T08:30:00', action: '咨询"转行简历怎么写"', aiInteractions: 2, resumeVersion: 0 },
        { stage: '岗位匹配', timestamp: '2025-05-12T14:00:00', action: '提交目标JD进行匹配分析', aiInteractions: 3, resumeVersion: 0 },
        { stage: '技能补充', timestamp: '2025-05-15T10:00:00', action: '根据匹配结果补充学习', aiInteractions: 2, resumeVersion: 0 },
        { stage: '简历初稿', timestamp: '2025-05-18T16:30:00', action: '完成第一版简历', aiInteractions: 4, resumeVersion: 1 },
        { stage: '持续优化', timestamp: '2025-05-22T20:00:00', action: '多轮修改和评测', aiInteractions: 6, resumeVersion: 2 },
      ],
    },
    {
      userId: 'user_003',
      username: '王同学',
      stages: [
        { stage: '注册', timestamp: '2025-05-20T12:00:00', action: '注册账号', aiInteractions: 0, resumeVersion: 0 },
        { stage: '初次提问', timestamp: '2025-05-20T12:15:00', action: '咨询"面试官会问什么"', aiInteractions: 1, resumeVersion: 0 },
        { stage: '面试模拟', timestamp: '2025-05-21T09:00:00', action: '使用面试模拟功能', aiInteractions: 2, resumeVersion: 0 },
        { stage: '简历生成', timestamp: '2025-05-22T14:00:00', action: '生成并优化简历', aiInteractions: 3, resumeVersion: 1 },
      ],
    },
  ];

  return { success: true, data: { users } };
}

function generateKnowledgeData(): { success: boolean; data: { recommendations: KnowledgeRecommendation[] } } {
  const recommendations: KnowledgeRecommendation[] = [
    {
      id: 'k1',
      topic: 'STAR法则详解',
      questionCount: 312,
      trend: 'up',
      suggestedContent: {
        tutorial: 'STAR法则完全指南：从入门到精通',
        example: '10个STAR法则实战案例分析',
        video: 'STAR法则5分钟快速上手',
      },
    },
    {
      id: 'k2',
      topic: '项目经历量化技巧',
      questionCount: 386,
      trend: 'up',
      suggestedContent: {
        tutorial: '如何用量化数据让简历更有说服力',
        example: '各岗位量化案例集（产品/技术/运营）',
        video: '项目量化方法论实战',
      },
    },
    {
      id: 'k3',
      topic: '自我评价写作',
      questionCount: 275,
      trend: 'stable',
      suggestedContent: {
        tutorial: '告别模板化：写出有灵魂的自我评价',
        example: '50个优秀自我评价案例库',
      },
    },
    {
      id: 'k4',
      topic: '面试高频问题',
      questionCount: 221,
      trend: 'up',
      suggestedContent: {
        tutorial: '面试官最常问的20个问题及回答策略',
        example: '真实面试场景还原',
        video: '面试前必看的准备清单',
      },
    },
    {
      id: 'k5',
      topic: '岗位匹配方法论',
      questionCount: 198,
      trend: 'stable',
      suggestedContent: {
        tutorial: '如何精准评估简历与岗位的匹配度',
        example: '不同行业匹配案例分析',
      },
    },
    {
      id: 'k6',
      topic: '零经验求职指南',
      questionCount: 176,
      trend: 'up',
      suggestedContent: {
        tutorial: '没有实习经验怎么写简历？',
        example: '校园项目转化为简历亮点的案例',
        video: '零经验求职者的逆袭之路',
      },
    },
    {
      id: 'k7',
      topic: '职业规划方法论',
      questionCount: 143,
      trend: 'stable',
      suggestedContent: {
        tutorial: '3年/5年/10年职业规划框架',
        example: '不同行业职业发展路径图',
      },
    },
  ];

  return { success: true, data: { recommendations } };
}
