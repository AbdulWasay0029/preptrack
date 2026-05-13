const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
require('dotenv').config();
require('./config/passport'); // Load passport config

const app = express();
const assessmentRouter = require('./routes/assessment');
const questionsRouter = require('./routes/questions');
const usersRouter     = require('./routes/users');
const progressRouter  = require('./routes/progress');
const analyticsRouter = require('./routes/analytics');
const paymentsRouter  = require('./routes/payments');
const authRouter      = require('./routes/auth');

const { initDb } = require('./services/init');

// Initialize Database on startup
initDb();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());


app.use('/assessment', assessmentRouter);
app.use('/questions', questionsRouter);
app.use('/users',     usersRouter);
app.use('/progress',  progressRouter);
app.use('/analytics', analyticsRouter);
app.use('/payments',  paymentsRouter);
app.use('/auth',      authRouter);

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
