import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

export default function Dashboard() {
  const {user, setUser} =  useAuth()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Welcome back, {user ? user.name : '...'}
          </p>
        </div>
        <button style={{
          background: 'var(--purple)', color: 'white',
          border: 'none', borderRadius: 7, padding: '8px 16px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer'
        }}>+ Log Workout</button>
      </div>

      content
    </div>
  )
}