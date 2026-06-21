# MathViz

MathViz 是一个面向数学主题的交互式可视化实验平台，结合前端动画、参数调节、公式展示与旁白资源，用于帮助用户直观理解抽象数学概念。

## 快速开始

### 1. 安装依赖

在仓库根目录执行：

```bash
npm run install:all
```

### 2. 启动开发环境

```bash
npm run dev
```

该命令会同时启动：

- 前端开发服务器：`http://localhost:5173`
- 后端 API 服务：`http://localhost:3001`

### 3. 单独启动前后端

```bash
npm run dev:client
npm run dev:server
```

## 实验内容开发

前端实验主要位于 `client/src/experiments`。每个子目录通常对应一个数学主题，例如：

- `bayes`
- `calculus`
- `fourier-series`
- `linear-algebra`
- `pde`
- `random-walk`

新增实验时，通常需要同步关注以下位置：

- `client/src/experiments`：实验实现
- `client/src/narrations`：旁白与讲解数据
- `client/public/audio/narrations`：音频资源

如果实验内容依赖课件或旁白资源，建议在提交前执行：

```bash
cd client
npm run check-courses
```