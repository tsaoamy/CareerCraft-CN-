/**
 * POST /api/ai/enhance — 项目经历增强分析
 */
import { NextRequest, NextResponse } from 'next/server';
import { enhanceProject } from '@/lib/ai/engine';
import { mockChat } from '@/lib/ai/engine';

export async function POST(request: NextRequest) {
  try {
    const { projectDescription } = await request.json();

    if (!projectDescription || typeof projectDescription !== 'string' || projectDescription.length < 10) {
      return NextResponse.json(
        { success: false, error: '请提供有效的项目经历描述（至少 10 个字符）' },
        { status: 400 }
      );
    }

    const result = await enhanceProject(projectDescription);

    if (!result.success) {
      const mockResult = await mockChat({
        messages: [{ role: 'user', content: projectDescription }],
        context: { projectExperience: projectDescription },
        mode: 'enhance',
      });
      return NextResponse.json({ ...mockResult, meta: { source: 'offline' as const } });
    }

    return NextResponse.json({ ...result, meta: { source: 'ai' as const } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || '分析失败' },
      { status: 500 }
    );
  }
}
