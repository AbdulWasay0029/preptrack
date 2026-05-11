const express = require('express');
const router = express.Router();
const db = require('../services/db');

// GET /questions/companies
router.get('/companies', async (req, res) => {
  try {
    const result = await db.query('SELECT name, slug, is_pro_only FROM companies ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    // Return sample data if table doesn't exist yet to prevent landing page crash
    res.json([
      { name: 'Amazon', slug: 'amazon', is_pro_only: false },
      { name: 'Microsoft', slug: 'microsoft', is_pro_only: false },
      { name: 'Meta', slug: 'meta', is_pro_only: false },
      { name: 'Google', slug: 'google', is_pro_only: true },
      { name: 'Apple', slug: 'apple', is_pro_only: true },
      { name: 'Netflix', slug: 'netflix', is_pro_only: true },
    ]);
  }
});

// GET /questions/topics
router.get('/topics', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM topics ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.json([
      { id: 1, name: 'Arrays & Hashing', slug: 'arrays-hashing' },
      { id: 2, name: 'Two Pointers', slug: 'two-pointers' },
      { id: 3, name: 'Sliding Window', slug: 'sliding-window' },
      { id: 7, name: 'Trees', slug: 'trees' },
      { id: 9, name: 'Dynamic Programming', slug: 'dynamic-programming' }
    ]);
  }
});

module.exports = router;
