require('dotenv').config();
const { Telegraf } = require('telegraf');
const { startScheduler } = require('./utils/scheduler');

// Import command handlers
const startCommand = require('./commands/start');
const todayCommand = require('./commands/today');
const progressCommand = require('./commands/progress');
const settingsCommand = require('./commands/settings');
const webCommand = require('./commands/web');
const helpCommand = require('./commands/help');
const upgradeCommand = require('./commands/upgrade');
const suggestCommand = require('./commands/suggest');
const assessCommand = require('./commands/assess');
const questionCallback = require('./handlers/questionCallback');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Register commands
bot.command('start', startCommand);
bot.command('today', todayCommand);
bot.command('progress', progressCommand);
bot.command('settings', settingsCommand);
bot.command('web', webCommand);
bot.command('help', helpCommand);
bot.command('assess', assessCommand);
upgradeCommand(bot); // Custom register for upgrade
suggestCommand(bot); // Custom register for suggest

// Register inline keyboard callbacks
bot.on('callback_query', questionCallback);

// Handle unknown messages
bot.on('message', (ctx) => {
  ctx.reply('I didn\'t understand that. Type /help to see all available commands!');
});

// Start
bot.telegram.deleteWebhook().then(() => {
  console.log('Webhook deleted, launching bot...');
  bot.launch().then(() => {
    console.log('PrepTrack bot started');
    startScheduler(bot);
  });
}).catch(err => {
  console.error('Failed to launch bot:', err);
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
