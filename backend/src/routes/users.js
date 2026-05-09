const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireInternalAuth, verifyTelegramLogin } = require('../middleware/auth');

// POST /users — create or update a user (called by bot on /start)
router.post('/', requireInternalAuth, async (req, res) => {
  const { telegram_id, name, username } = req.body;
  if (!telegram_id) return res.status(400).json({ error: 'telegram_id required' });

  try {
    const { rows } = await db.query(
      `INSERT INTO users (telegram_id, name, username)
       VALUES ($1, $2, $3)
       ON CONFLICT (telegram_id)
       DO UPDATE SET name = EXCLUDED.name, username = EXCLUDED.username
       RETURNING *`,
      [telegram_id, name || null, username || null]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('POST /users error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /users/:telegram_id — fetch user by telegram ID
router.get('/:telegram_id', requireInternalAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT u.*, c.slug AS company_slug, c.name AS company_name
       FROM users u
       LEFT JOIN companies c ON u.target_company_id = c.id
       WHERE u.telegram_id = $1`,
      [req.params.telegram_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /users/:telegram_id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /users/:telegram_id — update company, questions_per_day
router.patch('/:telegram_id', requireInternalAuth, async (req, res) => {
  const { target_company_slug, questions_per_day } = req.body;
  const updates = [];
  const values = [];
  let idx = 1;

  if (target_company_slug) {
    updates.push(
      `target_company_id = (SELECT id FROM companies WHERE slug = $${idx++})`
    );
    values.push(target_company_slug);
  }
  if (questions_per_day) {
    updates.push(`questions_per_day = $${idx++}`);
    values.push(questions_per_day);
  }
  if (!updates.length) return res.status(400).json({ error: 'Nothing to update' });

  values.push(req.params.telegram_id);
  try {
    const { rows } = await db.query(
      `UPDATE users SET ${updates.join(', ')}
       WHERE telegram_id = $${idx}
       RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /users/:telegram_id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /users/auth/telegram — web dashboard login via Telegram Login Widget
router.post('/auth/telegram', async (req, res) => {
  const data = req.body;
  if (!verifyTelegramLogin(data)) {
    return res.status(401).json({ error: 'Invalid Telegram login data' });
  }

  // Check that auth_date is not older than 24 hours
  const authDate = parseInt(data.auth_date, 10);
  if (Date.now() / 1000 - authDate > 86400) {
    return res.status(401).json({ error: 'Login data expired' });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO users (telegram_id, name, username)
       VALUES ($1, $2, $3)
       ON CONFLICT (telegram_id)
       DO UPDATE SET name = EXCLUDED.name, username = EXCLUDED.username
       RETURNING *`,
      [data.id, data.first_name + (data.last_name ? ' ' + data.last_name : ''), data.username || null]
    );
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('POST /users/auth/telegram error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
