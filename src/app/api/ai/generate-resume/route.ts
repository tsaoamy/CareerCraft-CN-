/**
 * POST /api/ai/generate-resume — 根据目标岗位 JD 重组用户简历
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateTailoredResume, mockChat } from '@/lib/ai/engine';
import { generateTailoredResumeLocal } from '@/lib/tailored-resume';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      resumeContent,
      jobTitle,
      company,
      jdText,
      jdKeywords = [],
    } = body as {
      resumeContent?: string;
      jobTitle?: string;
      company?: string;
      jdText?: string;
      jdKeywords?: string[];
    };

    if (!resumeContent || typeof resumeContent !== 'string' || resumeContent.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: '请提供至少 20 字的简历内容（上传或粘贴）' },
        { status: 400 }
      );
    }

    if (!jobTitle || typeof jobTitle !== 'string') {
      return NextResponse.json(
        { success: false, error: '请指定目标岗位' },
        { status: 400 }
      );
    }

    if (!jdText || typeof jdText !== 'string' || jdText.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: '请提供有效的岗位 JD' },
        { status: 400 }
      );
    }

    const keywords = Array.isArray(jdKeywords) ? jdKeywords : [];

    const result = await generateTailoredResume(
      resumeContent.trim(),
      jobTitle,
      jdText.trim(),
      { company, jdKeywords: keywords }
    );

    if (result.success) {
      return NextResponse.json(result);
    }

    const mockResult = await mockChat({
      messages: [{ role: 'user', content: resumeContent }],
      context: {
        resumeContent,
        targetPosition: jobTitle,
        jobDescription: jdText,
        company,
        jdKeywords: keywords,
      },
      mode: 'generate-resume',
    });

    if (mockResult.success) {
      return NextResponse.json(mockResult);
    }

    const local = generateTailoredResumeLocal({
      resumeContent: resumeContent.trim(),
      jobTitle,
      company,
      jdText: jdText.trim(),
      jdKeywords: keywords,
    });

    return NextResponse.json({
      success: true,
      message: `定制简历已生成，关键词覆盖率约 ${local.keywordCoverage}%`,
      data: local,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '简历生成失败';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
