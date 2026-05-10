const { Markup } = require('telegraf');
const api = require('../utils/api');

module.exports = async (ctx) => {
  const telegramId = ctx.from.id;

  try {
    const user = await api.getUser(telegramId);

    const companyName = user.target_company_name || 'Not set';
    const qpd = user.questions_per_day || 3;
    const tier = user.is_pro ? '⭐ Pro' : '🆓 Free';

    let message =
      `⚙️ Your Settings\n\n` +
      `🏢 Target Company: ${companyName}\n` +
      `📝 Questions/Day: ${qpd}\n` +
      `📦 Plan: ${tier}\n\n` +
      `What would you like to change?`;

    await ctx.reply(
      message,
      Markup.inlineKeyboard([
        [Markup.button.callback('🏢 Change Company', 'settings:company')],
        [Markup.button.callback('📝 Questions Per Day', 'settings:qpd')],
      ])
    );
  } catch (err) {
    console.error('/settings error:', err.message);
    await ctx.reply('Something went wrong loading your settings. Please try /settings again.');
  }
};
