const axios = require('axios');

const client = axios.create({
  baseURL: process.env.BACKEND_URL,
  headers: { Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}` },
  timeout: 10000,
});

const api = {
  async upsertUser(telegramId, name, username) {
    const { data } = await client.post('/users', {
      telegram_id: telegramId,
      name,
      username,
    });
    return data;
  },

  async getUser(telegramId) {
    const { data } = await client.get(`/users/${telegramId}`);
    return data;
  },

  async updateUser(telegramId, updates) {
    const { data } = await client.patch(`/users/${telegramId}`, updates);
    return data;
  },

  async getDailyQuestions(telegramId) {
    const { data } = await client.get(`/questions/daily/${telegramId}`);
    return data;
  },

  async getCompanies() {
    const { data } = await client.get('/questions/companies');
    return data;
  },

  async recordProgress(telegramId, questionId, status) {
    const { data } = await client.post('/progress', {
      telegram_id: telegramId,
      question_id: questionId,
      status,
    });
    return data;
  },

  async getSummary(telegramId) {
    const { data } = await client.get(`/progress/${telegramId}/summary`);
    return data;
  },

  async getActiveUsers() {
    const { data } = await client.get('/users/active');
    return data;
  },

  async submitSuggestion(telegramId, url) {
    const { data } = await client.post('/users/suggest', { telegram_id: telegramId, url });
    return data;
  },

  async startAssessment(telegramId, companySlug) {
    const { data } = await client.post('/assessments/start', { telegram_id: telegramId, company_slug: companySlug });
    return data;
  },

  async submitResponse(assessmentId, payload) {
    const { data } = await client.post(`/assessments/${assessmentId}/respond`, payload);
    return data;
  },

  async completeAssessment(assessmentId) {
    const { data } = await client.post(`/assessments/${assessmentId}/complete`);
    return data;
  },

  async getLatestAssessment(telegramId) {
    const { data } = await client.get(`/assessments/${telegramId}/latest`);
    return data;
  }
};

module.exports = { ...api, client };
