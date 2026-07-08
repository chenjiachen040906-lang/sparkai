'use client';

import { useEffect, useRef } from 'react';
import { MessageItem } from './message-item';
import type { Message } from '@/types';

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({ messages, isStreaming, streamingContent, messagesEndRef }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  // 空状态
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-color)]/10">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">
            开始你的 AI 对话
          </h2>
          <p className="mb-8 text-[var(--text-secondary)]">
            输入你的问题，AI 会为你生成回答。支持代码编写、文案创作、知识问答等多种场景。
          </p>

          {/* 示例提示 */}
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { icon: '💡', text: '解释一下量子计算的基本原理' },
              { icon: '✍️', text: '帮我写一篇关于 AI 发展的博客' },
              { icon: '💻', text: '用 Python 实现一个排序算法' },
              { icon: '📊', text: '分析一下当前 AI 行业的趋势' },
            ].map((item, i) => (
              <button
                key={i}
                className="rounded-lg border border-[var(--border-color)] p-3 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                onClick={() => {
                  const event = new CustomEvent('fill-input', { detail: item.text });
                  window.dispatchEvent(event);
                }}
              >
                <span className="mr-2">{item.icon}</span>
                {item.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4"
    >
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.map((message, index) => {
          const isLastAssistant =
            message.role === 'assistant' && index === messages.length - 1;
          const showStreaming = isLastAssistant && isStreaming;

          return (
            <MessageItem
              key={message.id}
              message={message}
              isStreaming={showStreaming}
            />
          );
        })}
        <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} />
      </div>
    </div>
  );
}
