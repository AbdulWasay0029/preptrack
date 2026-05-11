# PrepTrack — Phase 2 Agent Plan
> Paste this entire document as context into any AI agent (Antigravity, Cursor, ChatGPT, Gemini).
> Read it fully before writing a single line of code.

---

## What PrepTrack Is

Adaptive placement prep platform for Indian CS students at tier 2–3 colleges.
- Telegram bot = daily interaction layer
- Web dashboard = analytics layer
- Express backend = business logic + adaptive engine
- Core differentiator = weak topic detection (adjusts future questions based on what you keep getting stuck on)

**Live URLs:**
- Bot: @PrepTrackBot
- Web: https://preptrack-hazel.vercel.app
- Repo: https://github.com/AbdulWasay0029/preptrack

---

## Current Stack (LOCKED — do not change)

| Layer | Technology |
|-------|-----------|
| Bot | Node.js + Telegraf v4 (CommonJS) |
| Backend | Node.js + Express (CommonJS) |
| Database | Neon PostgreSQL |
| Frontend | React + Vite + Tailwind CSS |
| Payments | Razorpay |
| Hosting | Render (backend + bot) + Vercel (web) |

---

## What Is Already Built

### Backend (`/backend/`) — COMPLETE
- Express server with all routes: users, questions, progress, analytics, payments
- Adaptive engine: calculateWeakTopics, selectDailyQuestions, refreshWeakTopicCache
- Internal auth (Bearer token between bot and backend)
- Razorpay order creation + verification endpoints (coded, not live — needs real keys)

### Bot (`/bot/`) — MOSTLY COMPLETE
- /start, /today, /progress, /settings, /help, /web commands
- Inline keyboard callbacks (Solved/Stuck/Skip)
- Scheduler exists but IS A PLACEHOLDER — daily auto-delivery is NOT working

