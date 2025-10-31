const axios = require('axios');
require('dotenv').config();
const META_TOKEN = process.env.META_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;

async function sendText(to, message){
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  const body = { messaging_product: 'whatsapp', to, text: { body: message } };
  try{
    const res = await axios.post(url, body, { headers: { Authorization: `Bearer ${META_TOKEN}` } });
    return res.data;
  }catch(err){
    console.error('WhatsApp send error', err.response && err.response.data ? err.response.data : err.message);
    throw err;
  }
}

module.exports = { sendText };
