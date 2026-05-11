# PrepTrack - Technical Interview Readiness Platform

## Comprehensive Documentation

### 1. Project Overview
PrepTrack is a full-stack, AI-powered interview readiness platform specifically designed for computer science students. It bridges the gap between passive learning and active interview performance by providing:
- **Diagnostic Assessments**: High-fidelity simulators that mimic real company interviews.
- **Adaptive Curriculum**: A learning path that evolves based on identified weaknesses.
- **AI Coaching**: A real-time tutor powered by Gemini 1.5 Flash for concept mastery.
- **Telegram Integration**: Seamless delivery of daily problems and performance alerts.

### 2. Architecture Analysis

#### 2.1 Frontend (React + Vite + Tailwind)
The frontend is built as a modern Single Page Application (SPA).
- **Vite**: Chosen for its blazing-fast build times and efficient HMR (though HMR is disabled in this specific container environment, the production builds are optimized).
- **Tailwind CSS**: Used for utility-first styling, ensuring rapid UI development while maintaining a cohesive "Material Dark" aesthetic.
- **React Router**: Manages the multi-page flow (Landing, Dashboard, Curriculum, Lesson, Diagnostic, Progress).
- **Motion (framer-motion)**: Integrated for fluid transitions and micro-animations to enhance the premium feel.

#### 2.2 Backend (Express + Node.js)
A lightweight but robust API server.
- **Express**: Handles routing and middleware (CORS, Morgan, JSON parsing).
- **PostgreSQL**: The primary relational database for storing users, questions, assessments, and progress data.
- **Gemini 1.5 Flash**: Orchestrates the "AI Brain" of the platform, evaluating user responses and providing feedback.

#### 2.3 Bot Layer (Telegraf)
- **Telegraf**: A powerful library for interacting with the Telegram Bot API.
- **Deep Linking**: Uses `start` parameters to link web sessions with Telegram identities.

### 3. Database Schema (PostgreSQL)

The database is designed to handle relational data efficiently for complex tracking.

```sql
-- Core user data linked to Telegram
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    telegram_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Companies and their specific interview patterns
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    is_pro_only BOOLEAN DEFAULT FALSE
);

-- Curated question set
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER,
    title VARCHAR(200) NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    leetcode_link TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Track patterns like 'arrays', 'trees', 'dp'
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

-- Each assessment session
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    target_company_id INTEGER REFERENCES companies(id),
    overall_score INTEGER,
    topic_scores JSONB, -- Breakdown by topic
    completed_at TIMESTAMP
);

-- Individual responses within an assessment
CREATE TABLE assessment_responses (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES assessments(id),
    question_id INTEGER REFERENCES questions(id),
    user_response TEXT,
    ai_score INTEGER,
    ai_feedback TEXT,
    time_taken_seconds INTEGER
);
```

### 4. API Endpoints

#### Assessments
- `POST /assessments/start`: Initializes a new session. Selects 5 questions across key topics.
- `POST /assessments/:id/respond`: Sends an individual answer to the AI for grading and saves it.
- `POST /assessments/:id/complete`: Calculates the aggregate score and marks the session as finished.
- `GET /assessments/:telegram_id/latest`: Retrieves the last completed assessment for the dashboard.

#### Questions/Metadata
- `GET /questions/companies`: Fetches the list of supported companies for the landing and settings pages.

### 5. Design Philosophy
The design follows a **Swiss-influenced Dark Aesthetic**:
- **Palette**: A deep charcoal base (`#0e150e`) with vibrant neon accents (`#4be277`).
- **Typography**: Inter (Sans) for clean hierarchy and JetBrains Mono for a "coding" feel in code blocks.
- **Consistency**: All cards use a consistent border (`#3d4a3d`) and padding scale.

### 6. User Flow Strategy

1. **Discovery (Landing)**:
   - User lands on the marketing page.
   - Enticed by the "Adaptive Loop" and "Company Tracks".
   - Clicks "Start Free on Telegram".

2. **Onboarding (Bot)**:
   - User starts the bot (`/start`).
   - Bot asks for target company.
   - Bot generates a unique link to the Diagnostic.

3. **Evaluation (Diagnostic)**:
   - User takes a timed assessment.
   - Each answer is evaluated by Gemini for approach correctness, complexity, and communication.
   - Result is saved to Postgres.

4. **Iterative Learning (Dashboard/Curriculum)**:
   - User views their Score Card.
   - AI identifies "Dynamic Programming" as a weakness.
   - User enters the "Dynamic Programming" lesson.
   - AI Tutor explains concepts and asks follow-up test questions.

### 7. What is left to do?

Despite the robust core, several advanced features are in the roadmap:
- **Audio/Video Mocking**: Integrating WebRTC and Gemini Multimodal Live API to handle voice-based behavioral and technical mocks.
- **Shared Code Editor**: A collaborative room for mock interviews with mentors.
- **Paywall Integration**: Stripe checkout for the "Engineer Pro" tier.
- **LeetCode Sync**: API integration to import solved counts from LeetCode.
- **Discord Bot**: Extending the notification system to Discord servers.

---
This documentation serves as the blueprint for scaling PrepTrack to the next level.
