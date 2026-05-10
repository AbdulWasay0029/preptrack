# PrepTrack — Deployment Guide

> Step-by-step instructions for deploying PrepTrack to production.
> **Stack:** Render (backend + bot) + Neon (PostgreSQL) + Vercel (web dashboard) + Vercel (web dashboard)

---

## Prerequisites

- GitHub repo pushed: `https://github.com/AbdulWasay0029/preptrack.git`
- Telegram bot token from [@BotFather](https://t.me/BotFather)
- (Optional) Razorpay account for payments

---

## 1. Neon — PostgreSQL Database

1. Go to [neon.tech](https://neon.tech) → **Create Project**
2. In the dashboard, copy the PostgreSQL connection string from the connection details.
3. This is your `DATABASE_URL` — you'll need it for the backend.

### Seed the database

Connect from your terminal:
```bash
# Install psql locally, then:
psql "<your-neon-DATABASE_URL>" -f database/schema.sql
psql "<your-neon-DATABASE_URL>" -f database/seed/questions.sql
```

Alternatively, you can just run the node seed script:
```bash
node database/seed-neon.js
```
---

## 2. Render — Backend Service

1. Go to [render.com](https://render.com) → Dashboard → **New** → **Web Service**
2. Select your GitHub repo `AbdulWasay0029/preptrack`
3. In **Settings**:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. In **Environment Variables**, add:

```env
DATABASE_URL=<copied from Neon>
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

5. Render will auto-deploy.
6. Once deployed, copy the **public URL** (e.g., `https://preptrack-backend.onrender.com`)

---

## 3. Render — Bot Service

1. In Render dashboard, click **New** → **Background Worker**
2. Select the same repo `AbdulWasay0029/preptrack`
3. In **Settings**:
   - **Root Directory:** `bot`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. In **Environment Variables**, add:

```env
TELEGRAM_BOT_TOKEN=<same bot token as backend>
BACKEND_URL=<Render backend URL from step 2, e.g., https://preptrack-backend.onrender.com>
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
VITE_API_URL=<Render backend URL from step 2>
VITE_TELEGRAM_BOT_NAME=<Your exact bot username without the @>
```

5. Click **Deploy**
6. Once live, copy the Vercel URL (e.g., `https://preptrack.vercel.app`)
7. Go back to Render → Backend service → Environment → update `WEB_URL` to this Vercel URL

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

### Render
1. Go to your backend service → **Settings** → **Custom Domains**
2. Add your API domain (e.g., `api.preptrack.tech`)
3. Update `VITE_API_URL` in Vercel and `BACKEND_URL` in the bot service

---

## Environment Variables — Quick Reference

| Variable | Where | Value |
|----------|-------|-------|
| `DATABASE_URL` | Backend | Neon PostgreSQL connection string |
| `PORT` | Backend | `3001` |
| `NODE_ENV` | Backend | `production` |
| `INTERNAL_API_SECRET` | Backend + Bot | Same random 32+ char string in both |
| `TELEGRAM_BOT_TOKEN` | Backend + Bot | From @BotFather |
| `WEB_URL` | Backend | Your Vercel URL |
| `BACKEND_URL` | Bot | Your Render backend URL |
| `DAILY_CRON` | Bot | Cron expression (UTC), default `30 2 * * *` |
| `VITE_API_URL` | Web | Your Render backend URL |
| `VITE_TELEGRAM_BOT_NAME` | Web | Exact Bot username without @ (e.g., `PrepTrackBot`) |
| `RAZORPAY_KEY_ID` | Backend | From Razorpay dashboard (when ready) |
| `RAZORPAY_KEY_SECRET` | Backend | From Razorpay dashboard (when ready) |

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Bot doesn't respond at all | Bot service crashed or token wrong | Check Render bot logs, verify `TELEGRAM_BOT_TOKEN` |
| "Something went wrong" on every command | Backend unreachable or secret mismatch | Verify `BACKEND_URL` is correct, `INTERNAL_API_SECRET` matches in both services |
| No questions returned by `/today` | Database not seeded | Run `node database/seed-neon.js` locally to populate Neon |
| Web dashboard CORS error | Backend not allowing Vercel origin | Ensure `WEB_URL` is set correctly in backend env vars |
| Telegram Login Widget doesn't load | Bot username mismatch | Update `data-telegram-login` in `Login.jsx` to match your bot's username |
| Render deploy fails | Missing dependencies | Check that `package.json` is in the root directory specified |
