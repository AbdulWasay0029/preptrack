module.exports = async (ctx) => {
  const telegramId = ctx.from.id;
  const webUrl = process.env.WEB_URL || 'https://preptrack-hazel.vercel.app';
  
  await ctx.reply(
    `🌐 *Access your Web Dashboard*\n\n` +
    `Click the secure magic link below to instantly log in (no phone number required!):\n\n` +
    `${webUrl}/?login=${telegramId}`,
    { parse_mode: 'Markdown' }
  );
};
