const { Markup } = require('telegraf');
const api = require('../utils/api');

module.exports = async (ctx) => {
  const { id: telegramId, first_name, last_name, username } = ctx.from;
  const name = [first_name, last_name].filter(Boolean).join(' ');
  
  const payload = ctx.payload || (ctx.message.text ? ctx.message.text.split(' ')[1] : '');
  const isFromWeb = payload === 'web';

  try {
    await api.upsertUser(telegramId, name, username);
    const companies = await api.getCompanies();

    // Build inline keyboard — free companies first, then Pro
    const buttons = companies.map((c) => [
      Markup.button.callback(
        c.is_pro_only ? `${c.name} 🔒` : c.name,
        `set_company:${c.slug}`
      ),
    ]);

    let welcomeMsg = `Welcome to PrepTrack, ${first_name}! 👋\n\n` +
      `I send you company-specific DSA questions every day and track which topics you're weak at — then I send you more of those.\n\n`;

    if (isFromWeb) {
      const webUrl = process.env.WEB_URL || 'https://preptrack-hazel.vercel.app';
      welcomeMsg += `🌐 *Access your Web Dashboard*\n` +
        `Click the secure magic link below to instantly log in:\n` +
        `${webUrl}/?login=${telegramId}\n\n`;
    }

    welcomeMsg += `Pick your target company to get started:`;

    await ctx.reply(
      welcomeMsg,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(buttons)
      }
    );
    await ctx.reply('Tap a company above to get started.');
  } catch (err) {
    console.error('/start error:', err.message);
    ctx.reply('Something went wrong. Please try /start again.');
  }
};
