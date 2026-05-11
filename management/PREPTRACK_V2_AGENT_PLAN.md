# PrepTrack v2 — Agent Plan
> This supersedes PREPTRACK_AGENT_PLAN.md (v1).
> Paste this + HANDOFF.md into Antigravity as first message.
> Read fully before writing a single line of code.

---

## CRITICAL — READ THIS FIRST

### Design Reference Files
You have been given HTML reference designs from Stitch. These are REFERENCES, not templates to copy verbatim. Your job is to:
- Extract the design patterns, spacing, colors, and component styles
- Implement them as clean React JSX with dynamic data
- Ensure visual consistency ACROSS all pages — same card styles, same button styles, same spacing, same typography scale everywhere
- Do NOT hardcode the Stitch HTML directly into React files

### Consistency Rules (Non-negotiable)
- Every page uses the same Tailwind config (copy from Design System section below exactly once into tailwind.config.js)
- Cards always: `bg-surface-container border border-outline-variant rounded-lg p-unit_md` or `p-unit_xl`
- Primary buttons always: `bg-primary text-on-primary font-bold rounded active:scale-95 transition-all`
- Ghost buttons always: `border border-outline-variant text-on-surface-variant` same padding as primary
- Bottom nav always visible on mobile (md:hidden) across ALL pages
- Top nav always visible on desktop (hidden md:flex) across ALL pages
- Page padding always: `px-page_padding`
- Typography always uses the defined classes: `text-headline-lg`, `text-body-md`, `text-label-bold` etc

---

## What PrepTrack Is

AI-powered interview readiness platform for Indian CS students. Mobile-first web app + Telegram bot.

**Repo:** https://github.com/AbdulWasay0029/preptrack
**Live:** https://preptrack-hazel.vercel.app
**Bot:** @PrepTrackBot

---

## Locked Stack

| Layer | Technology |
|-------|-----------|
| Bot | Node.js + Telegraf v4 (CommonJS) |
| Backend | Node.js + Express (CommonJS) |
| Database | Neon PostgreSQL |
| Frontend | React + Vite + Tailwind CSS |
| AI Layer | Google Gemini API (gemini-1.5-flash) |
| Payments | Razorpay |
| Hosting | Render (backend + bot) + Vercel (web) |

---

## Design System

Copy this exactly into `web/tailwind.config.js`:

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

---

## Shared Components (Build These First)

Before any page, build these. Every page uses them.

### `web/src/components/Layout.jsx`
Wraps every page. Includes TopNav + BottomNav + children.
```jsx
export default function Layout({ children, activePage }) {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <TopNav activePage={activePage} />
      <main className="flex-1 pb-20 md:pb-0 md:pt-20">
        {children}
      </main>
      <BottomNav activePage={activePage} />
    </div>
  );
}
```

### `web/src/components/TopNav.jsx`
Desktop only. Logo left, nav links center, upgrade button right.
```jsx
export default function TopNav({ activePage }) {
  return (
    <header className="hidden md:flex justify-between items-center h-20 px-page_padding max-w-7xl mx-auto w-full fixed top-0 left-0 right-0 z-50 border-b border-outline-variant bg-surface-container-lowest">
      <div className="flex items-center gap-unit_sm">
        <span className="material-symbols-outlined text-primary">terminal</span>
        <span className="text-headline-md font-bold text-primary">PrepTrack</span>
      </div>
      <nav className="flex gap-8">
        {[['/', 'Home'], ['/curriculum', 'Curriculum'], ['/mock', 'Mock'], ['/progress', 'Progress']].map(([path, label]) => (
          <a key={path} href={path} className={`font-medium transition-colors ${activePage === path ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>
            {label}
          </a>
        ))}
      </nav>
      <button className="bg-primary-container text-on-primary px-6 py-2 rounded font-bold hover:opacity-90 active:scale-95 transition-all">
        Upgrade
      </button>
    </header>
  );
}
```

### `web/src/components/BottomNav.jsx`
Mobile only. Fixed bottom. 4 tabs.
```jsx
const tabs = [
  { path: '/dashboard', icon: 'home', label: 'Home' },
  { path: '/curriculum', icon: 'menu_book', label: 'Curriculum' },
  { path: '/mock', icon: 'video_call', label: 'Mock' },
  { path: '/progress', icon: 'query_stats', label: 'Progress' },
];

