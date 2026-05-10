# PrepTrack — AI Handoff Document
> Paste this entire file as context into any AI tool (Antigravity, Cursor, ChatGPT, Gemini, etc.)
> It contains everything needed to continue building without prior conversation context.

---

## Project Summary

**PrepTrack** is an adaptive placement prep platform for Indian CS students at tier 2–3 colleges.
- Telegram bot = daily interaction layer (questions, marking progress)
- Web dashboard = analytics/visualization layer
- Backend = Express API that both the bot and web talk to
- Core differentiator = adaptive weak-topic detection (the engine adjusts future questions based on what you keep getting stuck on)

**Repo:** https://github.com/AbdulWasay0029/preptrack.git  
**Owner:** Abdul Wasay (CMRIT Hyderabad, 2nd year CSE)

---

## Locked Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Bot | Node.js + Telegraf v4 | CommonJS (require/module.exports) |
| Backend | Node.js + Express | CommonJS, runs on Railway |
| Database | PostgreSQL | pg pool |
| Frontend | React + Vite + Tailwind CSS | Vercel deployment |
| Payments | Razorpay | UPI-compatible, ₹199/month Pro tier |
| Hosting | Railway (bot + backend) + Vercel (web) |

**DO NOT** switch any of these. All decisions are locked.

---

## What Is Already Built

### `/database/schema.sql` ✅
Complete PostgreSQL schema with these tables:
- `companies` — amazon, microsoft, google, flipkart, walmart, adobe, atlassian, intuit
- `topics` — arrays, strings, linked-lists, trees, graphs, dynamic-prog, stacks-queues, binary-search, greedy, backtracking, heap, sorting, design
- `questions` — title, leetcode_link, difficulty (easy/medium/hard), topic_id
- `company_questions` — many-to-many with frequency (1–5)
- `users` — telegram_id (BIGINT), name, username, target_company_id, questions_per_day (default 3), is_pro, streak, last_active_date
- `user_progress` — user_id, question_id, status (solved/stuck/skipped), attempted_at
- `daily_deliveries` — tracks what was sent each day, prevents repeats within 14 days
- `user_weak_topics` — cached weak_score (0–1) per user per topic
- `payments` — razorpay_order_id, razorpay_payment_id, amount_paise, status

### `/database/seed/questions.sql` ✅
75 questions seeded across 5 companies with frequency weights.
Topics covered per company: arrays, strings, trees, graphs, DP, stacks, binary search, greedy, backtracking, heap, design.

### `/backend/` ✅ COMPLETE

**File structure:**
```
backend/
├── package.json          (express, pg, cors, dotenv, razorpay, nodemon)
├── .env.example
└── src/
    ├── index.js           (Express app, CORS, all routes mounted)
    ├── db/
    │   └── index.js       (pg Pool, reads DATABASE_URL from env)
    ├── middleware/
    │   └── auth.js        (requireInternalAuth, verifyTelegramLogin)
    ├── services/
    │   └── adaptiveEngine.js  (calculateWeakTopics, selectDailyQuestions, refreshWeakTopicCache)
    └── routes/
        ├── users.js       (POST /users, GET /users/:tid, PATCH /users/:tid, POST /users/auth/telegram)
        ├── questions.js   (GET /questions/companies, GET /questions/daily/:tid)
        ├── progress.js    (POST /progress, GET /progress/:tid/summary)
        ├── analytics.js   (GET /analytics/:tid — full data for web dashboard)
        └── payments.js    (POST /payments/create-order, POST /payments/verify)
```

**Internal auth pattern:** All bot→backend calls require `Authorization: Bearer <INTERNAL_API_SECRET>` header.

**Adaptive engine logic (adaptiveEngine.js):**
- `calculateWeakTopics(userId, db)` — looks at last 30 days of progress, scores each topic: `weak_score = (stuck×2 + skipped×1) / (total×3) × recency_weight`
- `selectDailyQuestions(userId, companySlug, count, db, isPro)` — 60% from weak topics (score > 0.4), 40% standard pool, excludes questions sent in last 14 days
- `refreshWeakTopicCache(userId, db)` — writes scores to `user_weak_topics` table (called async after each progress POST)

**Free tier limits:** max 3 questions/day, only amazon + microsoft companies available.

### `/bot/` ✅ COMPLETE (built 2026-05-10, Antigravity session)

