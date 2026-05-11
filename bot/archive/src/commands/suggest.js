module.exports = function registerSuggestCommand(bot) {
  bot.command('suggest', async (ctx) => {
    try {
      const messageText = ctx.message.text;
      const parts = messageText.split(' ');
      
      if (parts.length < 2) {
        return ctx.reply('Please provide a LeetCode or GeeksForGeeks URL.\nUsage: /suggest <url>');
      }

      const url = parts[1];
      if (!url.startsWith('http')) {
        return ctx.reply('Please provide a valid URL starting with http:// or https://');
      }

      const telegramId = ctx.from.id.toString();
      const api = require('../utils/api');
      
      await api.client.post('/users/suggest', { telegram_id: telegramId, url });

      await ctx.reply('✅ Thank you! Your suggestion has been recorded and will be reviewed by our team.');
    } catch (error) {
      console.error('Error in /suggest command:', error);
      ctx.reply('Failed to submit suggestion. You might need to run /start first to register your account.');
    }
  });
};
