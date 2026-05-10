# PrepTrack — Deployment Guide

> Step-by-step instructions for deploying PrepTrack to production.
> **Stack:** Railway (backend + bot + PostgreSQL) + Vercel (web dashboard)

---

## Prerequisites

- GitHub repo pushed: `https://github.com/AbdulWasay0029/preptrack.git`
- Telegram bot token from [@BotFather](https://t.me/BotFather)
- (Optional) Razorpay account for payments

---

## 1. Railway — PostgreSQL Database

1. Go to [railway.app](https://railway.app) → **New Project**
2. Click **Add Service** → **Database** → **PostgreSQL**
3. Once provisioned, click the PostgreSQL service → **Variables** tab
4. Copy the `DATABASE_URL` value — you'll need it for the backend

### Seed the database

Option A — Use Railway's **Query** tab:
- Click the PostgreSQL service → **Data** tab → **Query**
- Paste the contents of `database/schema.sql` and run
- Then paste `database/seed/questions.sql` and run

Option B — Connect from your terminal:
```bash
# Install psql locally, then:
psql "<your-railway-DATABASE_URL>" -f database/schema.sql
psql "<your-railway-DATABASE_URL>" -f database/seed/questions.sql
```

---

## 2. Railway — Backend Service

1. In the same Railway project, click **Add Service** → **GitHub Repo**
2. Select `AbdulWasay0029/preptrack`
3. In **Settings**:
   - **Root Directory:** `/backend`
   - **Start Command:** `npm start`
4. In **Variables**, add:

```env
DATABASE_URL=<copied from PostgreSQL service — or use Railway's variable reference: ${{Postgres.DATABASE_URL}}>
PORT=3001
NODE_ENV=production
INTERNAL_API_SECRET=<generate a random 32+ character string>
TELEGRAM_BOT_TOKEN=<your bot token from BotFather>
WEB_URL=https://preptrack.vercel.app
```

> **Tip:** For `INTERNAL_API_SECRET`, run this in your terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

5. Railway will auto-deploy. Check the **Deployments** tab for logs.
6. Once deployed, copy the **public URL** (e.g., `https://preptrack-backend-production.up.railway.app`)

---

## 3. Railway — Bot Service

1. In the same project, click **Add Service** → **GitHub Repo** again
2. Select the same repo `AbdulWasay0029/preptrack`
3. In **Settings**:
   - **Root Directory:** `/bot`
   - **Start Command:** `npm start`
4. In **Variables**, add:

```env
TELEGRAM_BOT_TOKEN=<same bot token as backend>
BACKEND_URL=<Railway backend URL from step 2, e.g., https://preptrack-backend-production.up.railway.app>
INTERNAL_API_SECRET=<same secret as backend>
DAILY_CRON=30 2 * * *
```

> **Note:** `DAILY_CRON=30 2 * * *` = 2:30 AM UTC = 8:00 AM IST.
> Adjust to your preferred delivery time.

5. Deploy. Check logs — you should see `PrepTrack bot started`.

---

## 4. Vercel — Web Dashboard

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import from GitHub → select `AbdulWasay0029/preptrack`
3. In **Configure Project**:
   - **Framework Preset:** Vite
   - **Root Directory:** `web`
4. In **Environment Variables**, add:

```env
VITE_API_URL=<Railway backend URL from step 2>
```

5. Click **Deploy**
6. Once live, copy the Vercel URL (e.g., `https://preptrack.vercel.app`)
7. Go back to Railway → Backend service → Variables → update `WEB_URL` to this Vercel URL

---

## 5. Post-Deploy Checklist

- [ ] Open Telegram → send `/start` to your bot → verify company picker appears
- [ ] Pick Amazon → send `/today` → verify questions appear
- [ ] Tap ✅ Solved on a question → verify message updates
- [ ] Send `/progress` → verify stats appear
- [ ] Visit your Vercel URL → verify login page loads
- [ ] (Optional) Test Telegram Login Widget on the web dashboard

---

## 6. Custom Domain (Optional)

### Vercel
1. Go to your Vercel project → **Settings** → **Domains**
2. Add your domain (e.g., `preptrack.tech`)
3. Update DNS records as Vercel instructs

### Railway
1. Go to your backend service → **Settings** → **Networking** → **Custom Domain**
2. Add your API domain (e.g., `api.preptrack.tech`)
3. Update `VITE_API_URL` in Vercel and `BACKEND_URL` in the bot service

---

## Environment Variables — Quick Reference

| Variable | Where | Value |
|----------|-------|-------|
| `DATABASE_URL` | Backend | Railway PostgreSQL connection string |
| `PORT` | Backend | `3001` |
| `NODE_ENV` | Backend | `production` |
| `INTERNAL_API_SECRET` | Backend + Bot | Same random 32+ char string in both |
| `TELEGRAM_BOT_TOKEN` | Backend + Bot | From @BotFather |
| `WEB_URL` | Backend | Your Vercel URL |
| `BACKEND_URL` | Bot | Your Railway backend URL |
| `DAILY_CRON` | Bot | Cron expression (UTC), default `30 2 * * *` |
| `VITE_API_URL` | Web | Your Railway backend URL |
| `RAZORPAY_KEY_ID` | Backend | From Razorpay dashboard (when ready) |
| `RAZORPAY_KEY_SECRET` | Backend | From Razorpay dashboard (when ready) |

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Bot doesn't respond at all | Bot service crashed or token wrong | Check Railway bot logs, verify `TELEGRAM_BOT_TOKEN` |
| "Something went wrong" on every command | Backend unreachable or secret mismatch | Verify `BACKEND_URL` is correct, `INTERNAL_API_SECRET` matches in both services |
| No questions returned by `/today` | Database not seeded | Run `schema.sql` then `questions.sql` against your PostgreSQL |
| Web dashboard CORS error | Backend not allowing Vercel origin | Ensure `WEB_URL` is set correctly in backend env vars |
| Telegram Login Widget doesn't load | Bot username mismatch | Update `data-telegram-login` in `Login.jsx` to match your bot's username |
| Railway deploy fails | Missing dependencies | Check that `package.json` is in the root directory specified |
