<p id="readme-top" align="center">
  <h1 align="center">✨ SparkAI</h1>

  <p align="center">
    <strong>你的多模型 AI 对话助手，一键部署，即开即用。</strong>
  </p>

  <p align="center">
    <a href="https://github.com/chenjiachen040906-lang/sparkai/stargazers"><img src="https://img.shields.io/github/stars/chenjiachen040906-lang/sparkai?style=social" alt="Stars" /></a>
    <a href="https://github.com/chenjiachen040906-lang/sparkai/blob/main/LICENSE"><img src="https://img.shields.io/github/license/chenjiachen040906-lang/sparkai?style=flat-square" alt="License" /></a>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js 14" />
    <img src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  </p>

  <p align="center">
    <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchenjiachen040906-lang%2Fsparkai">
      <img src="https://vercel.com/button" alt="Deploy with Vercel" />
    </a>
  </p>
</p>

---

## 界面预览

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/chenjiachen040906-lang/sparkai/raw/main/docs/screenshot-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/chenjiachen040906-lang/sparkai/raw/main/docs/screenshot-light.png">
  <img src="https://github.com/chenjiachen040906-lang/sparkai/raw/main/docs/screenshot-light.png" alt="SparkAI Interface" width="100%">
</picture>

<p align="center"><em>浅色 & 深色主题 · DeepSeek v4 思考过程可视化 · Web 端 API Key 配置</em></p>

<details>
<summary>📸 更多截图</summary>

<br>

**💬 深色模式 & 思考过程**

