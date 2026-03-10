# 🌟 Skillozen — AI-Powered Life Skills Platform for Children

> Help children aged 4–20 develop, measure, and strengthen essential 21st-century life skills.

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Local Setup](#local-setup)
6. [Database Setup](#database-setup)
7. [OpenAI Setup](#openai-setup)
8. [Vercel Deployment](#vercel-deployment)
9. [Environment Variables](#environment-variables)
10. [Admin Dashboard](#admin-dashboard)
11. [API Reference](#api-reference)
12. [Roadmap](#roadmap)

---

## 🏗️ Architecture Overview <a name="architecture"></a>

```
┌─────────────────────────────────────────────────────────────────┐
│                        SKILLOZEN PLATFORM                       │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js 14 App Router + TypeScript + Tailwind CSS)   │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Landing  │  │  Onboarding  │  │Assessment│  │  Results  │  │
│  │ Page     │  │  (Child +    │  │  (20-Q   │  │  (Radar   │  │
│  │          │  │   Parent)    │  │   Game)  │  │   Chart)  │  │
│  └──────────┘  └──────────────┘  └──────────┘  └───────────┘  │
│  ┌──────────────────────────┐    ┌─────────────────────────┐   │
│  │  Training Hub (500+ acts)│    │  Admin Dashboard        │   │
│  │  XP · Badges · Streaks   │    │  Users · Stats · Export │   │
│  └──────────────────────────┘    └─────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  API Layer (Next.js Route Handlers — all server-side)           │
│  /api/user  /api/assessment/*  /api/training/*  /api/admin      │
├──────────────────────────────┬──────────────────────────────────┤
│  PostgreSQL (via Prisma ORM) │   OpenAI API (gpt-4o-mini)       │
│  Users · Children · Assess- │   · Adaptive question generation  │
│  ments · SkillProfiles ·    │   · Answer scoring + reasoning    │
│  Activities · Badges        │   · Skill profile synthesis       │
└──────────────────────────────┴──────────────────────────────────┘
```

### User Journey
```
Landing → Onboarding → Assessment (20 Q's) → Skill Report Card → Training Hub
            ↓                                        ↓
       Email captured                     XP, Badges, Streaks
       Parent profile                     Daily activity queue
       Child profile                      Personalised to skill gaps
```

---

## ✨ Features <a name="features"></a>

### Feature 1: Skill Analysis (FREE)
- **Adaptive 20-question diagnostic** — game-like exploration, not a test
- **5 skill areas**: Critical Thinking, Communication, Social-Emotional, Creativity, Digital Literacy
- **OpenAI-powered** question generation and answer scoring
- **Skill Radar Chart** showing performance across all skills
- **Age-benchmarked comparisons** — global percentile estimates
- **Parent report** with plain-language insights, strengths, gaps, and recommendations
- **Fallback system** — works even if OpenAI is unavailable

### Feature 2: Skill Training (₹499/yr)
- **500+ seeded activities** organised by skill, age group, and activity type
- **Activity types**: Quizzes, Simulations, Creative Tasks, Reflections, Challenges, Games
- **XP system** — earn points for every completed activity
- **Level system** — level up every 100 XP
- **Badges** — 10 achievement badges including First Step, Week Warrior, XP Legend
- **Streak tracking** — daily activity streaks
- **Daily personalised queue** — 3 activities tailored to skill gaps
- **Offline indicator** — activities marked as offline-capable

### Admin Dashboard
- JWT-authenticated admin panel
- Total users, children, assessments, activities
- Plan breakdown (Free / Standard / Premium)
- Feature usage analytics
- Average skill scores across all assessments
- Recent signup table
- CSV export of all user emails

---

## 🛠️ Tech Stack <a name="tech-stack"></a>

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Frontend      | Next.js 14 (App Router)             |
| Language      | TypeScript                          |
| Styling       | Tailwind CSS                        |
| Charts        | Recharts                            |
| Database      | PostgreSQL                          |
| ORM           | Prisma                              |
| AI            | OpenAI API (gpt-4o-mini)            |
| Auth (Admin)  | JWT (jsonwebtoken) + bcryptjs       |
| Validation    | Zod                                 |
| Deployment    | Vercel                              |
| Repo          | GitHub                              |

---

## 📁 Project Structure <a name="project-structure"></a>

```
skillozen/
├── app/
│   ├── layout.tsx                  # Root layout, fonts, metadata
│   ├── globals.css                 # Global styles + Tailwind directives
│   ├── page.tsx                    # Landing page
│   ├── onboarding/
│   │   └── page.tsx                # Parent + child profile setup
│   ├── assessment/
│   │   └── page.tsx                # 20-question adaptive assessment
│   ├── results/
│   │   └── [id]/page.tsx           # Skill Report Card with charts
│   ├── training/
│   │   └── page.tsx                # Training hub with activities
│   ├── admin/
│   │   └── page.tsx                # Admin dashboard
│   └── api/
│       ├── user/route.ts           # User + child creation
│       ├── assessment/
│       │   ├── start/route.ts      # Start assessment session
│       │   ├── question/route.ts   # Generate adaptive question (AI)
│       │   ├── complete/route.ts   # Submit answer + score (AI)
│       │   └── result/route.ts     # Fetch skill profile result
│       ├── training/
│       │   ├── activities/route.ts # Get age-appropriate activities
│       │   └── complete/route.ts   # Mark activity done, award XP
│       └── admin/route.ts          # Admin login + stats + CSV export
├── lib/
│   ├── prisma.ts                   # Singleton Prisma client
│   ├── openai.ts                   # OpenAI helpers (questions, scoring, profiles)
│   └── utils.ts                    # Shared utilities (rate limiting, XP, etc.)
├── prisma/
│   ├── schema.prisma               # Full database schema
│   └── seed.ts                     # Seeds 15+ activities + 10 badges
├── .env.example                    # Environment variable template
├── tailwind.config.ts              # Brand colors, fonts, animations
├── next.config.ts                  # Next.js config + security headers
└── README.md
```

---

## 🚀 Local Setup <a name="local-setup"></a>

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or hosted)
- OpenAI API key
- Git

### Step 1: Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/skillozen.git
cd skillozen
npm install
```

### Step 2: Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values (see [Environment Variables](#environment-variables) section).

### Step 3: Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with activities and badges
npm run db:seed
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🗄️ Database Setup <a name="database-setup"></a>

### Option A: Supabase (Recommended — Free tier available)
1. Go to [supabase.com](https://supabase.com) → New project
2. Settings → Database → Copy the **Connection string (URI)**
3. Paste into `DATABASE_URL` in your `.env.local`
4. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### Option B: Neon (Serverless PostgreSQL — Free tier)
1. Go to [neon.tech](https://neon.tech) → New project
2. Copy the connection string
3. Format: `postgresql://[user]:[password]@[host]/[db]?sslmode=require`

### Option C: Railway
1. Go to [railway.app](https://railway.app) → New → PostgreSQL
2. Copy `DATABASE_URL` from the Variables tab

### After setting DATABASE_URL:
```bash
npm run db:push    # Creates all tables
npm run db:seed    # Seeds activities, badges, and admin account
```

---

## 🤖 OpenAI Setup <a name="openai-setup"></a>

1. Go to [platform.openai.com](https://platform.openai.com) → API Keys
2. Create a new secret key
3. Add to `.env.local`: `OPENAI_API_KEY=sk-...`

**Cost estimate**: The platform uses `gpt-4o-mini` which costs ~$0.15/1M input tokens.
- Assessment (20 questions): ~$0.01 per child
- Skill profile generation: ~$0.005 per completion
- **Estimated cost**: <₹1 per child assessment

> ⚡ **Fallback**: If OpenAI is unavailable or over quota, the platform automatically falls back to pre-written questions and rule-based scoring. The app never breaks!

---

## ☁️ Vercel Deployment <a name="vercel-deployment"></a>

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial Skillozen setup"
git remote add origin https://github.com/YOUR_USERNAME/skillozen.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework Preset: **Next.js** (auto-detected)
4. Add Environment Variables (see below)
5. Click **Deploy**

### Step 3: Post-Deploy Database Migration

After first deploy, run in Vercel console or locally (pointing to production DB):
```bash
DATABASE_URL="your-production-url" npm run db:push
DATABASE_URL="your-production-url" npm run db:seed
```

### Step 4: Update App URL

In Vercel, add:
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 🔐 Environment Variables <a name="environment-variables"></a>

| Variable              | Description                                    | Required |
|-----------------------|------------------------------------------------|----------|
| `DATABASE_URL`        | PostgreSQL connection string                    | ✅ Yes   |
| `OPENAI_API_KEY`      | OpenAI API key (sk-...)                        | ✅ Yes   |
| `NEXT_PUBLIC_APP_URL` | Your app URL (http://localhost:3000 in dev)    | ✅ Yes   |
| `ADMIN_JWT_SECRET`    | Secret for admin JWT tokens (32+ chars)        | ✅ Yes   |
| `ADMIN_PASSWORD`      | Admin dashboard password                       | ✅ Yes   |
| `RATE_LIMIT_MAX`      | Max API requests per window (default: 60)      | Optional |
| `RATE_LIMIT_WINDOW_MS`| Rate limit window in ms (default: 60000)       | Optional |

**Add all variables in Vercel**: Project → Settings → Environment Variables

---

## 🔧 Admin Dashboard <a name="admin-dashboard"></a>

Access at `/admin`

**Default credentials**:
- Password: Set via `ADMIN_PASSWORD` env var (default: `admin@skillozen2024`)

**Change the admin password**:
```bash
# Re-run the seed after changing ADMIN_PASSWORD env var
ADMIN_PASSWORD="your-new-password" npm run db:seed
```

**Features**:
- 📊 Overview: total users, assessments, activities, plan breakdown
- 👥 Users tab: recent signups table with email, name, plan, joined date
- 📈 Usage tab: average skill scores across all assessments
- 📥 Export: Download all user emails as CSV

---

## 📡 API Reference <a name="api-reference"></a>

### User
| Method | Endpoint    | Description                    |
|--------|-------------|--------------------------------|
| POST   | `/api/user` | Create user + child profile    |
| GET    | `/api/user?userId=xxx` | Fetch user data   |

### Assessment
| Method | Endpoint                      | Description                        |
|--------|-------------------------------|------------------------------------|
| POST   | `/api/assessment/start`       | Create new assessment session      |
| POST   | `/api/assessment/question`    | Get AI-generated question          |
| POST   | `/api/assessment/complete`    | Submit answer + generate profile   |
| GET    | `/api/assessment/result?id=x` | Fetch skill profile result         |

### Training
| Method | Endpoint                       | Description                    |
|--------|--------------------------------|--------------------------------|
| GET    | `/api/training/activities`     | Get age-appropriate activities |
| POST   | `/api/training/complete`       | Mark activity done, award XP   |

### Admin (JWT protected)
| Method | Endpoint                    | Description                |
|--------|-----------------------------|----------------------------|
| POST   | `/api/admin`                | Login → get JWT token      |
| GET    | `/api/admin?action=stats`   | Dashboard statistics       |
| GET    | `/api/admin?action=export`  | Download users CSV         |

---

## 🗺️ Roadmap <a name="roadmap"></a>

### Phase 1 (Current) ✅
- [x] Landing page with email capture
- [x] Child + parent onboarding
- [x] AI-adaptive 20-question assessment
- [x] Skill Profile with radar chart
- [x] 15+ seeded training activities
- [x] XP, badges, and streak system
- [x] Admin dashboard with CSV export

### Phase 2 (Planned)
- [ ] Feature 3: Smart Progress Dashboard
  - [ ] Real-time grade/score tracking
  - [ ] AI weekly reports
  - [ ] Predictive struggle alerts
  - [ ] Goal-setting wizard
- [ ] Stripe payment integration (Standard/Premium plans)
- [ ] Email reports via Resend/SendGrid
- [ ] Activity expansion to 500+
- [ ] Multi-child support per parent

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Teacher/school portal
- [ ] Custom activity creation for parents
- [ ] Peer comparison with privacy controls
- [ ] Certificate generation

---

## 🛡️ Security

- ✅ All OpenAI calls are server-side only
- ✅ `OPENAI_API_KEY` never exposed to client
- ✅ Zod validation on all API inputs
- ✅ Rate limiting on all endpoints (in-memory; use Redis for scale)
- ✅ JWT authentication for admin panel
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- ✅ Input sanitisation via Prisma parameterised queries

---

## 📄 License

MIT — build freely, attribute kindly.

---

Built with ❤️ for children's education · [Skillozen.com](https://skillozen.com)
