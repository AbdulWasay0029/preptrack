# PrepTrack V2 — Product Requirements Document
> For: Antigravity (builder agent)
> Written by: Claude (lead developer/manager)
> Last updated: 2026-05-13
> This document is the single source of truth. When in doubt, come back here.

---

## WHO YOU ARE AND HOW YOU THINK

You are Antigravity — a senior full-stack builder. You are NOT an architect. You are NOT a product manager. You are NOT a designer.

Your job is to implement exactly what this document says, in the order this document says it, using the stack this document specifies.

**The mindset you must hold at all times:**

You will encounter ambiguity. The codebase is fragmented. Some files contradict each other. Some features are partially built. When this happens, you do not improvise a new architecture. You do not go beyond your current task. You fix the immediate problem cleanly and document what you found in HANDOFF.md.

Before writing a single line of code, ask yourself: "Does this serve the exact task I was given?" If the answer is no, stop.

When you finish a task, you update HANDOFF.md with: what you built, what files you touched, what you broke (if anything), and what is still pending. This is non-negotiable. A session without an updated HANDOFF.md is a failed session.

You do not make product decisions. If the spec says the diagnostic has 5 questions, it has 5 questions. You do not decide it should have 3 "to reduce friction." That's not your call.

You do not over-engineer. No TypeScript migrations unless explicitly asked. No new libraries unless the spec mentions them. No refactoring code you weren't asked to touch.

You write clean, consistent code. Every new file you create must use the design system tokens defined in Section 4. No inline hex values. No custom pixel values outside the spacing scale.

---

## SECTION 1 — WHAT PREPTRACK IS

PrepTrack is an AI-powered interview readiness platform for Indian CS students at tier 2-3 colleges who are 3 months from placement season.

The core problem it solves: Students don't know if they are ready. They don't know what companies actually ask. They can't construct solutions to problems they haven't seen before. They've never experienced what an interview actually feels like.

PrepTrack solves this through four things that work together:

1. **Diagnostic Assessment** — An honest readiness score. 5 questions, AI-evaluated, tells you where you stand.
2. **Pattern Curriculum** — Structured learning around 15 DSA patterns that cover 80% of placement interviews. Not random questions. Ordered, progressively harder, pattern-first.
3. **AI Mock Interview** — A simulated interview with an AI that asks follow-up questions, evaluates your explanation, and gives feedback on communication, not just correctness.
4. **Readiness Dashboard** — A single screen showing your current readiness score, what to work on next, and your history.

These four features are not independent pages. They are a loop. Diagnostic sets your baseline. Curriculum improves it. Mock Interview tests it under pressure. Dashboard tracks all of it.

**The web app is the primary product.** The Telegram bot is a notification layer only — it pings users to come back to the web app. Do not add features to the bot unless explicitly instructed.

---

## SECTION 2 — THE USER FLOW (RESOLVED)

The strategic dilemma in the HANDOFF (assessment-first vs curriculum-first) is resolved. Here is the answer and the reasoning.

**The flow is: Soft Gate → Assessment → Curriculum → Mock.**

This is how it works:

A new user lands on the app. They see the dashboard in a "not assessed" state. The readiness score circle shows "?" instead of a number. A single prominent card says: "Find out where you stand. Take the 5-minute diagnostic." There is a secondary link: "Skip for now — show me the curriculum."

This is not forcing the assessment. It is leading with it. Most motivated users (the target audience is students in serious prep mode, not casual browsers) will take it. Students who skip it land on the curriculum with a "0% Readiness — Take the diagnostic to unlock your score" banner at the top.

Why this works: The assessment creates the score. The score creates a reason to care about the curriculum. Without the score, the curriculum is just another question list. The score is the hook. But forcing it on mobile with a 20-minute test before anything loads is a guaranteed high bounce rate. The soft gate preserves the hook while eliminating the drop-off risk.

**The LeetCode IDE interface from the Stitch designs** goes in the Pattern Detail page (inside curriculum), not in the mock interview. When a student opens a specific pattern and clicks a question, they get the split-screen: problem statement left, code area right. This makes pattern practice feel real without requiring an AI session.

---

## SECTION 3 — TECH STACK (LOCKED, DO NOT CHANGE)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Bot | Node.js + Telegraf v4 | CommonJS only. require/module.exports. |
| Backend | Node.js + Express | CommonJS only. Runs on Render. |
| Database | PostgreSQL via Neon | pg pool. Never change the DB driver. |
| Frontend | React + Vite + Tailwind CSS | JSX only. No TypeScript. Deployed on Vercel. |
| AI | Google Gemini 1.5 Flash | gemini-1.5-flash model. Backend only. Never in frontend. |
| Payments | Razorpay | Already integrated. Do not touch unless instructed. |

