/**
 * GET /api/enterprise - 企业版数据 (Phase 7)
 * POST /api/enterprise/batch - 创建批量分析
 * GET /api/enterprise/batch/[id] - 查看批次结果
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/middleware';
import { EnterpriseRepository } from '@/lib/db/repositories/enterprise';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const enterprise = await EnterpriseRepository.getByUserId(auth.userId);
    if (!enterprise) {
      return NextResponse.json(
        { success: false, error: '非企业用户' },
        { status: 403 }
      );
    }

    const batches = await EnterpriseRepository.getBatches(enterprise.id as string);

    return NextResponse.json({
      success: true,
      data: { enterprise, batches },
    });
  } catch (error) {
    console.error('Enterprise error:', error);
    return NextResponse.json(
      { success: false, error: '获取企业数据失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { action, ...data } = body;

    // 创建企业账户
    if (action === 'create_account') {
      const { company_name, company_size } = data;
      if (!company_name) {
        return NextResponse.json(
          { success: false, error: '请输入公司名称' },
          { status: 400 }
        );
      }

      const id = await EnterpriseRepository.createEnterpriseUser({
        user_id: auth.userId,
        company_name,
        company_size,
      });

      return NextResponse.json({ success: true, data: { id } });
    }

    // 创建批量分析批次
    if (action === 'create_batch') {
      const enterprise = await EnterpriseRepository.getByUserId(auth.userId);
      if (!enterprise) {
        return NextResponse.json(
          { success: false, error: '请先注册企业账户' },
          { status: 403 }
        );
      }

      const { batch_name, resumes, filters } = data;
      if (!resumes || !Array.isArray(resumes)) {
        return NextResponse.json(
          { success: false, error: '请提供简历列表' },
          { status: 400 }
        );
      }

      const batchId = await EnterpriseRepository.createBatch(
        enterprise.id as string,
        batch_name || `批次 ${Date.now()}`,
        resumes.length,
        filters
      );

      // 模拟批量处理
      for (const resume of resumes) {
        await EnterpriseRepository.addResumeResult({
          batch_id: batchId,
          resume_content: typeof resume === 'string' ? resume : JSON.stringify(resume),
          parsed_data: {
            name: `候选人${Math.floor(Math.random() * 1000)}`,
            education: ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)],
            experience: Math.floor(Math.random() * 10) + 1,
            skills: ['React', 'TypeScript', 'Python'].slice(0, 2 + Math.floor(Math.random() * 2)),
          },
          score: Math.round(55 + Math.random() * 40),
          tags: ['技术能力', '项目经验', '学历优秀'].slice(0, 1 + Math.floor(Math.random() * 3)),
          recommendation: ['强烈推荐', '推荐面试', '可考虑', '暂不匹配'][Math.floor(Math.random() * 4)],
          interview_questions: [
            '请介绍您最有挑战性的项目经历',
            '描述一次团队协作解决技术难题的经验',
          ],
        });
      }

      await EnterpriseRepository.updateBatchStatus(batchId, 'completed');

      return NextResponse.json({ success: true, data: { batchId } });
    }

    return NextResponse.json(
      { success: false, error: '无效的操作' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Enterprise POST error:', error);
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}
