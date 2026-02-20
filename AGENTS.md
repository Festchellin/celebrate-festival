# Celebrate Festival - 节日纪念日管理平台

## 项目概述

这是一个全栈 Web 应用，用于管理个人节日、生日、纪念日和其他重要日期，并提供倒计时提醒功能。

### 主要功能

- **用户认证**：注册、登录、JWT 认证
- **事件管理**：创建、编辑、删除个人事件
- **事件类型**：生日、纪念日、节日、自定义
- **农历支持**：支持农历日期（中国传统）
- **倒计时**：实时显示即将到来事件的倒计时
- **分享链接**：为事件生成分享链接
- **管理员面板**：管理员可管理所有用户和事件
- **响应式设计**：美观的 UI 动画，适配所有设备

### 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS 4 + React Router DOM 7 |
| 后端 | Express 5 + TypeScript + Prisma + SQLite |
| 部署 | Docker & Docker Compose + Caddy |

---

## 开发环境设置

### 前置要求

- Node.js 20+
- Docker & Docker Compose（容器化部署）
- npm 或 yarn

### 本地开发

```bash
# 1. 安装依赖
# 后端依赖
cd server && npm install

# 前端依赖
cd ../client && npm install

# 2. 设置数据库
cd server
npx prisma migrate dev
npx prisma generate

# 3. 启动开发服务器

# 终端 1：启动后端
cd server && npm run dev

# 终端 2：启动前端
cd client && npm run dev

# 4. 访问应用
# 前端：http://localhost:5173
# 后端 API：http://localhost:3001
# 默认管理员账户：admin / 123456
```

### Docker 部署

```bash
# 构建并运行容器
docker compose up -d

# 访问应用
# 前端：http://localhost
# 后端 API：http://localhost:3001

# 查看日志
docker compose logs -f

# 停止容器
docker compose down
```

---

## 常用命令

### 前端 (client)

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run lint` | 代码检查 |
| `npm run preview` | 预览生产版本 |

### 后端 (server)

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（热重载） |
| `npm run build` | 编译 TypeScript |
| `npm run start` | 运行生产版本 |
| `npx prisma studio` | 打开 Prisma 数据库管理界面 |

---

## 项目结构

```
celebrate-festival/
├── client/                      # 前端 React 应用
│   ├── src/
│   │   ├── components/          # 可复用 UI 组件
│   │   │   ├── common/         # 通用组件（Button、Card、Input）
│   │   │   ├── countdown/      # 倒计时组件
│   │   │   └── layout/         # 布局组件
│   │   ├── pages/              # 页面组件
│   │   │   ├── Home/           # 首页
│   │   │   ├── Login/          # 登录页
│   │   │   ├── Register/       # 注册页
│   │   │   ├── AddEvent/       # 添加事件页
│   │   │   ├── Profile/        # 个人资料页
│   │   │   ├── Share/          # 分享页
│   │   │   └── Admin/           # 管理页
│   │   ├── context/            # React Context（认证状态）
│   │   ├── hooks/              # 自定义 Hooks
│   │   ├── api/                # API 请求封装
│   │   ├── types/              # TypeScript 类型定义
│   │   └── utils/              # 工具函数（农历）
│   ├── dist/                   # 构建后的生产文件
│   └── Dockerfile              # 客户端 Docker 镜像
│
├── server/                      # 后端 Express 应用
│   ├── src/
│   │   ├── controllers/       # 路由处理器
│   │   ├── routes/             # API 路由
│   │   ├── middlewares/        # 认证和管理员中间件
│   │   └── utils/              # Prisma 客户端
│   ├── prisma/
│   │   ├── schema.prisma       # 数据库 schema
│   │   └── dev.db             # SQLite 数据库
│   ├── dist/                   # 编译后的 JavaScript
│   └── Dockerfile              # 服务器 Docker 镜像
│
├── docker-compose.yml           # Docker 编排配置
└── README.md                    # 项目文档
```

---

## API 文档

### 认证路由 (`/api/auth`)

| 方法 | 端点 | 描述 | 需要认证 |
|------|------|------|----------|
| POST | /register | 注册新用户 | 否 |
| POST | /login | 用户登录 | 否 |
| GET | /me | 获取当前用户 | 是 |
| PUT | /profile | 更新用户资料 | 是 |

### 事件路由 (`/api/events`)

| 方法 | 端点 | 描述 | 需要认证 |
|------|------|------|----------|
| GET | / | 获取用户所有事件 | 是 |
| GET | /:id | 获取单个事件 | 是 |
| POST | / | 创建新事件 | 是 |
| PUT | /:id | 更新事件 | 是 |
| DELETE | /:id | 删除事件 | 是 |

### 分享路由 (`/api/share`)

| 方法 | 端点 | 描述 | 需要认证 |
|------|------|------|----------|
| POST | / | 创建分享链接 | 是 |
| GET | /:token | 获取分享的事件 | 否 |

### 管理路由 (`/api/admin`)

| 方法 | 端点 | 描述 | 需要认证 |
|------|------|------|----------|
| GET | /users | 获取所有用户 | 是（管理员） |
| PUT | /users/:id/role | 更新用户角色 | 是（管理员） |
| DELETE | /users/:id | 删除用户 | 是（管理员） |
| GET | /events | 获取所有事件 | 是（管理员） |
| DELETE | /events/:id | 删除事件 | 是（管理员） |

---

## 数据库 Schema

### User 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Int | 主键 |
| username | String | 用户名（唯一） |
| password | String | 密码（加密） |
| nickname | String? | 昵称 |
| avatar | String? | 头像 URL |
| bio | String? | 个人简介 |
| role | String | 角色（USER/ADMIN） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### Event 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Int | 主键 |
| userId | Int | 关联用户 |
| title | String | 事件标题 |
| date | DateTime | 事件日期 |
| type | String | 事件类型 |
| description | String? | 描述 |
| isRecurring | Boolean | 是否每年重复 |
| remindDays | Int? | 提前提醒天数 |
| isLunar | Boolean | 是否农历 |
| lunarMonth | Int? | 农历月份 |
| lunarDay | Int? | 农历日期 |

### ShareLink 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Int | 主键 |
| eventId | Int | 关联事件 |
| token | String | 分享令牌（唯一） |
| expiresAt | DateTime | 过期时间 |
| createdAt | DateTime | 创建时间 |

---

## 开发约定

### 代码风格

- **TypeScript**：严格模式，使用类型注解
- **ESLint**：代码规范检查
- **Tailwind CSS 4**：使用 utility-first 样式

### 数据库操作

- 使用 Prisma ORM 进行数据库操作
- 修改 schema 后需要运行 `npx prisma generate`

### API 设计

- RESTful API 设计
- 使用 JWT 进行身份认证
- 管理员路由需要管理员权限中间件

---

## 环境变量

### 后端

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
```

### 前端

前端使用 Vite，连接后端 `/api`（可通过代理或直连）。

---

## 故障排查

### 常见问题

1. **数据库连接失败**：确保 `server/prisma/dev.db` 存在，如不存在运行 `npx prisma migrate dev`
2. **前端无法连接后端**：检查后端是否运行在 3001 端口，检查 API 请求地址
3. **管理员账户无法登录**：确保数据库中已创建 admin 用户，首次启动服务器时会自动创建

### 查看日志

```bash
# Docker 日志
docker compose logs -f

# 本地开发日志
# 后端日志直接显示在终端
# 前端日志直接显示在终端
```
