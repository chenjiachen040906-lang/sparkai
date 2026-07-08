'use client';

import { useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '@/lib/store';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import type { Message } from '@/types';

export function ChatArea() {
  const {
    conversations,
    activeConversationId,
    isStreaming,
    settings,
    createConversation,
    addMessage,
    streamingContent,
    toggleSidebar,
    sidebarOpen,
  } = useChatStore();

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const handleSend = useCallback(
    async (content: string) => {
      let convId = activeConversationId;

      // 如果没有活跃对话，创建一个
      if (!convId) {
        convId = createConversation();
      }

      // 添加用户消息
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        createdAt: Date.now(),
      };
      addMessage(convId, userMessage);

      // 添加空的助手消息占位
      const assistantMsgId = uuidv4();
      const assistantMessage: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      };
      addMessage(convId, assistantMessage);

      // 开始流式请求
      useChatStore.setState({ isStreaming: true, streamingContent: '' });

      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      let fullContent = '';
      let fullReasoningContent = '';
      let hasError = false;

      try {
        // 获取当前对话的所有消息（除了最后的空助手消息）
        const currentConv = useChatStore.getState().conversations.find((c) => c.id === convId);
        const messagesForApi = (currentConv?.messages || [])
          .filter((m) => m.id !== assistantMsgId)
          .map((m) => ({ role: m.role, content: m.content }));

        console.log('[Chat] Sending request:', { provider: settings.provider, model: settings.model, msgCount: messagesForApi.length });

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: messagesForApi,
            provider: settings.provider,
            model: settings.model,
            apiKey: settings.apiKey,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          let errorMsg = `请求失败 (${response.status})`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } catch { /* 忽略 JSON 解析错误 */ }
          throw new Error(errorMsg);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('无法读取响应流');

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n').filter((l) => l.trim());

          for (const line of lines) {
            if (line === '[DONE]') continue;
            try {
              const data = JSON.parse(line);
              if (data.type === 'text' && data.content) {
                fullContent += data.content;
              } else if (data.type === 'thinking' && data.content) {
                fullReasoningContent += data.content;
              } else if (data.type === 'error') {
                throw new Error(data.error || 'AI 生成出错');
              }
              // 直接按 ID 更新助手消息，同时更新 content 和 reasoningContent
              if (data.type === 'text' || data.type === 'thinking') {
                useChatStore.setState((state) => ({
                  conversations: state.conversations.map((c) => {
                    if (c.id !== convId) return c;
                    return {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsgId
                          ? { ...m, content: fullContent, reasoningContent: fullReasoningContent }
                          : m
                      ),
                    };
                  }),
                }));
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }
      } catch (error) {
        hasError = true;
        if ((error as Error).name === 'AbortError') {
          fullContent = '已停止生成。';
        } else {
          const errMsg = error instanceof Error ? error.message : '未知错误';
          console.error('[Chat Error]:', error);
          fullContent = `出错了: ${errMsg}\n\n请检查左侧设置中的 API Key 是否正确，以及网络连接是否正常。`;
        }
      } finally {
        // 兜底：如果没有内容也没有思考过程，才显示错误提示
        if (!fullContent && !fullReasoningContent) {
          fullContent = '抱歉，AI 未能生成回复。请检查 API Key 是否有效，或换个问题再试一次。';
        }
        useChatStore.setState((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== convId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMsgId && !m.content && !m.reasoningContent
                  ? { ...m, content: fullContent }
                  : m
              ),
            };
          }),
          isStreaming: false,
          streamingContent: '',
        }));
        abortControllerRef.current = null;
      }
    },
    [
      activeConversationId,
      settings,
      createConversation,
      addMessage,
    ]
  );

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* 顶部栏 */}
      <header className="flex items-center gap-3 border-b border-[var(--border-color)] px-4 py-3">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            aria-label="打开侧边栏"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        )}
        <h2 className="truncate text-sm font-medium text-[var(--text-primary)]">
          {activeConversation?.title || '新对话'}
        </h2>
      </header>

      {/* 消息列表 */}
      <MessageList
        messages={activeConversation?.messages || []}
        isStreaming={isStreaming}
        streamingContent={streamingContent}
        messagesEndRef={messagesEndRef}
      />

      {/* 输入区域 */}
      <ChatInput
        onSend={handleSend}
        onStop={handleStop}
        isStreaming={isStreaming}
        disabled={isStreaming}
      />
    </div>
  );
}
