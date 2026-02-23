# Celebrate Festival - Agent 开发指南

## 项目概述

全栈 Web 应用，用于管理个人节日、生日、纪念日，提供倒计时提醒功能。

### 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS 4 + React Router DOM 7 |
| 后端 | Express 5 + TypeScript + Prisma + SQLite |

---

## 常用命令

### 前端 (client)

```bash
cd client
npm run dev              # 开发服务器 (http://localhost:5173)
npm run build            # 编译 + 构建生产版本
npm run preview          # 预览生产版本
npm run lint             # ESLint 检查
npm run lint -- --fix   # 自动修复 ESLint 问题
npm run test             # 无测试配置
```

### 后端 (server)

```bash
cd server
npm run dev              # 开发服务器 (热重载, 端口 3001)
npm run build            # 编译 TypeScript 到 dist/
npm run start            # 运行生产版本
npx prisma migrate dev   # 创建迁移
npx prisma generate      # 生成 Prisma Client
```

### Docker

```bash
docker compose up -d     # 构建并运行容器
docker compose logs -f   # 查看日志
docker compose down      # 停止容器
```

---

## 代码风格指南

### TypeScript

- 使用严格模式 (`strict: true`)
- 始终使用类型注解，避免 `any`
- 接口命名：`PascalCase`，如 `interface UserProps`
- 导出优先使用命名导出

### 前端组件

- 使用函数组件 + Hooks
- Props 接口命名：`[组件名]Props`，如 `ButtonProps`
- 组件文件：`PascalCase.tsx`

### 导入排序 (ESLint 自动格式化)

```typescript
// 1. React/React Router
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. 第三方库
import axios from 'axios';
import { format } from 'date-fns';

// 3. 项目内部模块
import { Button } from '@/components/common/Button';
import { authApi } from '@/api';

// 4. 类型导入
import type { User, Event } from '@/types';

// 5. 工具函数
import { formatDate, getLunarDate } from '@/utils';
```

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `CountdownCard`, `Header` |
| 文件 | kebab-case | `home-page.tsx`, `auth-context.tsx` |
| 函数 | camelCase | `getUserEvents`, `formatDate` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| CSS 类 | kebab-case | `text-center`, `bg-blue-500` |

### 错误处理

- 前端：使用 `try/catch` + async/await，组件内处理错误状态
- API 请求：统一在 `api/index.ts` 处理 401 跳转登录
- 后端：使用 try/catch 中间件统一错误响应

### Tailwind CSS 4

- 使用 utility-first 样式
- 主题色通过 `ThemeContext` 动态设置
- 响应式：`md:`, `lg:` 前缀
- 深色模式：`dark:` 前缀

---

## 项目结构

```
celebrate-festival/
├── client/                      # 前端 React 应用
│   ├── src/
│   │   ├── components/          # UI 组件 (common, countdown, layout)
│   │   ├── pages/               # 页面组件
│   │   ├── context/             # React Context
│   │   ├── hooks/               # 自定义 Hooks
│   │   ├── api/                 # API 请求封装
│   │   ├── types/               # TypeScript 类型
│   │   └── utils/               # 工具函数
│   └── dist/                    # 构建产物
│
├── server/                      # 后端 Express 应用
│   ├── src/
│   │   ├── controllers/         # 路由处理器
│   │   ├── routes/              # API 路由
│   │   ├── middlewares/         # 中间件
│   │   └── utils/              # 工具
│   ├── prisma/
│   │   ├── schema.prisma       # 数据库 Schema
│   │   └── dev.db              # SQLite 数据库
│   └── dist/                   # 编译产物
│
└── docker-compose.yml           # Docker 配置
```

---

## API 端点

### 认证 (`/api/auth`)

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /register | 注册用户 |
| POST | /login | 用户登录 |
| GET | /me | 获取当前用户 |
| PUT | /profile | 更新资料 |

### 事件 (`/api/events`)

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | / | 获取用户事件 |
| GET | /:id | 获取单个事件 |
| POST | / | 创建事件 |
| PUT | /:id | 更新事件 |
| DELETE | /:id | 删除事件 |

### 分享 (`/api/share`)

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | / | 创建分享链接 |
| GET | /:token | 获取分享事件 |

### 管理 (`/api/admin`) - 需管理员权限

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /users | 获取所有用户 |
| PUT | /users/:id/role | 更新用户角色 |
| DELETE | /users/:id | 删除用户 |
| GET | /events | 获取所有事件 |
| DELETE | /events/:id | 删除事件 |

---

## 开发约定

1. **数据库**：修改 schema 后运行 `npx prisma generate`
2. **认证**：JWT 存储在 localStorage，API 请求自动添加 Bearer Token
3. **管理员**：首次启动服务器自动创建 admin/123456
4. **主题**：前端支持主题色切换，通过 ThemeContext 管理
