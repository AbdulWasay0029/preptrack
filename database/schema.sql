-- PrepTrack Database Schema
-- Run: psql -U postgres -d preptrack -f database/schema.sql

-- ============================================================
-- COMPANIES
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
  id         SERIAL PRIMARY KEY,
  slug       VARCHAR(50)  UNIQUE NOT NULL,
  name       VARCHAR(100) NOT NULL,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  is_pro_only BOOLEAN     NOT NULL DEFAULT FALSE
);

-- ============================================================
-- TOPICS
-- ============================================================
CREATE TABLE IF NOT EXISTS topics (
  id    SERIAL PRIMARY KEY,
  slug  VARCHAR(50)  UNIQUE NOT NULL,
  name  VARCHAR(100) NOT NULL
);

-- ============================================================
-- QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  leetcode_link VARCHAR(300),
  difficulty    VARCHAR(10)  NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic_id      INT          NOT NULL REFERENCES topics(id),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COMPANY <-> QUESTION (many-to-many)
-- frequency: how often this question appears in that company's interviews (1–5)
-- ============================================================
CREATE TABLE IF NOT EXISTS company_questions (
  company_id  INT NOT NULL REFERENCES companies(id),
  question_id INT NOT NULL REFERENCES questions(id),
  frequency   INT NOT NULL DEFAULT 1 CHECK (frequency BETWEEN 1 AND 5),
  PRIMARY KEY (company_id, question_id)
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id                SERIAL PRIMARY KEY,
  telegram_id       BIGINT      UNIQUE NOT NULL,
  name              VARCHAR(100),
  username          VARCHAR(100),
  target_company_id INT         REFERENCES companies(id),
  questions_per_day INT         NOT NULL DEFAULT 3 CHECK (questions_per_day BETWEEN 1 AND 10),
  is_pro            BOOLEAN     NOT NULL DEFAULT FALSE,
  streak            INT         NOT NULL DEFAULT 0,
  last_active_date  DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USER PROGRESS
-- One row per question attempt per day. status drives weak-topic logic.
-- ============================================================
CREATE TABLE IF NOT EXISTS user_progress (
  id            SERIAL PRIMARY KEY,
  user_id       INT         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id   INT         NOT NULL REFERENCES questions(id),
  status        VARCHAR(10) NOT NULL CHECK (status IN ('solved', 'stuck', 'skipped')),
  attempted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DAILY DELIVERIES
-- Tracks which questions were sent to which user on which date.
-- Prevents repeating questions within a 14-day window.
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_deliveries (
  id           SERIAL PRIMARY KEY,
  user_id      INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id  INT  NOT NULL REFERENCES questions(id),
  delivered_on DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE (user_id, question_id, delivered_on)
);

-- ============================================================
-- USER WEAK TOPICS (cached scores, refreshed daily)
-- weak_score: 0.0 (strong) to 1.0 (very weak)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_weak_topics (
  user_id    INT   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id   INT   NOT NULL REFERENCES topics(id),
  weak_score FLOAT NOT NULL DEFAULT 0.0 CHECK (weak_score BETWEEN 0 AND 1),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, topic_id)
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id                  SERIAL PRIMARY KEY,
  user_id             INT         NOT NULL REFERENCES users(id),
  razorpay_order_id   VARCHAR(100) UNIQUE,
  razorpay_payment_id VARCHAR(100),
  amount_paise        INT         NOT NULL,  -- amount in paise (19900 = ₹199)
  status              VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'completed', 'failed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id
  ON user_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_topic
  ON user_progress(user_id, attempted_at DESC);

CREATE INDEX IF NOT EXISTS idx_daily_deliveries_user_date
  ON daily_deliveries(user_id, delivered_on);

CREATE INDEX IF NOT EXISTS idx_company_questions_company
  ON company_questions(company_id);

CREATE INDEX IF NOT EXISTS idx_questions_topic
  ON questions(topic_id);
