const api = require('../utils/api');

module.exports = async (ctx) => {
  const telegramId = ctx.from.id;

  try {
    const summary = await api.getSummary(telegramId);

    const { streak, last30Days, weakTopics } = summary;
    const s = last30Days || { solved: 0, stuck: 0, skipped: 0, total: 0 };

    let message =
      `📊 Your PrepTrack Stats (last 30 days)\n\n` +
      `🔥 Streak: ${streak || 0} days\n` +
      `✅ Solved: ${s.solved}   😕 Stuck: ${s.stuck}   ⏭️ Skipped: ${s.skipped}\n`;

    if (weakTopics && weakTopics.length > 0) {
      message += `\n⚠️ Weak Topics (focus here):\n`;
      for (const topic of weakTopics) {
        const pct = Math.round(topic.weak_score * 100);
        message += `• ${topic.name} — score ${pct}%\n`;
      }
    } else {
      message += `\n✨ No weak topics detected yet — keep solving to build your profile.\n`;
    }

    message += `\nKeep at it. Tomorrow's questions will target your weak areas.`;

    await ctx.reply(message);
  } catch (err) {
    console.error('/progress error:', err.message);
    await ctx.reply('Something went wrong loading your progress. Please try /progress again.');
  }
};
