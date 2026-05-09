const cron = require('node-cron');
const api = require('./api');

/**
 * Delivers daily questions to all registered users.
 * Runs on DAILY_CRON schedule (default: 8:00 AM IST).
 *
 * Note: The bot fetches each user's questions from the backend,
 * which handles adaptive selection, caching, and deduplication.
 */
async function deliverDailyQuestions(bot) {
  console.log(`[scheduler] Starting daily delivery — ${new Date().toISOString()}`);

  // In production, you'd paginate through all users from the DB.
  // For now the backend /questions/daily/:id handles delivery logic;
  // the scheduler just needs a list of telegram_ids to trigger for.
  // This is intentionally left as a thin trigger — the backend owns the logic.

  // TODO Week 2: fetch all active user IDs from backend and trigger delivery.
  // For testing, trigger manually via /today command.
  console.log('[scheduler] Daily delivery complete');
}

function startScheduler(bot) {
  const schedule = process.env.DAILY_CRON || '30 2 * * *';
  console.log(`[scheduler] Scheduled with cron: "${schedule}" (UTC)`);

  cron.schedule(schedule, () => {
    deliverDailyQuestions(bot).catch((err) =>
      console.error('[scheduler] Delivery error:', err)
    );
  });
}

module.exports = { startScheduler, deliverDailyQuestions };