**Full file structure:**
```
bot/
├── package.json          (telegraf, axios, node-cron, dotenv, nodemon)
├── .env.example
└── src/
    ├── index.js           (entry point — registers commands, callback handler, scheduler)
    ├── commands/
    │   ├── start.js       (onboarding: upsert user, company picker with Pro locks)
    │   ├── today.js       (daily questions with solve/stuck/skip keyboard, 403 Pro gate)
    │   ├── progress.js    (30-day stats: streak, solved/stuck/skipped, weak topics)
    │   └── settings.js    (current settings display, change company or qpd)
    ├── handlers/
    │   └── questionCallback.js  (central callback router: set_company, q_status, settings, set_qpd)
    └── utils/
        ├── api.js         (axios client with auth header, wraps all backend calls)
        └── scheduler.js   (node-cron setup, placeholder for daily delivery loop)
```

### `/web/` ✅ COMPLETE (built 2026-05-10, Antigravity session)

**Scaffolded with:** Vite + React + TailwindCSS + recharts + react-router-dom
**Design:** Dark theme — bg `#0f0f0f`, cards `#1a1a1a`, accent `#22c55e`

```
web/
├── package.json
├── vite.config.js        (Vite + TailwindCSS plugin)
├── .env.example          (VITE_API_URL)
└── src/
    ├── main.jsx
    ├── index.css          (Tailwind + custom theme tokens)
    ├── App.jsx            (BrowserRouter: /login, /, /progress)
    ├── api/
    │   └── client.js      (axios with auto telegram_id from localStorage)
    ├── pages/
    │   ├── Login.jsx      (Telegram Login Widget, auth flow)
    │   ├── Dashboard.jsx  (streak card, today's questions with difficulty badges)
    │   └── Progress.jsx   (WeakTopicChart BarChart + Activity AreaChart via recharts)
    └── components/
        ├── Navbar.jsx
        ├── StreakCard.jsx
        ├── DifficultyBadge.jsx
        └── WeakTopicChart.jsx
```

### `/docs/` NOT BUILT YET
ARCHITECTURE.md, API.md, DATABASE.md, DEPLOYMENT.md need to be written.

---

## What You Need to Build Now

### TASK 1: `bot/src/index.js` — Bot Entry Point

```javascript
// bot/src/index.js
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { startScheduler } = require('./utils/scheduler');

// Import command handlers
const startCommand = require('./commands/start');
const todayCommand = require('./commands/today');
const progressCommand = require('./commands/progress');
const settingsCommand = require('./commands/settings');
const questionCallback = require('./handlers/questionCallback');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Register commands
bot.command('start', startCommand);
bot.command('today', todayCommand);
bot.command('progress', progressCommand);
bot.command('settings', settingsCommand);

// Register inline keyboard callbacks
bot.on('callback_query', questionCallback);

// Handle unknown messages
bot.on('message', (ctx) => {
  ctx.reply('Use /today to get your questions, /progress to see your stats, /settings to update preferences.');
});

// Start
bot.launch().then(() => {
  console.log('PrepTrack bot started');
  startScheduler(bot);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
```

---

### TASK 2: `bot/src/commands/start.js` — Onboarding Flow

This is the most important command. Flow:
1. User sends /start
2. Bot calls `api.upsertUser(ctx.from.id, fullName, username)`
3. Bot sends welcome message with company selection (inline keyboard)
4. User picks company → bot calls `api.updateUser(tid, { target_company_slug: slug })`
5. Bot confirms and explains how it works

Companies available for free: Amazon, Microsoft
Companies that require Pro: Google, Flipkart, Walmart, Adobe, Atlassian, Intuit

Example structure:
```javascript
const { Markup } = require('telegraf');
const api = require('../utils/api');

module.exports = async (ctx) => {
  const { id: telegramId, first_name, last_name, username } = ctx.from;
  const name = [first_name, last_name].filter(Boolean).join(' ');

  try {
    await api.upsertUser(telegramId, name, username);
    const companies = await api.getCompanies();

    // Build inline keyboard — free companies first, then Pro
    const buttons = companies.map((c) => [
      Markup.button.callback(
        c.is_pro_only ? `${c.name} 🔒` : c.name,
        `set_company:${c.slug}`
      ),
    ]);

    await ctx.reply(
      `Welcome to PrepTrack, ${first_name}! 👋\n\n` +
      `I send you company-specific DSA questions every day and track which topics you're weak at — then I send you more of those.\n\n` +
      `Pick your target company to get started:`,
      Markup.inlineKeyboard(buttons)
    );
  } catch (err) {
    console.error('/start error:', err.message);
    ctx.reply('Something went wrong. Please try /start again.');
  }
};
```

The `set_company:${slug}` callback is handled in `questionCallback.js`.

---

### TASK 3: `bot/src/commands/today.js` — Daily Questions

Flow:
1. Call `api.getDailyQuestions(telegramId)`
2. For each question, send a message with the title, topic, difficulty, LeetCode link
3. Include inline keyboard: ✅ Solved | 😕 Stuck | ⏭️ Skip
4. Button callback data format: `q_status:${questionId}:solved`, `q_status:${questionId}:stuck`, `q_status:${questionId}:skipped`

Difficulty display: easy → 🟢 Easy, medium → 🟡 Medium, hard → 🔴 Hard

Example message format:
```
📌 Two Sum
🏷️ Arrays  •  🟢 Easy

