import React, { useEffect, useState } from 'react'

function Transactions({ mode, apiUrl }){
  const [rows, setRows] = useState([])

  useEffect(()=>{
    if(mode==='demo'){
      setRows([
        {id:1, user:'+2348012345678', type:'topup', amount:1000, status:'success', provider:'flutterwave'},
        {id:2, user:'+2348098765432', type:'airtime', amount:200, status:'failed', provider:'vtpass'},
      ])
      return
    }
    fetch(apiUrl + '/admin/transactions').then(r=>r.json()).then(setRows).catch(()=>setRows([]))
  },[mode,apiUrl])

  return (
    <div>
      <div className="card">
        <h3>Transactions</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>User</th><th>Type</th><th>Amount</th><th>Status</th><th>Provider</th></tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.user}</td>
                <td>{r.type}</td>
                <td>₦{r.amount}</td>
                <td>{r.status}</td>
                <td>{r.provider||'n/a'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Transactions
