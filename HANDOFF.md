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
| Hosting | Render (bot + backend) + Vercel (web) |

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
77 questions seeded across 8 companies with frequency weights.

**Database hosting:** Neon PostgreSQL (free tier, ap-southeast-1 Singapore region).
Seed script: `database/seed-neon.js` — run from project root: `node database/seed-neon.js`
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

### `/docs/` PARTIALLY BUILT
- `DEPLOYMENT.md` ✅ Complete (Railway + Vercel step-by-step)
- `ARCHITECTURE.md` ❌ Not yet — hand off to Claude
- `API.md` ❌ Not yet — hand off to Claude
- `DATABASE.md` ❌ Not yet — hand off to Claude

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
1. Go to render.com → Dashboard → New → Web Service
2. Deploy the backend: point to your GitHub repo, set root directory to `/backend`, build command `npm install`, start command `npm start`.
3. Go to Dashboard → New → Background Worker
4. Deploy the bot: point to your repo, set root directory to `/bot`, build command `npm install`, start command `npm start`.
5. Add env variables for both. Render will provide an internal URL for the backend (e.g. `https://preptrack-backend.onrender.com`).

**Vercel (web):**
1. Go to vercel.com → New Project → Import GitHub repo
2. Set root directory to `/web`
3. Set env var `VITE_API_URL` to your Render backend URL
4. Deploy

---

## Environment Variables Reference

### `backend/.env`
```
DATABASE_URL=postgresql://...         # From Neon PostgreSQL service
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
TELEGRAM_BOT_TOKEN=<your-bot-token-here>
BACKEND_URL=https://your-backend.onrender.com
INTERNAL_API_SECRET=<same as backend>
DAILY_CRON=30 2 * * *
```

### `web/.env`
```
VITE_API_URL=https://your-backend.onrender.com
VITE_TELEGRAM_BOT_NAME=PrepTrackBot
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

1. ~~Build `bot/src/index.js` (entry point)~~ ✅ Done (2026-05-10)
2. ~~Build `bot/src/commands/start.js` (onboarding)~~ ✅ Done (2026-05-10)
3. ~~Build `bot/src/handlers/questionCallback.js` (all button presses)~~ ✅ Done (2026-05-10)
4. ~~Build `bot/src/commands/today.js` (core daily loop)~~ ✅ Done (2026-05-10)
5. ~~Build `bot/src/commands/progress.js`~~ ✅ Done (2026-05-10)
6. ~~Build `bot/src/commands/settings.js`~~ ✅ Done (2026-05-10)
7. ~~Test the bot end-to-end locally~~ ✅ Done (2026-05-10)
8. ~~Build the React web dashboard~~ ✅ Done (2026-05-10)
9. ~~Write deployment docs~~ ✅ Done (2026-05-10)
10. Deploy to Render + Vercel ← NEXT STEP FOR CLAUDE

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

---

## Session Log

### 2026-05-10 — Antigravity (Claude Opus 4.6) — Full Build Session

**What was built:**
- `bot/src/index.js` — entry point, wires commands + callbacks + scheduler
- `bot/src/commands/start.js` — onboarding with company picker (free vs Pro 🔒)
- `bot/src/commands/today.js` — daily questions with ✅😕⏭️ inline keyboard, 403 Pro handling
- `bot/src/commands/progress.js` — 30-day stats, streak, weak topic scores
- `bot/src/commands/settings.js` — current settings, change company / questions-per-day
- `bot/src/handlers/questionCallback.js` — central callback router (set_company, q_status, settings, set_qpd)
- `web/` — full React dashboard (Vite + TailwindCSS + recharts + react-router-dom)
  - Login.jsx (Telegram Widget), Dashboard.jsx, Progress.jsx
  - Components: Navbar, StreakCard, DifficultyBadge, WeakTopicChart
  - Dark theme: bg #0f0f0f, cards #1a1a1a, accent #22c55e
- `docs/DEPLOYMENT.md` — Railway + Vercel step-by-step
- `database/seed-neon.js` — script to seed Neon PostgreSQL from project root

**Infrastructure set up:**
- Neon PostgreSQL (free tier, Singapore ap-southeast-1)
- Database seeded: 8 companies, 13 topics, 77 questions
- `.env` files configured with matching INTERNAL_API_SECRET
- Notion Engineering page updated with build log

**Issues fixed:**
- Leaked bot token in HANDOFF.md → replaced with placeholder, token reset on BotFather
- Hardened `.gitignore` with explicit `.env.*` patterns + `!.env.example` exception
- Fixed 403 (INTERNAL_API_SECRET mismatch between bot and backend)
- Fixed 500 (DATABASE_URL pointing to nonexistent local Postgres → now points to Neon)
- Fixed undefined questions error in `/today` response parsing
- Added missing company guardrails and chunked UI buttons for improved layout
- Added a dummy HTTP server so bot can run on Render free Web Service tier
- Added VITE_TELEGRAM_BOT_NAME environment variable to avoid Telegram widget mismatch

**What's left for Claude:**
- [x] Test Telegram Login Widget on the web dashboard locally (`cd web && npm run dev`)
- [x] Deploy to Render (backend + bot) + Vercel (web)
- [x] Write missing docs (`docs/ARCHITECTURE.md`, `docs/API.md`, `docs/DATABASE.md`)
- [x] Set up Razorpay webhooks and full payment flow when ready for monetization

### 2026-05-10 — Phase 2 Complete (Antigravity)
- **Task 1:** Fixed Daily Scheduler
- **Task 2:** Fixed Name Bug in Web Dashboard
- **Task 3:** Expanded Question Dataset to 300+ and seeded to Neon DB
- **Task 4:** Built Landing Page and updated web routes
- **Task 5:** Razorpay Integration added to webhook and dashboard / bot
- **Task 6:** Web Onboarding Flow forced company selection
- **Task 7:** LinkedIn Share Card for Streaks added
- **Task 8:** Community Question Submission added via `/suggest` and DB

### 2026-05-10 — Hotfix: Deploy-Breaking Bugs (Antigravity)
Two bugs introduced during Phase 2 crashed both Render and Vercel deploys:

**Bug 1 — `bot/src/commands/upgrade.js` line 1:**
Used ESM `from` syntax in a CommonJS file (`const { Markup } from 'telegraf'`).
Fix: Changed to `const { Markup } = require('telegraf')`.

**Bug 2 — `web/src/pages/Landing.jsx` missing dependency:**
Imported `lucide-react` icons but never installed the package. Vite build failed.
Fix: `npm install lucide-react` in `/web`.

Both fixes pushed in commit `5c0e5fd`. Render and Vercel should redeploy clean now.

**Verified locally:**
- `node -e "require('./src/commands/upgrade'); ..."` → all bot modules load OK
- `npm run build` in `/web` → `✓ built in 7.19s`, all assets generated
