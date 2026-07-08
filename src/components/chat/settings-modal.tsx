'use client';

import { useState, useEffect, useCallback } from 'react';
import { useChatStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { ProviderInfo } from '@/types';

export function SettingsModal() {
  const { settings, settingsOpen, closeSettings, updateSettings } = useChatStore();

  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [provider, setProvider] = useState(settings.provider);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState('');

  // 加载提供商列表
  useEffect(() => {
    fetch('/api/chat')
      .then((res) => res.json())
      .then((data) => {
        if (data.providers && data.providers.length > 0) {
          setProviders(data.providers);
        }
      })
      .catch(() => {
        // 使用硬编码的 fallback
        setProviders([
          { name: 'dashscope', displayName: '通义千问', models: ['qwen-turbo', 'qwen-plus', 'qwen-max'], defaultModel: 'qwen-plus', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', keyUrl: 'https://dashscope.console.aliyun.com/apiKey' },
          { name: 'zhipu', displayName: '智谱 AI', models: ['glm-4-flash', 'glm-4', 'glm-4-plus'], defaultModel: 'glm-4-flash', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', keyUrl: 'https://open.bigmodel.cn/usercenter/apikeys' },
          { name: 'deepseek', displayName: 'DeepSeek', models: ['deepseek-v4-flash', 'deepseek-v4-pro', 'deepseek-chat', 'deepseek-reasoner'], defaultModel: 'deepseek-v4-flash', baseUrl: 'https://api.deepseek.com', keyUrl: 'https://platform.deepseek.com/api_keys' },
          { name: 'moonshot', displayName: 'Moonshot (Kimi)', models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'], defaultModel: 'moonshot-v1-8k', baseUrl: 'https://api.moonshot.cn/v1', keyUrl: 'https://platform.moonshot.cn/console/api-keys' },
        ]);
      });
  }, []);

  // 弹窗打开时同步最新设置
  useEffect(() => {
    if (settingsOpen) {
      setProvider(settings.provider);
      setApiKey(settings.apiKey);
      setModel(settings.model);
      setSaved(false);
      setTestStatus('idle');
      setTestResult('');
    }
  }, [settingsOpen, settings]);

  const currentProvider = providers.find((p) => p.name === provider);

  const handleProviderChange = useCallback(
    (name: string) => {
      setProvider(name);
      setTestStatus('idle');
      const p = providers.find((pr) => pr.name === name);
      if (p) {
        setModel(p.defaultModel);
      }
    },
    [providers]
  );

  const handleTest = useCallback(async () => {
    if (!apiKey.trim()) {
      setTestStatus('error');
      setTestResult('请先填写 API Key');
      return;
    }
    setTestStatus('testing');
    setTestResult('');
    try {
      const res = await fetch('/api/diag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, model, apiKey }),
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus('success');
        setTestResult(data.message);
      } else {
        setTestStatus('error');
        setTestResult(data.error);
      }
    } catch (err) {
      setTestStatus('error');
      setTestResult(`请求诊断接口失败: ${(err as Error).message}`);
    }
  }, [provider, model, apiKey]);

  const handleSave = useCallback(() => {
    updateSettings({ provider, apiKey, model });
    setSaved(true);
    setTimeout(() => {
      closeSettings();
      setSaved(false);
    }, 800);
  }, [provider, apiKey, model, updateSettings, closeSettings]);

  if (!settingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={closeSettings}
      />

      {/* 弹窗 */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 shadow-2xl animate-slide-up">
        {/* 标题栏 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            AI 模型设置
          </h2>
          <button
            onClick={closeSettings}
            className="rounded-lg p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 提供商选择 */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
            模型提供商
          </label>
          <div className="grid grid-cols-2 gap-2">
            {providers.map((p) => (
              <button
                key={p.name}
                onClick={() => handleProviderChange(p.name)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                  provider === p.name
                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)]'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-color)]/50 hover:text-[var(--text-primary)]'
                )}
              >
                {p.displayName}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="请输入你的 API Key"
            className={cn(
              'w-full rounded-lg border border-[var(--border-color)] px-3 py-2.5 text-sm',
              'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
              'placeholder-[var(--text-secondary)]',
              'focus:border-[var(--accent-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]/30'
            )}
          />
          {currentProvider?.keyUrl && (
            <a
              href={currentProvider.keyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-block text-xs text-[var(--accent-color)] hover:underline"
            >
              前往获取 API Key →
            </a>
          )}
        </div>

        {/* 模型选择 */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
            模型
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={cn(
              'w-full rounded-lg border border-[var(--border-color)] px-3 py-2.5 text-sm',
              'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
              'focus:border-[var(--accent-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]/30'
            )}
          >
            {currentProvider?.models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* 测试连接 */}
        <div className="mb-4">
          <button
            onClick={handleTest}
            disabled={testStatus === 'testing'}
            className={cn(
              'w-full rounded-lg border px-4 py-2 text-sm font-medium transition-all',
              testStatus === 'testing'
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            )}
          >
            {testStatus === 'testing' ? '测试中...' : '测试连接'}
          </button>
          {testResult && (
            <div
              className={cn(
                'mt-2 rounded-lg px-3 py-2 text-xs',
                testStatus === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              )}
            >
              {testResult}
            </div>
          )}
        </div>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          className={cn(
            'w-full rounded-lg py-2.5 text-sm font-medium text-white transition-all',
            saved
              ? 'bg-green-500'
              : 'bg-[var(--accent-color)] hover:bg-[var(--accent-hover)]'
          )}
        >
          {saved ? '已保存 ✓' : '保存设置'}
        </button>

        <p className="mt-3 text-center text-xs text-[var(--text-secondary)]">
          API Key 仅保存在浏览器本地，不会上传到任何第三方服务器
        </p>
      </div>
    </div>
  );
}