![Dark Mode](https://github.com/chenjiachen040906-lang/sparkai/raw/main/docs/screenshot-dark.png)

**⚙️ 设置面板**

<p align="center">
  <img src="https://github.com/chenjiachen040906-lang/sparkai/raw/main/docs/screenshot-settings.png" alt="Settings" width="520">
</p>

</details>

<div align="right">[ <a href="#readme-top">↑ 返回顶部</a> ]</div>

---

## ✨ 功能特性

- 🤖 **多模型一站式接入** — 通义千问（Qwen）、智谱 GLM、DeepSeek v4、Moonshot (Kimi)，在设置面板中一键切换，无需修改代码或配置文件。

- 🧠 **深度思考可视化** — DeepSeek v4 等模型的 Thinking Mode 内容以可折叠的"💭 思考过程"区块展示，让你看到 AI 完整的推理链路。

- 💬 **流式打字体验** — 基于 SSE（Server-Sent Events）实时流式输出，逐字呈现 AI 回复，告别漫长等待。

- 🔑 **零配置上手** — API Key 直接在网页设置面板中填入，内置「测试连接」一键验证，无需配置环境变量。

- 📝 **Markdown 富文本** — 完整支持 Markdown 渲染，包括代码高亮、表格、列表、链接等，阅读体验一流。

- 🌓 **深色 / 浅色主题** — 一键切换，自动记忆偏好，适配你的使用习惯。

- 💾 **多会话管理** — 侧边栏管理多个对话，历史消息自动持久化到 localStorage，刷新不丢失。

- 📱 **响应式布局** — 桌面端和移动端完美适配，随时随地畅聊。

- 🔒 **安全防护** — 内置 API 速率限制中间件，防止滥用。

<div align="right">[ <a href="#readme-top">↑ 返回顶部</a> ]</div>

---

## 🚀 快速开始

### 一键部署（推荐）

| 平台 | 一键部署 | 备注 |
|------|---------|------|
| **Vercel** | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchenjiachen040906-lang%2Fsparkai) | 免费额度，无需服务器 |
| **Zeabur** | [![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/sparkai) | 亚洲节点，延迟更低 |

> [!TIP]
> 部署完成后打开网页，点击左下角 ⚙️ 设置按钮，选择模型提供商并填入 API Key 即可使用，**无需任何环境变量**。

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/chenjiachen040906-lang/sparkai.git
cd sparkai

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

### Docker 部署

```bash
# 构建镜像
docker build -t sparkai .

# 运行容器
docker run -d -p 3000:3000 --name sparkai sparkai
```

### 自建服务器

```bash
npm install
npm run build
npm start
```

> [!NOTE]
> 生产环境建议使用 PM2 或 systemd 管理进程：`pm2 start npm --name "sparkai" -- start`

<div align="right">[ <a href="#readme-top">↑ 返回顶部</a> ]</div>

---

## 🔑 获取 API Key

在网页设置面板中选择你想使用的模型提供商，前往对应平台申请 API Key：

| 提供商 | 申请地址 | 推荐模型 | 说明 |
|--------|---------|----------|------|
| 通义千问 | [阿里云百炼](https://dashscope.console.aliyun.com/apiKey) | `qwen-plus` | 新用户有免费额度 |
| 智谱 AI | [开放平台](https://open.bigmodel.cn/usercenter/apikeys) | `glm-4-flash` | Flash 模型免费 |
| DeepSeek | [开放平台](https://platform.deepseek.com/api_keys) | `deepseek-v4-pro` | 支持深度思考模式 |
| Moonshot | [开放平台](https://platform.moonshot.cn/console/api-keys) | `moonshot-v1-8k` | 支持超长上下文 |

<div align="right">[ <a href="#readme-top">↑ 返回顶部</a> ]</div>

---

## 🛠 技术架构

```
┌───────────────────────────────────────────────────┐
│                 Next.js 14 App Router              │
├─────────────────┬─────────────────────────────────┤
│    Frontend     │           Backend               │
│                 │                                 │
│  React 18       │  /api/chat    (SSE 流式)        │
│  Tailwind CSS   │  /api/diag    (连接诊断)        │
│  Zustand        │  /api/conversations             │
│  ReactMarkdown  │  Middleware   (速率限制)        │
│  SSE Parser     │  AI Provider  (多模型适配)      │
├─────────────────┴─────────────────────────────────┤
│                 AI Provider Layer                  │
│   ┌──────────┬──────────┬───────────┬─────────┐   │
│   │ 通义千问 │ 智谱 GLM │ DeepSeek  │Moonshot │   │
│   │  (Qwen)  │          │  v4 Pro   │ (Kimi)  │   │
│   └──────────┴──────────┴───────────┴─────────┘   │
│            OpenAI-Compatible API Format            │
└───────────────────────────────────────────────────┘
```

**核心依赖：** Next.js 14 · React 18 · TypeScript 5 · Tailwind CSS · Zustand · ReactMarkdown · remark-gfm

<div align="right">[ <a href="#readme-top">↑ 返回顶部</a> ]</div>

---

## 📁 项目结构

```
sparkai/
├── docs/                              # 文档截图
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts          # AI 对话 API（SSE 流式）
│   │   │   ├── diag/route.ts          # 连接诊断 API
│   │   │   └── conversations/route.ts # 会话管理 API
│   │   ├── layout.tsx                 # 根布局
│   │   ├── page.tsx                   # 主页
│   │   ├── error.tsx                  # 错误边界
│   │   └── globals.css                # 全局样式 + 主题变量
│   ├── components/
│   │   ├── chat/
│   │   │   ├── chat-area.tsx          # 聊天主区域 + 流式处理
│   │   │   ├── chat-input.tsx         # 输入框
│   │   │   ├── message-list.tsx       # 消息列表
│   │   │   ├── message-item.tsx       # 消息渲染（含思考过程）
│   │   │   └── settings-modal.tsx     # 设置面板
│   │   └── layout/
│   │       └── sidebar.tsx            # 侧边栏
│   ├── lib/
│   │   ├── ai-provider.ts             # AI 模型适配层
│   │   ├── store.ts                   # Zustand 状态管理
│   │   └── utils.ts                   # 工具函数
│   ├── types/index.ts                 # TypeScript 类型
│   └── middleware.ts                  # 速率限制中间件
├── vercel.json                        # Vercel 部署配置
├── Dockerfile                         # Docker 构建文件
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

<div align="right">[ <a href="#readme-top">↑ 返回顶部</a> ]</div>

---

## 📄 License

[MIT](./LICENSE) — 随便用，欢迎 Fork 和 Star ✨

<div align="right">[ <a href="#readme-top">↑ 返回顶部</a> ]</div>
