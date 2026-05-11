module.exports = async (ctx) => {
  const webUrl = process.env.WEB_URL || 'https://preptrack-hazel.vercel.app';
  await ctx.reply(
    `📊 *Readiness Assessment*\n\nFind out exactly where you stand.\n\n• 5 questions, AI-evaluated\n• 15 minutes per question\n• Honest score out of 100\n\n[Start Assessment →](${webUrl}/diagnostic)`,
    { parse_mode: 'Markdown' }
  );
};
