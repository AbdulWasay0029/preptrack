const app = require('./src/index');
const port = process.env.BACKEND_PORT || 3001;

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend API listening on port ${port}`);
}).on('error', (err) => {
  console.error('FAILED TO START BACKEND:', err);
});
