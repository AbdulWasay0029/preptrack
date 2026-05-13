const fs = require('fs');
const path = require('path');

const filePath = 'd:\\Code\\Active-Projects\\Interview Prep\\preptrack\\database\\seed\\questions.sql';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Line 149 in view is index 148
console.log('Line 149:', lines[148]);
console.log('Line 150:', lines[149]);
console.log('Line 380:', lines[379]);

// Update line 149 to end with semicolon
lines[148] = lines[148].replace(/,$/, ';');

// Remove lines 150 to 380 (index 149 to 379)
lines.splice(149, 231);

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Fixed questions.sql');
