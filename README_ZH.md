# Celebrate Festival - 节日纪念日管理平台

一个用于管理个人节日、生日、纪念日和其他重要日期的全栈Web应用，支持倒计时提醒功能。

## 功能特性

- **用户认证**：注册、登录、基于JWT的身份验证
- **事件管理**：创建、编辑、删除个人事件
- **事件类型**：生日、纪念日、节日、自定义
- **农历支持**：支持农历日期（中国传统）
- **倒计时**：实时显示即将到来事件的倒计时
- **分享链接**：生成可分享的事件链接
- **管理面板**：管理员可以管理所有用户和事件
- **响应式设计**：精美的动画UI，适配各种设备

## 技术栈

### 前端
- React 19 + TypeScript
- Vite（构建工具）
- Tailwind CSS 4（样式）
- React Router DOM 7（路由）
- Axios（HTTP客户端）
- lunar-javascript（农历日历）

### 后端
- Express 5 + TypeScript
- Prisma（ORM）
- SQLite（数据库）
- JWT（身份验证）
- bcryptjs（密码加密）

### 部署
- Docker & Docker Compose
- Caddy（反向代理/静态文件服务）

## 项目结构

```
celebrate-festival/
├── client/                 # 前端 React 应用
│   ├── src/
│   │   ├── components/     # 可复用 UI 组件
│   │   ├── pages/         # 页面组件
│   │   ├── context/       # React 上下文（认证状态）
│   │   ├── index.css      # 全局样式和动画
│   │   └── main.tsx       # 入口文件
│   ├── dist/              # 构建后的生产文件
│   ├── Dockerfile         # 客户端 Docker 镜像
│   └── Caddyfile          # Caddy 配置
│
├── server/                 # 后端 Express 应用
│   ├── src/
│   │   ├── controllers/   # 路由处理函数
│   │   ├── routes/        # API 路由
│   │   ├── middlewares/   # 认证和管理中间件
│   │   └── utils/         # Prisma 客户端
│   ├── prisma/
│   │   ├── schema.prisma  # 数据库模型
│   │   └── dev.db        # SQLite 数据库
│   ├── dist/              # 编译后的 JavaScript
│   └── Dockerfile         # 服务端 Docker 镜像
│
├── docker-compose.yml      # Docker 编排配置
└── README.md               # 英文说明文档
```

## 快速开始

### 前置条件

- Node.js 20+
- Docker & Docker Compose（容器化部署）
- npm 或 yarn

### 本地开发

1. **安装依赖**

```bash
# 安装服务端依赖
cd server && npm install

# 安装客户端依赖
cd ../client && npm install
```

2. **初始化数据库**

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

3. **启动开发服务器**

```bash
# 终端 1：启动后端
cd server && npm run dev

# 终端 2：启动前端
cd client && npm run dev
```

4. **访问应用**

- 前端：http://localhost:5173
- 后端 API：http://localhost:3001
- 默认管理员账户：`admin` / `123456`

### Docker 部署

1. **构建并运行容器**

```bash
docker compose up -d
```

2. **访问应用**

- 前端：http://localhost
- 后端 API：http://localhost:3001

3. **查看日志**

```bash
docker compose logs -f
```

4. **停止容器**

```bash
docker compose down
```

## API 文档

### 认证接口 (`/api/auth`)

| 方法 | 端点 | 描述 | 需要认证 |
|------|------|------|----------|
| POST | /register | 注册新用户 | 否 |
| POST | /login | 用户登录 | 否 |
| GET | /me | 获取当前用户 | 是 |
| PUT | /profile | 更新用户资料 | 是 |

### 事件接口 (`/api/events`)

| 方法 | 端点 | 描述 | 需要认证 |
|------|------|------|----------|
| GET | / | 获取用户所有事件 | 是 |
| GET | /:id | 获取单个事件 | 是 |
| POST | / | 创建新事件 | 是 |
| PUT | /:id | 更新事件 | 是 |
| DELETE | /:id | 删除事件 | 是 |

### 分享接口 (`/api/share`)

| 方法 | 端点 | 描述 | 需要认证 |
|------|------|------|----------|
| POST | / | 创建分享链接 | 是 |
| GET | /:token | 获取分享的事件 | 否 |

### 管理接口 (`/api/admin`)

| 方法 | 端点 | 描述 | 需要认证 |
|------|------|------|----------|
| GET | /users | 获取所有用户 | 是（管理员）|
| PUT | /users/:id/role | 更新用户角色 | 是（管理员）|
| DELETE | /users/:id | 删除用户 | 是（管理员）|
| GET | /events | 获取所有事件 | 是（管理员）|
| DELETE | /events/:id | 删除事件 | 是（管理员）|

## 事件数据结构

```typescript
{
  id: number;
  userId: number;
  title: string;
  date: Date;              // 事件日期
  type: 'birthday' | 'anniversary' | 'festival' | 'custom';
  description?: string;
  isRecurring: boolean;    // 每年重复
  remindDays?: number;     // 提前提醒天数
  isLunar: boolean;        // 农历日期
  lunarMonth?: number;     // 农历月份 (1-12)
  lunarDay?: number;      // 农历日期
}
```

## 环境变量

### 服务端
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=你的密钥
```

### 客户端
客户端使用 Vite，通过代理或直接连接到后端 `/api`。

## 生产环境构建

```bash
# 构建客户端
cd client && npm run build

# 构建服务端
cd ../server && npm run build
```

## 许可证

MIT 许可证
