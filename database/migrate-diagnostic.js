const path = require('path');

// Load dotenv and pg from backend's node_modules
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
    console.log('Creating assessments tables...');
    
    const tableSql = `
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        target_company_id INTEGER REFERENCES companies(id),
        overall_score INTEGER,
        topic_scores JSONB DEFAULT '{}',
        completed_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS assessment_responses (
        id SERIAL PRIMARY KEY,
        assessment_id INTEGER REFERENCES assessments(id),
        question_id INTEGER REFERENCES questions(id),
        user_response TEXT,
        ai_score INTEGER,
        ai_feedback TEXT,
        time_taken_seconds INTEGER
      );
    `;

    await client.query(tableSql);
    console.log('Tables created successfully.');

    console.log('Updating company Pro flags...');
    const updateSql = `
      UPDATE companies SET is_pro_only = true WHERE slug IN ('paytm','razorpay','swiggy','zomato','uber','salesforce');
      UPDATE companies SET is_pro_only = false WHERE slug IN ('amazon','microsoft');
    `;
    await client.query(updateSql);
    console.log('Company Pro flags updated.');

    console.log('✅ Migration complete!');
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
