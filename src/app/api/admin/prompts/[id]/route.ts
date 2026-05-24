/**
 * GET /api/admin/prompts/[id]/versions - 获取 Prompt 版本历史
 * POST /api/admin/prompts/[id]/rollback - 版本回滚
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/middleware';
import { PromptRepository } from '@/lib/db/repositories/prompt';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;

    const versions = await PromptRepository.getVersions(id);

    return NextResponse.json({
      success: true,
      data: versions,
    });
  } catch (error) {
    console.error('Get versions error:', error);
    return NextResponse.json(
      { success: false, error: '获取版本历史失败' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { version } = body;

    if (!version) {
      return NextResponse.json(
        { success: false, error: '缺少目标版本号' },
        { status: 400 }
      );
    }

    const success = await PromptRepository.rollback(id, version);
    if (!success) {
      return NextResponse.json(
        { success: false, error: '版本回滚失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Rollback error:', error);
    return NextResponse.json(
      { success: false, error: '版本回滚失败' },
      { status: 500 }
    );
  }
}
