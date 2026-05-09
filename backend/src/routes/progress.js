const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireInternalAuth } = require('../middleware/auth');
const { refreshWeakTopicCache } = require('../services/adaptiveEngine');

// POST /progress — record a question attempt
// Body: { telegram_id, question_id, status: 'solved'|'stuck'|'skipped' }
router.post('/', requireInternalAuth, async (req, res) => {
  const { telegram_id, question_id, status } = req.body;
  if (!telegram_id || !question_id || !status) {
    return res.status(400).json({ error: 'telegram_id, question_id, status required' });
  }
  const validStatuses = ['solved', 'stuck', 'skipped'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'status must be solved, stuck, or skipped' });
  }

  try {
    const { rows: userRows } = await db.query(
      'SELECT id FROM users WHERE telegram_id = $1',
      [telegram_id]
    );
    if (!userRows.length) return res.status(404).json({ error: 'User not found' });
    const userId = userRows[0].id;

    // Insert progress row
    await db.query(
      `INSERT INTO user_progress (user_id, question_id, status)
       VALUES ($1, $2, $3)`,
      [userId, question_id, status]
    );

    // Update streak
    await db.query(
      `UPDATE users
       SET last_active_date = CURRENT_DATE,
           streak = CASE
             WHEN last_active_date = CURRENT_DATE - INTERVAL '1 day' THEN streak + 1
             WHEN last_active_date = CURRENT_DATE THEN streak
             ELSE 1
           END
       WHERE id = $1`,
      [userId]
    );

    // Refresh weak topic cache asynchronously (don't block response)
    refreshWeakTopicCache(userId, db).catch((err) =>
      console.error('refreshWeakTopicCache error:', err)
    );

    res.json({ ok: true });
  } catch (err) {
    console.error('POST /progress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /progress/:telegram_id/summary — quick summary for bot /progress command
router.get('/:telegram_id/summary', requireInternalAuth, async (req, res) => {
  try {
    const { rows: userRows } = await db.query(
      'SELECT id, streak FROM users WHERE telegram_id = $1',
      [req.params.telegram_id]
    );
    if (!userRows.length) return res.status(404).json({ error: 'User not found' });
    const { id: userId, streak } = userRows[0];

    const { rows: stats } = await db.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'solved')  AS solved,
         COUNT(*) FILTER (WHERE status = 'stuck')   AS stuck,
         COUNT(*) FILTER (WHERE status = 'skipped') AS skipped,
         COUNT(*)                                    AS total
       FROM user_progress
       WHERE user_id = $1
         AND attempted_at > NOW() - INTERVAL '30 days'`,
      [userId]
    );

    const { rows: weakTopics } = await db.query(
      `SELECT t.name, uwt.weak_score
       FROM user_weak_topics uwt
       JOIN topics t ON uwt.topic_id = t.id
       WHERE uwt.user_id = $1
         AND uwt.weak_score > 0.4
       ORDER BY uwt.weak_score DESC
       LIMIT 3`,
      [userId]
    );

    res.json({
      streak,
      last30Days: stats[0],
      weakTopics,
    });
  } catch (err) {
    console.error('GET /progress/summary error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
