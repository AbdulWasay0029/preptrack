# Handover Document - PrepTrack

## Status Update (2026-05-11)

### 1. UI Fixes (Web)
- **Landing Page Text Wrapping**: The previous fix failed. The text was still wrapping word-by-word. I have now removed the custom `font-body-base` and `text-body-base` classes and added `w-full` to the paragraph tag to force it to fill the width. Pushed to `main`.
- **Dynamic Companies**: Updated the landing page to fetch companies dynamically from the API (`/questions/companies`).
- **Login Page Background**: Updated hardcoded backgrounds to use theme tokens.

### 2. Bot Status & Login
- **Issue**: The user reported that the bot is still not responding and the Telegram Login Widget is not working.
- **Bot Responsiveness**: Added `bot.telegram.deleteWebhook()` before `bot.launch()` in `bot/src/index.js` to clear any stale webhooks. Pushed to `main`.
- **Telegram Login Widget**: The widget might be failing due to the domain not being registered with BotFather for the bot.

### 3. Next Steps
- Verify the new text wrapping fix on the landing page.
- Guide the user to check BotFather settings for the domain `preptrack-hazel.vercel.app`.
