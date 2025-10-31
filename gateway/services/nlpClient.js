const axios = require('axios');
const NLP_URL = process.env.NLP_URL || 'http://localhost:4000/parse';

async function parse(text){
  try{
    const res = await axios.post(NLP_URL, { text }, { timeout: 5000 });
    return res.data;
  }catch(e){ return null; }
}

module.exports = { parse };
