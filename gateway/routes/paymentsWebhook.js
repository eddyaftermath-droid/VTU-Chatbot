const express = require('express');
const router = express.Router();
const flutter = require('../../services/payments/flutterwaveAdapter');
const paystack = require('../../services/payments/paystackAdapter');
const knex = require('knex');
const path = require('path');

const db = knex({
  client: 'sqlite3',
  connection: { filename: path.resolve(__dirname, '..', '..', 'data', 'dev.sqlite') },
  useNullAsDefault: true
});

router.post('/flutterwave', async (req,res)=>{
  const event = req.body;
  console.log('Flutterwave webhook', JSON.stringify(event).slice(0,200));
  // minimal: expect event.data.id
  try{
    const txId = event.data && event.data.id;
    if(txId){
      const verified = await flutter.verify(txId);
      if(verified && verified.data && verified.data.status === 'successful'){
        const ref = verified.data.tx_ref;
        await db('transactions').where({ reference: ref }).update({ status: 'success', provider_response: JSON.stringify(verified.data) });
      }
    }
  }catch(e){ console.error(e.message); }
  res.sendStatus(200);
});

router.post('/paystack', async (req,res)=>{
  const event = req.body;
  console.log('Paystack webhook', JSON.stringify(event).slice(0,200));
  // minimal handling
  res.sendStatus(200);
});

module.exports = router;
