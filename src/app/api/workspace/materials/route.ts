/**
 * GET /api/workspace/materials — 团队共享素材（跨用户可见，用于多端/多人同步验证）
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/middleware';
import { UserDataRepository } from '@/lib/db/repositories/user-data';
import { isCloudBaseEnabled, getCloudBaseEnvId, getCloudBaseInitError } from '@/lib/cloudbase/client';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const shared = await UserDataRepository.getSharedMaterials();

    return NextResponse.json({
      success: true,
      data: {
        shared,
        cloudEnabled: isCloudBaseEnabled(),
        envId: getCloudBaseEnvId(),
        syncedAt: new Date().toISOString(),
        initError: getCloudBaseInitError(),
      },
    });
  } catch (error) {
    console.error('GET workspace materials error:', error);
    return NextResponse.json({ success: false, error: '读取共享素材失败' }, { status: 500 });
  }
}
