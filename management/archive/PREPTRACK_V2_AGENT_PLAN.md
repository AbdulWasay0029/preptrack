# PrepTrack v2 — Agent Plan
> Paste this entire document as context into any AI agent.
> This supersedes the previous PREPTRACK_AGENT_PLAN.md.
> Read fully before writing a single line of code.

---

## What PrepTrack Is Now

PrepTrack is an AI-powered interview readiness platform for Indian CS students at tier 2-3 colleges. It is NOT a question sender. It is a coach.

The product answers one question: "Am I ready for this interview, and if not, what exactly do I do next?"

**Repo:** https://github.com/AbdulWasay0029/preptrack
**Live:** https://preptrack-hazel.vercel.app
**Bot:** @PrepTrackBot

---

## Locked Stack (Do Not Change)

| Layer | Technology |
|-------|-----------|
| Bot | Node.js + Telegraf v4 (CommonJS) |
| Backend | Node.js + Express (CommonJS) |
| Database | Neon PostgreSQL |
| Frontend | React + Vite + Tailwind CSS |
| AI Layer | Anthropic Claude API (claude-sonnet-4-20250514) |
| Payments | Razorpay |
| Hosting | Render (backend + bot) + Vercel (web) |

---

## What Already Exists (Do Not Rebuild)

- Full Express backend with user, question, progress, analytics, payment routes
- Telegraf bot with /start, /today, /progress, /settings, /help, /web, /suggest
- 384 questions across 15 companies in Neon PostgreSQL
- Adaptive engine in backend/src/services/adaptiveEngine.js
- React web dashboard (Landing, Login, Dashboard, Progress pages)
- Razorpay payment flow (needs live keys)
- Render + Vercel deployment live

---

## Immediate Bug Fixes (Do These First)

### Bug 1 — Duplicate questions in /today
File: `backend/src/services/adaptiveEngine.js`
In `selectDailyQuestions`, after building the question pool, deduplicate by ID:
```javascript
const unique = [...new Map(pool.map(q => [q.id, q])).entries()].map(([, q]) => q);
```
Use `unique` instead of `pool` when slicing to count.

### Bug 2 — /start message order
File: `bot/src/commands/start.js`
The company picker buttons and confirmation message are sending in wrong order.
Fix: only send picker buttons on /start. Confirmation ("✅ Target set to X") should only send inside the callback handler AFTER button tap, not on /start itself.

### Bug 3 — Company Pro flags
In the companies table, set is_pro_only = true for: Paytm, Razorpay (the company), Swiggy, Zomato, Uber, Salesforce.
Free companies: Amazon, Microsoft only.
Run UPDATE queries on Neon directly.

---

## Phase 1 — Diagnostic Assessment

This is the most important new feature. Build this before anything else.

### What it does
User completes a 5-question timed diagnostic on the web. Each question has a 15-minute timer. User types their approach (not actual code execution — just explanation of approach). Claude API evaluates the response and gives a score + feedback. Overall readiness score (0-100%) generated and stored.

### New DB tables needed

Add to database/schema.sql and run migration on Neon:

```sql
CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  target_company_id INTEGER REFERENCES companies(id),
  overall_score INTEGER,
  topic_scores JSONB,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_responses (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER REFERENCES assessments(id),
  question_id INTEGER REFERENCES questions(id),
  user_response TEXT,
  ai_score INTEGER,
  ai_feedback TEXT,
  time_taken_seconds INTEGER
);
```

### New backend routes needed

Add to `backend/src/routes/assessments.js` (new file):

```
POST /assessments/start         — create new assessment, return 5 questions
POST /assessments/:id/respond   — submit response to one question, call Claude API, store score
POST /assessments/:id/complete  — calculate overall score, update user readiness score
GET  /assessments/:user_id/latest — get latest assessment result
```

Mount in backend/src/index.js:
```javascript
const assessmentRoutes = require('./routes/assessments');
app.use('/assessments', assessmentRoutes);
```

### Claude API call for scoring

In `backend/src/routes/assessments.js`, POST /assessments/:id/respond:

```javascript
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const message = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: `You are evaluating a DSA interview response from a computer science student.

