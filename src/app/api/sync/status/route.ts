/**
 * GET /api/sync/status — 云端同步状态探测
 */

import { NextResponse } from 'next/server';
import {
  isCloudBaseEnabled,
  getCloudBaseEnvId,
  getCloudBaseInitError,
  getCloudBaseDb,
} from '@/lib/cloudbase/client';

export const runtime = 'nodejs';

export async function GET() {
  const enabled = isCloudBaseEnabled();
  let connected = false;

  if (enabled) {
    try {
      connected = getCloudBaseDb() !== null;
    } catch {
      connected = false;
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      cloudEnabled: enabled,
      cloudConnected: connected,
      envId: getCloudBaseEnvId(),
      initError: getCloudBaseInitError(),
      checkedAt: new Date().toISOString(),
    },
  });
}
