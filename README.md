# SparkAI - 智能对话助手

一个基于 Next.js 14 构建的现代化 AI 对话应用，支持接入多种国内大模型（通义千问、智谱 GLM、DeepSeek、Moonshot 等）。

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchenjiachen040906-lang%2Fsparkai)

> 部署后在网页设置中填入你的 API Key 即可使用，无需配置环境变量。

## 功能特性

- **多模型支持** — 通义千问、智谱 GLM、DeepSeek v4、Moonshot（Kimi），一键切换
- **深度思考** — 支持 DeepSeek v4 thinking mode，可折叠展示思考过程
- **流式响应** — 实时打字效果，逐字输出 AI 回复
- **Markdown 渲染** — 支持代码高亮、表格、列表等富文本展示
- **Web 端配置** — 在网页设置面板直接填入 API Key，支持连接测试
- **会话管理** — 多会话并行、历史对话持久化存储
- **暗色模式** — 一键切换浅色/深色主题
- **响应式布局** — 完美适配桌面端和移动端
- **安全防护** — API 速率限制，防止滥用

## 快速开始

### 1. 安装依赖

```bash
git clone https://github.com/chenjiachen040906-lang/sparkai.git
cd sparkai
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)，点击左下角设置按钮，选择模型提供商并填入 API Key。

### 3. 获取 API Key

| 提供商 | 申请地址 | 推荐模型 |
|--------|---------|----------|
| 通义千问 | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com/apiKey) | qwen-plus |
| 智谱 AI | [open.bigmodel.cn](https://open.bigmodel.cn/usercenter/apikeys) | glm-4-flash |
| DeepSeek | [platform.deepseek.com](https://platform.deepseek.com/api_keys) | deepseek-v4-pro |
| Moonshot | [platform.moonshot.cn](https://platform.moonshot.cn/console/api-keys) | moonshot-v1-8k |

## 部署方式

### Vercel 部署（推荐）

1. 点击上方 "Deploy with Vercel" 按钮，或在 [vercel.com/new](https://vercel.com/new) 导入此仓库
2. 无需任何额外配置，直接 Deploy
3. 部署完成后在网页设置中填入 API Key 即可使用

### Docker 部署

```bash
docker build -t sparkai .
docker run -p 3000:3000 sparkai
```

### 自建服务器

```bash
npm run build
npm start
```

建议使用 PM2 管理进程：`pm2 start npm --name "sparkai" -- start`

## 技术架构

- **前端**: React 18 + Tailwind CSS + Zustand
- **框架**: Next.js 14 App Router (Node.js Runtime)
- **语言**: TypeScript
- **AI**: OpenAI 兼容接口，SSE 流式响应
- **部署**: Vercel / Docker / 自建服务器

## 项目结构

```
sparkai/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts       # AI 对话 API（流式 SSE）
│   │   ├── api/diag/route.ts       # 连接诊断 API
│   │   ├── layout.tsx              # 根布局
│   │   ├── page.tsx                # 主页
│   │   └── globals.css             # 全局样式 + 主题变量
│   ├── components/
│   │   ├── chat/
│   │   │   ├── chat-area.tsx       # 聊天主区域 + 流式处理
│   │   │   ├── chat-input.tsx      # 输入框
│   │   │   ├── message-list.tsx    # 消息列表
│   │   │   ├── message-item.tsx    # 消息渲染（含思考过程）
│   │   │   └── settings-modal.tsx  # 设置面板
│   │   └── layout/
│   │       └── sidebar.tsx         # 侧边栏
│   ├── lib/
│   │   ├── ai-provider.ts          # AI 模型适配层
│   │   ├── store.ts                # Zustand 状态管理
│   │   └── utils.ts                # 工具函数
│   ├── types/index.ts              # TypeScript 类型
│   └── middleware.ts               # 速率限制中间件
├── vercel.json                     # Vercel 部署配置
├── Dockerfile                      # Docker 构建文件
└── package.json
```

## License

MIT
