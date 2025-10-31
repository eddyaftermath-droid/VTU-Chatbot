/ gateway/app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const webhookRoutes = require('./routes/webhook');
const paymentsWebhook = require('./routes/paymentsWebhook');

const app = express();
app.use(bodyParser.json());

app.use('/webhook', webhookRoutes);
app.use('/webhook/payments', paymentsWebhook);

app.get('/', (req, res) => res.send('WhatsApp Chatbot Gateway (serverless)'));

// export the app for Vercel
module.exports = app;
