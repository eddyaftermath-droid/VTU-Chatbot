const paystack = require('./paystackAdapter');
const flutter = require('./flutterwaveAdapter');

async function initializePayment(opts){
  const provider = opts.provider || process.env.DEFAULT_PAYMENT_PROVIDER || 'flutterwave';
  if(provider === 'paystack') return paystack.initialize(opts);
  return flutter.initialize(opts);
}

async function verifyPayment({ provider, reference }){
  if(provider === 'paystack') return paystack.verify(reference);
  if(provider === 'flutterwave') return flutter.verify(reference);
  return null;
}

module.exports = { initializePayment, verifyPayment };
