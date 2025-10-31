// gateway/api/index.js
const app = require('../app');

// Vercel expects module.exports = app (Express) or a handler
module.exports = app;
