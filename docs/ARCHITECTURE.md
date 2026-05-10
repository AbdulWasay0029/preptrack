# PrepTrack Architecture

PrepTrack is an adaptive placement preparation platform with a three-tier architecture:

## 1. Frontend (Web Dashboard)
- **Tech Stack:** React, Vite, Tailwind CSS, Recharts, React Router
- **Hosting:** Vercel
- **Purpose:** Visualizing user progress, streak, and topic performance over time.
- **Authentication:** Uses Telegram Login Widget. Upon success, stores `telegram_id` in localStorage. All subsequent API calls pass this ID. Fallback: Magic link via the bot `/web` command.

## 2. Bot (Telegram Interface)
- **Tech Stack:** Node.js, Telegraf v4
- **Hosting:** Render (Free Web Service tier, uses dummy HTTP server to satisfy health checks)
- **Purpose:** Primary user interface for daily interactions, delivering questions, and marking status (Solved, Stuck, Skipped).
- **Commands:** `/start`, `/today`, `/progress`, `/settings`, `/web`, `/help`.
- **Communication:** Communicates strictly with the Backend via REST API (does NOT access the database directly). Authenticated via `INTERNAL_API_SECRET`.

## 3. Backend & Engine (Express API)
- **Tech Stack:** Node.js, Express, pg (PostgreSQL driver)
- **Hosting:** Render (Web Service)
- **Database:** Neon PostgreSQL
- **Purpose:** Central source of truth. Handles business logic, adaptive topic detection, question selection, and serves both the bot and the web dashboard.
- **Adaptive Engine:** Analyzes the last 30 days of progress, scores topics based on stuck/skipped ratios, and serves a mix of weak-topic questions and standard pool questions.
- **Authentication:** Validates `INTERNAL_API_SECRET` for requests originating from the Bot. Allows public CORS access (with specific origin) for dashboard requests.

## Component Flow
1. User interacts with Bot on Telegram.
2. Bot sends requests to Backend API (with internal secret).
3. Backend processes logic via Adaptive Engine and queries Neon Postgres DB.
4. User logs into Web Dashboard via Telegram OAuth / Magic Link.
5. Web Dashboard fetches analytics directly from Backend API.
