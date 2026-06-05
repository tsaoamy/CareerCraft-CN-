/**
 * POST /api/ai/chat — AI 职业顾问通用对话
 */
import { NextRequest, NextResponse } from 'next/server';
import { smartChat } from '@/lib/ai/engine';
import type { ChatRequest } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { success: false, error: '消息不能为空' },
        { status: 400 }
      );
    }

    const result = await smartChat(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '服务器错误';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
