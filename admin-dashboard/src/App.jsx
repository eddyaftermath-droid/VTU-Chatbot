import React, { useEffect, useState } from 'react'
import Transactions from './views/Transactions'
import DashboardHome from './views/DashboardHome'
import Users from './views/Users'

const defaultApi = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App(){
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'live')
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('apiUrl') || defaultApi)

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
    localStorage.setItem('theme', theme)
  },[theme])

  useEffect(()=>{ localStorage.setItem('mode', mode); localStorage.setItem('apiUrl', apiUrl)},[mode,apiUrl])

  const [page, setPage] = useState('dashboard')

  return (
    <div>
      <div className="header">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <img src="" alt="logo" style={{width:36,height:36,background:'var(--accent)',borderRadius:8}}/>
          <div>
            <strong>QuickPay Admin</strong>
            <div className="small">WhatsApp-first chatbot</div>
          </div>
        </div>
        <div className="controls">
          <label className="small">Mode:</label>
          <select value={mode} onChange={(e)=>setMode(e.target.value)}>
            <option value="live">Live API</option>
            <option value="demo">Demo Data</option>
          </select>
          <label className="small">API URL:</label>
          <input style={{padding:'6px 8px',borderRadius:6,border:'1px solid rgba(0,0,0,0.08)'}} value={apiUrl} onChange={(e)=>setApiUrl(e.target.value)} />
          <button onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?'Light':'Dark'} mode</button>
        </div>
      </div>

      <div className="container">
        <div style={{display:'flex',gap:12,marginBottom:12}}>
          <button onClick={()=>setPage('dashboard')} className="card">Dashboard</button>
          <button onClick={()=>setPage('transactions')} className="card">Transactions</button>
          <button onClick={()=>setPage('users')} className="card">Users</button>
        </div>

        {page==='dashboard' && <DashboardHome mode={mode} apiUrl={apiUrl} />}
        {page==='transactions' && <Transactions mode={mode} apiUrl={apiUrl} />}
        {page==='users' && <Users mode={mode} apiUrl={apiUrl} />}

      </div>
    </div>
  )
}

export default App
