# AI Chat - 智能对话助手

一个基于 Next.js 构建的现代化 AI 对话应用，支持接入多种国内大模型（通义千问、智谱 GLM、DeepSeek、Moonshot 等）。

## ✨ 功能特性

- 🤖 **多模型支持** — 通义千问、智谱 GLM、DeepSeek、Moonshot（Kimi），一键切换
- 💬 **流式响应** — 实时打字效果，逐字输出 AI 回复
- 📝 **Markdown 渲染** — 支持代码高亮、表格、列表等富文本展示
- 💾 **会话管理** — 多会话并行、历史对话持久化存储
- 🌓 **暗色模式** — 一键切换浅色/深色主题
- 📱 **响应式布局** — 完美适配桌面端和移动端
- 🔒 **安全防护** — API 速率限制，防止滥用
- 🚀 **一键部署** — 支持 Vercel、Docker 等多种部署方式

## 🚀 快速开始

### 1. 安装依赖

```bash
cd ai-chat
npm install
```

### 2. 配置环境变量

复制环境变量模板文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 AI 模型 API Key：

```env
# 选择默认使用的模型提供商：dashscope / zhipu / deepseek / moonshot
AI_PROVIDER=dashscope

# 通义千问 (推荐，获取地址：https://dashscope.console.aliyun.com/)
DASHSCOPE_API_KEY=your_api_key_here
DASHSCOPE_MODEL=qwen-plus
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📦 部署方式

### 方式一：Vercel 部署（推荐）

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在 Vercel 的 Settings → Environment Variables 中配置 API Key
4. 点击 Deploy，等待部署完成

### 方式二：Docker 部署

```bash
# 构建镜像
docker build -t ai-chat .

# 运行容器
docker run -p 3000:3000 \
  -e AI_PROVIDER=dashscope \
  -e DASHSCOPE_API_KEY=your_key \
  ai-chat
```

### 方式三：自建服务器部署

```bash
npm run build
npm start
```

建议使用 PM2 或 systemd 管理进程：

```bash
# 使用 PM2
npm install -g pm2
pm2 start npm --name "ai-chat" -- start

# 使用 systemd (创建 /etc/systemd/system/ai-chat.service)
```

## 🛠 技术架构

```
┌─────────────────────────────────────────────┐
│              Next.js 14 App Router           │
├──────────────┬──────────────────────────────┤
│   Frontend   │          Backend              │
│              │                              │
│  React 18    │  /api/chat (Edge Runtime)    │
│  Tailwind CSS│  /api/conversations          │
│  Zustand     │  Middleware (Rate Limit)     │
│  Markdown    │  AI Provider Adapter         │
├──────────────┴──────────────────────────────┤
│         AI Provider Layer                    │
│  ┌────────┬────────┬──────────┬─────────┐   │
│  │ 通义   │ 智谱   │ DeepSeek │Moonshot │   │
│  │ 千问   │ GLM    │          │ (Kimi)  │   │
│  └────────┴────────┴──────────┴─────────┘   │
└─────────────────────────────────────────────┘
```

## 📁 项目结构

```
ai-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts        # AI 对话 API（流式）
│   │   │   └── conversations/route.ts # 会话管理 API
│   │   ├── layout.tsx               # 根布局
│   │   ├── page.tsx                 # 主页
│   │   └── globals.css              # 全局样式
│   ├── components/
│   │   ├── chat/
│   │   │   ├── chat-area.tsx        # 聊天主区域
│   │   │   ├── chat-input.tsx       # 输入框组件
│   │   │   ├── message-list.tsx     # 消息列表
│   │   │   └── message-item.tsx     # 单条消息（含 Markdown）
│   │   └── layout/
│   │       └── sidebar.tsx          # 侧边栏（会话管理）
│   ├── lib/
│   │   ├── ai-provider.ts          # AI 模型适配层
│   │   ├── store.ts                # 状态管理（Zustand）
│   │   └── utils.ts                # 工具函数
│   ├── types/
│   │   └── index.ts                # TypeScript 类型定义
│   └── middleware.ts               # 安全中间件
├── .env.local.example              # 环境变量模板
├── Dockerfile                      # Docker 构建文件
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 支持的 AI 模型

| 提供商 | 环境变量 | 可用模型 |
|--------|---------|----------|
| 通义千问 | `DASHSCOPE_API_KEY` | qwen-turbo, qwen-plus, qwen-max, qwen-long |
| 智谱 AI | `ZHIPU_API_KEY` | glm-4-flash, glm-4, glm-4-plus, glm-4-long |
| DeepSeek | `DEEPSEEK_API_KEY` | deepseek-chat, deepseek-reasoner |
| Moonshot | `MOONSHOT_API_KEY` | moonshot-v1-8k, moonshot-v1-32k, moonshot-v1-128k |

## 📄 License

MIT
