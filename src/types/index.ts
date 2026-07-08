export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoningContent?: string;
  createdAt: number;
  model?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model?: string;
}

export interface AISettings {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface ProviderInfo {
  name: string;
  displayName: string;
  models: string[];
  defaultModel: string;
  baseUrl: string;
  keyUrl: string;
}

export interface ChatRequest {
  messages: Message[];
  provider?: string;
  model?: string;
  apiKey?: string;
}

export interface StreamChunk {
  type: 'text' | 'thinking' | 'done' | 'error';
  content?: string;
  error?: string;
}
