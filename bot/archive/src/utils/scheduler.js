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

  try {
    const telegramIds = await api.getActiveUsers();
    
    for (const telegramId of telegramIds) {
      try {
        const { questions } = await api.getDailyQuestions(telegramId);
        
        if (questions && questions.length > 0) {
          await bot.telegram.sendMessage(
            telegramId,
            `⏰ *Time for your daily prep!*\nHere are your ${questions.length} questions for today:`,
            { parse_mode: 'Markdown' }
          );

          for (const q of questions) {
            const diffEmoji = q.difficulty === 'easy' ? '🟢 Easy' : q.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard';
            
            const message = `📌 *${q.title}*\n🏷️ ${q.topic_name}  •  ${diffEmoji}\n\n${q.leetcode_link || ''}\n\nDid you solve it?`;
            
            await bot.telegram.sendMessage(telegramId, message, {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: '✅ Solved', callback_data: `q_status:${q.id}:solved` },
                    { text: '😕 Stuck', callback_data: `q_status:${q.id}:stuck` },
                    { text: '⏭️ Skip', callback_data: `q_status:${q.id}:skipped` }
                  ]
                ]
              }
            });
          }
        }
      } catch (userErr) {
        console.error(`[scheduler] Failed to deliver to ${telegramId}:`, userErr.message);
      }
    }
  } catch (err) {
    console.error(`[scheduler] Failed to fetch active users:`, err.message);
  }

  console.log('[scheduler] Daily delivery complete');
}

function startScheduler(bot) {
  const schedule = process.env.DAILY_CRON || '0 3 * * *'; // 03:00 UTC is 08:30 IST, but plan says 9:00 AM IST. Let's use env or default to 0 3 * * *
  console.log(`[scheduler] Scheduled with cron: "${schedule}" (UTC)`);

  cron.schedule(schedule, () => {
    deliverDailyQuestions(bot).catch((err) =>
      console.error('[scheduler] Delivery error:', err)
    );
  });
}

module.exports = { startScheduler, deliverDailyQuestions };