**Critical rules:**

All Gemini API calls go through the backend. The API key must never touch the frontend. If you see Gemini calls in frontend files, move them to a backend route and call that route from the frontend instead.

Do not introduce TypeScript. The codebase has .tsx files from a parallel build. See Section 5 for how to handle them.

Do not add new npm packages without documenting what you added and why in HANDOFF.md.

---

## SECTION 4 — DESIGN SYSTEM (MANDATORY, COPY ONCE)

This goes into `web/tailwind.config.js`. Do not modify these values. Do not use any color, spacing, or font value not in this system.

```javascript
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#091009",
        "surface-container-low": "#161d16",
        "surface-container": "#1a211a",
        "outline": "#869585",
        "primary-container": "#4be277",
        "surface-container-high": "#252c24",
        "surface-container-highest": "#2f372e",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        "secondary-container": "#3d4a3d",
        "on-secondary": "#273327",
        "on-background": "#dde5d9",
        "surface": "#0e150e",
        "primary": "#6fff92",
        "on-primary": "#003915",
        "on-primary-container": "#006129",
        "primary-fixed-dim": "#4ae176",
        "on-surface-variant": "#bccbb9",
        "outline-variant": "#3d4a3d",
        "tertiary": "#ffddc7",
        "tertiary-container": "#ffb885",
        "on-tertiary": "#4f2500",
        "on-tertiary-container": "#79471d",
        "background": "#0e150e",
        "on-secondary-container": "#abb9a8",
        "on-surface": "#dde5d9",
        "surface-variant": "#2f372e",
        "secondary": "#bccbb9",
        "inverse-on-surface": "#2b322a"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "unit_lg": "24px",
        "unit_xxl": "48px",
        "base": "16px",
        "unit_sm": "8px",
        "page_padding": "24px",
        "unit_xs": "4px",
        "unit_xl": "32px",
        "unit_md": "16px"
      },
      fontFamily: {
        "sans": ["Inter", "system-ui", "sans-serif"]
      },
      fontSize: {
        "display": ["40px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "label-bold": ["14px", {"lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "700"}],
        "label-md": ["12px", {"lineHeight": "1.2", "fontWeight": "500"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
        "headline-sm": ["20px", {"lineHeight": "1.4", "fontWeight": "600"}],
        "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-lg": ["32px", {"lineHeight": "1.25", "letterSpacing": "-0.01em", "fontWeight": "600"}]
      }
    }
  }
}
```

Add to `web/index.html` head:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

Add to `web/src/index.css`:
```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #3d4a3d; border-radius: 10px; }
```

**Component rules (apply everywhere, no exceptions):**
- Cards: `bg-surface-container border border-outline-variant rounded-lg p-unit_md` or `p-unit_xl`
- Primary buttons: `bg-primary text-on-primary font-bold rounded active:scale-95 transition-all px-unit_lg py-unit_sm`
- Ghost buttons: `border border-outline-variant text-on-surface-variant rounded px-unit_lg py-unit_sm`
- Inputs: `bg-surface-container border border-outline-variant text-on-surface rounded p-unit_md w-full`
- Page wrapper: `min-h-screen bg-background text-on-surface px-page_padding`
- Bottom nav: always present on mobile (below md breakpoint), hidden on desktop
- Top nav: always present on desktop (md and above), hidden on mobile

---

## SECTION 5 — IMMEDIATE CLEANUP TASK (DO THIS BEFORE ANYTHING ELSE)

The codebase has duplicate files. This must be resolved before any feature work.

**Rule: JSX wins. Delete all .tsx files.**

The reason: The Diagnostic.jsx and Login.jsx files are JSX-only, meaning the original project was JSX. The .tsx files came from a parallel build in Google AI Studio. We are not migrating to TypeScript. Delete the .tsx files and standardize on JSX.

Steps:
1. Open `/web/src/pages/`
2. For each duplicate pair, examine both files. Take the better-implemented one (more complete UI, better logic) and save its content.
3. Delete ALL .tsx files: `Dashboard.tsx`, `Landing.tsx`, `Progress.tsx`, `Curriculum.tsx`, `Lesson.tsx`, `Mock.tsx`
4. If the .tsx version had better code than the .jsx version for any file, overwrite the .jsx file with that code (converted to JSX — remove type annotations)
5. Update `web/src/App.jsx` to import only .jsx files with no type extensions in import paths
6. Verify the app builds with `npm run build` from `/web`
7. Document every file you deleted and every file you modified in HANDOFF.md

