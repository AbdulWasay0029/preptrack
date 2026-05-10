require('dotenv').config();
const { Telegraf } = require('telegraf');
const { startScheduler } = require('./utils/scheduler');

// Import command handlers
const startCommand = require('./commands/start');
const todayCommand = require('./commands/today');
const progressCommand = require('./commands/progress');
const settingsCommand = require('./commands/settings');
const questionCallback = require('./handlers/questionCallback');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Register commands
bot.command('start', startCommand);
bot.command('today', todayCommand);
bot.command('progress', progressCommand);
bot.command('settings', settingsCommand);

// Register inline keyboard callbacks
bot.on('callback_query', questionCallback);

// Handle unknown messages
bot.on('message', (ctx) => {
  ctx.reply('Use /today to get your questions, /progress to see your stats, /settings to update preferences.');
});

// Start
bot.launch().then(() => {
  console.log('PrepTrack bot started');
  startScheduler(bot);
});

// Start a dummy HTTP server so Render (Free Web Service) doesn't crash the bot
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('PrepTrack Bot is running!\n');
}).listen(PORT, () => {
  console.log(`Dummy web server listening on port ${PORT} to keep Render happy`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
