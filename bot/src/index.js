const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

if (process.env.TELEGRAM_BOT_TOKEN) {
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  const APP_URL = process.env.APP_URL || 'http://localhost:3000';

  bot.start((ctx) => {
    const payload = ctx.startPayload;
    const telegramId = ctx.from.id;

    if (payload === 'link') {
      ctx.reply(`Account found! Click below to open your dashboard and finish linking.`, 
        Markup.inlineKeyboard([
          [Markup.button.url('Open Dashboard', `${APP_URL}/dashboard?telegram_id=${telegramId}`)]
        ])
      );
      return;
    }

    ctx.reply('Welcome to PrepTrack! I am here to help you master DSA and system design for your placements.\n\nUse /assess to start a diagnostic assessment.', 
      Markup.keyboard([['/assess', '/progress']]).resize()
    );
  });

  bot.command('assess', (ctx) => {
    const telegramId = ctx.from.id;
    
    // Show company options
    ctx.reply('Which company are you targeting?', 
      Markup.inlineKeyboard([
        [Markup.button.callback('Google', 'comp_google'), Markup.button.callback('Amazon', 'comp_amazon')],
        [Markup.button.callback('Microsoft', 'comp_microsoft'), Markup.button.callback('Meta', 'comp_meta')],
        [Markup.button.callback('Startup / General', 'comp_general')],
      ])
    );
  });

  bot.action(/comp_(.+)/, async (ctx) => {
    const companySlug = ctx.match[1];
    const telegramId = ctx.from.id;
    
    // Generate assessment URL
    const url = `${APP_URL}/diagnostic?telegram_id=${telegramId}&company=${companySlug}`;
    
    if (url.includes('localhost')) {
      await ctx.answerCbQuery();
      await ctx.reply(`⚠️ I cannot send a link to 'localhost' on Telegram. Please set the **APP_URL** environment variable in Render to your Vercel URL!`);
      return;
    }
    
    await ctx.answerCbQuery();
    await ctx.reply(`Great! Starting your diagnostic assessment for ${companySlug.toUpperCase()}.\n\nClick below to begin:`, 
      Markup.inlineKeyboard([
        [Markup.button.url('Start Assessment', url)]
      ])
    );
  });

  bot.command('progress', (ctx) => {
    const telegramId = ctx.from.id;
    const url = `${APP_URL}/progress?telegram_id=${telegramId}`;
    ctx.reply('Check your latest interview readiness score and focus areas here:', 
      Markup.inlineKeyboard([
        [Markup.button.url('View Progress', url)]
      ])
    );
  });

  bot.telegram.deleteWebhook().then(() => {
    console.log('Webhook deleted, launching bot...');
    bot.launch().then(() => console.log('Telegram Bot started'));
  }).catch(err => {
    console.error('Failed to delete webhook:', err);
    bot.launch().then(() => console.log('Telegram Bot started'));
  });

  // Start a dummy HTTP server so Render (Free Web Service) doesn't crash the bot
  const http = require('http');
  const PORT = process.env.PORT || 3000;
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('PrepTrack Bot is running!\n');
  }).listen(PORT, "0.0.0.0", () => {
    console.log(`Dummy web server listening on port ${PORT} to keep Render happy`);
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  module.exports = bot;
} else {
  console.log('TELEGRAM_BOT_TOKEN not found, bot disabled');
  module.exports = null;
}
