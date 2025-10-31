const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());

function ruleParse(text){
  const t = (text||'').toLowerCase();
  if(/airtime/.test(t)) return { intent:'buy_airtime', entities:{}, confidence:0.95 };
  if(/data/.test(t)) return { intent:'buy_data', entities:{}, confidence:0.95 };
  if(/bill|dstv|gotv/.test(t)) return { intent:'pay_bill', entities:{}, confidence:0.95 };
  return null;
}

app.post('/parse', async (req,res)=>{
  const { text } = req.body;
  const r = ruleParse(text);
  if(r) return res.json(r);
  if(process.env.OPENAI_API_KEY){
    try{
      const prompt = `Extract intent and entities from: ${text} as JSON with keys intent and entities.`;
      const api = 'https://api.openai.com/v1/chat/completions';
      const resp = await axios.post(api, { model:'gpt-4o-mini', messages:[{role:'user',content:prompt}], max_tokens:200 }, { headers:{ Authorization: 'Bearer '+process.env.OPENAI_API_KEY } });
      const content = resp.data.choices[0].message.content;
      try{ const parsed = JSON.parse(content); parsed.confidence = parsed.confidence || 0.7; return res.json(parsed); }catch(e){ return res.json({ intent:'unknown', entities:{}, confidence:0.4 }); }
    }catch(e){ console.error('openai err', e.message); return res.json({ intent:'unknown', entities:{}, confidence:0.4 }); }
  }
  return res.json({ intent:'unknown', entities:{}, confidence:0.3 });
});

const PORT = process.env.NLP_PORT || 4000;
app.listen(PORT, ()=> console.log('NLP service listening on', PORT));
