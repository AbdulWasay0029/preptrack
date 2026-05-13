const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { evaluateResponse } = require('../services/gemini');
const { requireJwtAuth } = require('../middleware/auth');

// POST /assessment/start
router.post('/start', requireJwtAuth, async (req, res) => {
  const { companySlug } = req.body;
  const userId = req.user.id;

  try {
    // 1. Get company id
    let companyId = null;
    if (companySlug) {
      const compRes = await db.query('SELECT id FROM companies WHERE slug = $1', [companySlug]);
      companyId = compRes.rows.length > 0 ? compRes.rows[0].id : null;
    }

    // 2. Select 1 question from 5 diverse topics
    const topicSlugs = ['arrays', 'trees', 'dynamic-prog', 'graphs', 'stacks-queues'];
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

    // 3. Create assessment record
    const assessRes = await db.query(`
      INSERT INTO assessments (user_id, target_company_id)
      VALUES ($1, $2)
      RETURNING id
    `, [userId, companyId]);

    res.json({
      assessmentId: assessRes.rows[0].id,
      questions
    });
  } catch (error) {
    console.error('Assessment Start Error:', error);
    res.status(500).json({ error: 'Failed to start assessment' });
  }
});

// POST /assessment/:id/submit-answer
router.post('/:id/submit-answer', requireJwtAuth, async (req, res) => {
  const assessmentId = req.params.id;
  const { questionId, response, timeSpentSeconds } = req.body;

  try {
    // Verify ownership
    const assessRes = await db.query('SELECT user_id FROM assessments WHERE id = $1', [assessmentId]);
    if (assessRes.rows.length === 0) return res.status(404).json({ error: 'Assessment not found' });
    if (assessRes.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Fetch question details
    const qRes = await db.query('SELECT q.title, q.difficulty, t.name as topic FROM questions q JOIN topics t ON q.topic_id = t.id WHERE q.id = $1', [questionId]);
    const question = qRes.rows[0] || { title: 'Unknown Question', difficulty: 'easy', topic: 'general' };

    // Evaluate with Gemini
    const evaluation = await evaluateResponse(question, response);

    // Insert into assessment_questions
    await db.query(`
      INSERT INTO assessment_questions (assessment_id, question_id, user_response, ai_score, ai_feedback, time_spent_seconds)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [assessmentId, questionId, response, evaluation.score, evaluation.feedback, timeSpentSeconds || 0]);

    res.json({ success: true, score: evaluation.score, feedback: evaluation.feedback });
  } catch (error) {
    console.error('Submit Answer Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /assessment/:id/complete
router.post('/:id/complete', requireJwtAuth, async (req, res) => {
  const assessmentId = req.params.id;
  const { responses } = req.body; // Expect array of { questionId, response, timeSpentSeconds }

  if (!responses || !Array.isArray(responses)) {
    return res.status(400).json({ error: 'Responses array is required' });
  }

  try {
    // Verify ownership
    const assessRes = await db.query('SELECT user_id FROM assessments WHERE id = $1', [assessmentId]);
    if (assessRes.rows.length === 0) return res.status(404).json({ error: 'Assessment not found' });
    if (assessRes.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const evaluationResults = [];
    const topicScores = {};
    const topicCounts = {};

    // Process all responses (using for loop to avoid rate limits or handle errors better than Promise.all if one fails)
    for (const r of responses) {
      const { questionId, response, timeSpentSeconds } = r;

      // Fetch question details
      const qRes = await db.query('SELECT q.title, q.difficulty, t.name as topic FROM questions q JOIN topics t ON q.topic_id = t.id WHERE q.id = $1', [questionId]);
      const question = qRes.rows[0] || { title: 'Unknown Question', difficulty: 'easy', topic: 'general' };

      // Evaluate with Gemini
      const evaluation = await evaluateResponse(question, response);

      // Insert into assessment_questions
      await db.query(`
        INSERT INTO assessment_questions (assessment_id, question_id, user_response, ai_score, ai_feedback, time_spent_seconds)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [assessmentId, questionId, response, evaluation.score, evaluation.feedback, timeSpentSeconds || 0]);

      evaluationResults.push({ ai_score: evaluation.score, topic: question.topic });

      // Track topic scores
      const topic = question.topic;
      if (!topicScores[topic]) {
        topicScores[topic] = 0;
        topicCounts[topic] = 0;
      }
      topicScores[topic] += evaluation.score;
      topicCounts[topic] += 1;
    }

    if (evaluationResults.length === 0) return res.status(400).json({ error: 'No responses processed' });

    const overallScore = Math.round(evaluationResults.reduce((acc, r) => acc + r.ai_score, 0) / evaluationResults.length);

    for (const topic in topicScores) {
      topicScores[topic] = Math.round(topicScores[topic] / topicCounts[topic]);
    }

    await db.query(`
      UPDATE assessments
      SET overall_score = $1, topic_scores = $2, completed_at = NOW()
      WHERE id = $3
    `, [overallScore, JSON.stringify(topicScores), assessmentId]);

    res.json({ overallScore, topicScores });
  } catch (error) {
    console.error('Complete Assessment Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /assessment/latest
router.get('/latest', requireJwtAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const assessRes = await db.query(`
      SELECT a.*, c.name as company_name
      FROM assessments a
      LEFT JOIN companies c ON a.target_company_id = c.id
      WHERE a.user_id = $1
      AND a.completed_at IS NOT NULL
      ORDER BY a.completed_at DESC
      LIMIT 1
    `, [userId]);

    if (assessRes.rows.length === 0) return res.json({ assessment: null });

    const assessment = assessRes.rows[0];
    const responsesRes = await db.query(`
      SELECT aq.*, q.title as question_title
      FROM assessment_questions aq
      JOIN questions q ON aq.question_id = q.id
      WHERE aq.assessment_id = $1
    `, [assessment.id]);

    res.json({
      assessment,
      questions: responsesRes.rows
    });
  } catch (error) {
    console.error('Fetch Latest Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
