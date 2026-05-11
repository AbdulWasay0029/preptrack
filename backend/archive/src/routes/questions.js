const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireInternalAuth } = require('../middleware/auth');
const { selectDailyQuestions } = require('../services/adaptiveEngine');

// GET /questions/companies — list all active companies
router.get('/companies', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, slug, name, is_pro_only FROM companies WHERE is_active = TRUE ORDER BY name`
    );
    
    const freeCompanies = ['amazon', 'microsoft'];
    const enriched = rows.map(r => ({
      ...r,
      is_pro_only: !freeCompanies.includes(r.slug)
    }));
    
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /questions/daily/:telegram_id — get today's questions for a user
// Called by the bot's daily scheduler and /today command
router.get('/daily/:telegram_id', requireInternalAuth, async (req, res) => {
  try {
    const { rows: userRows } = await db.query(
      `SELECT u.*, c.slug AS company_slug
       FROM users u
       LEFT JOIN companies c ON u.target_company_id = c.id
       WHERE u.telegram_id = $1`,
      [req.params.telegram_id]
    );
    if (!userRows.length) return res.status(404).json({ error: 'User not found' });

    const user = userRows[0];
    if (!user.company_slug) {
      return res.status(400).json({ error: 'User has no target company set' });
    }

    // Free tier: max 3 questions, only 2 companies
    const freeCompanies = ['amazon', 'microsoft'];
    if (!user.is_pro && !freeCompanies.includes(user.company_slug)) {
      return res.status(403).json({
        error: 'pro_required',
        message: 'Upgrade to Pro to unlock all companies.',
      });
    }
    const count = user.is_pro ? user.questions_per_day : Math.min(user.questions_per_day, 3);

    // Check if already delivered today
    const { rows: todayCheck } = await db.query(
      `SELECT COUNT(*) AS cnt FROM daily_deliveries
       WHERE user_id = $1 AND delivered_on = CURRENT_DATE`,
      [user.id]
    );
    if (parseInt(todayCheck[0].cnt) >= count) {
      // Return today's questions from cache
      const { rows: cached } = await db.query(
        `SELECT q.*, t.name AS topic_name
         FROM daily_deliveries dd
         JOIN questions q ON dd.question_id = q.id
         JOIN topics t ON q.topic_id = t.id
         WHERE dd.user_id = $1 AND dd.delivered_on = CURRENT_DATE`,
        [user.id]
      );
      return res.json({ questions: cached, cached: true });
    }

    // Select fresh questions
    const questions = await selectDailyQuestions(
      user.id,
      user.company_slug,
      count,
      db,
      user.is_pro
    );

    if (!questions.length) {
      return res.status(404).json({ error: 'No questions available for this company yet' });
    }

    // Record deliveries
    for (const q of questions) {
      await db.query(
        `INSERT INTO daily_deliveries (user_id, question_id, delivered_on)
         VALUES ($1, $2, CURRENT_DATE)
         ON CONFLICT DO NOTHING`,
        [user.id, q.id]
      );
    }

    // Fetch with topic names
    const ids = questions.map((q) => q.id);
    const { rows: enriched } = await db.query(
      `SELECT q.*, t.name AS topic_name
       FROM questions q
       JOIN topics t ON q.topic_id = t.id
       WHERE q.id = ANY($1::int[])`,
      [ids]
    );

    res.json({ questions: enriched, cached: false });
  } catch (err) {
    console.error('GET /questions/daily error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
