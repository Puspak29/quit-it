<div align="center">

# 🚭 Quit-It

### An AI-powered addiction recovery companion

Track your sobriety streak, understand your relapse patterns, and get real-time support from an AI coach — all in one private, judgment-free space.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-quit--it.vercel.app-7c3aed?style=for-the-badge)](https://quit-it.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge)](https://render.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

![Quit-It Dashboard Preview](https://quit-it.vercel.app/og.png)

</div>

---

## ✨ Features

- **Streak Tracking** — Visualize your sobriety streak in real time with gamified milestones
- **Daily Check-ins** — Log your mood every day and monitor emotional patterns over time
- **Relapse Logging** — Record relapses with context (trigger, mood, intensity) for self-awareness
- **AI Coach** — Chat with a Gemini-powered coach for real-time personalized support
- **Urge Intervention** — Hit the urge button mid-craving and get instant AI-guided coping strategies
- **Pattern Insights** — AI analyzes your relapse history and surfaces actionable behavioral insights
- **Mood Chart** — Visualize your emotional journey over time with an interactive Recharts graph
- **Multi-addiction support** — Track multiple habits simultaneously (smoking, alcohol, social media, and more)

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

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| TypeScript | Type safety throughout |
| Prisma ORM | Database access and migrations |
| PostgreSQL | Primary database |
| Upstash Redis | Caching and rate limiting |
| Google Gemini | Primary AI model |
| HuggingFace | AI fallback model |
| JWT + Cookies | Authentication |
| Helmet + CORS | Security headers |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Upstash | Managed Redis |
| PostgreSQL | Managed database (Render / Neon / Supabase) |

---

## 🗂 Project Structure

```
quit-it/
├── frontend/                  # Next.js app
│   ├── app/
│   │   ├── (auth)/            # Sign-in, Sign-up pages
│   │   └── (dashboard)/       # Protected app pages
│   │       ├── page.tsx       # Dashboard home
│   │       ├── checkin/       # Daily check-in
│   │       ├── coach/         # AI coach chat
│   │       ├── insights/      # AI pattern analysis
│   │       ├── settings/      # User settings
│   │       └── onboarding/    # First-time setup
│   ├── components/            # Reusable UI components
│   ├── context/               # AuthContext
│   ├── hooks/                 # useCoach, useCheckin, useStreak
│   ├── services/              # API service layer
│   ├── lib/                   # Axios instance, utils
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Route protection
│
└── backend/                   # Express API
    ├── src/
    │   ├── modules/           # Feature modules
    │   │   ├── auth/          # Register, login, logout
    │   │   ├── user/          # Profile
    │   │   ├── addiction/     # Addiction CRUD
    │   │   ├── checkin/       # Daily check-ins
    │   │   ├── relapse/       # Relapse logging
    │   │   └── ai/            # Coach, urge, insights
    │   ├── config/            # DB, Redis, env, constants
    │   ├── middlewares/       # Auth, validate, rate limit
    │   ├── services/          # Streak, AI, Gemini, cache
    │   └── utils/             # Errors, response helper, prompts
    └── prisma/
        └── schema.prisma      # Database schema
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Upstash Redis account
- Google Gemini API key

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

Create a `.env` file based on `.env.example`:

```env
PORT=8080
NODE_ENV=development
DATABASE_URL=<YOUR_POSTGRES_CONNECTION_STRING>
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=<YOUR_UPSTASH_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_UPSTASH_TOKEN>

# AI
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
HF_API_KEY=<YOUR_HUGGINGFACE_API_KEY>
```

Run database migrations and start the server:

```bash
npm run db:generate
npm run db:migrate
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
5. Add all environment variables from `.env.example`

### Frontend → Vercel

1. Import your GitHub repo on Vercel
2. Set root directory to `frontend`
3. Add environment variable:
   ```
   API_URL=https://your-backend.onrender.com
   ```
4. Deploy

> **Note:** The frontend uses Next.js rewrites to proxy all `/api/*` requests to the backend, so cookies are scoped to the Vercel domain and middleware authentication works correctly.

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

---

## 🔒 Security

- Passwords hashed with **bcrypt** (10 rounds)
- Auth via **httpOnly cookies** — not accessible via JavaScript
- All routes protected by **JWT middleware**
- **Helmet** security headers on all responses
- **CORS** restricted to frontend origin
- **Rate limiting** on AI endpoints via Redis
- Generic error messages on login to prevent user enumeration

---

## 📄 License

ISC © [Puspak29](https://github.com/Puspak29)

---

<div align="center">
  Built with ❤️ to help people reclaim their lives
</div>