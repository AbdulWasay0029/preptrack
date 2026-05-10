// Temporary script to seed the Neon database
// Run from project root: node database/seed-neon.js

const path = require('path');
const fs = require('fs');

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
    // Run schema
    console.log('Running schema.sql...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schema);
    console.log('Schema created successfully.');

    // Run seed
    console.log('Running seed/questions.sql...');
    const seed = fs.readFileSync(path.join(__dirname, 'seed', 'questions.sql'), 'utf-8');
    await client.query(seed);
    console.log('Seed data inserted successfully.');

    // Verify
    const companies = await client.query('SELECT slug, name, is_pro_only FROM companies ORDER BY id');
    console.log('\nCompanies loaded:');
    companies.rows.forEach(c => console.log(`  ${c.is_pro_only ? '🔒' : '🆓'} ${c.name} (${c.slug})`));

    const qCount = await client.query('SELECT COUNT(*) FROM questions');
    console.log(`\nTotal questions: ${qCount.rows[0].count}`);

    console.log('\n✅ Database is ready!');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
