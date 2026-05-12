# PrepTrack — AI Handoff Document (V2 Pivot Edition)
> Paste this entire file as context into any AI tool (Claude, Cursor, ChatGPT, Gemini, etc.)
> It contains everything needed to continue building without prior conversation context.

---

## 1. Project Summary & The Big Pivot
**PrepTrack** is an interview readiness platform for Indian CS students at tier 2–3 colleges. 

### The Evolution:
*   **V1 (The Baseline)**: Started as a Telegram bot sending 3 LeetCode questions per day based on an adaptive weak-topic engine.
*   **V2 (The Current Vision)**: Pivoting from a simple "question sender" to a full **AI Interview Coach**. Instead of just sending questions, it assesses the user's readiness, teaches them patterns (Curriculum), and conducts mock interviews.

**Owner:** Abdul Wasay (CMRIT Hyderabad, 2nd year CSE)

---

## 2. Tech Stack (Locked)
| Layer | Technology | Notes |
|-------|-----------|-------|
| Bot | Node.js + Telegraf v4 | CommonJS (require/module.exports) |
| Backend | Node.js + Express | CommonJS, runs on Render |
| Database | PostgreSQL | pg pool (Neon Serverless) |
| AI | Google Gemini 1.5 Flash | Used for analysis and coaching (free in AI Studio) |

---

## 3. The Current Mess (Codebase Fragmentation)
As of **May 13, 2026**, the app is in a state of chaos due to parallel builds by different agents (including a session in Google AI Studio and another with Antigravity):

### 📁 Duplicate Files in `/web/src/pages`:
We have a mix of `.jsx` and `.tsx` files for the same pages. We don't know which one is the active source of truth!
*   **Duplicates**: `Dashboard.jsx` & `Dashboard.tsx`, `Landing.jsx` & `Landing.tsx`, `Progress.jsx` & `Progress.tsx`.
*   **JSX Only**: `Diagnostic.jsx`, `Login.jsx`.
*   **TSX Only**: `Curriculum.tsx`, `Lesson.tsx`, `Mock.tsx`.

### 🧩 Fragmented Features:
*   **Diagnostic**: The initial assessment test is hidden or disconnected in the flow.
*   **Mock Interviews**: Linked in the navbar but not fully functional or integrated.
*   **Stitch Designs**: There is a "LeetCode-like" interface (Problem left, IDE right) in the designs that we don't know where to put.

---

## 4. The Strategic Dilemma
We are torn between two user flows, and we need YOU (Claude) to act as the **Lead Product Manager** to solve it:

1.  **Assessment-First**: Force the user to take a 20-minute test first to find their score.
    *   *Pros*: High personalization, high lock-in.
    *   *Risks*: High drop-off on mobile.
2.  **Curriculum-First**: Show them what to study first (0% score) and let them take the test later.
    *   *Pros*: Low friction, immediate value.
    *   *Risks*: Looks like just another free question list; hard to monetize.

---

## 5. What Was Built (The Baseline V1)
*The following describes the state of the app before the V2 chaos. It works but needs cleanup:*

### Backend (`/backend`) ✅
*   Express API with routes for users, questions, progress, and analytics.
*   **Adaptive Engine**: Calculates weak topics based on last 30 days of activity.
*   **Auth**: Internal auth via secret header; Telegram login verification.

### Bot (`/bot`) ✅
*   Commands: `/start` (onboarding), `/today` (daily questions), `/progress` (stats), `/settings`.
*   Callback handlers for Solved/Stuck/Skip.

### Web (`/web`) ⚠️
*   Scaffolded with Vite + React + Tailwind.
*   Contains the duplicate files mentioned above.
*   Dark theme: bg `#0f0f0f`, cards `#1a1a1a`, accent `#22c55e`.

---

## 6. Instructions for Claude (Next Steps)
1.  **Act as Lead PM**: Challenge assumptions. Do not just agree with the user.
2.  **Clean the Codebase**: Help the user decide whether to keep the JSX or TSX files and how to merge them.
3. **Define the Flow**: Create a cohesive flow that integrates the Diagnostic, Curriculum, Mock Interviews, and the LeetCode IDE.
4. **Solve the Dilemma**: Propose a flow (perhaps a hybrid) that hooks the user without high drop-off but retains the premium value of the AI Coach.

---

## 7. Session Log

### 2026-05-12 — Cleanup Task (Antigravity)
Completed the cleanup task specified in Section 5 of `PREPTRACK_PRD_FOR_ANTIGRAVITY.md`:
- **Deleted duplicate `.tsx` files** in `web/src/pages/`: `Dashboard.tsx`, `Landing.tsx`, `Progress.tsx`, `Curriculum.tsx`, `Lesson.tsx`, `Mock.tsx`.
- **Created/Overwrote `.jsx` files** with the content of the `.tsx` files (which contained the superior V2 implementation) and removed TypeScript type annotations:
  - `web/src/pages/Dashboard.jsx` (overwritten)
  - `web/src/pages/Landing.jsx` (overwritten)
  - `web/src/pages/Progress.jsx` (overwritten)
  - `web/src/pages/Curriculum.jsx` (created)
  - `web/src/pages/Lesson.jsx` (created)
  - `web/src/pages/Mock.jsx` (created)
- **Fixed typo** in `web/src/pages/Progress.jsx` line 9.
- **Verified build**: Ran `npm run build` in `/web` and it succeeded.

### 2026-05-12 — Google OAuth & JWT Auth Implementation (Antigravity)
- **Backend Google OAuth**:
  - Configured Passport with `passport-google-oauth20` strategy in `backend/src/config/passport.js`.
  - Created `/auth/google` and `/auth/google/callback` routes in `backend/src/routes/auth.js`.
  - Generates JWT on success and redirects to frontend with `?token=...`.
- **JWT Middleware**:
  - Added `requireJwtAuth` in `backend/src/middleware/auth.js` to verify JWT and attach user to `req.user`.
- **Protected Routes**:
  - Updated `GET /users/:telegram_id`, `PATCH /users/:telegram_id`, `GET /analytics/:telegram_id`, `POST /payments/create-order`, and `POST /payments/verify` to use `requireJwtAuth` and check ownership.
  - Updated `/assessments` routes (`/start`, `/:id/respond`, `/:id/complete`, `/:telegram_id/latest`) to use `requireJwtAuth` and check ownership.
- **Frontend Updates**:
  - Updated `AuthWrapper` in `web/src/App.jsx` to check for `token` in URL, store it as `prep_auth_token` in `localStorage`, and use it for auth.
  - Updated API client in `web/src/api/client.js` to send the token in the `Authorization` header as `Bearer <token>`.
  - Updated `Landing.jsx` to replace Telegram login with "Login with Google" button pointing to backend auth route.
- **Verified build**: Ran `npm run build` in `/web` and it succeeded.

