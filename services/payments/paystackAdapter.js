const axios = require('axios');
require('dotenv').config();
const KEY = process.env.PAYSTACK_SECRET_KEY;

async function initialize({ email, amount }){
  const res = await axios.post('https://api.paystack.co/transaction/initialize', { email, amount }, { headers: { Authorization: `Bearer ${KEY}` } });
  return res.data;
}

async function verify(reference){
  const res = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, { headers: { Authorization: `Bearer ${KEY}` } });
  return res.data;
}

module.exports = { initialize, verify };
