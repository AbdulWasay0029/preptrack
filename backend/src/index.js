require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usersRouter     = require('./routes/users');
const questionsRouter = require('./routes/questions');
const progressRouter  = require('./routes/progress');
const analyticsRouter = require('./routes/analytics');
const paymentsRouter  = require('./routes/payments');
const assessmentsRouter = require('./routes/assessments');

const app = express();

// Helper to ensure WEB_URL is a valid CORS origin
const getOrigin = () => {
  if (process.env.NODE_ENV !== 'production') return 'http://localhost:5173';
  let url = process.env.WEB_URL || '*';
  if (url !== '*' && !url.startsWith('http')) {
    url = 'https://' + url;
  }
  return url.replace(/\/$/, ''); // Remove trailing slash if present
};

app.use(cors({
  origin: getOrigin(),
  credentials: true,
}));
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/payments/webhook')) {
      req.rawBody = buf.toString();
    }
  }
}));

// ── Routes ────────────────────────────────────────────────────
app.use('/users',     usersRouter);
app.use('/questions', questionsRouter);
app.use('/progress',  progressRouter);
app.use('/analytics', analyticsRouter);
app.use('/payments',  paymentsRouter);
app.use('/assessments', assessmentsRouter);

// ── Health check ──────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`PrepTrack backend running on port ${PORT}`);
});
