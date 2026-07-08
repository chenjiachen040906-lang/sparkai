/**
 * /api/chat - AI 对话接口
 * 支持流式响应 (SSE)，适配多种国内大模型
 */
import { NextRequest, NextResponse } from 'next/server';
import { streamChat, getProvider } from '@/lib/ai-provider';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, provider, model, apiKey } = body;

    // 验证输入
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: '消息列表不能为空' },
        { status: 400 }
      );
    }

    // 验证至少有一条用户消息
    const hasUserMessage = messages.some((m: any) => m.role === 'user');
    if (!hasUserMessage) {
      return NextResponse.json(
        { error: '至少需要一条用户消息' },
        { status: 400 }
      );
    }

    // 检查 API Key：优先使用客户端传入的，其次使用环境变量
    const providerConfig = getProvider(provider);
    const resolvedKey = apiKey || providerConfig.getApiKey();
    if (!resolvedKey) {
      return NextResponse.json(
        {
          error: `${providerConfig.displayName} 的 API Key 未配置。请在页面设置中填写。`,
        },
        { status: 400 }
      );
    }

    // 流式调用 AI 模型
    const stream = await streamChat(
      messages.map((m: any) => ({ role: m.role, content: m.content })),
      { provider, model, apiKey: resolvedKey }
    );

    // 返回流式响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('[Chat API Error]:', error);
    const errorMessage = error instanceof Error ? error.message : '服务器内部错误';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// GET 请求返回所有提供商信息（供客户端 UI 使用）
export async function GET() {
  try {
    const { getAllProviderInfo } = await import('@/lib/ai-provider');
    const providers = getAllProviderInfo();
    return NextResponse.json({ providers });
  } catch (error) {
    return NextResponse.json({ providers: [] });
  }
}
