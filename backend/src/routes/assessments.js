const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { evaluateResponse } = require('../services/gemini');

// POST /assessments/start
router.post('/start', async (req, res) => {
  const { telegram_id, company_slug } = req.body;
  
  try {
    // 1. Ensure user exists
    let userId = null;
    if (telegram_id) {
      const userRes = await db.query('SELECT id FROM users WHERE telegram_id = $1', [telegram_id]);
      if (userRes.rows.length === 0) {
        const newUser = await db.query('INSERT INTO users (telegram_id) VALUES ($1) RETURNING id', [telegram_id]);
        userId = newUser.rows[0].id;
      } else {
        userId = userRes.rows[0].id;
      }
    }

    // 2. Get company id
    const compRes = await db.query('SELECT id FROM companies WHERE slug = $1', [company_slug]);
    const companyId = compRes.rows.length > 0 ? compRes.rows[0].id : null;

    // 3. Select 1 question from 5 diverse topics
    const topicSlugs = ['arrays-hashing', 'trees', 'dynamic-programming', 'graphs', 'stack'];
    const questions = [];

    for (const slug of topicSlugs) {
      const qRes = await db.query(`
        SELECT q.id, q.title, q.difficulty, t.name as topic, q.leetcode_link 
        FROM questions q
        JOIN topics t ON q.topic_id = t.id
        WHERE t.slug = $1
        ORDER BY RANDOM()
        LIMIT 1
      `, [slug]);
      
      if (qRes.rows.length > 0) {
        questions.push(qRes.rows[0]);
      }
    }

    // 4. Create assessment record
    const assessRes = await db.query(`
      INSERT INTO assessments (user_id, telegram_id, target_company_id)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [userId, telegram_id, companyId]);

    res.json({
      assessment_id: assessRes.rows[0].id,
      questions
    });
  } catch (error) {
    console.error('Assessment Start Error:', error);
    res.status(500).json({ error: 'Failed to start assessment' });
  }
});

// POST /assessments/:id/respond
router.post('/:id/respond', async (req, res) => {
  const assessmentId = req.params.id;
  const { question_id, user_response, time_taken_seconds } = req.body;

  try {
    // Fetch question details
    const qRes = await db.query('SELECT title, difficulty, topic FROM questions WHERE id = $1', [question_id]);
    const question = qRes.rows[0] || { title: 'Unknown Question', difficulty: 'easy', topic: 'general' };

    // Evaluate with Gemini
    const evaluation = await evaluateResponse(question, user_response);

    await db.query(`
      INSERT INTO assessment_responses (assessment_id, question_id, user_response, ai_score, ai_feedback, time_taken_seconds)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [assessmentId, question_id, user_response, evaluation.score, evaluation.feedback, time_taken_seconds || 0]);

    res.json({ success: true, score: evaluation.score, feedback: evaluation.feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /assessments/:id/complete
router.post('/:id/complete', async (req, res) => {
  const assessmentId = req.params.id;

  try {
    const responses = await db.query('SELECT ai_score, question_id FROM assessment_responses WHERE assessment_id = $1', [assessmentId]);
    
    if (responses.rows.length === 0) return res.status(400).json({ error: 'No responses found' });

    const overallScore = Math.round(responses.rows.reduce((acc, r) => acc + r.ai_score, 0) / responses.rows.length);

    // Calculate topic scores if needed (here we just have 1 per topic usually)
    const topicScores = {}; // Simplified for now

    await db.query(`
      UPDATE assessments
      SET overall_score = $1, topic_scores = $2, completed_at = NOW()
      WHERE id = $3
    `, [overallScore, JSON.stringify(topicScores), assessmentId]);

    res.json({ overall_score: overallScore, topic_scores: topicScores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /assessments/:telegram_id/latest
router.get('/:telegram_id/latest', async (req, res) => {
  const telegramId = req.params.telegram_id;

  try {
    const assessRes = await db.query(`
      SELECT a.*, c.name as company_name
      FROM assessments a
      LEFT JOIN companies c ON a.target_company_id = c.id
      WHERE (a.telegram_id = $1 OR a.user_id = (SELECT id FROM users WHERE telegram_id = $1))
      AND a.completed_at IS NOT NULL
      ORDER BY a.completed_at DESC
      LIMIT 1
    `, [telegramId]);

    if (assessRes.rows.length === 0) return res.json({ assessment: null });

    const assessment = assessRes.rows[0];
    const responsesRes = await db.query(`
      SELECT ar.*, q.title as question_title
      FROM assessment_responses ar
      JOIN questions q ON ar.question_id = q.id
      WHERE ar.assessment_id = $1
    `, [assessment.id]);

    res.json({
      assessment,
      responses: responsesRes.rows
    });
  } catch (error) {
    console.error('Fetch Latest Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
