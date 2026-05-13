const path = require('path');
const backendModules = path.join(__dirname, '..', 'backend', 'node_modules');
const dotenv = require(path.join(backendModules, 'dotenv'));
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const { Pool } = require(path.join(backendModules, 'pg'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('Running migration: ADD COLUMN description to questions');
    const sql = `ALTER TABLE questions ADD COLUMN IF NOT EXISTS description TEXT;`;
    await client.query(sql);
    console.log(' Migration complete: Column added.');
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
