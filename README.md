# PrepTrack

> Placement prep that adapts to your weak topics.

PrepTrack is an adaptive placement preparation platform for Indian CS students at tier 2–3 colleges targeting product companies. The Telegram bot is your daily interface — it sends you company-specific DSA questions, tracks what you solve vs get stuck on, and adjusts future questions accordingly. The web dashboard shows you where you actually stand.

---

## What It Does

- You pick a target company (Amazon, Microsoft, Google, Flipkart, Walmart, and more)
- You get 3–10 DSA questions per day tailored to that company's interview patterns
- You mark each one: **Solved**, **Stuck**, or **Skipped**
- The system detects which topics you keep struggling with
- Tomorrow's questions weight toward your weak topics
- The web dashboard visualises your progress, streak, and weak topic breakdown

---

## Architecture

```
Telegram Bot (Telegraf)
        ↓
Express Backend API
        ↓
PostgreSQL Database
        ↑
React Web Dashboard (Vite + Tailwind)
        ↑
Razorpay Payments
```

Full architecture details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Project Structure

```
preptrack/
├── backend/          # Express API server
├── bot/              # Telegram bot (Telegraf)
├── web/              # React dashboard (Vite + Tailwind)
├── database/
│   ├── schema.sql    # All table definitions
│   └── seed/
│       └── questions.sql  # Initial question dataset
└── docs/
    ├── ARCHITECTURE.md
    ├── API.md
    ├── DATABASE.md
    └── DEPLOYMENT.md
```

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Bot        | Node.js + Telegraf v4   |
| Backend    | Node.js + Express       |
| Database   | PostgreSQL               |
| Frontend   | React + Tailwind + Vite |
| Payments   | Razorpay                |
| Hosting    | Railway (backend + bot) + Vercel (web) |

---

## Pricing

| Tier | Price | Features |
|------|-------|----------|
| Free | ₹0 | 3 questions/day, 2 companies, basic tracking |
| Pro | ₹199/month | Unlimited questions, all companies, weak-topic analysis, adaptive daily plan |

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

### 1. Clone the repo

```bash
git clone https://github.com/AbdulWasay0029/preptrack.git
cd preptrack
```

### 2. Set up the database

```bash
psql -U postgres -c "CREATE DATABASE preptrack;"
psql -U postgres -d preptrack -f database/schema.sql
psql -U postgres -d preptrack -f database/seed/questions.sql
```

### 3. Start the backend

```bash
cd backend
cp .env.example .env
# Fill in your DATABASE_URL and other values
npm install
npm run dev
```

### 4. Start the bot

```bash
cd bot
cp .env.example .env
# Fill in your TELEGRAM_BOT_TOKEN and BACKEND_URL
npm install
npm run dev
```

### 5. Start the web dashboard

```bash
cd web
cp .env.example .env
# Fill in your VITE_API_URL
npm install
npm run dev
```

---

## Environment Variables

See `.env.example` in each sub-directory for required variables.

---

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Railway + Vercel setup.

---

## API Reference

See [docs/API.md](docs/API.md) for all endpoints.

---

## Database Schema

See [docs/DATABASE.md](docs/DATABASE.md) for table definitions and relationships.

---

## Development Roadmap

| Week | Goal |
|------|------|
| 1–2 | Seed dataset + bot skeleton + repo setup |
| 3–4 | Weak-topic detection + adaptive recommendations + first 10 users |
| 5–6 | Web dashboard + Razorpay integration |
| 7–8 | Scale to 15+ companies + distribution + polish |

---

## North Star Metric

**Weekly Active Users (WAU)** — users who interact with the bot at least 3 times per week.

---

## Built by

Abdul Wasay — 2nd year CSE, CMRIT Hyderabad
