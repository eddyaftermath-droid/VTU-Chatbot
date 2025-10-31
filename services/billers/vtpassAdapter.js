async function buyAirtime(payload){
  // stub: simulate provider success
  return { success:true, message:'VTpass mock success', reference: 'VT'+Date.now() };
}
module.exports = { buyAirtime };
