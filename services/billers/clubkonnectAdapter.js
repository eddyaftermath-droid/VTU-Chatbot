async function buyAirtime(payload){
  // stub: simulate provider success/fail
  return { success:true, message:'ClubKonnect mock success', reference: 'CK'+Date.now() };
}
module.exports = { buyAirtime };
