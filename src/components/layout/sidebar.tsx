'use client';

import { useChatStore } from '@/lib/store';
import { formatTime, cn } from '@/lib/utils';

export function Sidebar() {
  const {
    conversations,
    activeConversationId,
    darkMode,
    createConversation,
    deleteConversation,
    setActiveConversation,
    toggleSidebar,
    toggleDarkMode,
    openSettings,
    settings,
  } = useChatStore();

  return (
    <aside className="flex h-full flex-col border-r border-[var(--border-color)] bg-[var(--bg-secondary)]">
      {/* 顶部标题和操作区 */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] p-4">
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">
          {process.env.NEXT_PUBLIC_APP_NAME || 'AI Chat'}
        </h1>
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] md:hidden"
          aria-label="关闭侧边栏"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 新建对话按钮 */}
      <div className="p-3">
        <button
          onClick={() => createConversation()}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg border border-[var(--border-color)]',
            'px-3 py-2.5 text-sm font-medium text-[var(--text-primary)]',
            'transition-colors hover:bg-[var(--bg-tertiary)]'
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          新建对话
        </button>
      </div>

      {/* 会话列表 */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {conversations.length === 0 ? (
          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            还没有对话，点击上方开始
          </p>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  'group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5',
                  'transition-colors',
                  conv.id === activeConversationId
                    ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/50 hover:text-[var(--text-primary)]'
                )}
                onClick={() => setActiveConversation(conv.id)}
              >
                {/* 对话图标 */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>

                {/* 对话信息 */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{conv.title}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {formatTime(conv.updatedAt)}
                  </p>
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('确定删除这个对话吗？')) {
                      deleteConversation(conv.id);
                    }
                  }}
                  className="shrink-0 rounded p-1 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/30"
                  aria-label="删除对话"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* 底部工具栏 */}
      <div className="border-t border-[var(--border-color)] p-3 space-y-1">
        <button
          onClick={openSettings}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm',
            'text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)]'
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <span className="truncate">
            {settings.apiKey ? '模型设置' : '配置 API Key'}
          </span>
          {settings.apiKey && (
            <span className="ml-auto text-xs text-[var(--text-secondary)]">
              {settings.provider}
            </span>
          )}
        </button>
        <button
          onClick={toggleDarkMode}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm',
            'text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)]'
          )}
        >
          {darkMode ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              浅色模式
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              深色模式
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
