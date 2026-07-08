'use client';

import { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';

interface MessageItemProps {
  message: Message;
  isStreaming?: boolean;
}

export const MessageItem = memo(function MessageItem({ message, isStreaming }: MessageItemProps) {
  const isUser = message.role === 'user';
  const [thinkingOpen, setThinkingOpen] = useState(false);

  return (
    <div
      className={cn(
        'flex gap-3 animate-slide-up',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* 头像 */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
          isUser
            ? 'bg-[var(--accent-color)] text-white'
            : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
        )}
      >
        {isUser ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27A7 7 0 0 1 14 22h-4a7 7 0 0 1-6.73-3H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
            <circle cx="9" cy="15" r="1" />
            <circle cx="15" cy="15" r="1" />
          </svg>
        )}
      </div>

      {/* 消息内容 */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5',
          isUser
            ? 'bg-[var(--accent-color)] text-white'
            : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="markdown-body text-sm">
            {/* 思考过程（可折叠） */}
            {message.reasoningContent && (
              <details
                className="mb-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] overflow-hidden"
                open={thinkingOpen}
                onToggle={(e) => setThinkingOpen((e.target as HTMLDetailsElement).open)}
              >
                <summary className="cursor-pointer select-none px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  <span className="mr-1">💭</span>
                  思考过程
                  {isStreaming && !message.content && (
                    <span className="ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-color)]" />
                  )}
                </summary>
                <div className="border-t border-[var(--border-color)] px-3 py-2 text-xs leading-relaxed text-[var(--text-secondary)] max-h-60 overflow-y-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.reasoningContent}
                  </ReactMarkdown>
                </div>
              </details>
            )}
            {/* 思考中但还没有正式内容时显示加载提示 */}
            {isStreaming && message.reasoningContent && !message.content && (
              <p className="text-xs text-[var(--text-secondary)]">正在思考中...</p>
            )}
            {/* 正式回答内容 */}
            {message.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            ) : isStreaming && !message.reasoningContent ? (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              !isStreaming && !message.reasoningContent && (
                <p className="text-[var(--text-secondary)]">等待回复...</p>
              )
            )}
            {isStreaming && message.content && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[var(--text-primary)]" />
            )}
          </div>
        )}
      </div>
    </div>
  );
});
