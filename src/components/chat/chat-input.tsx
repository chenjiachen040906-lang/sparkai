'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (content: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 监听示例提示点击事件
  useEffect(() => {
    const handler = (e: Event) => {
      const text = (e as CustomEvent).detail;
      setInput(text);
      textareaRef.current?.focus();
    };
    window.addEventListener('fill-input', handler);
    return () => window.removeEventListener('fill-input', handler);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
  }, [input, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3">
      <div className="mx-auto max-w-3xl">
        <div
          className={cn(
            'flex items-end gap-2 rounded-2xl border border-[var(--border-color)]',
            'bg-[var(--bg-secondary)] px-4 py-2',
            'transition-colors focus-within:border-[var(--accent-color)]'
          )}
        >
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题... (Enter 发送, Shift+Enter 换行)"
            className={cn(
              'max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent',
              'text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]',
              'outline-none'
            )}
            maxRows={8}
            autoFocus
          />

          {isStreaming ? (
            <button
              onClick={onStop}
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                'bg-red-500 text-white transition-colors hover:bg-red-600'
              )}
              aria-label="停止生成"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || disabled}
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                'transition-colors',
                input.trim() && !disabled
                  ? 'bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
              )}
              aria-label="发送消息"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          )}
        </div>

        <p className="mt-2 text-center text-xs text-[var(--text-secondary)]">
          AI 生成内容仅供参考，请注意核实重要信息
        </p>
      </div>
    </div>
  );
}
