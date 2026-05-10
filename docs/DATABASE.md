# PrepTrack Database Schema

The platform relies on a PostgreSQL database (hosted on Neon).

## Core Tables

### `companies`
Stores target companies.
- `id` (SERIAL, PK)
- `slug` (VARCHAR) e.g., "amazon", "google"
- `name` (VARCHAR) e.g., "Amazon", "Google"
- `is_active` (BOOLEAN)
- `is_pro_only` (BOOLEAN)

### `topics`
Stores DSA topic categories.
- `id` (SERIAL, PK)
- `slug` (VARCHAR) e.g., "dynamic-prog"
- `name` (VARCHAR) e.g., "Dynamic Programming"

### `questions`
Stores the actual LeetCode / DSA questions.
- `id` (SERIAL, PK)
- `title` (VARCHAR)
- `leetcode_link` (VARCHAR)
- `difficulty` (VARCHAR) ENUM: easy, medium, hard
- `topic_id` (INT, FK -> topics)

### `company_questions`
Mapping table defining which questions are asked by which companies.
- `company_id` (INT, FK -> companies)
- `question_id` (INT, FK -> questions)
- `frequency_weight` (INT) 1-5 scale indicating how often this company asks this question.

## User & Tracking Tables

### `users`
Core user entity.
- `id` (SERIAL, PK)
- `telegram_id` (BIGINT, UNIQUE)
- `name` (VARCHAR)
- `username` (VARCHAR)
- `target_company_id` (INT, FK -> companies)
- `questions_per_day` (INT) default 3
- `is_pro` (BOOLEAN) default false
- `streak` (INT) default 0
- `last_active_date` (DATE)
- `created_at` (TIMESTAMP)

### `user_progress`
Logs every interaction a user has with a question.
- `id` (SERIAL, PK)
- `user_id` (INT, FK -> users)
- `question_id` (INT, FK -> questions)
- `status` (VARCHAR) ENUM: solved, stuck, skipped
- `attempted_at` (TIMESTAMP)

### `daily_deliveries`
Tracks which questions were served to the user on a given day to prevent immediate repeats.
- `id` (SERIAL, PK)
- `user_id` (INT, FK -> users)
- `question_id` (INT, FK -> questions)
- `delivered_on` (DATE)

### `user_weak_topics`
A materialized cache table populated by the Adaptive Engine.
- `user_id` (INT, FK -> users)
- `topic_id` (INT, FK -> topics)
- `weak_score` (DECIMAL) 0.0 to 1.0, representing how poorly the user performs in this topic based on stuck/skipped ratios.

## Monetization

### `payments`
- `id` (SERIAL, PK)
- `user_id` (INT, FK -> users)
- `razorpay_order_id` (VARCHAR)
- `razorpay_payment_id` (VARCHAR)
- `amount_paise` (INT)
- `status` (VARCHAR)
- `created_at` (TIMESTAMP)
