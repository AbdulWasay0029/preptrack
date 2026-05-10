module.exports = async (ctx) => {
  await ctx.reply(
    `🤖 *PrepTrack Bot Commands*\n\n` +
    `/start - Initialize or restart the bot\n` +
    `/today - Get your daily interview questions\n` +
    `/progress - View your analytics and stats\n` +
    `/settings - Update your target company and preferences\n` +
    `/web - Get a magic link to instantly access your dashboard\n` +
    `/help - Show this help message`,
    { parse_mode: 'Markdown' }
  );
};
