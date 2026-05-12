import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { apiClient } from "../../lib/ApiClient"
import { NavLink } from "react-router-dom"
export default function Dashboard() {
    const { user, setUser } = useAuth()
    const [summary, setSummary] = useState(null)

    const [recentWorkouts, setRecentWorkouts] = useState([])
    const [latestPrs, setLatestPrs] = useState([])

    useEffect(() => {
        if (!user) return

        apiClient(`/api/dashboard/summary?userId=${user.id}`)
            .then(data => setSummary(data))
            .catch(err => console.error(err))

        apiClient(`/api/workouts?userId=${user.id}`)
            .then(data => setRecentWorkouts(data.slice(0, 5)))
            .catch(err => console.error(err))

        apiClient(`/api/records?userId=${user.id}`)
            .then(data => setLatestPrs(data.slice(0, 3)))
            .catch(err => console.error(err))

    }, [user])

    useEffect(() => {
        console.log(recentWorkouts)
        console.log(latestPrs)
    })


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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.5rem' }}>
                {/* Recent Workouts */}
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Recent Workouts</div>

                    {recentWorkouts.length === 0 ? (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No workouts logged yet</div>
                    ) : (
                        recentWorkouts.map(workout => (
                            <div key={workout.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '8px 0', borderBottom: '0.5px solid var(--border)'
                            }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{workout.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{workout.date} · {workout.durationMinutes} min</div>
                                </div>
                                <span style={{
                                    fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                                    background: 'var(--purple-bg)', color: 'var(--purple-light)'
                                }}>{workout.splitCategory}</span>
                            </div>
                        ))
                    )}

                    <div style={{ marginTop: 12, paddingTop: 8, borderTop: '0.5px solid var(--border)' }}>
                        <NavLink to="/workouts" style={{ fontSize: 12, color: 'var(--purple-light)', textDecoration: 'none' }}>
                            View all workouts →
                        </NavLink>
                    </div>
                </div>

                {/* Latest PRs */}
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Latest Personal Records</div>

                    {latestPrs.length === 0 ? (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No personal records yet</div>
                    ) : (
                        latestPrs.map(pr => (
                            <div key={pr.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '8px 0', borderBottom: '0.5px solid var(--border)'
                            }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{pr.exerciseName}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{pr.category} · {pr.achievedAt}</div>
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)' }}>{pr.weight}kg × {pr.reps}</div>
                            </div>
                        ))
                    )}
                    <div style={{ marginTop: 12, paddingTop: 8, borderTop: '0.5px solid var(--border)' }}>
                        <NavLink to="/records" style={{ fontSize: 12, color: 'var(--purple-light)', textDecoration: 'none' }}>
                            View all records →
                        </NavLink>
                    </div>
                </div>

            </div>
        </div>
    )
}