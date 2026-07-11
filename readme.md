<div align="center">

# 🚭 Quit-It

### An AI-powered addiction recovery companion

Track your sobriety streak, understand your relapse patterns, connect with a supportive community, and get real-time support from an AI coach — all in one private, judgment-free space.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-quit--it.vercel.app-7c3aed?style=for-the-badge)](https://quit-it.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge)](https://render.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

![Quit-It Dashboard Preview](https://quit-it.vercel.app/og.png)

</div>

---

## ✨ Features

- **Community Chat** — Join addiction-specific communities and chat with others on the same journey in real-time via WebSocket
- **Milestone Celebrations** — Receive automated congratulations when you hit 7, 30, 90, 180, or 365 days of sobriety
- **Content Moderation** — Automated tiered moderation flags harmful content (self-harm, hate speech, drug references) and allows user flagging
- **Streak Tracking** — Visualize your sobriety streak in real time with gamified milestones
- **Daily Check-ins** — Log your mood every day and monitor emotional patterns over time
- **Relapse Logging** — Record relapses with context (trigger, mood, intensity) for self-awareness
- **AI Coach** — Chat with a Gemini-powered coach for real-time personalized support (with HuggingFace fallback)
- **Urge Intervention** — Hit the urge button mid-craving and get instant AI-guided coping strategies
- **Pattern Insights** — AI analyzes your relapse history and surfaces actionable behavioral insights
- **Mood Chart** — Visualize your emotional journey over time with an interactive Recharts graph
- **Multi-addiction support** — Track multiple habits simultaneously (smoking, alcohol, social media, gambling, and more)
- **Auto-join Communities** — Automatically joined to the relevant support community when you create an active addiction

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework with server-side rendering |
| TypeScript | Type safety throughout |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations and page transitions |
| Recharts | Mood trend charts |
| Axios | HTTP client with interceptors |
| React Hot Toast | Notifications |
| socket.io-client | Real-time community chat |
| js-cookie | Client-side cookie management |
| lucide-react | Icon library |
| clsx + tailwind-merge | Conditional class utilities |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| TypeScript | Type safety throughout |
| Prisma ORM | Database access and migrations |
| PostgreSQL | Primary database |
| Upstash Redis | Caching and rate limiting |
| IORedis | Redis client for BullMQ job queues |
| BullMQ | Background job queues (moderation, milestones, notifications) |
| Socket.io | WebSocket server for real-time community messaging |
| Google Gemini | Primary AI model (via LangChain) |
| HuggingFace | AI fallback model |
| LangChain | AI orchestration layer |
| JWT + Cookies | Authentication |
| Helmet + CORS | Security headers |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Upstash | Managed Redis (caching & rate limiting) |
| Redis (self-hosted / Docker) | BullMQ job queue backend |
| PostgreSQL | Managed database (Render / Neon / Supabase) |
| Docker | Containerized backend with Redis |

---

## 🗂 Project Structure

```
quit-it/
├── frontend/                        # Next.js app
│   ├── app/
│   │   ├── (auth)/                  # Sign-in, Sign-up pages
│   │   └── (dashboard)/             # Protected app pages
│   │       ├── page.tsx             # Dashboard home
│   │       ├── checkin/             # Daily check-in
│   │       ├── coach/               # AI coach chat
│   │       ├── community/           # Community chat page
│   │       ├── insights/            # AI pattern analysis
│   │       ├── settings/            # User settings
│   │       └── onboarding/          # First-time setup
│   ├── components/
│   │   ├── coach/                   # ChatWindow, MessageBubble
│   │   ├── community/               # CommunityHeader, MessageBubble, FlagMenu, MessageInput, MilestoneToast
│   │   ├── dashboard/               # StreakCard, MoodChart, UrgeButton
│   │   └── ui/                      # Button, Card, Modal
│   ├── context/                     # AuthContext
│   ├── hooks/                       # useCoach, useCheckin, useStreak, useCommunity, useSocket
│   ├── services/                    # API service layer
│   ├── lib/                         # Axios instance, utils, request wrapper
│   ├── types/                       # TypeScript types
│   └── middleware.ts                # Route protection
│
└── backend/                         # Express API
    ├── src/
    │   ├── modules/                 # Feature modules
    │   │   ├── auth/                # Register, login, logout
    │   │   ├── user/                # Profile
    │   │   ├── addiction/           # Addiction CRUD
    │   │   ├── checkin/             # Daily check-ins
    │   │   ├── relapse/             # Relapse logging
    │   │   ├── ai/                  # Coach, urge, insights
    │   │   └── community/           # Community list, join/leave, messages
    │   ├── queues/                  # BullMQ queue definitions (notification, milestone, moderation)
    │   ├── workers/                 # BullMQ workers (milestone broadcasts, moderation scanning)
    │   ├── events/                  # Event emitter for community lifecycle events
    │   ├── config/                  # DB, Redis, BullMQ Redis, Socket.io, env, constants
    │   ├── middlewares/             # Auth, validate, rate limit
    │   ├── services/                # Streak, AI service, Gemini, HuggingFace, cache
    │   └── utils/                   # Errors, response helper, prompt builder, asyncHandler, seed
    └── prisma/
        └── schema.prisma            # Database schema (incl. Community, CommunityMessage, CommunityMember, ModerationFlag)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Upstash Redis account (caching + rate limiting)
- Redis instance for BullMQ (or use Docker Compose)
- Google Gemini API key
- HuggingFace API key (fallback)

### 1. Clone the repository

```bash
git clone https://github.com/Puspak29/quit-it.git
cd quit-it
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=8080
NODE_ENV=development
DATABASE_URL=<YOUR_POSTGRES_CONNECTION_STRING>
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Redis (Upstash — caching & rate limiting)
UPSTASH_REDIS_REST_URL=<YOUR_UPSTASH_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_UPSTASH_TOKEN>

# Redis (direct — BullMQ job queues)
REDIS_QUEUE_URL=redis://localhost:6379

# AI — Primary
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>

# AI — Fallback
HF_API_KEY=<YOUR_HUGGINGFACE_API_KEY>

# Firebase Cloud Messaging (optional — for push notifications)
FIREBASE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
FIREBASE_CLIENT_EMAIL=<YOUR_FIREBASE_CLIENT_EMAIL>
FIREBASE_PRIVATE_KEY=<YOUR_FIREBASE_PRIVATE_KEY>
```

#### Option A: Local Redis

Install and run Redis locally on port 6379, or use Docker Compose:

```bash
docker compose up -d redis
```

#### Option B: Full Docker Compose

```bash
docker compose up --build
```

This starts both the backend (port 8080) and a Redis instance for BullMQ.

Then run database migrations and seed communities:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

### Backend → Render

1. Create a new **Web Service** on Render
2. Connect your GitHub repo, set root directory to `backend`
3. Set build command: `npm install && npm run build && npm run db:generate`
4. Set start command: `npm start`
5. Add all environment variables from `.env` (use a managed Redis provider for BullMQ, e.g., Redis Cloud)

### Frontend → Vercel

1. Import your GitHub repo on Vercel
2. Set root directory to `frontend`
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```
4. Deploy

> **Note:** The frontend proxies all `/api/*` requests to the backend via the `NEXT_PUBLIC_API_URL` env var. Authentication uses a bearer token stored in a cookie (`frontend-token`), and Next.js middleware redirects unauthenticated users to `/sign-in`.

---

## 🏘 Community System

The community feature provides real-time, addiction-specific support groups:

### How it works

- **Pre-seeded Communities** — One community per addiction type is created at startup via `npm run db:seed`
- **Auto-join** — When you create an active addiction, you're automatically added to the corresponding community
- **Real-time Chat** — Messages are sent and received via WebSocket (Socket.io) — no page refresh needed
- **Live Indicators** — Shows connection status and live member count

### Moderation

- **Automated Scanning** — Every message passes through a BullMQ worker that checks against tiered keyword lists
  - `SELF_HARM` → message hidden immediately
  - `HATE_SPEECH` / `AUTO_KEYWORD` → message flagged for review
- **User Flagging** — Members can flag messages as spam, hate speech, or self-harm
- **Flagged messages** are hidden from other users but still visible to the sender

### Milestones

When a user posts a message and their streak matches a milestone (7, 30, 90, 180, or 365 days), a BullMQ job broadcasts a congratulatory toast to the entire community in real-time.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |

### User
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/me` | Get current user |
| PATCH | `/api/user/profile` | Update profile |

### Addiction
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/addiction` | Create addiction |
| GET | `/api/addiction` | List addictions |
| PATCH | `/api/addiction/:id` | Update addiction |

### Check-ins
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/checkin` | Submit daily check-in |
| GET | `/api/checkin` | Get check-in history |

### Relapses
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/relapse` | Log a relapse |
| GET | `/api/relapse` | Get relapse history |

### AI
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/chat` | Send message to AI coach |
| GET | `/api/ai/history` | Get chat history |
| POST | `/api/ai/urge` | Trigger urge intervention |
| GET | `/api/ai/insight` | Get AI pattern insight |

### Community
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/communities` | List all communities (with membership status) |
| GET | `/api/communities/:id` | Get community details |
| POST | `/api/communities/:id/join` | Join a community |
| DELETE | `/api/communities/:id/leave` | Leave a community |
| GET | `/api/communities/:id/messages` | Paginated message history (cursor-based) |

### WebSocket Events
| Event | Direction | Description |
|---|---|---|
| `community:join` | Client → Server | Join a community room |
| `community:send` | Client → Server | Send a chat message |
| `community:flag` | Client → Server | Report a message |
| `community:message` | Server → Client | New message broadcast |
| `community:milestone` | Server → Client | Milestone achievement broadcast |
| `community:message:hidden` | Server → Client | Message removed by moderation |

---

## 🔒 Security

- Passwords hashed with **bcrypt** (10 rounds)
- Auth via **bearer token** stored in httpOnly cookie — not accessible via JavaScript
- All routes protected by **JWT middleware**
- **Helmet** security headers on all responses
- **CORS** restricted to frontend origin
- **Rate limiting** on AI and community endpoints via Redis
- Generic error messages on login to prevent user enumeration
- **Content moderation** — Tiered keyword filtering with automated flagging/hiding
- Community message length capped at 1000 characters

---

## 📄 License

ISC © [Puspak29](https://github.com/Puspak29)

---

<div align="center">
  Built with ❤️ to help people reclaim their lives
</div>