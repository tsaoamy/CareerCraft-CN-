/**
 * POST /api/events - 记录用户行为事件 (Phase 2)
 * GET /api/events - 获取事件统计（管理员）
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext, requireAdmin } from '@/lib/api/middleware';
import { EventRepository } from '@/lib/db/repositories/event';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events } = body;

    // 支持单个事件或批量事件
    if (Array.isArray(events)) {
      const count = await EventRepository.trackBatch(events);
      return NextResponse.json({
        success: true,
        data: { count },
      });
    }

    const id = await EventRepository.track(body);
    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error('Track event error:', error);
    return NextResponse.json(
      { success: false, error: '事件记录失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '50');
    const eventType = url.searchParams.get('event_type') || undefined;
    const startDate = url.searchParams.get('start_date') || undefined;
    const endDate = url.searchParams.get('end_date') || undefined;

    const result = await EventRepository.list(page, pageSize, {
      event_type: eventType,
      startDate,
      endDate,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { success: false, error: '获取事件失败' },
      { status: 500 }
    );
  }
}