https://leetcode.com/problems/two-sum/

Did you solve it?
[✅ Solved] [😕 Stuck] [⏭️ Skip]
```

Handle `error.response.status === 403` (pro_required) by telling user to upgrade.

---

### TASK 4: `bot/src/commands/progress.js` — Progress Report

Call `api.getSummary(telegramId)` which returns:
```json
{
  "streak": 5,
  "last30Days": { "solved": 12, "stuck": 8, "skipped": 3, "total": 23 },
  "weakTopics": [
    { "name": "Dynamic Programming", "weak_score": 0.72 },
    { "name": "Graphs", "weak_score": 0.61 }
  ]
}
```

Format into a clean message:
```
📊 Your PrepTrack Stats (last 30 days)

🔥 Streak: 5 days
✅ Solved: 12   😕 Stuck: 8   ⏭️ Skipped: 3

⚠️ Weak Topics (focus here):
• Dynamic Programming — score 72%
• Graphs — score 61%

Keep at it. Tomorrow's questions will target your weak areas.
```

---

### TASK 5: `bot/src/commands/settings.js` — Settings

Show current settings and allow changing:
- Target company (same inline keyboard as /start)
- Questions per day (1–10 for Pro, 1–3 for free): inline keyboard with numbers

---

### TASK 6: `bot/src/handlers/questionCallback.js` — Inline Keyboard Handler

Handles ALL callback queries. Route by callback data prefix:

```javascript
module.exports = async (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data.startsWith('set_company:')) {
    const slug = data.split(':')[1];
    // handle company selection from /start or /settings
  }

  if (data.startsWith('q_status:')) {
    const [, questionId, status] = data.split(':');
    // call api.recordProgress(telegramId, questionId, status)
    // edit the message to show their selection (remove keyboard)
    // if status is 'stuck', add a motivating note
  }

  if (data.startsWith('set_qpd:')) {
    const count = parseInt(data.split(':')[1]);
    // call api.updateUser(telegramId, { questions_per_day: count })
  }

  await ctx.answerCbQuery(); // always answer to dismiss loading state
};
```

---

### TASK 7: React Web Dashboard (`/web/`)

Use **Vite + React + Tailwind CSS**.

```bash
# scaffold:
npm create vite@latest web -- --template react
cd web && npm install tailwindcss @tailwindcss/vite axios recharts
```

**File structure to build:**
```
web/
├── package.json
├── vite.config.js
├── index.html
├── .env.example          (VITE_API_URL=http://localhost:3001)
└── src/
    ├── main.jsx
    ├── App.jsx            (routing: Login page if no user, else Dashboard)
    ├── api/
    │   └── client.js      (axios instance pointing to VITE_API_URL)
    ├── pages/
    │   ├── Login.jsx      (Telegram Login Widget button)
    │   ├── Dashboard.jsx  (streak card, overall stats, today's questions)
    │   └── Progress.jsx   (charts: weak topics bar chart, daily activity)
    └── components/
        ├── StreakCard.jsx
        ├── WeakTopicChart.jsx   (recharts BarChart)
        ├── DifficultyBadge.jsx  (🟢🟡🔴 based on difficulty)
        └── Navbar.jsx
```

**Auth flow:**
1. User lands on `/login`
2. Shows Telegram Login Widget button (script tag from Telegram)
3. On success, Telegram calls your callback with auth data
4. POST to `/users/auth/telegram` to verify + get user object
5. Store `telegram_id` in localStorage
6. All subsequent API calls include `telegram_id` as query param or in requests

**Telegram Login Widget (paste in `Login.jsx`):**
```html
<script
  async
  src="https://telegram.org/js/telegram-widget.js?22"
  data-telegram-login="PrepTrackBot"
  data-size="large"
  data-onauth="onTelegramAuth(user)"
  data-request-access="write"
></script>
```

**Dashboard data:** GET `/analytics/:telegram_id` returns everything needed.

**Styling:** Dark theme. Background `#0f0f0f`, cards `#1a1a1a`, accent `#22c55e` (green-500 in Tailwind). Clean, minimal, no gradients.

**Charts (use recharts):**
- Weak topics: horizontal BarChart (topic name → weak_score as %)
- Daily activity: AreaChart (date → questions solved)

---

### TASK 8: `docs/DEPLOYMENT.md`

Write step-by-step instructions for:

**Railway (backend + bot):**
1. Go to railway.app → New Project → Deploy from GitHub
2. Add PostgreSQL service — Railway gives you a DATABASE_URL
3. Create two services: one for `/backend`, one for `/bot`
4. Set env vars for each (copy from .env.example, fill real values)
5. For backend: set start command `npm start`, root directory `/backend`
6. For bot: set start command `npm start`, root directory `/bot`

**Vercel (web):**
1. Go to vercel.com → New Project → Import GitHub repo
2. Set root directory to `/web`
3. Set env var `VITE_API_URL` to your Railway backend URL
4. Deploy

---

## Environment Variables Reference

### `backend/.env`
```
DATABASE_URL=postgresql://...         # From Railway PostgreSQL service
PORT=3001
NODE_ENV=production
INTERNAL_API_SECRET=<random 32+ char string>
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
TELEGRAM_BOT_TOKEN=<same as bot>
WEB_URL=https://preptrack.vercel.app  # Your Vercel URL
```

### `bot/.env`
```
TELEGRAM_BOT_TOKEN=8596220157:AAGwDBQU75LDy19N49knY3WUqgq3DVKGLD8
BACKEND_URL=https://your-backend.railway.app
INTERNAL_API_SECRET=<same as backend>
DAILY_CRON=30 2 * * *
```

### `web/.env`
```
VITE_API_URL=https://your-backend.railway.app
```

---

## Code Conventions

- **All Node.js files use CommonJS** (`require` / `module.exports`). No ESM (`import`/`export`) in bot or backend.
- **React uses ESM** (Vite default).
- **Error handling:** always wrap async route handlers in try/catch, log with `console.error('route error:', err)`, return `res.status(500).json({ error: 'Server error' })`.
- **No raw SQL in routes** — keep DB queries in routes for now (no ORM), but the adaptive engine logic stays in `services/adaptiveEngine.js`.
- **Internal API calls** from bot always go through `bot/src/utils/api.js` — never call the DB directly from the bot.
- **Telegram IDs are BIGINT** — always pass as number, not string.

---

## API Endpoints Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /users | internal | Create/update user |
| GET | /users/:telegram_id | internal | Get user |
| PATCH | /users/:telegram_id | internal | Update company, qpd |
| POST | /users/auth/telegram | none | Web login via Telegram widget |
| GET | /questions/companies | none | List all companies |
| GET | /questions/daily/:telegram_id | internal | Get today's questions |
| POST | /progress | internal | Record solved/stuck/skipped |
| GET | /progress/:telegram_id/summary | internal | Bot /progress command data |
| GET | /analytics/:telegram_id | internal | Full web dashboard data |
| POST | /payments/create-order | none | Create Razorpay order |
| POST | /payments/verify | none | Verify payment + upgrade to Pro |
| GET | /health | none | Health check |

---

## Pricing Logic

- **Free:** 3 questions/day max, only Amazon + Microsoft available
- **Pro (₹199/month):** unlimited questions/day (up to 10), all 8 companies, weak-topic analysis unlocked
- Free tier still shows weak topic summary in /progress (to show value), but labels Pro features with 🔒

---

## What To Do First (Priority Order)

1. Build `bot/src/index.js` (entry point)
2. Build `bot/src/commands/start.js` (onboarding — most critical path)
3. Build `bot/src/handlers/questionCallback.js` (handles all button presses)
4. Build `bot/src/commands/today.js` (core daily loop)
5. Build `bot/src/commands/progress.js`
6. Build `bot/src/commands/settings.js`
7. Test the bot end-to-end locally
8. Build the React web dashboard
9. Write deployment docs
10. Deploy to Railway + Vercel

---

## Testing Locally

```bash
# Terminal 1 — backend
cd backend && npm install && npm run dev

# Terminal 2 — bot
cd bot && npm install && npm run dev

# Test the bot:
# Open Telegram, find @PrepTrackBot, send /start
# Pick a company
# Send /today
# Click Solved/Stuck/Skip on each question
# Send /progress
```

Make sure `backend/.env` and `bot/.env` both have the same `INTERNAL_API_SECRET`.

---

## Reminder: What This Product Actually Is

Don't over-engineer. The entire value prop is:
> "I know which topics you keep getting stuck on, and I make sure you practice them more."

Everything else (dashboard, payments, multiple companies) is secondary. The bot loop — question → mark status → adaptive selection — is the product. Build that first, make it work reliably, then layer on everything else.
