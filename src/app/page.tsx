'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/sidebar';
import { ChatArea } from '@/components/chat/chat-area';
import { SettingsModal } from '@/components/chat/settings-modal';

export default function Home() {
  const { initFromStorage, sidebarOpen } = useChatStore();

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  return (
    <main className="flex h-screen overflow-hidden">
      {/* 侧边栏 */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-[260px] transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* 主聊天区域 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatArea />
      </div>

      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => useChatStore.getState().toggleSidebar()}
        />
      )}

      {/* 设置弹窗 */}
      <SettingsModal />
    </main>
  );
}