### Web (`/web/`) — BASIC
- Login.jsx (Telegram magic link auth)
- Dashboard.jsx (streak + today's questions)
- Progress.jsx (weak topics + activity charts)
- Dark theme: bg #0f0f0f, cards #1a1a1a, accent #22c55e

### Database — SEEDED
- 8 companies, 13 topics, 77 questions
- Schema: companies, topics, questions, company_questions, users, user_progress, daily_deliveries, user_weak_topics, payments

---

## What You Are Building Now (Phase 2)

Complete these in exact priority order. Do not skip ahead.

---

## TASK 1 — Fix Daily Scheduler (CRITICAL)

**File:** `bot/src/utils/scheduler.js`

**Problem:** Scheduler is a placeholder. Users must type /today manually. The "daily" part doesn't work.

**What to build:**
- Use node-cron to run at 9:00 AM IST daily (cron: `0 3 * * *` — IST is UTC+5:30)
- Query all active users from backend: `GET /users/active` (add this endpoint if missing)
- For each user, call `GET /questions/daily/:telegram_id`
- Send questions to each user via bot.telegram.sendMessage
- Handle errors gracefully — if one user fails, continue to next

**New backend endpoint needed:** `GET /users/active`
- Returns all users with `last_active_date` within last 7 days
- Auth: internal
- Response: array of `{ telegram_id, name }`

**Code convention:** CommonJS only. Same error handling pattern as existing routes.

---

## TASK 2 — Fix Name Bug in Web Dashboard

**File:** `backend/src/routes/analytics.js`

**Problem:** Dashboard shows "Welcome back, User!" — name is not returning.

**Fix:** The analytics query is not joining the users table properly or not returning the `name` field. Check the SQL query in the analytics route — ensure `users.name` is selected and returned in the response object under `user.name`.

---

## TASK 3 — Expand Question Dataset to 300+

**Current:** 77 questions, 8 companies
**Target:** 300+ questions, 15 companies

**New companies to add:**
- Swiggy
- Zomato  
- Paytm
- PhonePe
- Razorpay (the company)
- Uber India
- Salesforce India

**Method:**
Use this exact prompt in Google AI Studio / Gemini for each company:

```
Generate 20 DSA interview questions commonly asked at [COMPANY] in India for software engineering roles.
For each question provide:
- title (exact LeetCode problem name if it exists)
- leetcode_link (full URL if exists, else null)
- difficulty (easy/medium/hard)
- topic (one of: arrays, strings, linked-lists, trees, graphs, dynamic-prog, stacks-queues, binary-search, greedy, backtracking, heap, sorting, design)
- frequency (1-5, how commonly this appears in real interviews, 5 = very common)

Return ONLY a valid JSON array. No explanation, no markdown, no backticks.
```

**After generating:**
Add to `database/seed/questions.sql` in the same format as existing entries.
Run `node database/seed-neon.js` to push to production.

---

## TASK 4 — Build Landing Page

**File:** Create `web/src/pages/Landing.jsx`
**Update:** `web/src/App.jsx` — make `/` render Landing.jsx, move dashboard to `/dashboard`

**Landing page sections (in order):**

### Hero
- Headline: "Stop grinding randomly. Start fixing your weaknesses."
- Sub: "PrepTrack sends you company-specific DSA questions daily and adapts to what you keep getting stuck on."
- Primary CTA button: "Start Free on Telegram" → links to https://t.me/PrepTrackBot
- Secondary CTA: "View Dashboard" → /dashboard

### How It Works (3 steps)
1. Pick your target company (Amazon, Microsoft, and more)
2. Get 3 questions daily, mark Solved / Stuck / Skip
3. PrepTrack detects your weak topics and adjusts tomorrow's questions

### Companies Supported
Grid of company logos or names: Amazon, Microsoft, Google (Pro), Flipkart (Pro), Walmart (Pro), Adobe (Pro), Atlassian (Pro), Intuit (Pro), Swiggy (Pro), Zomato (Pro)

### Pricing
Two cards side by side:

**Free**
- ₹0/month
- 3 questions/day
- Amazon + Microsoft
- Basic progress tracking

**Pro — ₹199/month**
- Unlimited questions
- All 15+ companies
- Weak topic analysis
- Adaptive daily plan
- CTA: "Upgrade to Pro" (links to bot /web command)

### Social Proof
Empty for now. Placeholder: "Join students from CMRIT, VIT, CBIT and more."

### FAQ
- Is it really free? Yes, forever for Amazon + Microsoft.
- How does the adaptive engine work? It tracks which topics you mark as Stuck or Skip and weights future questions toward those areas.
- Do I need to install anything? No. Just Telegram.
- What's the difference between Free and Pro? Company access and question volume.

**Design rules:**
- Dark theme only: bg #0f0f0f, sections alternate #0f0f0f and #111111
- Accent: #22c55e (green-500)
- Font: system font stack, no Google Fonts import needed
- Mobile first — most visitors on phone
- No animations, keep it fast
- Tailwind only, no external CSS libraries

---

## TASK 5 — Razorpay Live Integration

**Prerequisites:** Razorpay account with PAN + bank account verified. Get live API keys.

**Step 1:** Update environment variables
```
# backend/.env and Render environment
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
```

**Step 2:** Add webhook endpoint
File: `backend/src/routes/payments.js`
Add: `POST /payments/webhook`
- Verify Razorpay webhook signature using `razorpay.webhooks.verifyPaymentSignature`
- On `payment.captured` event: set `is_pro = true` for the user
- This is the backup for if the verify endpoint is missed

**Step 3:** Add Pro upgrade flow to bot
In `bot/src/commands/settings.js` or a new `upgrade.js`:
- /upgrade command
- Bot sends message: "Upgrade to PrepTrack Pro for ₹199/month"
- Button: "Pay Now" → calls backend POST /payments/create-order → returns Razorpay checkout URL
- After payment: bot confirms "You're now Pro! All companies unlocked."

**Step 4:** Add upgrade button to web dashboard
In `web/src/pages/Dashboard.jsx`:
- If `user.is_pro === false`: show "Upgrade to Pro — ₹199/month" button
- On click: POST to /payments/create-order → open Razorpay checkout widget

---

## TASK 6 — Web Onboarding Flow

**Problem:** New users who land on web dashboard have no guidance.

**File:** Update `web/src/pages/Login.jsx`

After successful Telegram login, if user has no target_company set:
- Show company selection UI (same companies as bot)
- User picks company → PATCH /users/:telegram_id with target_company_slug
- Then redirect to /dashboard

---

## TASK 7 — LinkedIn Share Card for Streaks

When user hits 7-day streak, bot sends:
"🔥 7-day streak! Share your progress:"
[Share on LinkedIn] button → opens pre-filled LinkedIn post:

```
Day 7 of my placement prep streak on PrepTrack 🔥

Practicing Amazon DSA questions daily.
My weak area this week: Dynamic Programming

Free tool for CS students: @PrepTrackBot
#PlacementPrep #DSA #IndiaJobs
```

**Implementation:** Generate a URL-encoded LinkedIn share link. No API needed.
`https://www.linkedin.com/sharing/share-offsite/?url=https://preptrack-hazel.vercel.app&summary=<encoded_text>`

---

## TASK 8 — Community Question Submission

**Bot command:** /suggest
- User sends: /suggest <leetcode_link>
- Bot saves to a `suggestions` table (create this table)
- Admin reviews and adds to main dataset

**New table:**
```sql
CREATE TABLE suggestions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  leetcode_link VARCHAR(500),
  company VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

---

## Code Conventions (Mandatory)

- ALL Node.js files (bot + backend): CommonJS only — `require()` / `module.exports`
- React files: ESM (Vite default)
- Error handling: try/catch on every async handler
  ```js
  } catch (err) {
    console.error('route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
  ```
- Bot never touches DB directly — always calls backend via `bot/src/utils/api.js`
- Telegram IDs are BIGINT — always number, never string
- No new npm packages without checking if existing ones cover the need

---

## Environment Variables Reference

### backend/.env
```
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
INTERNAL_API_SECRET=<32+ char string>
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
TELEGRAM_BOT_TOKEN=<bot token>
WEB_URL=https://preptrack-hazel.vercel.app
```

### bot/.env
```
TELEGRAM_BOT_TOKEN=<bot token>
BACKEND_URL=https://preptrack-backend.onrender.com
INTERNAL_API_SECRET=<same as backend>
DAILY_CRON=0 3 * * *
```

### web/.env
```
VITE_API_URL=https://preptrack-backend.onrender.com
VITE_TELEGRAM_BOT_NAME=PrepTrackBot
```

---

## API Endpoints Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | none | Health check |
| POST | /users | internal | Create/upsert user |
| GET | /users/:tid | internal | Get user |
| PATCH | /users/:tid | internal | Update settings |
| GET | /users/active | internal | Get users active in last 7 days (NEW) |
| POST | /users/auth/telegram | none | Web login |
| GET | /questions/companies | none | List companies |
| GET | /questions/daily/:tid | internal | Get today's questions |
| POST | /progress | internal | Record answer |
| GET | /progress/:tid/summary | internal | Bot /progress data |
| GET | /analytics/:tid | internal | Full web dashboard data |
| POST | /payments/create-order | none | Create Razorpay order |
| POST | /payments/verify | none | Verify payment |
| POST | /payments/webhook | none | Razorpay webhook (NEW) |

---

## Session Log

### 2026-05-10 — Phase 1 Complete
- Full codebase built by Antigravity
- Deployed to Render + Vercel
- Bot, web, backend all live and tested
- 77 questions seeded

### 2026-05-10 — Phase 2 Plan Created (Claude)
- Full roadmap written
- 8 tasks defined and prioritized
- Notion updated with roadmap + all docs
- This agent plan generated

### 2026-05-10 — Phase 2 Complete (Antigravity)
- Task 1: Fixed Daily Scheduler
- Task 2: Fixed Name Bug in Web Dashboard
- Task 3: Expanded Question Dataset to 300+ and seeded to Neon DB
- Task 4: Built Landing Page and updated web routes
- Task 5: Razorpay Integration added to webhook and dashboard / bot
- Task 6: Web Onboarding Flow forced company selection
- Task 7: LinkedIn Share Card for Streaks added
- Task 8: Community Question Submission added via /suggest and DB

---

## Start Here

All Phase 2 tasks are completed! Product is fully ready.
