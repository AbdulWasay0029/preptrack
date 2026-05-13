require('dotenv').config();
const db = require('../services/db.js');

async function check() {
  try {
    const res = await db.query('SELECT id, title, topic_id FROM questions LIMIT 10');
    console.log('Questions in DB:', res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

check();
