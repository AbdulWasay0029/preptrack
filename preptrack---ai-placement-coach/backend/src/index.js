const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const assessmentsRouter = require('./routes/assessments');
const questionsRouter = require('./routes/questions');

const { initDb } = require('./services/init');

// Initialize Database on startup
initDb();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/assessments', assessmentsRouter);
app.use('/questions', questionsRouter);

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
