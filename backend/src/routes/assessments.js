const express = require('express');
const router = express.Router();
const pool = require('../db');
const { generateContent } = require('../services/gemini');
const { requireInternalAuth } = require('../middleware/auth');

// Helper to get user ID from telegram ID
async function getUserId(telegramId) {
  const result = await pool.query('SELECT id FROM users WHERE telegram_id = $1', [telegramId]);
  return result.rows[0]?.id;
}

// POST /assessments/start
router.post('/start', requireInternalAuth, async (req, res) => {
  const { telegram_id, company_slug } = req.body;
  
  try {
    const userId = await getUserId(telegram_id);
    if (!userId) {
      return res.status(404).json({ error: 'User not found' });
    }

    const companyResult = await pool.query('SELECT id FROM companies WHERE slug = $1', [company_slug]);
    const companyId = companyResult.rows[0]?.id;

    // Select 1 question from each of 5 topics: arrays, trees, dynamic-prog, graphs, strings
    const topics = ['arrays', 'trees', 'dynamic-prog', 'graphs', 'strings'];
    const questions = [];

    for (const topicSlug of topics) {
      const qResult = await pool.query(`
        SELECT q.id, q.title, q.description, q.difficulty, t.name as topic, q.leetcode_link
        FROM questions q
        JOIN topics t ON q.topic_id = t.id
        WHERE t.slug = $1
        ORDER BY RANDOM()
        LIMIT 1
      `, [topicSlug]);
      
      if (qResult.rows.length > 0) {
        questions.push(qResult.rows[0]);
      }
    }

    if (questions.length < 5) {
      // Fallback: fill with random questions if some topics are missing
      const excludeIds = questions.map(q => q.id).join(',');
      const whereClause = excludeIds ? `WHERE q.id NOT IN (${excludeIds})` : '';
      
      const fallbackResult = await pool.query(`
        SELECT q.id, q.title, q.description, q.difficulty, t.name as topic, q.leetcode_link
        FROM questions q
        JOIN topics t ON q.topic_id = t.id
        ${whereClause}
        ORDER BY RANDOM()
        LIMIT $1
      `, [5 - questions.length]);
      
      questions.push(...fallbackResult.rows);
    }

    // Create assessment record
    const assessmentResult = await pool.query(`
      INSERT INTO assessments (user_id, target_company_id)
      VALUES ($1, $2)
      RETURNING id
    `, [userId, companyId]);

    res.json({
      assessment_id: assessmentResult.rows[0].id,
      questions
    });
  } catch (err) {
    console.error('Error in /assessments/start:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /assessments/:id/respond
router.post('/:id/respond', requireInternalAuth, async (req, res) => {
  const assessmentId = req.params.id;
  const { question_id, user_response, time_taken_seconds, question_title, difficulty, topic } = req.body;

  try {
    let score = 0;
    let feedback = "No response provided.";

    if (user_response && user_response.trim().length >= 10) {
      const prompt = `Evaluate this DSA interview response from an Indian CS placement student.
Problem: "${question_title}" (${difficulty}, topic: ${topic})
Student response: "${user_response}"
Score on: approach correctness, complexity awareness, communication clarity.
Return ONLY valid JSON: {"score": <0-100>, "feedback": "<2 sentences>", "approach_correct": <true/false>}`;

      const aiResponseText = await generateContent(prompt);
      
      try {
        // Clean up response text if it contains markdown code blocks
        const cleanedText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiResponse = JSON.parse(cleanedText);
        score = aiResponse.score;
        feedback = aiResponse.feedback;
      } catch (parseErr) {
        console.error('Failed to parse Gemini response:', aiResponseText);
        // Fallback score if JSON parsing fails
        score = 50;
        feedback = "Response received but could not be scored automatically.";
      }
    }

    // Store in assessment_responses
    await pool.query(`
      INSERT INTO assessment_responses (assessment_id, question_id, user_response, ai_score, ai_feedback, time_taken_seconds)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [assessmentId, question_id, user_response, score, feedback, time_taken_seconds]);

    res.json({ score, feedback });
  } catch (err) {
    console.error('Error in /assessments/:id/respond:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /assessments/:id/complete
router.post('/:id/complete', requireInternalAuth, async (req, res) => {
  const assessmentId = req.params.id;

  try {
    // Calculate average score
    const result = await pool.query(`
      SELECT AVG(ai_score) as avg_score, 
             jsonb_object_agg(t.slug, r.ai_score) as topic_scores
      FROM assessment_responses r
      JOIN questions q ON r.question_id = q.id
      JOIN topics t ON q.topic_id = t.id
      WHERE r.assessment_id = $1
      GROUP BY r.assessment_id
    `, [assessmentId]);

    if (result.rows.length === 0 || result.rows[0].avg_score === null) {
      return res.status(404).json({ error: 'No responses found for this assessment' });
    }

    const overallScore = Math.round(parseFloat(result.rows[0].avg_score));
    const topicScores = result.rows[0].topic_scores;

    // Update assessments
    await pool.query(`
      UPDATE assessments
      SET overall_score = $1, topic_scores = $2, completed_at = NOW()
      WHERE id = $3
    `, [overallScore, topicScores, assessmentId]);

    res.json({ overall_score: overallScore, topic_scores: topicScores });
  } catch (err) {
    console.error('Error in /assessments/:id/complete:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /assessments/:telegram_id/latest
router.get('/:telegram_id/latest', requireInternalAuth, async (req, res) => {
  const telegramId = req.params.telegram_id;

  try {
    const userId = await getUserId(telegramId);
    if (!userId) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await pool.query(`
      SELECT a.id, a.overall_score, a.topic_scores, a.completed_at,
             json_agg(json_build_object(
               'question_id', r.question_id,
               'user_response', r.user_response,
               'ai_score', r.ai_score,
               'ai_feedback', r.ai_feedback,
               'time_taken_seconds', r.time_taken_seconds,
               'title', q.title,
               'difficulty', q.difficulty,
               'topic', t.name
             )) as responses
      FROM assessments a
      LEFT JOIN assessment_responses r ON a.id = r.assessment_id
      LEFT JOIN questions q ON r.question_id = q.id
      LEFT JOIN topics t ON q.topic_id = t.id
      WHERE a.user_id = $1 AND a.overall_score IS NOT NULL
      GROUP BY a.id
      ORDER BY a.completed_at DESC
      LIMIT 1
    `, [userId]);

    if (result.rows.length === 0 || result.rows[0].id === null) {
      return res.json({ message: 'No assessments completed yet' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in /assessments/:telegram_id/latest:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
