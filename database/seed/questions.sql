-- PrepTrack Seed Data
-- Inserts companies, topics, questions, and company-question mappings.
-- Run AFTER schema.sql: psql -U postgres -d preptrack -f database/seed/questions.sql

-- ============================================================
-- COMPANIES
-- ============================================================
INSERT INTO companies (slug, name, is_active, is_pro_only) VALUES
  ('amazon',    'Amazon',         TRUE, FALSE),
  ('microsoft', 'Microsoft',      TRUE, FALSE),
  ('google',    'Google',         TRUE, TRUE),
  ('flipkart',  'Flipkart',       TRUE, TRUE),
  ('walmart',   'Walmart',        TRUE, TRUE),
  ('adobe',     'Adobe',          TRUE, TRUE),
  ('atlassian', 'Atlassian',      TRUE, TRUE),
  ('intuit',    'Intuit',         TRUE, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TOPICS
-- ============================================================
INSERT INTO topics (slug, name) VALUES
  ('arrays',           'Arrays'),
  ('strings',          'Strings'),
  ('linked-lists',     'Linked Lists'),
  ('trees',            'Trees'),
  ('graphs',           'Graphs'),
  ('dynamic-prog',     'Dynamic Programming'),
  ('stacks-queues',    'Stacks & Queues'),
  ('binary-search',    'Binary Search'),
  ('greedy',           'Greedy'),
  ('backtracking',     'Backtracking'),
  ('heap',             'Heap / Priority Queue'),
  ('sorting',          'Sorting'),
  ('design',           'System Design / OOP')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- QUESTIONS
-- ============================================================
INSERT INTO questions (title, leetcode_link, difficulty, topic_id) VALUES
  -- Arrays
  ('Two Sum',                        'https://leetcode.com/problems/two-sum/',                          'easy',   (SELECT id FROM topics WHERE slug='arrays')),
  ('Maximum Subarray',               'https://leetcode.com/problems/maximum-subarray/',                 'medium', (SELECT id FROM topics WHERE slug='arrays')),
  ('Product of Array Except Self',   'https://leetcode.com/problems/product-of-array-except-self/',    'medium', (SELECT id FROM topics WHERE slug='arrays')),
  ('Merge Intervals',                'https://leetcode.com/problems/merge-intervals/',                  'medium', (SELECT id FROM topics WHERE slug='arrays')),
  ('Trapping Rain Water',            'https://leetcode.com/problems/trapping-rain-water/',              'hard',   (SELECT id FROM topics WHERE slug='arrays')),
  ('Best Time to Buy and Sell Stock','https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', 'easy',   (SELECT id FROM topics WHERE slug='arrays')),
  ('3Sum',                           'https://leetcode.com/problems/3sum/',                             'medium', (SELECT id FROM topics WHERE slug='arrays')),
  ('Container With Most Water',      'https://leetcode.com/problems/container-with-most-water/',        'medium', (SELECT id FROM topics WHERE slug='arrays')),
  ('Spiral Matrix',                  'https://leetcode.com/problems/spiral-matrix/',                    'medium', (SELECT id FROM topics WHERE slug='arrays')),
  ('Subarray Sum Equals K',          'https://leetcode.com/problems/subarray-sum-equals-k/',            'medium', (SELECT id FROM topics WHERE slug='arrays')),
  ('Maximum Product Subarray',       'https://leetcode.com/problems/maximum-product-subarray/',         'medium', (SELECT id FROM topics WHERE slug='arrays')),
  ('Move Zeroes',                    'https://leetcode.com/problems/move-zeroes/',                      'easy',   (SELECT id FROM topics WHERE slug='arrays')),
  ('Contains Duplicate',             'https://leetcode.com/problems/contains-duplicate/',               'easy',   (SELECT id FROM topics WHERE slug='arrays')),
  ('Rotate Array',                   'https://leetcode.com/problems/rotate-array/',                     'medium', (SELECT id FROM topics WHERE slug='arrays')),
  ('Median of Two Sorted Arrays',    'https://leetcode.com/problems/median-of-two-sorted-arrays/',     'hard',   (SELECT id FROM topics WHERE slug='arrays')),

  -- Strings
  ('Longest Substring Without Repeating Characters', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 'medium', (SELECT id FROM topics WHERE slug='strings')),
  ('Valid Anagram',                  'https://leetcode.com/problems/valid-anagram/',                    'easy',   (SELECT id FROM topics WHERE slug='strings')),
  ('Group Anagrams',                 'https://leetcode.com/problems/group-anagrams/',                   'medium', (SELECT id FROM topics WHERE slug='strings')),
  ('Longest Palindromic Substring',  'https://leetcode.com/problems/longest-palindromic-substring/',   'medium', (SELECT id FROM topics WHERE slug='strings')),
  ('Minimum Window Substring',       'https://leetcode.com/problems/minimum-window-substring/',         'hard',   (SELECT id FROM topics WHERE slug='strings')),
  ('Decode Ways',                    'https://leetcode.com/problems/decode-ways/',                      'medium', (SELECT id FROM topics WHERE slug='strings')),
  ('Permutation in String',          'https://leetcode.com/problems/permutation-in-string/',            'medium', (SELECT id FROM topics WHERE slug='strings')),
  ('String to Integer (atoi)',       'https://leetcode.com/problems/string-to-integer-atoi/',           'medium', (SELECT id FROM topics WHERE slug='strings')),
  ('Word Break',                     'https://leetcode.com/problems/word-break/',                       'medium', (SELECT id FROM topics WHERE slug='strings')),
  ('Regular Expression Matching',    'https://leetcode.com/problems/regular-expression-matching/',      'hard',   (SELECT id FROM topics WHERE slug='strings')),

  -- Linked Lists
  ('Reverse Linked List',            'https://leetcode.com/problems/reverse-linked-list/',              'easy',   (SELECT id FROM topics WHERE slug='linked-lists')),
  ('Merge K Sorted Lists',           'https://leetcode.com/problems/merge-k-sorted-lists/',             'hard',   (SELECT id FROM topics WHERE slug='linked-lists')),
  ('Linked List Cycle',              'https://leetcode.com/problems/linked-list-cycle/',                'easy',   (SELECT id FROM topics WHERE slug='linked-lists')),
  ('Middle of the Linked List',      'https://leetcode.com/problems/middle-of-the-linked-list/',        'easy',   (SELECT id FROM topics WHERE slug='linked-lists')),
  ('LRU Cache',                      'https://leetcode.com/problems/lru-cache/',                        'medium', (SELECT id FROM topics WHERE slug='linked-lists')),
  ('Add Two Numbers',                'https://leetcode.com/problems/add-two-numbers/',                  'medium', (SELECT id FROM topics WHERE slug='linked-lists')),
  ('Remove Nth Node From End',       'https://leetcode.com/problems/remove-nth-node-from-end-of-list/','medium', (SELECT id FROM topics WHERE slug='linked-lists')),

  -- Trees
  ('Maximum Depth of Binary Tree',   'https://leetcode.com/problems/maximum-depth-of-binary-tree/',    'easy',   (SELECT id FROM topics WHERE slug='trees')),
  ('Validate Binary Search Tree',    'https://leetcode.com/problems/validate-binary-search-tree/',     'medium', (SELECT id FROM topics WHERE slug='trees')),
  ('Binary Tree Level Order Traversal','https://leetcode.com/problems/binary-tree-level-order-traversal/','medium',(SELECT id FROM topics WHERE slug='trees')),
  ('Lowest Common Ancestor of BST',  'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/','easy',(SELECT id FROM topics WHERE slug='trees')),
  ('Serialize and Deserialize Binary Tree','https://leetcode.com/problems/serialize-and-deserialize-binary-tree/','hard',(SELECT id FROM topics WHERE slug='trees')),
  ('Implement Trie',                 'https://leetcode.com/problems/implement-trie-prefix-tree/',       'medium', (SELECT id FROM topics WHERE slug='trees')),
  ('Path Sum II',                    'https://leetcode.com/problems/path-sum-ii/',                      'medium', (SELECT id FROM topics WHERE slug='trees')),
  ('Flatten Binary Tree to Linked List','https://leetcode.com/problems/flatten-binary-tree-to-linked-list/','medium',(SELECT id FROM topics WHERE slug='trees')),
  ('Same Tree',                      'https://leetcode.com/problems/same-tree/',                        'easy',   (SELECT id FROM topics WHERE slug='trees')),
  ('Symmetric Tree',                 'https://leetcode.com/problems/symmetric-tree/',                   'easy',   (SELECT id FROM topics WHERE slug='trees')),

  -- Graphs
  ('Number of Islands',              'https://leetcode.com/problems/number-of-islands/',                'medium', (SELECT id FROM topics WHERE slug='graphs')),
  ('Clone Graph',                    'https://leetcode.com/problems/clone-graph/',                      'medium', (SELECT id FROM topics WHERE slug='graphs')),
  ('Course Schedule',                'https://leetcode.com/problems/course-schedule/',                  'medium', (SELECT id FROM topics WHERE slug='graphs')),
  ('Word Ladder',                    'https://leetcode.com/problems/word-ladder/',                      'hard',   (SELECT id FROM topics WHERE slug='graphs')),
  ('Alien Dictionary',               'https://leetcode.com/problems/alien-dictionary/',                 'hard',   (SELECT id FROM topics WHERE slug='graphs')),
  ('Graph Valid Tree',               'https://leetcode.com/problems/graph-valid-tree/',                 'medium', (SELECT id FROM topics WHERE slug='graphs')),
  ('Pacific Atlantic Water Flow',    'https://leetcode.com/problems/pacific-atlantic-water-flow/',      'medium', (SELECT id FROM topics WHERE slug='graphs')),

  -- Dynamic Programming
  ('Climbing Stairs',                'https://leetcode.com/problems/climbing-stairs/',                  'easy',   (SELECT id FROM topics WHERE slug='dynamic-prog')),
  ('House Robber',                   'https://leetcode.com/problems/house-robber/',                     'medium', (SELECT id FROM topics WHERE slug='dynamic-prog')),
  ('Coin Change',                    'https://leetcode.com/problems/coin-change/',                      'medium', (SELECT id FROM topics WHERE slug='dynamic-prog')),
  ('Longest Common Subsequence',     'https://leetcode.com/problems/longest-common-subsequence/',       'medium', (SELECT id FROM topics WHERE slug='dynamic-prog')),
  ('Unique Paths',                   'https://leetcode.com/problems/unique-paths/',                     'medium', (SELECT id FROM topics WHERE slug='dynamic-prog')),
  ('Edit Distance',                  'https://leetcode.com/problems/edit-distance/',                    'hard',   (SELECT id FROM topics WHERE slug='dynamic-prog')),
  ('Longest Increasing Subsequence', 'https://leetcode.com/problems/longest-increasing-subsequence/',  'medium', (SELECT id FROM topics WHERE slug='dynamic-prog')),
  ('Minimum Path Sum',               'https://leetcode.com/problems/minimum-path-sum/',                 'medium', (SELECT id FROM topics WHERE slug='dynamic-prog')),

  -- Stacks & Queues
  ('Valid Parentheses',              'https://leetcode.com/problems/valid-parentheses/',                'easy',   (SELECT id FROM topics WHERE slug='stacks-queues')),
  ('Min Stack',                      'https://leetcode.com/problems/min-stack/',                        'medium', (SELECT id FROM topics WHERE slug='stacks-queues')),
  ('Implement Queue Using Stacks',   'https://leetcode.com/problems/implement-queue-using-stacks/',     'easy',   (SELECT id FROM topics WHERE slug='stacks-queues')),
  ('Daily Temperatures',             'https://leetcode.com/problems/daily-temperatures/',               'medium', (SELECT id FROM topics WHERE slug='stacks-queues')),

  -- Binary Search
  ('Binary Search',                  'https://leetcode.com/problems/binary-search/',                    'easy',   (SELECT id FROM topics WHERE slug='binary-search')),
  ('Search in Rotated Sorted Array', 'https://leetcode.com/problems/search-in-rotated-sorted-array/',  'medium', (SELECT id FROM topics WHERE slug='binary-search')),
  ('Find Minimum in Rotated Sorted Array','https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/','medium',(SELECT id FROM topics WHERE slug='binary-search')),
  ('First Bad Version',              'https://leetcode.com/problems/first-bad-version/',                'easy',   (SELECT id FROM topics WHERE slug='binary-search')),

  -- Greedy
  ('Jump Game',                      'https://leetcode.com/problems/jump-game/',                        'medium', (SELECT id FROM topics WHERE slug='greedy')),
  ('Meeting Rooms II',               'https://leetcode.com/problems/meeting-rooms-ii/',                 'medium', (SELECT id FROM topics WHERE slug='greedy')),
  ('Task Scheduler',                 'https://leetcode.com/problems/task-scheduler/',                   'medium', (SELECT id FROM topics WHERE slug='greedy')),

  -- Backtracking
  ('Word Search II',                 'https://leetcode.com/problems/word-search-ii/',                   'hard',   (SELECT id FROM topics WHERE slug='backtracking')),
  ('Permutations',                   'https://leetcode.com/problems/permutations/',                     'medium', (SELECT id FROM topics WHERE slug='backtracking')),
  ('Subsets',                        'https://leetcode.com/problems/subsets/',                          'medium', (SELECT id FROM topics WHERE slug='backtracking')),
  ('Combination Sum',                'https://leetcode.com/problems/combination-sum/',                  'medium', (SELECT id FROM topics WHERE slug='backtracking')),

  -- Heap
  ('Kth Largest Element',            'https://leetcode.com/problems/kth-largest-element-in-an-array/', 'medium', (SELECT id FROM topics WHERE slug='heap')),
  ('Find Median from Data Stream',   'https://leetcode.com/problems/find-median-from-data-stream/',    'hard',   (SELECT id FROM topics WHERE slug='heap')),
  ('Top K Frequent Elements',        'https://leetcode.com/problems/top-k-frequent-elements/',         'medium', (SELECT id FROM topics WHERE slug='heap')),

  -- Design
  ('Insert Delete GetRandom O(1)',   'https://leetcode.com/problems/insert-delete-getrandom-o1/',      'medium', (SELECT id FROM topics WHERE slug='design')),
  ('Design Hit Counter',             'https://leetcode.com/problems/design-hit-counter/',              'medium', (SELECT id FROM topics WHERE slug='design'))
;

-- ============================================================
-- COMPANY-QUESTION MAPPINGS
-- frequency: 1 = seen occasionally, 5 = extremely common
-- ============================================================

-- AMAZON
INSERT INTO company_questions (company_id, question_id, frequency)
SELECT c.id, q.id, f.freq FROM companies c
CROSS JOIN (VALUES
  ('Two Sum',                         5),
  ('Maximum Subarray',                5),
  ('Product of Array Except Self',    4),
  ('Merge Intervals',                 4),
  ('Trapping Rain Water',             3),
  ('LRU Cache',                       4),
  ('Number of Islands',               5),
  ('Word Ladder',                     3),
  ('Binary Tree Level Order Traversal',4),
  ('Lowest Common Ancestor of BST',   4),
  ('Serialize and Deserialize Binary Tree',3),
  ('Coin Change',                     4),
  ('Longest Common Subsequence',      3),
  ('Word Break',                      4),
  ('Minimum Path Sum',                3),
  ('Longest Substring Without Repeating Characters',4),
  ('Valid Parentheses',               4),
  ('Min Stack',                       3),
  ('Reverse Linked List',             4),
  ('Merge K Sorted Lists',            4),
  ('Top K Frequent Elements',         4),
  ('Subarray Sum Equals K',           3),
  ('Climbing Stairs',                 3),
  ('House Robber',                    3),
  ('Course Schedule',                 3),
  ('Insert Delete GetRandom O(1)',    3),
  ('Meeting Rooms II',                3)
) AS f(title, freq)
JOIN questions q ON q.title = f.title
WHERE c.slug = 'amazon'
ON CONFLICT DO NOTHING;

-- MICROSOFT
INSERT INTO company_questions (company_id, question_id, frequency)
SELECT c.id, q.id, f.freq FROM companies c
CROSS JOIN (VALUES
  ('Two Sum',                         5),
  ('Valid Anagram',                   4),
  ('Group Anagrams',                  4),
  ('Climbing Stairs',                 4),
  ('House Robber',                    3),
  ('Unique Paths',                    3),
  ('Implement Trie',                  4),
  ('Validate Binary Search Tree',     4),
  ('Lowest Common Ancestor of BST',   4),
  ('Course Schedule',                 4),
  ('Clone Graph',                     3),
  ('Number of Islands',               4),
  ('Find Median from Data Stream',    3),
  ('Task Scheduler',                  3),
  ('Reverse Linked List',             4),
  ('Linked List Cycle',               3),
  ('Merge Intervals',                 4),
  ('Maximum Subarray',                4),
  ('Spiral Matrix',                   3),
  ('Valid Parentheses',               4),
  ('Min Stack',                       3),
  ('Binary Tree Level Order Traversal',4),
  ('LRU Cache',                       3)
) AS f(title, freq)
JOIN questions q ON q.title = f.title
WHERE c.slug = 'microsoft'
ON CONFLICT DO NOTHING;

-- GOOGLE
INSERT INTO company_questions (company_id, question_id, frequency)
SELECT c.id, q.id, f.freq FROM companies c
CROSS JOIN (VALUES
  ('Median of Two Sorted Arrays',     4),
  ('Trapping Rain Water',             4),
  ('Word Search II',                  3),
  ('Alien Dictionary',                4),
  ('Longest Increasing Subsequence',  4),
  ('Edit Distance',                   4),
  ('Regular Expression Matching',     3),
  ('Jump Game',                       4),
  ('Meeting Rooms II',                4),
  ('Find Median from Data Stream',    4),
  ('Decode Ways',                     3),
  ('Minimum Window Substring',        4),
  ('Permutation in String',           3),
  ('Insert Delete GetRandom O(1)',    3),
  ('Spiral Matrix',                   3),
  ('Subsets',                         3),
  ('Word Ladder',                     3),
  ('Pacific Atlantic Water Flow',     3),
  ('Number of Islands',               4),
  ('Top K Frequent Elements',         3),
  ('Group Anagrams',                  3)
) AS f(title, freq)
JOIN questions q ON q.title = f.title
WHERE c.slug = 'google'
ON CONFLICT DO NOTHING;

-- FLIPKART
INSERT INTO company_questions (company_id, question_id, frequency)
SELECT c.id, q.id, f.freq FROM companies c
CROSS JOIN (VALUES
  ('Best Time to Buy and Sell Stock', 5),
  ('Contains Duplicate',              4),
  ('Find Minimum in Rotated Sorted Array',4),
  ('Search in Rotated Sorted Array',  4),
  ('3Sum',                            4),
  ('Container With Most Water',       4),
  ('Rotate Array',                    3),
  ('Maximum Product Subarray',        4),
  ('Flatten Binary Tree to Linked List',3),
  ('Path Sum II',                     3),
  ('Kth Largest Element',             4),
  ('Subarray Sum Equals K',           3),
  ('Longest Palindromic Substring',   4),
  ('String to Integer (atoi)',        3),
  ('Coin Change',                     3),
  ('House Robber',                    3),
  ('Merge Intervals',                 4),
  ('Two Sum',                         4),
  ('Maximum Subarray',                4),
  ('Valid Parentheses',               3)
) AS f(title, freq)
JOIN questions q ON q.title = f.title
WHERE c.slug = 'flipkart'
ON CONFLICT DO NOTHING;

-- WALMART
INSERT INTO company_questions (company_id, question_id, frequency)
SELECT c.id, q.id, f.freq FROM companies c
CROSS JOIN (VALUES
  ('Two Sum',                         5),
  ('Maximum Depth of Binary Tree',    4),
  ('Same Tree',                       3),
  ('Symmetric Tree',                  3),
  ('Reverse Linked List',             4),
  ('Linked List Cycle',               4),
  ('Middle of the Linked List',       3),
  ('Valid Parentheses',               4),
  ('Implement Queue Using Stacks',    3),
  ('Binary Search',                   4),
  ('First Bad Version',               3),
  ('Move Zeroes',                     3),
  ('Contains Duplicate',              4),
  ('Climbing Stairs',                 4),
  ('Maximum Subarray',                4),
  ('Best Time to Buy and Sell Stock', 4),
  ('Merge Intervals',                 3),
  ('Number of Islands',               3),
  ('Valid Anagram',                   3)
) AS f(title, freq)
JOIN questions q ON q.title = f.title
WHERE c.slug = 'walmart'
ON CONFLICT DO NOTHING;