Problem: ${question.title} (${question.difficulty})
Topic: ${question.topic}

Student's response: "${userResponse}"

Evaluate this response on:
1. Correctness of approach (did they identify the right algorithm/pattern?)
2. Complexity awareness (do they mention time/space complexity?)
3. Communication clarity (is their explanation understandable?)

Respond with ONLY valid JSON, no explanation:
{
  "score": <integer 0-100>,
  "feedback": "<2 sentence actionable feedback>",
  "approach_correct": <true/false>,
  "mentioned_complexity": <true/false>
}`
    }
  ]
});

const result = JSON.parse(message.content[0].text);
```

### New env variable needed

```
# backend/.env
ANTHROPIC_API_KEY=sk-ant-...
```

Add to Render backend environment variables.

### Web UI for diagnostic

New file: `web/src/pages/Diagnostic.jsx`

Flow:
1. User lands on /diagnostic
2. Sees: "5 questions, 15 minutes each, type your approach" explanation
3. Clicks Start
4. Question appears with 15-minute countdown timer
5. User types approach in textarea
6. Clicks Submit → next question
7. After 5 questions: loading state while AI scores
8. Results page: overall score, topic breakdown, feedback per question

Add route in App.jsx: `/diagnostic`

Design: same dark theme as rest of app. Timer in top right, red when under 2 minutes.

### Bot integration

Add to `bot/src/commands/` a new file `assess.js`:
```javascript
module.exports = async (ctx) => {
  const webUrl = process.env.WEB_URL || 'https://preptrack-hazel.vercel.app';
  await ctx.reply(
    `📊 *Readiness Assessment*\n\nFind out exactly where you stand before your placement interviews.\n\n` +
    `Takes 20-30 minutes. 5 questions, AI-evaluated.\n\n` +
    `[Start your assessment](${webUrl}/diagnostic)`,
    { parse_mode: 'Markdown' }
  );
};
```
Register in index.js: `bot.command('assess', assessCommand);`

---

## Phase 2 — Pattern Curriculum

Build after Phase 1 is complete and tested.

### New DB tables

```sql
CREATE TABLE IF NOT EXISTS patterns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  when_to_use TEXT,
  order_index INTEGER
);

CREATE TABLE IF NOT EXISTS pattern_questions (
  pattern_id INTEGER REFERENCES patterns(id),
  question_id INTEGER REFERENCES questions(id),
  order_index INTEGER,
  PRIMARY KEY (pattern_id, question_id)
);

CREATE TABLE IF NOT EXISTS user_pattern_progress (
  user_id INTEGER REFERENCES users(id),
  pattern_id INTEGER REFERENCES patterns(id),
  questions_completed INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  PRIMARY KEY (user_id, pattern_id)
);
```

### Seed the 15 patterns

Insert into patterns table:
Sliding Window, Two Pointers, Fast/Slow Pointers, Merge Intervals, Cyclic Sort, In-place Reversal, Tree BFS, Tree DFS, Two Heaps, Subsets, Binary Search, Top K Elements, K-way Merge, Dynamic Programming, Graphs

Then map existing questions to patterns via pattern_questions table based on their topic.

### New backend routes

```
GET  /patterns                          — list all patterns with user progress
GET  /patterns/:slug                    — pattern detail + questions in order
POST /patterns/:slug/progress           — mark question complete in pattern
```

### Web UI

New page: `web/src/pages/Curriculum.jsx`
- Grid of 15 pattern cards
- Each card: pattern name, description, progress bar (X/5 questions done)
- Click → pattern detail page with explanation + problem list

New page: `web/src/pages/PatternDetail.jsx`
- Pattern explanation at top (what it is, when to use it)
- Problem list below in order
- Each problem: title, difficulty badge, LeetCode link, mark complete button

---

## Phase 3 — AI Mock Interview

Build after Phase 2. This is the core differentiator.

### How it works

1. User clicks "Start Mock Interview" on web
2. Picks company + difficulty
3. System selects a question from that company's pool
4. Timer starts (45 minutes)
5. Question shown left side, chat interface right side
6. User types their approach
7. Claude API responds as interviewer with follow-up questions
8. 3-4 exchanges then final feedback

