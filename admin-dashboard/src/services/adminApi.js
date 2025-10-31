export async function fetchJson(url, opts){
  const res = await fetch(url, opts);
  if(!res.ok) throw new Error('network');
  return res.json();
}