export default function BottomNav({ activePage }) {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center h-16 border-t border-outline-variant bg-surface">
      {tabs.map(tab => (
        <a key={tab.path} href={tab.path} className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 rounded-full transition-all ${activePage === tab.path ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
          <span className="text-label-md">{tab.label}</span>
        </a>
      ))}
    </nav>
  );
}
```

### `web/src/components/DifficultyBadge.jsx`
```jsx
export default function DifficultyBadge({ difficulty }) {
  const styles = {
    easy: 'bg-[#166534] text-[#4ade80]',
    medium: 'bg-[#854d0e] text-[#fbbf24]',
    hard: 'bg-[#7f1d1d] text-[#ef4444]',
  };
  return (
    <span className={`${styles[difficulty] || styles.medium} px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
      {difficulty}
    </span>
  );
}
```

---

## Immediate Fixes (Do First)

### Fix duplicate questions
File: `backend/src/services/adaptiveEngine.js`
```javascript
// After building pool, before slicing:
const unique = [...new Map(pool.map(q => [q.id, q])).entries()].map(([, q]) => q);
// Use unique.slice(0, count) instead of pool.slice(0, count)
```

### Fix company Pro flags
Run on Neon SQL editor:
```sql
UPDATE companies SET is_pro_only = true WHERE slug IN ('paytm','razorpay','swiggy','zomato','uber','salesforce');
UPDATE companies SET is_pro_only = false WHERE slug IN ('amazon','microsoft');
```

---

## AI Setup

```bash
cd backend && npm install @google/generative-ai
```

Create `backend/src/services/gemini.js`:
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function generateContent(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { generateContent, model };
```

---

## PHASE 1 — Diagnostic Assessment

### DB migration (run on Neon)
```sql
CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  target_company_id INTEGER REFERENCES companies(id),
  overall_score INTEGER,
  topic_scores JSONB DEFAULT '{}',
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

### Backend routes
New file: `backend/src/routes/assessments.js`

**POST /assessments/start** — auth: internal
- Body: `{ telegram_id, company_slug }`
- Select 1 question from each of 5 topics: arrays, trees, dynamic-prog, graphs, strings
- Create assessment record
- Return: `{ assessment_id, questions: [{id, title, difficulty, topic, leetcode_link}] }`

**POST /assessments/:id/respond** — auth: internal
- Body: `{ question_id, user_response, time_taken_seconds, question_title, difficulty, topic }`
- If response < 10 chars: score 0, feedback "No response"
- Otherwise call Gemini:
```javascript
const prompt = `Evaluate this DSA interview response from an Indian CS placement student.
Problem: "${question_title}" (${difficulty}, topic: ${topic})
Student response: "${user_response}"
Score on: approach correctness, complexity awareness, communication clarity.
Return ONLY valid JSON: {"score": <0-100>, "feedback": "<2 sentences>", "approach_correct": <true/false>}`;
```
- Store in assessment_responses
- Return: `{ score, feedback }`

**POST /assessments/:id/complete** — auth: internal
- Calculate average score from all responses
- Update assessments.overall_score and topic_scores
- Return: `{ overall_score, topic_scores }`

**GET /assessments/:telegram_id/latest** — auth: internal
- Return latest completed assessment with responses

Mount in `backend/src/index.js`:
```javascript
app.use('/assessments', require('./routes/assessments'));
```

Also add to `bot/src/utils/api.js`:
```javascript
async startAssessment(telegramId, companySlug) {
  const { data } = await client.post('/assessments/start', { telegram_id: telegramId, company_slug: companySlug });
  return data;
},
async submitResponse(assessmentId, payload) {
  const { data } = await client.post(`/assessments/${assessmentId}/respond`, payload);
  return data;
},
async completeAssessment(assessmentId) {
  const { data } = await client.post(`/assessments/${assessmentId}/complete`);
  return data;
},
async getLatestAssessment(telegramId) {
  const { data } = await client.get(`/assessments/${telegramId}/latest`);
  return data;
},
```

### Web page: `web/src/pages/Diagnostic.jsx`
Based on Stitch diagnostic reference design.

States:
1. Loading (fetching questions)
2. Active question — timer running, textarea, submit/skip buttons
3. Timer warning — timer text turns `text-error`, border turns `border-error`
4. Scoring — loading spinner between questions
5. Results — score circle, topic bars, feedback accordion

Key implementation:
```jsx
// Timer
const [timeLeft, setTimeLeft] = useState(15 * 60);
useEffect(() => {
  if (timeLeft <= 0) handleSubmit();
  const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
  return () => clearInterval(interval);
}, [timeLeft]);

const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
const isWarning = timeLeft < 120;
```

Score circle color logic:
- > 70: `text-primary` (green)
- 40-70: `text-tertiary` (orange/yellow)
- < 40: `text-error` (red)

Add route in `web/src/App.jsx`:
```jsx
<Route path="/diagnostic" element={<Diagnostic />} />
```

### Bot command: `bot/src/commands/assess.js`
```javascript
module.exports = async (ctx) => {
  const webUrl = process.env.WEB_URL || 'https://preptrack-hazel.vercel.app';
  await ctx.reply(
    `📊 *Readiness Assessment*\n\nFind out exactly where you stand.\n\n• 5 questions, AI-evaluated\n• 15 minutes per question\n• Honest score out of 100\n\n[Start Assessment →](${webUrl}/diagnostic)`,
    { parse_mode: 'Markdown' }
  );
};
```
Register: `bot.command('assess', require('./commands/assess'));`
Add to /help: `/assess - Take your readiness assessment`

---

## PHASE 2 — Pattern Curriculum

Build after Phase 1 tested with real users.

### DB migration
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

### Seed 15 patterns
```sql
INSERT INTO patterns (name, slug, description, when_to_use, order_index) VALUES
('Sliding Window','sliding-window','Find subarrays satisfying given conditions','Finding longest/shortest substring or subarray',1),
('Two Pointers','two-pointers','Two pointers moving toward each other','Sorted arrays, pairs/triplets problems',2),
('Fast & Slow Pointers','fast-slow-pointers','Pointers at different speeds','Cycle detection in linked lists',3),
('Merge Intervals','merge-intervals','Dealing with overlapping intervals','Merging or inserting intervals',4),
('Binary Search','binary-search','Divide and conquer on sorted data','O(log n) search on sorted input',5),
('Tree BFS','tree-bfs','Level-order traversal using queue','Traverse tree level by level',6),
('Tree DFS','tree-dfs','Depth-first traversal','Path finding, tree structure problems',7),
('Dynamic Programming','dynamic-programming','Overlapping subproblems and optimal substructure','Optimization problems with repeated subproblems',8),
('Graphs','graphs','BFS/DFS on graph structures','Connectivity, shortest path, cycle detection',9),
('Top K Elements','top-k-elements','Find top K elements using heap','Kth largest/smallest element',10),
('Two Heaps','two-heaps','Min and max heap partition','Median in a data stream',11),
('Subsets','subsets','Generate all subsets','Permutation, combination problems',12),
('Greedy','greedy','Locally optimal choices','Problems solvable by always picking best current option',13),
('Backtracking','backtracking','Explore all possibilities','Constraint satisfaction: N-Queens, Sudoku',14),
('In-place Reversal','in-place-reversal','Reverse without extra space','Reversing or rotating arrays/linked lists',15)
ON CONFLICT DO NOTHING;
```

### Backend: `backend/src/routes/patterns.js`
```
GET  /patterns                        — list all + user progress
GET  /patterns/:slug                  — detail + questions ordered
POST /patterns/:slug/complete/:qid    — mark question complete
```

### Web pages
- `web/src/pages/Curriculum.jsx` — based on Stitch curriculum list design
- `web/src/pages/PatternDetail.jsx` — based on Stitch pattern detail design

---

## PHASE 3 — AI Mock Interview

Build after Phase 2.

### DB migration
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

### Backend: `backend/src/routes/mock.js`
```
POST /mock/start           — create session, return question
POST /mock/:id/message     — send message, get interviewer response
POST /mock/:id/complete    — end session, generate final feedback
GET  /mock/:telegram_id/history
```

Gemini interviewer system context:
```
You are a senior engineer at {company} conducting a technical phone screen for an SDE role.
Problem: "{question.title}" ({difficulty})
- Ask ONE follow-up at a time
- Ask brute force → optimize progression
- Always ask time/space complexity
- Be professional, not warm
- After 3-4 exchanges end with:
FINAL_ASSESSMENT:
Verdict: [Strong Hire/Hire/Maybe/No Hire]
Approach: [correct/partially/incorrect]
Communication: [clear/needs improvement]
Complexity: [mentioned/not mentioned]
Feedback: [2-3 sentences]
```

### Web page
`web/src/pages/MockInterview.jsx` — based on Stitch mock interview reference (mobile + desktop designs provided).

Mobile: question collapsible top, chat below, input pinned to bottom.
Desktop: split screen — question left 45%, chat right 55%.

---

## PHASE 4 — Readiness Dashboard

Update `web/src/pages/Dashboard.jsx`:

Replace streak card with readiness score circle. Logic:
```javascript
const readinessScore = Math.round(
  (diagnosticScore * 0.40) +
  (mockAverage * 0.35) +
  ((patternsCompleted / 15) * 100 * 0.25)
);
```

Score circle: large number center, ring colored by range (green/yellow/red).
Add: next action card, recent mock sessions, curriculum progress bar.

---

## Environment Variables

```
# backend + Render
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
INTERNAL_API_SECRET=<secret>
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
TELEGRAM_BOT_TOKEN=<token>
WEB_URL=https://preptrack-hazel.vercel.app
GEMINI_API_KEY=<your key>

# bot + Render
TELEGRAM_BOT_TOKEN=<token>
BACKEND_URL=https://preptrack-backend.onrender.com
INTERNAL_API_SECRET=<same>
DAILY_CRON=30 3 * * *
WEB_URL=https://preptrack-hazel.vercel.app

# web + Vercel
VITE_API_URL=https://preptrack-backend.onrender.com
VITE_TELEGRAM_BOT_NAME=PrepTrackBot
```

---

## Session Log

### 2026-05-11 — Product Pivot
Pivoted from question sender to AI interview coach. 5 layers: Assess, Learn, Practice, Feedback, Track. Pricing ₹499/month.

### 2026-05-11 — Agent Plan v2 (Claude)
Full v2 plan: Gemini API, complete design system, shared components, consistency rules, all 4 phases with backend code, DB schemas, web page specs.
