const axios = require('axios');
require('dotenv').config();
const whatsappService = require('../../services/whatsappService');
const paymentsManager = require('../../services/payments/paymentsManager');
const nlpClient = require('../services/nlpClient');
const knex = require('knex');
const path = require('path');

const db = knex({
  client:'sqlite3',
  connection:{ filename: path.resolve(__dirname,'..','..','data','dev.sqlite')},
  useNullAsDefault: true
});

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'verifytoken';

exports.verifyWebhook = (req,res)=>{
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if(mode && token){
    if(mode==='subscribe' && token===VERIFY_TOKEN){
      console.log('WEBHOOK_VERIFIED');
      return res.status(200).send(challenge);
    } else return res.sendStatus(403);
  }
  res.sendStatus(400);
};

exports.handleIncoming = async (req,res)=>{
  try{
    const body = req.body;
    if (body.object && body.entry){
      for(const entry of body.entry){
        if(!entry.changes) continue;
        for(const change of entry.changes){
          const val = change.value;
          if(!val.messages) continue;
          for(const message of val.messages){
            const from = message.from;
            const text = message.text && message.text.body ? message.text.body.trim() : '';
            console.log('Incoming message', from, text);
            await handleMessage(from, text, message, val.metadata && val.metadata.phone_number_id);
          }
        }
      }
      return res.sendStatus(200);
    }
    res.sendStatus(404);
  }catch(err){ console.error(err); res.sendStatus(500); }
};

async function ensureUser(phone){
  let u = await db('users').where({ phone }).first();
  if(!u){
    const [id] = await db('users').insert({ phone, name:null });
    u = await db('users').where({ id }).first();
  }
  return u;
}

async function handleMessage(from, text){
  const user = await ensureUser(from);
  const nlpr = await nlpClient.parse(text);
  const intent = nlpr && nlpr.intent ? nlpr.intent : null;
  const lower = (text||'').toLowerCase();

  if(intent === 'buy_airtime' || lower.includes('airtime')){
    await whatsappService.sendText(from, 'To buy airtime: AIRTIME <network> <amount> e.g. AIRTIME MTN 500');
    return;
  }
  if(intent === 'buy_data' || lower.includes('data')){
    await whatsappService.sendText(from, 'To buy data: DATA <network> <plan_code> e.g. DATA MTN 1GB');
    return;
  }
  if(/hi|hello|hey/i.test(lower)){
    await whatsappService.sendText(from, 'Hi! Welcome to QuickPay Bot. Reply with AIRTIME, DATA, BILL, or TOPUP <amount>');
    return;
  }
  if(lower.startsWith('topup ')){
    const parts = text.split(/\s+/);
    const amount = parseFloat(parts[1]);
    if(!amount) return whatsappService.sendText(from, 'Invalid topup command. Use: TOPUP <amount>');
    const tx_ref = 'TOPUP' + Date.now();
    // initialize payment via payments manager (auto provider)
    const init = await paymentsManager.initializePayment({ amount, currency:'NGN', customer:{email: from+'@example.local'}, tx_ref, provider: process.env.DEFAULT_PAYMENT_PROVIDER || 'flutterwave' });
    if(init && init.data && (init.data.link || init.data.checkout_url || init.data.authorization_url)){
      const url = init.data.link || init.data.checkout_url || (init.data.authorization_url && init.data.authorization_url);
      await db('transactions').insert({ user_id: user.id, type:'topup', amount, status:'pending', reference: init.data.reference || tx_ref });
      return whatsappService.sendText(from, `To top up ₦${amount}, open: ${url}`);
    } else {
      return whatsappService.sendText(from, 'Failed to create payment link.');
    }
  }

  await whatsappService.sendText(from, "Sorry, I didn't understand. Type HELP.");
}
