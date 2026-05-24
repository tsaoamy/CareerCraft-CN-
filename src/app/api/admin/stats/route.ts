/**
 * GET /api/admin/stats - 获取管理统计数据
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/middleware';
import { UserRepository } from '@/lib/db/repositories/user';
import { EventRepository } from '@/lib/db/repositories/event';
import { PromptRepository } from '@/lib/db/repositories/prompt';
import { TalentRepository } from '@/lib/db/repositories/talent';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [userStats, dau, weeklyStats, promptCalls, skillDist] = await Promise.all([
      UserRepository.getStats(),
      EventRepository.getDAU(today),
      EventRepository.getDailyStatsRange(weekAgo, today),
      PromptRepository.getCallStats(),
      TalentRepository.getSkillDistribution(),
    ]);

    // 计算本周汇总
    const weekSummary = {
      totalEvents: 0,
      resumeGenerated: 0,
      resumeDownloaded: 0,
      aiCalls: 0,
    };

    for (const row of weeklyStats) {
      weekSummary.totalEvents += (row.total_events as number) || 0;
      weekSummary.resumeGenerated += (row.resume_generated as number) || 0;
      weekSummary.resumeDownloaded += (row.resume_downloaded as number) || 0;
      weekSummary.aiCalls += (row.ai_calls as number) || 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        users: userStats,
        dau,
        weekSummary,
        weeklyTrend: weeklyStats,
        promptCalls,
        skillDistribution: skillDist,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { success: false, error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
