/**
 * POST /api/ai/parse-resume-file — 上传并解析简历文件（PDF / Word / 文本）
 * 需登录；按用户限流
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseResumeBuffer } from '@/lib/resume-file-parser';
import { requireAuth } from '@/lib/api/middleware';
import { rateLimitOrResponse } from '@/lib/api/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const PARSE_LIMIT = 15;
const PARSE_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = rateLimitOrResponse(
      `parse-resume-file:${auth.userId}`,
      PARSE_LIMIT,
      PARSE_WINDOW_MS
    );
    if (limited) return limited;

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: '请选择要上传的简历文件' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await parseResumeBuffer(buffer, file.name);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '简历解析失败';
    console.error('Parse resume file error:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