Do not touch backend or bot during this task.

---

## SECTION 6 — PHASE 1: DIAGNOSTIC ASSESSMENT

Build this after the cleanup task is done and the app builds cleanly.

### What it is

A 5-question timed assessment. The user explains their approach to each problem in plain text. Gemini evaluates the explanation and returns a topic score. At the end, the user sees an overall readiness score (0-100) and a topic breakdown.

### Database migrations (run on Neon before building backend)

```sql
CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  company_id INTEGER REFERENCES companies(id),
  score INTEGER,
  topic_scores JSONB DEFAULT '{}',
  responses JSONB DEFAULT '[]',
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_questions (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id),
  assessment_id INTEGER REFERENCES assessments(id),
  user_response TEXT,
  ai_score INTEGER,
  ai_feedback TEXT,
  time_spent_seconds INTEGER
);
```

### Backend routes: `backend/src/routes/assessment.js`

```
POST /assessment/start
  Body: { telegramId, companyId }
  Returns: { assessmentId, questions: [5 questions from company's pool, ordered easy to hard] }

POST /assessment/:id/submit-answer
  Body: { questionId, response, timeSpent }
  Action: Calls Gemini to score the response, saves result
  Returns: { score, feedback, nextQuestion (or null if last) }

POST /assessment/:id/complete
  Body: { telegramId }
  Action: Calculates overall score from topic_scores, saves to assessments table
  Returns: { overallScore, topicScores, responses }

GET /assessment/:telegramId/latest
  Returns: most recent completed assessment for user
```

### Gemini scoring prompt (use exactly this in `backend/src/services/geminiScorer.js`)

```javascript
const scoreResponse = async (questionTitle, difficulty, topic, userResponse) => {
  const prompt = `
You are evaluating a student's DSA interview answer for placement preparation.

Problem: "${questionTitle}" (${difficulty}, topic: ${topic})
Student's response: "${userResponse}"

Score this response from 0-100 based on:
- Correctness of approach (40 points): Does the student understand the right algorithm/pattern?
- Completeness (30 points): Did they mention time/space complexity? Edge cases?
- Communication clarity (30 points): Is the explanation clear enough for an interviewer?

Return ONLY a valid JSON object in this exact format, no other text:
{
  "score": <integer 0-100>,
  "feedback": "<2 sentences max: what they got right, what they missed>",
  "pattern_identified": <true|false>
}
`;
  // call Gemini with this prompt, parse JSON response, return it
};
```

### Frontend: `web/src/pages/Diagnostic.jsx`

States the component must handle:
1. **Loading** — fetching questions from backend, show skeleton
2. **Intro** — before starting, show: "5 questions. Explain your approach. No code needed. 5 minutes per question." + "Start Assessment" button
3. **Active question** — question card + textarea + timer + Submit button
4. **Timer warning** — when timer < 2 minutes, timer text turns `text-error`, textarea border turns `border-error`
5. **Scoring** — after submitting each answer, show loading state while Gemini scores
6. **Results** — score circle + topic breakdown + per-question accordion

Timer implementation:
```javascript
const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 min per question
useEffect(() => {
  if (timeLeft <= 0) handleSubmit();
  const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
  return () => clearInterval(interval);
}, [timeLeft]);
const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
const isWarning = timeLeft < 120;
```

Score circle color logic:
- score > 70: `text-primary` (green)
- score 40-70: `text-tertiary` (orange)
- score < 40: `text-error` (red)

