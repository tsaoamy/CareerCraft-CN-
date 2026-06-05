/**
 * POST /api/talent/matching - 职位匹配分析 (Phase 5)
 * GET /api/talent/matching - 获取匹配历史 / 岗位列表
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/middleware';
import { MatchingRepository } from '@/lib/db/repositories/matching';
import { getPositionById, JOB_POSITIONS_SEED } from '@/data/job-positions';
import { buildPositionMatchResult } from '@/lib/match-engine';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const positions = url.searchParams.get('type') === 'positions';

    if (positions) {
      const industry = url.searchParams.get('industry') || undefined;
      const jobLevel = url.searchParams.get('job_level') || undefined;
      const search = url.searchParams.get('search') || undefined;
      const list = await MatchingRepository.listPositions({
        industry: industry && industry !== '全部' ? industry : undefined,
        job_level: jobLevel,
        search,
      });
      return NextResponse.json({ success: true, data: list });
    }

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

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
    // 认证必须在业务逻辑之前，防止未认证用户获取匹配分析结果
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

    const position = getPositionById(positionId);
    const matchResult = buildPositionMatchResult(
      positionId,
      resumeContent || '',
      position,
      JOB_POSITIONS_SEED
    );

    const id = await MatchingRepository.saveMatch(auth.userId, positionId, matchResult);

    return NextResponse.json({ success: true, data: { id, ...matchResult } });
  } catch (error) {
    console.error('Matching error:', error);
    return NextResponse.json(
      { success: false, error: '匹配分析失败' },
      { status: 500 }
    );
  }
}
