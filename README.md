# Celebrate Festival - 节日纪念日管理平台

[English](./README.md) | [中文](./README_ZH.md)

A full-stack web application for managing personal festivals, birthdays, anniversaries, and other important dates with countdown reminders.

## Features

- **User Authentication**: Register, login, JWT-based authentication
- **Event Management**: Create, edit, delete personal events
- **Event Types**: Birthday, Anniversary, Festival, Custom events
- **Lunar Calendar Support**: Support for lunar calendar dates (Chinese traditional)
- **Countdown Timer**: Real-time countdown to upcoming events
- **Share Links**: Generate shareable links for events
- **Admin Panel**: Admin users can manage all users and events
- **Responsive Design**: Beautiful UI with animations, works on all devices

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS 4 (styling)
- React Router DOM 7 (routing)
- Axios (HTTP client)
- lunar-javascript (Chinese lunar calendar)

### Backend
- Express 5 + TypeScript
- Prisma (ORM)
- SQLite (database)
- JWT (authentication)
- bcryptjs (password hashing)

### DevOps
- Docker & Docker Compose
- Caddy (reverse proxy / static file server)

## Project Structure

```
celebrate-festival/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (auth state)
│   │   ├── index.css      # Global styles & animations
│   │   └── main.tsx       # Entry point
│   ├── dist/              # Built production files
│   ├── Dockerfile         # Client Docker image
│   └── Caddyfile          # Caddy configuration
│
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Auth & admin middleware
│   │   └── utils/         # Prisma client
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── dev.db        # SQLite database
│   ├── dist/              # Compiled JavaScript
│   └── Dockerfile         # Server Docker image
│
├── docker-compose.yml      # Docker orchestration
└── README.md               # This file
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for containerized deployment)
- npm or yarn

### Local Development

1. **Install dependencies**

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

2. **Setup database**

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

3. **Start development servers**

```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
cd client && npm run dev
```

4. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Default admin account: `admin` / `123456`

### Docker Deployment

1. **Build and run containers**

```bash
docker compose up -d
```

2. **Access the application**

- Frontend: http://localhost
- Backend API: http://localhost:3001

3. **View logs**

```bash
docker compose logs -f
```

4. **Stop containers**

```bash
docker compose down
```

## API Documentation

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /register | Register new user | No |
| POST | /login | Login user | No |
| GET | /me | Get current user | Yes |
| PUT | /profile | Update user profile | Yes |

### Event Routes (`/api/events`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | / | Get all events for user | Yes |
| GET | /:id | Get single event | Yes |
| POST | / | Create new event | Yes |
| PUT | /:id | Update event | Yes |
| DELETE | /:id | Delete event | Yes |

### Share Routes (`/api/share`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | / | Create share link | Yes |
| GET | /:token | Get shared event | No |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /users | Get all users | Yes (Admin) |
| PUT | /users/:id/role | Update user role | Yes (Admin) |
| DELETE | /users/:id | Delete user | Yes (Admin) |
| GET | /events | Get all events | Yes (Admin) |
| DELETE | /events/:id | Delete event | Yes (Admin) |

## Event Data Structure

```typescript
{
  id: number;
  userId: number;
  title: string;
  date: Date;              // Event date
  type: 'birthday' | 'anniversary' | 'festival' | 'custom';
  description?: string;
  isRecurring: boolean;    // Annual recurrence
  remindDays?: number;     // Days before to remind
  isLunar: boolean;        // Lunar calendar date
  lunarMonth?: number;     // Lunar month (1-12)
  lunarDay?: number;       // Lunar day
}
```

## Environment Variables

### Server
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
```

### Client
The client uses Vite and connects to the backend at `/api` (proxied or direct).

## Build for Production

```bash
# Build client
cd client && npm run build

# Build server
cd ../server && npm run build
```

## License

MIT License
