# BlowMoldTech - 大型吹塑设备专业平台

BlowMoldTech是一个专业的大型吹塑设备交易平台，致力于连接设备买家与卖家，提供安全、高效的设备交易服务。平台不仅提供设备浏览、搜索功能，还包含物流追踪、在线聊天、交易保障等完善的配套服务，让每一台设备都能发挥最大价值。

## 技术栈

- **前端框架**: React 18+
- **开发语言**: TypeScript
- **状态管理**: React Context API
- **路由**: React Router DOM
- **UI组件**: Tailwind CSS
- **动画效果**: Framer Motion
- **数据可视化**: Recharts
- **表单验证**: Zod
- **通知组件**: Sonner
- **构建工具**: Vite
- **包管理器**: pnpm

## 功能亮点

- **设备市场**: 提供丰富的吹塑设备信息，支持多维度筛选和搜索
- **交易保障**: 平台担保交易，提供专业合同和资金监管
- **物流追踪**: 实时追踪设备运输状态，确保安全送达
- **在线沟通**: 买卖双方直接沟通，解答疑问
- **设备检测**: 每台设备经过专业工程师检测，确保质量可靠
- **售后支持**: 提供安装调试、技术培训和维修保养等服务
- **响应式设计**: 适配PC端和移动端，提供流畅的用户体验
- **深色模式**: 支持切换深色/浅色主题，保护视力

## 安装和运行指南

### 前提条件

- Node.js 18+
- pnpm 8+

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/example/blowmoldtech.git
cd blowmoldtech
```

2. **安装依赖**

```bash
pnpm install
```

3. **本地开发**

```bash
pnpm dev
```

项目将在 http://localhost:3000 启动

4. **构建生产版本**

```bash
pnpm build
```

构建后的文件将生成在 `dist` 目录中

## 项目结构

```
├── src/                  # 源代码目录
│   ├── components/       # 可复用组件
│   ├── contexts/         # React Context状态管理
│   ├── hooks/            # 自定义Hooks
│   ├── lib/              # 工具函数
│   ├── pages/            # 页面组件
│   ├── App.tsx           # 应用根组件
│   ├── index.css         # 全局样式
│   └── main.tsx          # 入口文件
├── public/               # 静态资源
├── .gitignore            # Git忽略文件配置
├── package.json          # 项目依赖配置
├── pnpm-lock.yaml        # pnpm依赖锁定文件
├── tsconfig.json         # TypeScript配置
├── vite.config.ts        # Vite配置
├── tailwind.config.js    # Tailwind CSS配置
└── README.md             # 项目说明文档
```

## 核心功能模块

1. **设备市场**: 浏览、搜索和筛选各类吹塑设备
2. **设备详情**: 查看设备的详细信息、图片、规格参数和验机报告
3. **购物车**: 管理待购买的设备
4. **订单管理**: 查看和管理历史订单
5. **消息中心**: 与卖家进行在线沟通
6. **个人中心**: 管理个人信息、发布的设备和收藏
7. **物流追踪**: 实时跟踪设备的运输状态
8. **管理员后台**: 管理平台设备、订单和用户

## 模拟数据

项目使用了模拟数据来展示功能，包括设备信息、用户信息、订单信息和物流信息等。这些数据存储在本地存储(localStorage)中，方便开发和测试。

## 测试账户

### 用户账户
- 用户名: example@blowmoldtech.com
- 密码: password123

### 管理员账户
- 用户名: admin
- 密码: admin123

## 部署指南

### Vercel 部署

1. 登录 [Vercel](https://vercel.com/)
2. 点击 "New Project"
3. 选择您的 Git 仓库
4. 配置项目设置（保持默认即可）
5. 点击 "Deploy" 按钮

### Netlify 部署

1. 登录 [Netlify](https://www.netlify.com/)
2. 点击 "Add new site" -> "Import an existing project"
3. 选择您的 Git 仓库
4. 配置构建命令: `pnpm build`
5. 配置发布目录: `dist`
6. 点击 "Deploy site"

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

如有问题或建议，请联系我们:
- 邮箱: contact@blowmoldtech.com
- 电话: 400-888-8888
- 地址: 上海市浦东新区张江高科技园区