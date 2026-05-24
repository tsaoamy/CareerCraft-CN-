/**
 * POST /api/talent/matching - 职位匹配分析 (Phase 5)
 * GET /api/talent/matching - 获取匹配历史
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/middleware';
import { MatchingRepository } from '@/lib/db/repositories/matching';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const url = new URL(request.url);
    const positions = url.searchParams.get('type') === 'positions';

    if (positions) {
      const industry = url.searchParams.get('industry') || undefined;
      const jobLevel = url.searchParams.get('job_level') || undefined;
      const search = url.searchParams.get('search') || undefined;
      const list = await MatchingRepository.listPositions({ industry, job_level: jobLevel, search });
      return NextResponse.json({ success: true, data: list });
    }

    const matches = await MatchingRepository.getUserMatches(auth.userId);
    return NextResponse.json({ success: true, data: matches });
  } catch (error) {
    console.error('Get matching error:', error);
    return NextResponse.json(
      { success: false, error: '获取匹配数据失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { positionId, resumeContent } = body;

    if (!positionId) {
      return NextResponse.json(
        { success: false, error: '请选择目标岗位' },
        { status: 400 }
      );
    }

    // 模拟 AI 匹配分析结果
    const matchResult = await simulateMatching(resumeContent || '', positionId);

    const id = await MatchingRepository.saveMatch(
      auth.userId,
      positionId,
      matchResult
    );

    return NextResponse.json({
      success: true,
      data: { id, ...matchResult },
    });
  } catch (error) {
    console.error('Matching error:', error);
    return NextResponse.json(
      { success: false, error: '匹配分析失败' },
      { status: 500 }
    );
  }
}

/**
 * 模拟 AI 匹配分析（生产环境替换为真实 AI 调用）
 */
async function simulateMatching(resumeContent: string, positionId: string) {
  const keywords = ['React', 'TypeScript', 'Next.js', 'Python', 'SQL', 'Docker', 'Kubernetes', 'AWS'];
  const matchedKeywords = keywords.slice(0, Math.floor(Math.random() * 4) + 3);

  const matchScore = Math.round(60 + Math.random() * 35);
  const keywordCoverage = Math.round(40 + Math.random() * 50);
  const competitivenessScore = Math.round(50 + Math.random() * 40);

  return {
    match_score: matchScore,
    skill_gaps: keywords
      .filter((k) => !matchedKeywords.includes(k))
      .slice(0, 3)
      .map((skill) => ({
        skill,
        required_level: Math.round(3 + Math.random() * 7),
        current_level: Math.round(1 + Math.random() * 4),
      })),
    keyword_coverage: keywordCoverage,
    competitiveness_score: competitivenessScore,
    optimization_tips: [
      '建议在简历中突出量化成果，使用具体数据描述项目贡献',
      '补充 AI/ML 相关项目经验可显著提升竞争力',
      '建议添加技术博客或开源贡献经历',
    ],
    top5_positions: [
      { title: '前端开发工程师', company: '示例科技', match_score: 88 },
      { title: '全栈开发工程师', company: '示例云', match_score: 82 },
      { title: 'React 开发工程师', company: '示例AI', match_score: 79 },
      { title: 'Web 前端专家', company: '示例数据', match_score: 76 },
      { title: 'UI 开发工程师', company: '示例金融', match_score: 73 },
    ],
    top5_industries: ['互联网', '人工智能', '金融科技', '云计算', '电商'],
    growth_path: [
      { step: 1, description: '补齐后端基础（Node.js/Go）', timeframe: '1-3个月' },
      { step: 2, description: '深入学习系统设计', timeframe: '3-6个月' },
      { step: 3, description: '积累架构设计经验', timeframe: '6-12个月' },
      { step: 4, description: '向全栈/Tech Lead方向发展', timeframe: '1-2年' },
    ],
  };
}
