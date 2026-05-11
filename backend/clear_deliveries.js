require('dotenv').config();
const db = require('./src/db');

async function run() {
  try {
    const { rows } = await db.query("SELECT id, name FROM users WHERE name LIKE '%Abdul%'");
    console.log('Found users:', rows);
    if (rows.length > 0) {
      const id = rows[0].id;
      await db.query("DELETE FROM daily_deliveries WHERE user_id = $1 AND delivered_on = CURRENT_DATE", [id]);
      console.log('Cleared deliveries for today for', rows[0].name);
    } else {
      console.log('User not found');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await db.end();
  }
}

run();
