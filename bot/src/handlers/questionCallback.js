const { Markup } = require('telegraf');
const api = require('../utils/api');

const STATUS_RESPONSES = {
  solved: '✅ Marked as solved. Nice work!',
  stuck: '😕 Marked as stuck. No worries — this topic will come back in future sessions so you can nail it.',
  skipped: '⏭️ Skipped. It\'ll reappear later when the time is right.',
};

module.exports = async (ctx) => {
  const data = ctx.callbackQuery.data;
  const telegramId = ctx.from.id;

  try {
    // ── Company selection (from /start or /settings) ──
    if (data.startsWith('set_company:')) {
      const slug = data.split(':')[1];

      try {
        await api.updateUser(telegramId, { target_company_slug: slug });
        await ctx.editMessageText(
          `✅ Target company set to *${slug}*!\n\n` +
          `Use /today to get your first batch of questions.\n` +
          `Use /progress anytime to see your stats.`,
          { parse_mode: 'Markdown' }
        );
      } catch (err) {
        // Handle Pro-gated company
        if (err.response && err.response.status === 403) {
          await ctx.editMessageText(
            `🔒 *${slug}* requires a Pro subscription (₹199/month).\n\n` +
            `Free tier includes Amazon and Microsoft.\n` +
            `Upgrade on the web dashboard to unlock all companies.`,
            { parse_mode: 'Markdown' }
          );
        } else {
          throw err;
        }
      }
    }

    // ── Question status (solved/stuck/skipped from /today) ──
    if (data.startsWith('q_status:')) {
      const [, questionId, status] = data.split(':');

      await api.recordProgress(telegramId, parseInt(questionId, 10), status);

      const response = STATUS_RESPONSES[status] || 'Response recorded.';
      await ctx.editMessageReplyMarkup(undefined); // remove the inline keyboard
      await ctx.editMessageText(
        ctx.callbackQuery.message.text + `\n\n${response}`
      );
    }

    // ── Settings: show company picker ──
    if (data === 'settings:company') {
      const companies = await api.getCompanies();

      const buttons = companies.map((c) => [
        Markup.button.callback(
          c.is_pro_only ? `${c.name} 🔒` : c.name,
          `set_company:${c.slug}`
        ),
      ]);

      await ctx.editMessageText(
        '🏢 Pick your new target company:',
        Markup.inlineKeyboard(buttons)
      );
    }

    // ── Settings: show questions-per-day picker ──
    if (data === 'settings:qpd') {
      const user = await api.getUser(telegramId);
      const maxQpd = user.is_pro ? 10 : 3;

      const buttons = [];
      for (let i = 1; i <= maxQpd; i++) {
        buttons.push(Markup.button.callback(`${i}`, `set_qpd:${i}`));
      }

      let note = '';
      if (!user.is_pro) {
        note = '\n\n🔒 Free tier: max 3/day. Upgrade to Pro for up to 10.';
      }

      const chunkedButtons = [];
      for (let i = 0; i < buttons.length; i += 5) {
        chunkedButtons.push(buttons.slice(i, i + 5));
      }

      await ctx.editMessageText(
        `📝 How many questions per day?${note}`,
        Markup.inlineKeyboard(chunkedButtons)
      );
    }

    // ── Set questions-per-day value ──
    if (data.startsWith('set_qpd:')) {
      const count = parseInt(data.split(':')[1], 10);

      await api.updateUser(telegramId, { questions_per_day: count });
      await ctx.editMessageText(
        `✅ Questions per day set to *${count}*.\n\n` +
        `Your next /today will reflect this change.`,
        { parse_mode: 'Markdown' }
      );
    }
  } catch (err) {
    console.error('Callback error:', err.message);
    // Attempt to notify the user without crashing
    try {
      await ctx.reply('Something went wrong processing that action. Please try again.');
    } catch (_) {
      // Silently fail if we can't even reply
    }
  }

  // Always answer the callback query to dismiss Telegram's loading spinner
  await ctx.answerCbQuery().catch(() => {});
};
