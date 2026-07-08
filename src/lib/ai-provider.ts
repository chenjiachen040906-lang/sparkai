/**
 * AI 模型提供商适配层
 * 支持通义千问、智谱GLM、文心一言、DeepSeek 等多种国内大模型
 * 统一使用 OpenAI 兼容接口格式
 */

export interface ProviderConfig {
  name: string;
  displayName: string;
  baseUrl: string;
  defaultModel: string;
  models: string[];
  keyUrl: string;
  getApiKey: () => string;
}

const providers: Record<string, ProviderConfig> = {
  dashscope: {
    name: 'dashscope',
    displayName: '通义千问',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-long'],
    keyUrl: 'https://dashscope.console.aliyun.com/apiKey',
    getApiKey: () => process.env.DASHSCOPE_API_KEY || '',
  },
  zhipu: {
    name: 'zhipu',
    displayName: '智谱 AI',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-4-flash',
    models: ['glm-4-flash', 'glm-4', 'glm-4-plus', 'glm-4-long'],
    keyUrl: 'https://open.bigmodel.cn/usercenter/apikeys',
    getApiKey: () => process.env.ZHIPU_API_KEY || '',
  },
  deepseek: {
    name: 'deepseek',
    displayName: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-v4-flash',
    models: ['deepseek-v4-flash', 'deepseek-v4-pro', 'deepseek-chat', 'deepseek-reasoner'],
    keyUrl: 'https://platform.deepseek.com/api_keys',
    getApiKey: () => process.env.DEEPSEEK_API_KEY || '',
  },
  moonshot: {
    name: 'moonshot',
    displayName: 'Moonshot (Kimi)',
    baseUrl: 'https://api.moonshot.cn/v1',
    defaultModel: 'moonshot-v1-8k',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    keyUrl: 'https://platform.moonshot.cn/console/api-keys',
    getApiKey: () => process.env.MOONSHOT_API_KEY || '',
  },
};

export function getProvider(name?: string): ProviderConfig {
  const providerName = name || process.env.AI_PROVIDER || 'dashscope';
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Unknown AI provider: ${providerName}. Available: ${Object.keys(providers).join(', ')}`);
  }
  return provider;
}

export function getModel(providerName?: string, modelName?: string): string {
  const provider = getProvider(providerName);
  return modelName || process.env[`${providerName?.toUpperCase()}_MODEL`] || provider.defaultModel;
}

export function getAllProviders(): ProviderConfig[] {
  return Object.values(providers).filter((p) => {
    try {
      return !!p.getApiKey();
    } catch {
      return false;
    }
  });
}

/** 返回所有提供商信息（供客户端 UI 使用，不依赖环境变量） */
export function getAllProviderInfo() {
  return Object.values(providers).map((p) => ({
    name: p.name,
    displayName: p.displayName,
    baseUrl: p.baseUrl,
    defaultModel: p.defaultModel,
    models: p.models,
    keyUrl: p.keyUrl,
  }));
}

export async function streamChat(
  messages: Array<{ role: string; content: string }>,
  options?: { provider?: string; model?: string; apiKey?: string }
): Promise<ReadableStream> {
  const provider = getProvider(options?.provider);
  const model = getModel(options?.provider, options?.model);
  // 优先使用客户端传入的 API Key，其次使用环境变量
  const apiKey = options?.apiKey || provider.getApiKey();

  if (!apiKey) {
    throw new Error(
      `API Key not configured for ${provider.displayName}. Please set the environment variable.`
    );
  }

  // 设置 30 秒连接超时，防止请求永远挂起
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), 30000);

  let response: Response;
  try {
    response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
        stream_options: { include_usage: true },
        temperature: 0.7,
        max_tokens: 4096,
      }),
      signal: timeoutController.signal,
    });
  } catch (fetchError) {
    clearTimeout(timeoutId);
    if ((fetchError as Error).name === 'AbortError') {
      throw new Error(`${provider.displayName} 连接超时（30秒），请检查网络或稍后重试。`);
    }
    throw new Error(`${provider.displayName} 连接失败: ${(fetchError as Error).message}`);
  }
  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${provider.displayName} 接口返回错误 (${response.status}): ${errorText}`);
  }

  if (!response.body) {
    throw new Error(`${provider.displayName} 未返回响应流`);
  }

  // 将上游 SSE 流解析为标准文本流
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          controller.enqueue(new TextEncoder().encode('[DONE]'));
          controller.close();
          return;
        }

        const rawText = decoder.decode(value, { stream: true });
        buffer += rawText;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;
          if (trimmed === 'data: [DONE]') {
            controller.enqueue(new TextEncoder().encode('[DONE]'));
            controller.close();
            return;
          }

          // 提取 data: 后面的内容
          let dataStr = '';
          if (trimmed.startsWith('data: ')) {
            dataStr = trimmed.slice(6);
          } else if (trimmed.startsWith('data:')) {
            dataStr = trimmed.slice(5);
          } else {
            continue;
          }

          if (!dataStr || dataStr === '[DONE]') continue;

          try {
            const json = JSON.parse(dataStr);
            const choice = json.choices?.[0];
            if (!choice) continue;

            const delta = choice.delta;
            if (!delta) continue;

            // 提取最终回答内容
            const content =
              delta.content ||
              choice.message?.content ||
              choice.text ||
              '';

            // 提取思考过程内容（DeepSeek v4 等支持 thinking mode 的模型）
            const reasoningContent = delta.reasoning_content || '';

            // 发送思考过程
            if (reasoningContent) {
              const chunk = JSON.stringify({ type: 'thinking', content: reasoningContent });
              controller.enqueue(new TextEncoder().encode(chunk + '\n'));
            }

            // 发送正式回答内容
            if (content) {
              const chunk = JSON.stringify({ type: 'text', content });
              controller.enqueue(new TextEncoder().encode(chunk + '\n'));
            }

            // 检查上游返回的错误
            if (json.error) {
              const errMsg = json.error.message || JSON.stringify(json.error);
              controller.enqueue(
                new TextEncoder().encode(JSON.stringify({ type: 'error', error: errMsg }) + '\n')
              );
              controller.close();
              return;
            }
          } catch {
            // 跳过解析失败的行
          }
        }
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(
          new TextEncoder().encode(JSON.stringify({ type: 'error', error: errMsg }) + '\n')
        );
        controller.close();
      }
    },
  });
}
