/**
 * 全局状态管理 - 基于 Zustand
 * 管理会话列表、当前会话、主题等全局状态
 * 使用 localStorage 持久化会话数据
 */
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Message, Conversation, AISettings } from '@/types';

interface ChatStore {
  // 会话列表
  conversations: Conversation[];
  activeConversationId: string | null;
  sidebarOpen: boolean;

  // 主题
  darkMode: boolean;

  // AI 设置
  settings: AISettings;
  settingsOpen: boolean;

  // UI 状态
  isStreaming: boolean;
  streamingContent: string;

  // Actions
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  updateConversationTitle: (id: string, title: string) => void;

  addMessage: (conversationId: string, message: Message) => void;
  updateLastAssistantMessage: (conversationId: string, content: string) => void;

  toggleSidebar: () => void;
  toggleDarkMode: () => void;

  setStreaming: (streaming: boolean) => void;
  appendStreamContent: (content: string) => void;
  resetStreamContent: () => void;

  // 设置
  updateSettings: (settings: Partial<AISettings>) => void;
  openSettings: () => void;
  closeSettings: () => void;

  // 初始化
  initFromStorage: () => void;
}

const STORAGE_KEY = 'ai-chat-conversations';
const ACTIVE_KEY = 'ai-chat-active-id';
const DARK_KEY = 'ai-chat-dark-mode';
const SETTINGS_KEY = 'ai-chat-settings';

const defaultSettings: AISettings = {
  provider: 'dashscope',
  apiKey: '',
  model: 'qwen-plus',
};

function loadFromStorage(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage(conversations: Conversation[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    console.warn('Failed to save conversations to localStorage');
  }
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  sidebarOpen: true,
  darkMode: false,
  settings: defaultSettings,
  settingsOpen: false,
  isStreaming: false,
  streamingContent: '',

  createConversation: () => {
    const id = uuidv4();
    const now = Date.now();
    const conversation: Conversation = {
      id,
      title: '新对话',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    set((state) => {
      const updated = [conversation, ...state.conversations];
      saveToStorage(updated);
      return { conversations: updated, activeConversationId: id };
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_KEY, id);
    }
    return id;
  },

  deleteConversation: (id) => {
    set((state) => {
      const updated = state.conversations.filter((c) => c.id !== id);
      saveToStorage(updated);
      const newActiveId = state.activeConversationId === id
        ? (updated[0]?.id || null)
        : state.activeConversationId;
      if (typeof window !== 'undefined') {
        if (newActiveId) {
          localStorage.setItem(ACTIVE_KEY, newActiveId);
        } else {
          localStorage.removeItem(ACTIVE_KEY);
        }
      }
      return {
        conversations: updated,
        activeConversationId: newActiveId,
      };
    });
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    if (typeof window !== 'undefined') {
      if (id) {
        localStorage.setItem(ACTIVE_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_KEY);
      }
    }
  },

  updateConversationTitle: (id, title) => {
    set((state) => {
      const updated = state.conversations.map((c) =>
        c.id === id ? { ...c, title, updatedAt: Date.now() } : c
      );
      saveToStorage(updated);
      return { conversations: updated };
    });
  },

  addMessage: (conversationId, message) => {
    set((state) => {
      const updated = state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const messages = [...c.messages, message];
        // 用第一条用户消息自动命名对话
        const title =
          c.messages.length === 0 && message.role === 'user'
            ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
            : c.title;
        return { ...c, messages, title, updatedAt: Date.now() };
      });
      saveToStorage(updated);
      return { conversations: updated };
    });
  },

  updateLastAssistantMessage: (conversationId, content) => {
    set((state) => {
      const updated = state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const messages = [...c.messages];
        const lastIdx = messages.length - 1;
        if (lastIdx >= 0 && messages[lastIdx].role === 'assistant') {
          messages[lastIdx] = { ...messages[lastIdx], content };
        }
        return { ...c, messages, updatedAt: Date.now() };
      });
      saveToStorage(updated);
      return { conversations: updated };
    });
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDarkMode: () => {
    set((state) => {
      const newDark = !state.darkMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem(DARK_KEY, String(newDark));
        document.documentElement.classList.toggle('dark', newDark);
      }
      return { darkMode: newDark };
    });
  },

  setStreaming: (streaming) => set({ isStreaming: streaming }),
  appendStreamContent: (content) =>
    set((state) => ({ streamingContent: state.streamingContent + content })),
  resetStreamContent: () => set({ streamingContent: '' }),

  updateSettings: (partial) => {
    set((state) => {
      const updated = { ...state.settings, ...partial };
      if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      }
      return { settings: updated };
    });
  },
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),

  initFromStorage: () => {
    const conversations = loadFromStorage();
    const activeId =
      typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_KEY) : null;
    const darkMode =
      typeof window !== 'undefined'
        ? localStorage.getItem(DARK_KEY) === 'true'
        : false;

    // 加载 AI 设置
    let settings = defaultSettings;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
          settings = { ...defaultSettings, ...JSON.parse(saved) };
        }
      } catch {
        // 使用默认设置
      }
    }

    if (darkMode && typeof window !== 'undefined') {
      document.documentElement.classList.add('dark');
    }

    set({
      conversations,
      activeConversationId: activeId && conversations.some((c) => c.id === activeId)
        ? activeId
        : null,
      darkMode,
      settings,
      // 首次访问没有 API Key 时自动弹出设置
      settingsOpen: !settings.apiKey,
    });
  },
}));
