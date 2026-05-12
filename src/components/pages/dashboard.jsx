import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { apiClient } from "../../lib/ApiClient"

export default function Dashboard() {
    const { user, setUser } = useAuth()
    const [summary, setSummary] = useState(null)

    useEffect(() => {
        if (!user) return
        apiClient(`/api/dashboard/summary?userId=${user.id}`)
          .then(data => setSummary(data))
          .catch(err => console.error(err))
      }, [user])


    const stats = [
        { label: 'Workouts this week', value: summary?.workoutsThisWeek ?? '—', color: 'var(--purple)' },
        { label: 'Personal Records', value: summary?.totalPrs ?? '—', color: 'var(--teal)' },
        { label: 'Current Streak', value: summary?.currentStreak ?? '—', color: 'var(--amber)' },
      ]

    return (
        <div>

            {/* top */}
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

            {/* Stat cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 13,
                marginBottom: '1.5rem'
            }}>
                {stats.map(({ label, value, color }) => (
                    <div key={label} style={{
                        background: 'var(--bg-card)',
                        border: '0.5px solid var(--border)',
                        borderRadius: 10,
                        padding: '1rem',
                    }}>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}