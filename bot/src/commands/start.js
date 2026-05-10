const { Markup } = require('telegraf');
const api = require('../utils/api');

module.exports = async (ctx) => {
  const { id: telegramId, first_name, last_name, username } = ctx.from;
  const name = [first_name, last_name].filter(Boolean).join(' ');

  try {
    await api.upsertUser(telegramId, name, username);
    const companies = await api.getCompanies();

    // Build inline keyboard — free companies first, then Pro
    // Usually companies might have a property `is_pro_only`
    const buttons = companies.map((c) => [
      Markup.button.callback(
        c.is_pro_only ? `${c.name} 🔒` : c.name,
        `set_company:${c.slug}`
      ),
    ]);

    await ctx.reply(
      `Welcome to PrepTrack, ${first_name}! 👋\n\n` +
      `I send you company-specific DSA questions every day and track which topics you're weak at — then I send you more of those.\n\n` +
      `Pick your target company to get started:`,
      Markup.inlineKeyboard(buttons)
    );
  } catch (err) {
    console.error('/start error:', err.message);
    ctx.reply('Something went wrong. Please try /start again.');
  }
};
