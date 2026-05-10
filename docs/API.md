# PrepTrack API Documentation

All routes are prefixed with the base backend URL (e.g., `https://preptrack-backend.onrender.com`).

## Authentication
Internal routes require the bot to pass an authorization header:
`Authorization: Bearer <INTERNAL_API_SECRET>`

Web dashboard routes rely on passing the `telegram_id` as a URL parameter or query parameter, and are restricted via CORS.

---

## Users API (`/users`)

### `POST /users`
**Auth:** Internal
**Body:** `{ telegram_id: number, name: string, username: string }`
**Description:** Upserts a user in the database.

### `GET /users/:telegram_id`
**Auth:** Internal
**Description:** Retrieves user details including their active streak and target company.

### `PATCH /users/:telegram_id`
**Auth:** Internal
**Body:** `{ target_company_slug: string, questions_per_day: number }`
**Description:** Updates a user's settings.

### `POST /users/auth/telegram`
**Auth:** None
**Body:** Telegram Login Widget hash payload
**Description:** Verifies the cryptographic hash from the Telegram login widget to securely log a user in to the web dashboard.

---

## Questions API (`/questions`)

### `GET /questions/companies`
**Auth:** None
**Description:** Returns a list of all active companies, including flags indicating if they require a Pro subscription.

### `GET /questions/daily/:telegram_id`
**Auth:** Internal
**Description:** Returns the user's assigned questions for the day, utilizing the adaptive engine to bias selection towards weak topics. Handles caching to ensure the same questions are returned if requested multiple times in one day.

---

## Progress API (`/progress`)

### `POST /progress`
**Auth:** Internal
**Body:** `{ telegram_id: number, question_id: number, status: 'solved' | 'stuck' | 'skipped' }`
**Description:** Records a user's progress on a specific question. Updates their streak and asynchronously triggers a recalculation of their weak topic scores.

### `GET /progress/:telegram_id/summary`
**Auth:** Internal
**Description:** Returns a lightweight summary of the user's progress over the last 30 days (used by the bot's `/progress` command).

---

## Analytics API (`/analytics`)

### `GET /analytics/:telegram_id`
**Auth:** None (CORS restricted)
**Description:** Comprehensive analytics endpoint for the Web Dashboard. Returns user details, overall lifetime stats, per-topic breakdowns, 30-day rolling activity, difficulty breakdowns, and the currently assigned questions for today.

---

## Payments API (`/payments`)

*(Currently scaffolding)*

### `POST /payments/create-order`
**Auth:** None
**Description:** Initializes a Razorpay order for the Pro tier upgrade.

### `POST /payments/verify`
**Auth:** None
**Description:** Webhook / manual verification endpoint to confirm payment success and flip the user's `is_pro` status to true.
