require('dotenv').config();
const db = require('../services/db.js');

async function check() {
  try {
    const colRes = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'questions'
    `);
    console.log('Questions Columns:', colRes.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

check();
