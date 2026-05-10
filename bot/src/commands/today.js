const { Markup } = require('telegraf');
const api = require('../utils/api');

const DIFFICULTY_DISPLAY = {
  easy: '🟢 Easy',
  medium: '🟡 Medium',
  hard: '🔴 Hard',
};

module.exports = async (ctx) => {
  const telegramId = ctx.from.id;

  try {
    const questions = await api.getDailyQuestions(telegramId);

    if (!questions || questions.length === 0) {
      await ctx.reply(
        "You're all caught up! 🎉\n\n" +
        "No new questions for today. Come back tomorrow or use /settings to increase your daily count."
      );
      return;
    }

    await ctx.reply(`📚 Here are your ${questions.length} questions for today:\n`);

    for (const q of questions) {
      const difficulty = DIFFICULTY_DISPLAY[q.difficulty] || q.difficulty;
      const message =
        `📌 ${q.title}\n` +
        `🏷️ ${q.topic_name}  •  ${difficulty}\n\n` +
        `${q.leetcode_link}\n\n` +
        `Did you solve it?`;

      await ctx.reply(
        message,
        Markup.inlineKeyboard([
          Markup.button.callback('✅ Solved', `q_status:${q.id}:solved`),
          Markup.button.callback('😕 Stuck', `q_status:${q.id}:stuck`),
          Markup.button.callback('⏭️ Skip', `q_status:${q.id}:skipped`),
        ])
      );
    }
  } catch (err) {
    // Handle Pro-gated company error
    if (err.response && err.response.status === 403) {
      await ctx.reply(
        '🔒 Your target company requires a Pro subscription.\n\n' +
        'Upgrade to Pro (₹199/month) to unlock all 8 companies, unlimited daily questions, and full weak-topic analysis.\n\n' +
        'Switch to Amazon or Microsoft for free access, or visit the web dashboard to upgrade.'
      );
      return;
    }

    console.error('/today error:', err.message);
    await ctx.reply('Something went wrong fetching your questions. Please try /today again.');
  }
};
