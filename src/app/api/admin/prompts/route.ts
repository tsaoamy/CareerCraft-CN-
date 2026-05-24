/**
 * GET /api/admin/prompts - 获取 Prompt 列表
 * POST /api/admin/prompts - 创建 Prompt
 * PUT /api/admin/prompts - 更新 Prompt
 * DELETE /api/admin/prompts - 删除 Prompt
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/middleware';
import { PromptRepository } from '@/lib/db/repositories/prompt';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;

    const url = new URL(request.url);
    const category = url.searchParams.get('category') || undefined;
    const modelType = url.searchParams.get('model_type') || undefined;
    const isActive = url.searchParams.get('is_active');

    const prompts = await PromptRepository.listAll({
      category,
      model_type: modelType,
      is_active: isActive !== null ? parseInt(isActive) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: prompts,
    });
  } catch (error) {
    console.error('Get prompts error:', error);
    return NextResponse.json(
      { success: false, error: '获取 Prompt 列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { name, category, model_type, system_prompt, user_prompt_template, variables, temperature, max_tokens } = body;

    if (!name || !system_prompt || !user_prompt_template) {
      return NextResponse.json(
        { success: false, error: '名称、系统Prompt和用户Prompt模板为必填' },
        { status: 400 }
      );
    }

    const id = await PromptRepository.create({
      name,
      category,
      model_type,
      system_prompt,
      user_prompt_template,
      variables,
      temperature,
      max_tokens,
    });

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error('Create prompt error:', error);
    return NextResponse.json(
      { success: false, error: '创建 Prompt 失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少 Prompt ID' },
        { status: 400 }
      );
    }

    // 检查是否有权限进行 AB 测试操作
    if (data.is_ab_test !== undefined && auth.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: '需要超级管理员权限进行 AB 测试设置' },
        { status: 403 }
      );
    }

    const success = await PromptRepository.update(id, data);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Prompt 不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Update prompt error:', error);
    return NextResponse.json(
      { success: false, error: '更新 Prompt 失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少 Prompt ID' },
        { status: 400 }
      );
    }

    const success = await PromptRepository.delete(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Prompt 不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Delete prompt error:', error);
    return NextResponse.json(
      { success: false, error: '删除 Prompt 失败' },
      { status: 500 }
    );
  }
}
