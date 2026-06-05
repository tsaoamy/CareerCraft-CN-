/**
 * POST /api/ai/extract-resume — 简历文本关键词与经历提取
 * 需登录；按用户限流
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseResumeContent } from '@/lib/resume-extract';
import { requireAuth } from '@/lib/api/middleware';
import { rateLimitOrResponse } from '@/lib/api/rate-limit';

const EXTRACT_LIMIT = 30;
const EXTRACT_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = rateLimitOrResponse(
      `extract-resume:${auth.userId}`,
      EXTRACT_LIMIT,
      EXTRACT_WINDOW_MS
    );
    if (limited) return limited;

    const body = await request.json();
    const content = typeof body.content === 'string' ? body.content.trim() : '';

    if (!content || content.length < 20) {
      return NextResponse.json(
        { success: false, error: '简历内容过短，请上传包含更多信息的文件' },
        { status: 400 }
      );
    }

    const result = parseResumeContent(content);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Extract resume error:', error);
    return NextResponse.json(
      { success: false, error: '简历解析失败，请稍后重试' },
      { status: 500 }
    );
  }
}
