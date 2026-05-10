const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireInternalAuth } = require('../middleware/auth');

// GET /analytics/:telegram_id — full analytics for web dashboard
router.get('/:telegram_id', async (req, res) => {
  try {
    const { rows: userRows } = await db.query(
      `SELECT u.id, u.name, u.streak, c.slug AS company_slug, c.name AS company_name
       FROM users u
       LEFT JOIN companies c ON u.target_company_id = c.id
       WHERE u.telegram_id = $1`,
      [req.params.telegram_id]
    );
    if (!userRows.length) return res.status(404).json({ error: 'User not found' });
    const { id: userId, name, streak, company_name } = userRows[0];

    // Overall stats
    const { rows: overall } = await db.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'solved')  AS total_solved,
         COUNT(*) FILTER (WHERE status = 'stuck')   AS total_stuck,
         COUNT(*) FILTER (WHERE status = 'skipped') AS total_skipped,
         COUNT(*)                                    AS total_attempted
       FROM user_progress
       WHERE user_id = $1`,
      [userId]
    );

    // Per-topic breakdown
    const { rows: topicBreakdown } = await db.query(
      `SELECT
         t.name AS topic,
         COUNT(*) FILTER (WHERE up.status = 'solved')  AS solved,
         COUNT(*) FILTER (WHERE up.status = 'stuck')   AS stuck,
         COUNT(*) FILTER (WHERE up.status = 'skipped') AS skipped,
         COALESCE(uwt.weak_score, 0)                   AS weak_score
       FROM user_progress up
       JOIN questions q  ON up.question_id = q.id
       JOIN topics t     ON q.topic_id = t.id
       LEFT JOIN user_weak_topics uwt
         ON uwt.user_id = up.user_id AND uwt.topic_id = t.id
       WHERE up.user_id = $1
       GROUP BY t.name, uwt.weak_score
       ORDER BY weak_score DESC`,
      [userId]
    );

    // Daily activity (last 30 days) — for streak/calendar view
    const { rows: dailyActivity } = await db.query(
      `SELECT
         DATE(attempted_at) AS date,
         COUNT(*) AS questions_attempted,
         COUNT(*) FILTER (WHERE status = 'solved') AS solved
       FROM user_progress
       WHERE user_id = $1
         AND attempted_at > NOW() - INTERVAL '30 days'
       GROUP BY DATE(attempted_at)
       ORDER BY date ASC`,
      [userId]
    );

    // Difficulty breakdown
    const { rows: difficultyBreakdown } = await db.query(
      `SELECT
         q.difficulty,
         COUNT(*) FILTER (WHERE up.status = 'solved')  AS solved,
         COUNT(*) FILTER (WHERE up.status = 'stuck')   AS stuck,
         COUNT(*)                                       AS total
       FROM user_progress up
       JOIN questions q ON up.question_id = q.id
       WHERE up.user_id = $1
       GROUP BY q.difficulty`,
      [userId]
    );

    // Fetch today's questions
    const { rows: todayQuestions } = await db.query(
      `SELECT q.*, t.name AS topic_name
       FROM daily_deliveries dd
       JOIN questions q ON dd.question_id = q.id
       JOIN topics t ON q.topic_id = t.id
       WHERE dd.user_id = $1 AND dd.delivered_on = CURRENT_DATE`,
      [userId]
    );

    res.json({
      user: { name, streak, company: company_name },
      overall: overall[0],
      topicBreakdown,
      dailyActivity,
      difficultyBreakdown,
      todayQuestions,
    });
  } catch (err) {
    console.error('GET /analytics error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
