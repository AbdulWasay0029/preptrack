const { Markup } = require('telegraf');

function registerUpgradeCommand(bot) {
  bot.command('upgrade', async (ctx) => {
    try {
      // In a real scenario, you'd generate a dynamic payment link from Stripe or Razorpay API
      // For now, we return a static / dummy link for the checkout page.
      const paymentLink = process.env.PAYMENT_LINK || 'https://razorpay.com/payment-link/dummy';

      await ctx.reply(
        '🚀 *Upgrade to PrepTrack Pro*\n\n' +
        'Unlock top-tier companies (Google, Apple, Swiggy, Uber) and advanced analytics.\n\n' +
        'Price: ₹499 (Lifetime Access)',
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.url('Pay with Razorpay', paymentLink)]
          ])
        }
      );
    } catch (error) {
      console.error('Error in /upgrade command:', error);
      ctx.reply('Failed to retrieve upgrade link. Please try again later.');
    }
  });
}

module.exports = registerUpgradeCommand;
