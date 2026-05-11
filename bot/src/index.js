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

  bot.launch().then(() => console.log('Telegram Bot started'));

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  module.exports = bot;
} else {
  console.log('TELEGRAM_BOT_TOKEN not found, bot disabled');
  module.exports = null;
}
