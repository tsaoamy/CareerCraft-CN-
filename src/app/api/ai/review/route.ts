/**
 * POST /api/ai/review — 简历全面评测
 */
import { NextRequest, NextResponse } from 'next/server';
import { reviewResume } from '@/lib/ai/engine';
import { mockChat } from '@/lib/ai/engine';

export async function POST(request: NextRequest) {
  try {
    const { resumeContent } = await request.json();

    if (!resumeContent || typeof resumeContent !== 'string' || resumeContent.length < 10) {
      return NextResponse.json(
        { success: false, error: '请提供有效的简历内容（至少 10 个字符）' },
        { status: 400 }
      );
    }

    const result = await reviewResume(resumeContent);
    
    if (!result.success) {
      const mockResult = await mockChat({
        messages: [{ role: 'user', content: resumeContent }],
        context: { resumeContent },
        mode: 'review',
      });
      return NextResponse.json({ ...mockResult, meta: { source: 'offline' as const } });
    }

    return NextResponse.json({ ...result, meta: { source: 'ai' as const } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || '评测失败' },
      { status: 500 }
    );
  }
}
