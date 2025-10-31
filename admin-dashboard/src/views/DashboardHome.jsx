import React, { useEffect, useState } from 'react'

function DashboardHome({ mode, apiUrl }){
  const [kpis, setKpis] = useState(null)

  useEffect(()=>{
    if(mode==='demo'){
      setKpis({ totalRevenue:45000, todayOrders:12, successRate:92, failed:1 })
      return
    }
    // fetch from API
    fetch(apiUrl + '/admin/kpis').then(r=>r.json()).then(setKpis).catch(()=>{
      setKpis({ totalRevenue:0, todayOrders:0, successRate:0, failed:0 })
    })
  },[mode,apiUrl])

  if(!kpis) return <div className="card">Loading...</div>

  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi card">
          <div className="small">Total Revenue</div>
          <h3>₦{kpis.totalRevenue}</h3>
        </div>
        <div className="kpi card">
          <div className="small">Orders Today</div>
          <h3>{kpis.todayOrders}</h3>
        </div>
        <div className="kpi card">
          <div className="small">Success Rate</div>
          <h3>{kpis.successRate}%</h3>
        </div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <h4>Recent Activity</h4>
        <div className="small">This section shows recent transactions (demo or live)</div>
      </div>
    </div>
  )
}

export default DashboardHome
