const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const webhookRoutes = require('./routes/webhook');
const paymentsWebhook = require('./routes/paymentsWebhook');
const knex = require('knex');

const app = require('./app);
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Gateway listening on port', PORT));

const dbFile = path.resolve(__dirname, '..', 'data', 'dev.sqlite');
const sqlFile = path.resolve(__dirname, '..', 'sql', 'schema.sql');

// ensure data dir
if (!fs.existsSync(path.resolve(__dirname,'..','data'))) fs.mkdirSync(path.resolve(__dirname,'..','data'));

const db = knex({
  client: 'sqlite3',
  connection: { filename: dbFile },
  useNullAsDefault: true
});

// init schema
const sql = fs.readFileSync(sqlFile).toString();
(async () => {
  const statements = sql.split(';').map(s=>s.trim()).filter(Boolean);
  for (const st of statements) {
    try { await db.raw(st); } catch(e){ console.error('schema err', e.message); }
  }
})();

app.use('/webhook', webhookRoutes);
app.use('/webhook/payments', paymentsWebhook);

app.get('/', (req,res)=> res.send('WhatsApp Chatbot Demo running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Gateway listening on port', PORT));