Results page must show:
- Large score circle in the center top
- "Your readiness score for [Company Name]" subtitle
- Topic breakdown as horizontal progress bars (one per topic that appeared in the assessment)
- Per-question accordion (click to expand: shows the question title, user's response, AI feedback, and score for that question)
- Primary CTA button: "Start Pattern Training" → routes to `/curriculum`
- Secondary link: "Retake Assessment" → resets and restarts

Add route in `web/src/App.jsx`:
```jsx
<Route path="/diagnostic" element={<Diagnostic />} />
```

---

## SECTION 7 — PHASE 2: PATTERN CURRICULUM

Build after Phase 1 is tested and working. Do not start this until Abdul confirms Phase 1 is live and at least 3 real students have used it.

### Database migrations

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

Seed 15 patterns:
```sql
INSERT INTO patterns (name, slug, description, when_to_use, order_index) VALUES
('Sliding Window','sliding-window','Find subarrays satisfying given conditions','Finding longest/shortest substring or subarray',1),
('Two Pointers','two-pointers','Two pointers moving toward each other or same direction','Sorted arrays, pairs/triplets problems',2),
('Fast & Slow Pointers','fast-slow-pointers','Pointers at different speeds through the same structure','Cycle detection in linked lists',3),
('Merge Intervals','merge-intervals','Dealing with overlapping intervals','Merging, inserting, or checking interval overlap',4),
('Binary Search','binary-search','Divide and conquer on sorted or monotonic data','O(log n) search, rotated arrays, answer-space search',5),
('Tree BFS','tree-bfs','Level-order traversal using a queue','Traverse tree level by level, shortest path in unweighted graph',6),
('Tree DFS','tree-dfs','Depth-first traversal with recursion or stack','Path finding, tree structure problems, root-to-leaf paths',7),
('Dynamic Programming','dynamic-programming','Overlapping subproblems with optimal substructure','Optimization, counting, decision problems with repeated subproblems',8),
('Graphs','graphs','BFS/DFS on graph structures','Connectivity, shortest path, cycle detection, topological sort',9),
('Top K Elements','top-k-elements','Use a heap to maintain K extreme elements','Kth largest/smallest, top K frequent, stream problems',10),
('Two Heaps','two-heaps','Min heap and max heap partition to track median','Median in a stream, balancing two groups',11),
('Subsets','subsets','Generate all subsets or permutations recursively','Permutation, combination, power set problems',12),
('Greedy','greedy','Make locally optimal choice at each step','Interval scheduling, coin change (greedy), activity selection',13),
('Backtracking','backtracking','Explore all possibilities, prune dead ends','N-Queens, Sudoku, word search, constraint satisfaction',14),
('In-place Reversal','in-place-reversal','Reverse linked list or array without extra space','Reversing groups, rotating arrays/lists',15)
ON CONFLICT DO NOTHING;
```

### Backend routes: `backend/src/routes/patterns.js`

```
GET  /patterns                        — list all patterns + user's progress on each
GET  /patterns/:slug                  — pattern detail + ordered question list + user completion per question
POST /patterns/:slug/complete/:qid    — mark a specific question complete for user
```

### Frontend pages

`web/src/pages/Curriculum.jsx` — grid of 15 pattern cards. Each card shows: name, one-line description, X/5 questions completed, lock status (locked if previous pattern not completed), completion checkmark if done.

`web/src/pages/PatternDetail.jsx` — split layout. Left: question list with difficulty badges and LeetCode links. Right (desktop only): pattern explanation + "when to use" box + user's progress stats. On mobile, question list is full width, pattern explanation is a collapsible card at top.

When a student clicks a question, open the LeetCode link in a new tab. The "Mark Complete" button is independent of whether they opened the link — it is on the trust system. The platform trusts the student to mark it complete when they've actually solved it.

---

## SECTION 8 — PHASE 3: AI MOCK INTERVIEW

Build after Phase 2 is tested. This is the premium feature — it is what justifies charging ₹499/month.

### Database migrations

```sql
CREATE TABLE IF NOT EXISTS mock_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  company_id INTEGER REFERENCES companies(id),
  question_id INTEGER REFERENCES questions(id),
  transcript JSONB DEFAULT '[]',
  final_feedback TEXT,
  score VARCHAR(20),
  duration_seconds INTEGER,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

### Backend routes: `backend/src/routes/mock.js`

```
POST /mock/start           — create session, assign a question appropriate to user's level, return it
POST /mock/:id/message     — user sends a message, Gemini responds as interviewer
POST /mock/:id/complete    — end session, generate final feedback from full transcript
GET  /mock/:telegramId/history — list of past sessions with scores
```

### Gemini interviewer system prompt (use exactly this)

```
You are a senior software engineer at {company} conducting a technical phone screen for an SDE1 role.

Problem assigned: "{questionTitle}" — difficulty: {difficulty}

Your behavior:
- Start by presenting the problem and asking if they have any clarifying questions.
- Ask ONE follow-up question at a time. Never multiple.
- Guide them from brute force toward an optimal solution.
- Always eventually ask about time and space complexity.
- Ask about at least one edge case.
- Be professional and neutral. Not warm, not hostile.
- After 4-6 exchanges, wrap up with FINAL_ASSESSMENT on its own line.

FINAL_ASSESSMENT format:
Verdict: [Strong Hire / Hire / Maybe / No Hire]
Approach: [correct / partially correct / incorrect]
Communication: [clear / needs improvement / unclear]
Complexity awareness: [mentioned unprompted / mentioned when asked / not mentioned]
Feedback: [2-3 sentences — what they did well and what would improve their performance]
```

### Frontend: `web/src/pages/MockInterview.jsx`

Mobile layout: problem statement in a collapsible card at top, chat thread fills remaining space, input fixed to bottom.

Desktop layout: 45% left panel (problem statement, difficulty badge, hints accordion), 55% right panel (chat thread + input at bottom).

Top bar on both: company name + role + countdown timer from 45:00. Timer turns red at 5 minutes. "End Interview" button (ghost, red border) top right.

Chat message styles: Interviewer messages left-aligned with "Interviewer" label, bg `surface-container`. User messages right-aligned, bg `rgba(75,226,119,0.1)`.

After "End Interview" or session end: results page showing verdict card, 4 metric cards (Approach / Communication / Complexity Awareness / Edge Cases), full transcript in an accordion, and two CTA buttons: "Practice Again" + "View Dashboard."

---

## SECTION 9 — PHASE 4: READINESS DASHBOARD

This is an update to the existing Dashboard page, not a new page.

Replace the current streak/points card with a Readiness Score circle. The score is computed as:

```javascript
const readinessScore = Math.round(
  (diagnosticScore * 0.40) +
  (mockAverage * 0.35) +
  ((patternsCompleted / 15) * 100 * 0.25)
);
```

If no diagnostic has been taken, show "?" in the circle with a "Take Assessment" prompt instead of a number. Do not show 0% — "?" communicates "unknown" which is more honest and more motivating.

Additional cards to add to dashboard:
- "Next Action" card — one recommended action: if no diagnostic, "Take your diagnostic." If diagnostic done but curriculum not started, "Start Sliding Window pattern." If in curriculum, "Continue [current pattern]." If curriculum done, "Schedule a Mock Interview."
- "Recent Mock Sessions" section — last 3 sessions with verdict badges (Hire / Maybe / No Hire) and company names
- "Curriculum Progress" — a single progress bar showing X of 15 patterns complete

Remove from dashboard: streak card, random question card (if present). These are v1 artifacts.

---

## SECTION 10 — ENVIRONMENT VARIABLES

```
# backend (Render)
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
INTERNAL_API_SECRET=<secret>
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
TELEGRAM_BOT_TOKEN=<token>
WEB_URL=https://preptrack-hazel.vercel.app
GEMINI_API_KEY=<your key>

# bot (Render)
TELEGRAM_BOT_TOKEN=<token>
BACKEND_URL=https://preptrack-backend.onrender.com
INTERNAL_API_SECRET=<same secret>
WEB_URL=https://preptrack-hazel.vercel.app

# web (Vercel)
VITE_API_URL=https://preptrack-backend.onrender.com
VITE_TELEGRAM_BOT_NAME=PrepTrackBot
```

GEMINI_API_KEY must only be in the backend environment. Never in Vercel environment variables.

---

## SECTION 11 — HANDOFF.MD TEMPLATE

After every session, update HANDOFF.md with this structure. Do not skip fields.

```markdown
# PrepTrack HANDOFF — [DATE]

## Session Summary
What was accomplished this session in 3-5 sentences.

## Files Modified
- /path/to/file.jsx — what changed
- /path/to/file.js — what changed

## Files Created
- /path/to/newfile.jsx — what it is

## Files Deleted
- /path/to/deleted.tsx — why deleted

## What's Working
- List of features confirmed working

## What's Broken or Incomplete
- List of known issues, with file names if possible

## Gemini API calls: [frontend/backend/none]
Confirm all Gemini calls are in backend only.

## Build status: [passing/failing]
If failing, paste the error.

## Next Task
What the next Antigravity session should do.
```

---

## SECTION 12 — WHAT NEVER TO DO

- Never put API keys in frontend code or Vercel environment variables
- Never migrate to TypeScript
- Never change the Razorpay integration without explicit instruction
- Never add a library without documenting it
- Never build Phase 2 while Phase 1 is untested
- Never redesign a page that wasn't in your task
- Never make product decisions (feature scope, pricing, user flow) — that is Claude's job
- Never end a session without updating HANDOFF.md