### New DB table

```sql
CREATE TABLE IF NOT EXISTS mock_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  company_id INTEGER REFERENCES companies(id),
  question_id INTEGER REFERENCES questions(id),
  transcript JSONB DEFAULT '[]',
  final_feedback TEXT,
  score INTEGER,
  duration_seconds INTEGER,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

### New backend routes

```
POST /mock/start                — create session, return question
POST /mock/:id/message          — send message, get AI interviewer response
POST /mock/:id/complete         — end session, generate final feedback
GET  /mock/:user_id/history     — past mock sessions
```

### Claude API system prompt for mock interviewer

```javascript
const systemPrompt = `You are a senior software engineer at ${company} conducting a technical phone screen.
The candidate is a computer science student applying for an SDE internship or entry-level role.
The problem you've given them is: "${question.title}" — ${question.difficulty} difficulty.

Your role:
- Ask one question at a time
- If they give a brute force, ask if they can optimize
- Always ask about time and space complexity
- Ask about edge cases they haven't considered
- Be professional, not warm or encouraging — this is a real interview
- After 3-4 exchanges, give a final assessment in this format:

FINAL ASSESSMENT:
Approach: [correct/partially correct/incorrect]
Communication: [clear/needs improvement]
Complexity awareness: [good/needs work]
Overall: [hire/no hire/maybe]
Feedback: [2-3 sentences of specific actionable feedback]`;
```

### Web UI

New page: `web/src/pages/MockInterview.jsx`
- Split layout: question panel left (40%), chat panel right (60%)
- Timer top right, turns red under 5 minutes
- Chat: user messages right-aligned, interviewer left-aligned
- Input box at bottom with Send button
- End Interview button top left
- After session: redirect to feedback page

---

## Phase 4 — Readiness Dashboard

Replace current streak dashboard with readiness-based view.

### Readiness score calculation

```javascript
function calculateReadiness(user) {
  const diagnosticWeight = 0.40;
  const mockWeight = 0.35;
  const curriculumWeight = 0.25;

  const diagnosticScore = user.latestAssessment?.overall_score || 0;
  const mockAverage = user.mockSessions?.length > 0
    ? user.mockSessions.reduce((sum, s) => sum + s.score, 0) / user.mockSessions.length
    : 0;
  const curriculumScore = (user.patternsCompleted / 15) * 100;

  return Math.round(
    (diagnosticScore * diagnosticWeight) +
    (mockAverage * mockWeight) +
    (curriculumScore * curriculumWeight)
  );
}
```

### Dashboard changes

Update `web/src/pages/Dashboard.jsx`:
- Replace streak card with readiness score (big number, 0-100%)
- Add "Next recommended action" card (always one clear thing)
- Add recent mock session scores
- Add pattern curriculum progress bar
- Keep today's questions section but make it secondary

---

## Code Conventions (Mandatory)

- All Node.js: CommonJS (require/module.exports)
- React: ESM (Vite default)
- Error handling: try/catch on every async handler, console.error, return 500 JSON
- Bot never touches DB — always calls backend via bot/src/utils/api.js
- Telegram IDs are BIGINT — always number, never string
- Claude API calls happen in backend only, never in frontend

---

## Environment Variables (Add These)

```
# backend/.env + Render
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Priority Order

1. Fix 3 bugs (duplicates, message order, Pro flags) — today
2. Add ANTHROPIC_API_KEY to backend env
3. Build Phase 1 (diagnostic assessment) — this week
4. Test diagnostic with real users
5. Build Phase 2 (pattern curriculum) — next week
6. Build Phase 3 (mock interview) — week after
7. Build Phase 4 (readiness dashboard) — final week

---

## Session Log

### 2026-05-11 — Product Pivot (Abdul + Claude)
PrepTrack pivoted from "daily question sender" to "AI interview readiness coach."
Core insight: the target user (Abdul himself) would not use the original product.
Real problem identified: students don't know if they're ready, can't handle unseen problems, have never experienced interview pressure.
New vision: 5-layer coach system (Assess → Learn → Practice → Feedback → Track).
Pricing revised from ₹199 to ₹499/month.
This agent plan supersedes all previous versions.
