const axios = require('axios');
require('dotenv').config();
const base = 'https://api.flutterwave.com/v3';
const KEY = process.env.FLUTTERWAVE_SECRET_KEY;

async function initialize({ amount, currency='NGN', customer, tx_ref, redirect_url }){
  const body = { tx_ref, amount: amount.toString(), currency, redirect_url, customer };
  const res = await axios.post(`${base}/payments`, body, { headers: { Authorization: `Bearer ${KEY}` } });
  return res.data;
}

async function verify(transaction_id){
  const res = await axios.get(`${base}/transactions/${transaction_id}/verify`, { headers: { Authorization: `Bearer ${KEY}` } });
  return res.data;
}

async function refund(payment_id, amount){
  const res = await axios.post(`${base}/payments/${payment_id}/refund`, { amount }, { headers: { Authorization: `Bearer ${KEY}` } });
  return res.data;
}

module.exports = { initialize, verify, refund };
