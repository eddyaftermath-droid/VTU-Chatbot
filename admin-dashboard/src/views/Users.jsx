import React, { useEffect, useState } from 'react'

function Users({ mode, apiUrl }){
  const [users, setUsers] = useState([])

  useEffect(()=>{
    if(mode==='demo'){
      setUsers([{id:1, phone:'+2348012345678', balance:5000}, {id:2, phone:'+2348098765432', balance:1200}])
      return
    }
    fetch(apiUrl + '/admin/users').then(r=>r.json()).then(setUsers).catch(()=>setUsers([]))
  },[mode,apiUrl])

  return (
    <div>
      <div className="card">
        <h3>Users</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>Phone</th><th>Wallet</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id}><td>{u.id}</td><td>{u.phone}</td><td>₦{u.wallet_balance||u.balance||0}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
