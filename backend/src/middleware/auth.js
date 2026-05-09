/**
 * Internal API auth middleware.
 * The bot calls the backend with a shared secret in the Authorization header.
 * Format: Authorization: Bearer <INTERNAL_API_SECRET>
 */
function requireInternalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.slice(7);
  if (token !== process.env.INTERNAL_API_SECRET) {
    return res.status(403).json({ error: 'Invalid API secret' });
  }

  next();
}

/**
 * Telegram Login Widget verification.
 * Used for web dashboard login — verifies the hash Telegram sends back.
 */
const crypto = require('crypto');

function verifyTelegramLogin(data) {
  const { hash, ...fields } = data;
  const secret = crypto
    .createHash('sha256')
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();

  const checkString = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join('\n');

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(checkString)
    .digest('hex');

  return hmac === hash;
}

module.exports = { requireInternalAuth, verifyTelegramLogin };
