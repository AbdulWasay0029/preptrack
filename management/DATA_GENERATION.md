# PrepTrack — Data Generation Instructions
> Use this file in Google AI Studio / Gemini to expand the question database.
> Maintained by Claude. Do not edit manually.

---

## When to Use This

When the question database needs expanding. Current state: 384 questions across 15 companies.
Target: 500+ questions, better pattern tagging, more Indian company coverage.

---

## Step 1 — Generate Questions for a Company

Paste this exact prompt into Google AI Studio (use Gemini 1.5 Pro):

```
Generate 25 DSA interview questions commonly asked at [COMPANY NAME] in India for software engineering roles (internship or SDE1 level).

Rules:
- Only include questions that are real LeetCode problems
- Focus on what this company ACTUALLY asks (based on interview reports)
- Mix of difficulty: roughly 30% easy, 50% medium, 20% hard

For each question provide:
- title: exact LeetCode problem name
- leetcode_link: full URL (https://leetcode.com/problems/[slug]/)
- difficulty: easy OR medium OR hard (lowercase)
- topic: ONE of these exact values only: arrays, strings, linked-lists, trees, graphs, dynamic-prog, stacks-queues, binary-search, greedy, backtracking, heap, sorting, design
- frequency: integer 1-5 (how commonly reported in real interviews, 5 = asked very frequently)
- pattern: ONE of these exact values only: sliding-window, two-pointers, fast-slow-pointers, merge-intervals, cyclic-sort, in-place-reversal, tree-bfs, tree-dfs, two-heaps, subsets, binary-search, top-k-elements, k-way-merge, dynamic-programming, graphs

Return ONLY a valid JSON array. No explanation, no markdown, no backticks. Start directly with [
```

Replace [COMPANY NAME] with one of:
- Amazon (most important, do this first)
- Google
- Microsoft
- Flipkart
- Walmart
- Adobe
- Atlassian
- Swiggy
- Zomato
- Paytm

---

## Step 2 — Validate the Output

Before using any generated data:
1. Check that all `topic` values are from the allowed list
2. Check that all `pattern` values are from the allowed list
3. Spot-check 5 random LeetCode links to confirm they exist
4. Remove any duplicates (same title as existing questions)

---

## Step 3 — Convert to SQL

Paste the validated JSON into AI Studio with this prompt:

```
Convert this JSON array of DSA questions into PostgreSQL INSERT statements.

Use this exact format:
INSERT INTO questions (title, leetcode_link, difficulty, topic_id) 
VALUES ('[title]', '[url]', '[difficulty]', (SELECT id FROM topics WHERE slug = '[topic]'))
ON CONFLICT DO NOTHING;

Then for each question, add a company_questions INSERT:
INSERT INTO company_questions (company_id, question_id, frequency)
VALUES (
  (SELECT id FROM companies WHERE slug = '[company_slug]'),
  (SELECT id FROM questions WHERE title = '[title]'),
  [frequency]
) ON CONFLICT DO NOTHING;

Return ONLY the SQL statements. No explanation.

Company slug for this batch: [company_slug]

JSON: [paste your JSON here]
```

---

## Step 4 — Run on Neon

1. Open Neon dashboard → SQL Editor
2. Paste the generated SQL
3. Run it
4. Verify with: `SELECT COUNT(*) FROM questions;`

---

## Companies Priority Order

1. Amazon (most common in placements) — do first
2. Google
3. Microsoft
4. Flipkart
5. All others

---

## Pattern Tagging (for existing questions)

To retroactively tag existing questions with patterns, run in AI Studio:

```
I have a list of DSA problems. For each one, identify which ONE pattern from this list best describes the solution approach:

sliding-window, two-pointers, fast-slow-pointers, merge-intervals, cyclic-sort, in-place-reversal, tree-bfs, tree-dfs, two-heaps, subsets, binary-search, top-k-elements, k-way-merge, dynamic-programming, graphs

Problems:
[paste question titles here, one per line]

Return ONLY a JSON object mapping each title to its pattern. No explanation.
```

Then update the pattern_questions table accordingly.
