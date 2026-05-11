/**
 * Adaptive Engine — the core intelligence of PrepTrack.
 *
 * Responsibilities:
 *  1. calculateWeakTopics(userId, db)  → scored list of topics by weakness
 *  2. selectDailyQuestions(userId, db) → picks today's questions for a user
 *  3. refreshWeakTopicCache(userId, db)→ writes scores to user_weak_topics table
 *
 * Scoring model:
 *  raw_score = (stuck×2 + skipped×1) / (total_attempts × 3)
 *  recency_weight = max(0.3, 1 − days_since_last_attempt / 30)
 *  weak_score = raw_score × recency_weight   [0–1, higher = weaker]
 *
 *  A topic with weak_score > 0.4 is considered weak.
 *  Question selection: 60% from weak topics, 40% standard company pool.
 */

const WEAK_THRESHOLD = 0.4;
const WEAK_RATIO = 0.6;
const RECENCY_WINDOW_DAYS = 30;
const DELIVERY_COOLDOWN_DAYS = 14; // don't repeat a question within this window

/**
 * Returns topics sorted by weakness score descending.
 * Only topics with ≥2 attempts in the last 30 days are scored.
 */
async function calculateWeakTopics(userId, db) {
  const { rows } = await db.query(
    `SELECT
       t.id       AS topic_id,
       t.name     AS topic_name,
       up.status,
       up.attempted_at
     FROM user_progress up
     JOIN questions q ON up.question_id = q.id
     JOIN topics t    ON q.topic_id = t.id
     WHERE up.user_id = $1
       AND up.attempted_at > NOW() - INTERVAL '${RECENCY_WINDOW_DAYS} days'
     ORDER BY up.attempted_at ASC`,
    [userId]
  );

  // Aggregate stats per topic
  const stats = {};
  for (const row of rows) {
    const tid = row.topic_id;
    if (!stats[tid]) {
      stats[tid] = {
        topicId: tid,
        name: row.topic_name,
        solved: 0,
        stuck: 0,
        skipped: 0,
        total: 0,
        lastAttempt: row.attempted_at,
      };
    }
    stats[tid][row.status]++;
    stats[tid].total++;
    if (new Date(row.attempted_at) > new Date(stats[tid].lastAttempt)) {
      stats[tid].lastAttempt = row.attempted_at;
    }
  }

  // Score each topic
  return Object.values(stats)
    .filter((s) => s.total >= 2)
    .map((s) => {
      const rawScore = (s.stuck * 2 + s.skipped * 1) / (s.total * 3);
      const daysSince =
        (Date.now() - new Date(s.lastAttempt).getTime()) / (1000 * 60 * 60 * 24);
      const recencyWeight = Math.max(0.3, 1 - daysSince / RECENCY_WINDOW_DAYS);
      return { ...s, weakScore: parseFloat((rawScore * recencyWeight).toFixed(3)) };
    })
    .sort((a, b) => b.weakScore - a.weakScore);
}

/**
 * Selects today's questions for a user.
 * Returns an array of question rows.
 */
async function selectDailyQuestions(userId, companySlug, count, db, isPro) {
  // Get user's weak topics above threshold
  const weakTopics = await calculateWeakTopics(userId, db);
  const weakTopicIds = weakTopics
    .filter((t) => t.weakScore > WEAK_THRESHOLD)
    .map((t) => t.topicId);

  // Get recently delivered question IDs to avoid repetition
  const { rows: recentRows } = await db.query(
    `SELECT question_id FROM daily_deliveries
     WHERE user_id = $1
       AND delivered_on > CURRENT_DATE - INTERVAL '${DELIVERY_COOLDOWN_DAYS} days'`,
    [userId]
  );
  const recentIds = recentRows.map((r) => r.question_id);
  const excludeParam = recentIds.length > 0 ? recentIds : [0];

  // Free tier: cap at easy/medium difficulty
  const difficultyClause = isPro ? '' : `AND q.difficulty IN ('easy', 'medium')`;

  let questions = [];

  // --- Phase 1: fill weak-topic slots ---
  if (weakTopicIds.length > 0) {
    const weakSlots = Math.ceil(count * WEAK_RATIO);
    const { rows: weakQ } = await db.query(
      `SELECT q.*
       FROM questions q
       JOIN company_questions cq ON q.id = cq.question_id
       JOIN companies c ON cq.company_id = c.id
       WHERE c.slug = $1
         AND q.topic_id = ANY($2::int[])
         AND q.id != ALL($3::int[])
         ${difficultyClause}
       ORDER BY cq.frequency DESC, RANDOM()
       LIMIT $4`,
      [companySlug, weakTopicIds, excludeParam, weakSlots]
    );
    questions.push(...weakQ);
  }

  // --- Phase 2: fill remaining slots with standard company questions ---
  const remaining = count - questions.length;
  if (remaining > 0) {
    const existingIds = questions.map((q) => q.id);
    const allExclude = [...recentIds, ...existingIds];
    const excludeParam2 = allExclude.length > 0 ? allExclude : [0];

    const { rows: stdQ } = await db.query(
      `SELECT q.*
       FROM questions q
       JOIN company_questions cq ON q.id = cq.question_id
       JOIN companies c ON cq.company_id = c.id
       WHERE c.slug = $1
         AND q.id != ALL($2::int[])
         ${difficultyClause}
       ORDER BY cq.frequency DESC, RANDOM()
       LIMIT $3`,
      [companySlug, excludeParam2, remaining]
    );
    questions.push(...stdQ);
  }

  const unique = [...new Map(questions.map(q => [q.id, q])).entries()].map(([, q]) => q);
  return unique.slice(0, count);
}

/**
 * Writes/updates the user_weak_topics cache.
 * Call this after every batch of progress updates.
 */
async function refreshWeakTopicCache(userId, db) {
  const weakTopics = await calculateWeakTopics(userId, db);

  for (const topic of weakTopics) {
    await db.query(
      `INSERT INTO user_weak_topics (user_id, topic_id, weak_score, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, topic_id)
       DO UPDATE SET weak_score = EXCLUDED.weak_score, updated_at = NOW()`,
      [userId, topic.topicId, topic.weakScore]
    );
  }

  return weakTopics;
}

module.exports = { calculateWeakTopics, selectDailyQuestions, refreshWeakTopicCache };
