const db = require('./db');

const initDb = async () => {
  try {
    console.log('Starting Database Initialization...');

    // 1. Create Tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        telegram_id VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(100),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(50) UNIQUE NOT NULL,
        is_pro_only BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        slug VARCHAR(50) UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        topic_id INTEGER,
        title VARCHAR(200) NOT NULL,
        difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
        leetcode_link TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        telegram_id VARCHAR(50),
        target_company_id INTEGER,
        overall_score INTEGER,
        topic_scores JSONB,
        completed_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS assessment_responses (
        id SERIAL PRIMARY KEY,
        assessment_id INTEGER,
        question_id INTEGER,
        user_response TEXT,
        ai_score INTEGER,
        ai_feedback TEXT,
        time_taken_seconds INTEGER
      );
    `);

    // 2. Seed Data
    const companiesCheck = await db.query('SELECT count(*) FROM companies');
    if (parseInt(companiesCheck.rows[0].count) === 0) {
      console.log('Seeding companies...');
      await db.query(`
        INSERT INTO companies (name, slug, is_pro_only) VALUES
        ('Amazon', 'amazon', false),
        ('Microsoft', 'microsoft', false),
        ('Google', 'google', true),
        ('Meta', 'meta', false),
        ('Apple', 'apple', true),
        ('Netflix', 'netflix', true)
      `);
    }

    const topicsCheck = await db.query('SELECT count(*) FROM topics');
    if (parseInt(topicsCheck.rows[0].count) === 0) {
      console.log('Seeding topics...');
      await db.query(`
        INSERT INTO topics (name, slug) VALUES
        ('Arrays & Hashing', 'arrays-hashing'),
        ('Two Pointers', 'two-pointers'),
        ('Sliding Window', 'sliding-window'),
        ('Stack', 'stack'),
        ('Binary Search', 'binary-search'),
        ('Linked List', 'linked-list'),
        ('Trees', 'trees'),
        ('Graphs', 'graphs'),
        ('Dynamic Programming', 'dynamic-programming')
      `);
    }

    const questionsCheck = await db.query('SELECT count(*) FROM questions');
    if (parseInt(questionsCheck.rows[0].count) === 0) {
      console.log('Seeding questions...');
      await db.query(`
        INSERT INTO questions (title, difficulty, topic_id) VALUES
        ('Two Sum', 'easy', 1),
        ('Valid Anagram', 'easy', 1),
        ('Group Anagrams', 'medium', 1),
        ('Valid Palindrome', 'easy', 2),
        ('3Sum', 'medium', 2),
        ('Container With Most Water', 'medium', 2),
        ('Best Time to Buy and Sell Stock', 'easy', 3),
        ('Longest Substring Without Repeating Characters', 'medium', 3),
        ('Valid Parentheses', 'easy', 4),
        ('Minimum Stack', 'medium', 4),
        ('Binary Search', 'easy', 5),
        ('Search in Rotated Sorted Array', 'medium', 5),
        ('Reverse Linked List', 'easy', 6),
        ('Merge Two Sorted Lists', 'easy', 6),
        ('Invert Binary Tree', 'easy', 7),
        ('Maximum Depth of Binary Tree', 'easy', 7),
        ('Number of Islands', 'medium', 8),
        ('Climbing Stairs', 'easy', 9),
        ('Coin Change', 'medium', 9)
      `);
    }

    console.log('Database Initialization Complete!');
  } catch (error) {
    console.error('Database Initialization Failed:', error);
  }
};

module.exports = { initDb };
