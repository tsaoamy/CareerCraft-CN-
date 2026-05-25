/**
 * POST /api/ai/match — 岗位匹配分析
 */
import { NextRequest, NextResponse } from 'next/server';
import { matchPosition } from '@/lib/ai/engine';
import { mockChat } from '@/lib/ai/engine';

export async function POST(request: NextRequest) {
  try {
    const { resumeContent, jdContent } = await request.json();

    if (!resumeContent || typeof resumeContent !== 'string' || resumeContent.length < 10) {
      return NextResponse.json(
        { success: false, error: '请提供有效的简历内容' },
        { status: 400 }
      );
    }

    if (!jdContent || typeof jdContent !== 'string' || jdContent.length < 10) {
      return NextResponse.json(
        { success: false, error: '请提供有效的岗位 JD' },
        { status: 400 }
      );
    }

    const result = await matchPosition(resumeContent, jdContent);

    if (!result.success) {
      const mockResult = await mockChat({
        messages: [{ role: 'user', content: `${resumeContent}\n---\n${jdContent}` }],
        context: { resumeContent, jobDescription: jdContent },
        mode: 'match',
      });
      return NextResponse.json(mockResult);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || '匹配分析失败' },
      { status: 500 }
    );
  }
}
