# Handover Document - PrepTrack

## Status Update (2026-05-11 - Final Session)

### 1. Work Accomplished

*   **Reverted Landing Page Code Block to Green**: Restored the monochrome green look for the syntax-highlighted code block on the landing page (as requested by user).
*   **Fixed Bug 1 — Bot `/start` Message Order**: Fixed the issue where confirmation messages appeared before the company selection. The company picker now shows first with the correct caption.
*   **Fixed Bug 2 — Duplicate Questions in `/today`**: Added deduplication logic in `backend/src/services/adaptiveEngine.js` to ensure unique questions are selected.
*   **Cleared Cached Deliveries**: Cleared the daily deliveries for user "Abdul Wasay" for today (2026-05-11) so the fix can be tested immediately without waiting for tomorrow.
*   **Fixed Company Display Inconsistency**: Updated the `/companies` endpoint in the backend to compute `is_pro_only` based on the hardcoded list of free companies (`amazon`, `microsoft`). This ensures that companies like Google appear as Pro on the landing page and bot buttons, matching the backend check.
*   **Investigated Symbols Issue**: Verified that the Material Symbols font link is correctly included in `web/index.html`.

### 2. Known Issues & Notes

*   **Material Symbols**: The user reported that symbols broke down again. The link is present in `index.html`. It might be a temporary network issue or caching. If it persists, consider adding a fallback or checking network console.
*   **Telegram Login Widget**: The user reported they don't get a message after entering their phone number. Explained that the message comes from the "Telegram" system chat, not the bot itself.

### 3. Next Steps

*   User to verify if the duplicate questions issue is fixed by running `/today` again (deliveries have been cleared).
*   User to check if the company display (Pro vs Free) matches expectations on the landing page and bot.
*   User to check the "Telegram" system chat for the login verification message.
