const { Worker } = require('bullmq');
const Redis = require('ioredis');
const billerManager = require('../services/billers/billerManager');
const path = require('path');
const knex = require('knex');

const connection = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
const db = knex({ client:'sqlite3', connection:{ filename: path.resolve(__dirname,'..','data','dev.sqlite') }, useNullAsDefault:true });

const worker = new Worker('orders', async job => {
  const order = job.data;
  const providers = billerManager.getProvidersFor(order.type);
  let lastErr = null;
  for(const p of providers){
    try{
      const res = await billerManager.callProvider(p, order);
      if(res && res.success){
        await db('transactions').where({ id: order.id }).update({ status: 'success', provider_response: JSON.stringify(res), reference: res.reference });
        return;
      }
    }catch(e){ lastErr = e; console.error('provider err', e.message); }
  }
  await db('transactions').where({ id: order.id }).update({ status: 'failed', provider_response: JSON.stringify({ error: lastErr ? lastErr.message : 'all failed' }) });
  throw new Error('All providers failed');
});

worker.on('failed', (job, err)=> console.error('job failed', job.id, err.message));
console.log('Fallback worker started');
