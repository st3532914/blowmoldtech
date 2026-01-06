# BlowMoldTech 大型吹塑设备交易平台

BlowMoldTech 是一个专业的大型吹塑设备交易平台，致力于连接设备买家和卖家，提供高质量的设备交易服务。

## 技术栈

- **前端框架**: React 18+
- **编程语言**: TypeScript
- **路由管理**: React Router
- **状态管理**: React Context API
- **UI 组件库**: Tailwind CSS
- **动画库**: Framer Motion
- **图表库**: Recharts
- **表单验证**: Zod
- **通知组件**: Sonner
- **构建工具**: Vite

## 功能亮点

- 🎯 专业的设备分类和搜索系统
- 📱 响应式设计，支持多端访问
- 🔐 用户认证和授权系统
- 🛒 完整的购物车和结账流程
- 💬 实时聊天系统，方便买卖双方沟通
- 📦 物流追踪功能
- 🌙 支持明暗主题切换
- 📊 数据可视化展示
- 🔍 设备详情和专业验机报告

## 快速开始

### 前置要求

- Node.js 16+
- pnpm (推荐) 或 npm/yarn

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

项目将在 http://localhost:3000 启动

### 构建生产版本

```bash
pnpm build
```

构建后的文件将生成在 `dist` 目录

## 部署指南

### 网站部署详细教程

#### 1. Vercel 部署

1. 访问 [Vercel](https://vercel.com/) 并登录
2. 点击 "New Project" 按钮
3. 选择要部署的 Git 仓库
4. 配置项目设置：
   - Framework Preset: React
   - Build Command: `pnpm build`
   - Output Directory: `dist/static`
5. 点击 "Deploy" 按钮
6. 等待部署完成，Vercel 将提供一个公共 URL

#### 2. Netlify 部署

1. 访问 [Netlify](https://www.netlify.com/) 并登录
2. 点击 "Add new site" -> "Import an existing project"
3. 选择要部署的 Git 仓库
4. 配置构建设置：
   - Build Command: `pnpm build`
   - Publish Directory: `dist/static`
5. 点击 "Deploy site"
6. 等待部署完成，Netlify 将提供一个公共 URL

#### 3. GitHub Pages 部署

1. 确保项目根目录有 `gh-pages` 分支
2. 安装 `gh-pages` 依赖：
   ```bash
   pnpm add -D gh-pages
   ```
3. 在 `package.json` 中添加脚本：
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist/static"
   }
   ```
4. 构建项目：`pnpm build`
5. 部署到 GitHub Pages：`pnpm deploy`
6. 在 GitHub 仓库的 Settings -> Pages 中确认部署状态

### 多端部署详细教程

#### H5 部署

1. 确保响应式设计适配移动设备
2. 在 `index.html` 中添加移动端视口设置：
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
   ```
3. 按照网站部署步骤进行部署
4. 测试在各种移动设备上的显示效果

#### App 部署

项目目前是一个 Web 应用，如果需要转换为移动应用，可以考虑以下方案：

##### 使用 Capacitor 转换为原生应用

1. 安装 Capacitor：
   ```bash
   pnpm add @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
   ```
2. 初始化 Capacitor：
   ```bash
   npx cap init BlowMoldTech com.yourcompany.blowmoldtech
   ```
3. 构建项目：`pnpm build`
4. 添加平台：
   ```bash
   npx cap add android
   npx cap add ios
   ```
5. 同步项目到各平台：
   ```bash
   npx cap sync
   ```
6. 打开 IDE 进行原生开发：
   ```bash
   npx cap open android  # 打开 Android Studio
   npx cap open ios      # 打开 Xcode
   ```
7. 在 IDE 中完成应用配置并构建发布版本

##### 使用 Taro 或 uni-app 重写

如果需要更深入的跨平台支持，可以考虑使用 Taro 或 uni-app 框架重写项目，这样可以更好地支持小程序和原生应用。

## 开发注意事项

1. 代码风格遵循 TypeScript 和 React 最佳实践
2. 组件设计遵循单一职责原则
3. 页面组件放在 `src/pages` 目录下
4. 通用组件放在 `src/components` 目录下
5. 共享状态通过 Context API 管理
6. 使用 Tailwind CSS 进行样式设计，避免内联样式
7. 对于复杂动画，使用 Framer Motion
8. 使用 Recharts 进行数据可视化
9. 使用 Zod 进行表单验证

## 常见问题解决

### 部署相关问题

1. **构建失败**：检查依赖是否安装完整，尝试删除 `node_modules` 和 `pnpm-lock.yaml` 文件后重新安装
2. **路由问题**：在 SPA 应用中部署到子路径时，需要配置路由的 basePath
3. **静态资源加载失败**：确保 `vite.config.ts` 中的静态资源路径配置正确
4. **权限问题**：确保部署平台有足够的权限访问代码仓库

### 开发相关问题

1. **类型错误**：检查 TypeScript 类型定义是否正确
2. **状态管理问题**：使用 React DevTools 检查 Context 状态
3. **性能问题**：使用 React.memo 和适当的状态分离优化组件渲染

## 许可证

MIT