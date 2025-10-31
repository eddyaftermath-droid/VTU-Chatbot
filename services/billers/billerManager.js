const vk = require('./vtpassAdapter');
const ck = require('./clubkonnectAdapter');

function getProvidersFor(type){
  // preference order
  return ['vtpass','clubkonnect'];
}

async function callProvider(provider, order){
  if(provider === 'vtpass') return vk.buyAirtime(order.payload);
  if(provider === 'clubkonnect') return ck.buyAirtime(order.payload);
  throw new Error('unknown provider');
}

module.exports = { getProvidersFor, callProvider };
