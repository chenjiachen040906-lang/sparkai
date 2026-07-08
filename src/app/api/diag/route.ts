/**
 * /api/diag - 诊断接口，检查 API 连接状态
 */
import { NextRequest, NextResponse } from 'next/server';
import { getProvider, getAllProviderInfo } from '@/lib/ai-provider';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { provider, model, apiKey } = await req.json();

    if (!provider || !apiKey) {
      return NextResponse.json({
        success: false,
        error: '缺少 provider 或 apiKey',
      });
    }

    const providerConfig = getProvider(provider);
    const testModel = model || providerConfig.defaultModel;

    // 发送一个简单的测试请求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${providerConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: testModel,
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 5,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: `${providerConfig.displayName} (${testModel}) 连接正常，API Key 有效`,
        });
      } else {
        const errorText = await response.text();
        return NextResponse.json({
          success: false,
          status: response.status,
          error: `${providerConfig.displayName} 返回错误 (${response.status}): ${errorText}`,
        });
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if ((fetchError as Error).name === 'AbortError') {
        return NextResponse.json({
          success: false,
          error: `${providerConfig.displayName} 连接超时（15秒），可能是网络问题或 API 地址不可达`,
        });
      }
      return NextResponse.json({
        success: false,
        error: `${providerConfig.displayName} 连接失败: ${(fetchError as Error).message}`,
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `诊断接口出错: ${(error as Error).message}`,
    });
  }
}

export async function GET() {
  const providers = getAllProviderInfo();
  return NextResponse.json({ providers });
}
