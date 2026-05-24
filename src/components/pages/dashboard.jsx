import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { apiClient } from "../../lib/ApiClient"
import { NavLink } from "react-router-dom"
import ActivityCalendar from "../ui/ActivityCalendar"
import LogWorkoutModal from "../ui/WorkoutModalComponents/LogWorkoutModal"
import { useNavigate } from "react-router-dom"


export default function Dashboard() {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()    

    const [summary, setSummary] = useState(null)
    const [recentWorkouts, setRecentWorkouts] = useState([])
    const [latestPrs, setLatestPrs] = useState([])
    const [isLogModalOpen, setIsLogModalOpen] = useState(false)


    useEffect(() => {
        if (!user) return

        apiClient(`/api/dashboard/summary?userId=${user.id}`)
            .then(data => setSummary(data))
            .catch(err => console.error(err))

        apiClient(`/api/workoutlogs?userId=${user.id}`)
            .then(data => setRecentWorkouts(data.slice(0, 5)))
            .catch(err => console.error(err))

        apiClient(`/api/records?userId=${user.id}`)
            .then(data => setLatestPrs(data.slice(0, 3)))
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
                    <h1 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                        Welcome back, {user ? user.name : '...'}
                    </p>
                </div>
                <button onClick={() => setIsLogModalOpen(true)} style={{
                    background: 'var(--purple)', color: 'white',
                    border: 'none', borderRadius: 7, padding: '8px 16px',
                    fontWeight: 600, cursor: 'pointer'
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
                        <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
                        <div style={{ fontWeight: 700, color }}>{value}</div>
                    </div>
                ))}
            </div>

            {/* Recent workouts / prs*/}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.5rem' }}>
                {/* Recent Workouts */}
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Recent Workouts</div>

                    {recentWorkouts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ fontSize: 24, marginBottom: 8 }}>👋</div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Welcome to GymLog!</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 12 }}>
                                Get started by letting your AI trainer create your first workout, or build one yourself.
                            </div>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                <button
                                    onClick={() => navigate('/ai')}
                                    style={{ background: 'var(--purple)', color: 'white', borderRadius: 7, padding: '7px 14px', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                                    🤖 Try AI Trainer
                                </button>
                                <button
                                    onClick={() => navigate('/workouts')}
                                    style={{ background: 'transparent', color: 'var(--text-muted)', borderRadius: 7, padding: '7px 14px', fontWeight: 600, border: '0.5px solid var(--border)', cursor: 'pointer', fontSize: 14 }}>
                                    Create Workout
                                </button>
                            </div>
                        </div>
                    ) : (
                        recentWorkouts.map((workout, index) => (
                            <div key={workout.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '8px 0',
                                borderBottom: index === recentWorkouts.length - 1 ? 'none' : '0.5px solid var(--border)'
                            }}>
                                <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{workout.workoutName}</div>
                                <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>
                                    {workout.date} · {workout.durationMinutes ? `${workout.durationMinutes} min` : '—'}
                                </div>
                                <span style={{
                                    fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                                    background: 'var(--purple-bg)', color: 'var(--purple-light)'
                                }}>{workout.splitCategory}</span>
                            </div>
                        ))
                    )}

                    <div style={{ marginTop: 12, paddingTop: 8, borderTop: '0.5px solid var(--border)' }}>
                        <NavLink to="/logs" style={{ color: 'var(--purple-light)', textDecoration: 'none' }}>
                            View all logs →
                        </NavLink>
                    </div>
                </div>

                {/* Latest PRs */}
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Latest Personal Records</div>

                    {latestPrs.length === 0 ? (
                        <div style={{ color: 'var(--text-muted)' }}>No personal records yet</div>
                    ) : (
                        latestPrs.map((pr, index) => (
                            <div key={pr.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '8px 0',
                                borderBottom: index === latestPrs.length - 1 ? 'none' : '0.5px solid var(--border)'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{pr.exerciseName}</div>
                                    <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{pr.category} · {pr.achievedAt}</div>
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--teal)' }}>{pr.weight}kg × {pr.reps}</div>
                            </div>
                        ))
                    )}
                    <div style={{ marginTop: 12, paddingTop: 8, borderTop: '0.5px solid var(--border)' }}>
                        <NavLink to="/records" style={{ color: 'var(--purple-light)', textDecoration: 'none' }}>
                            View all records →
                        </NavLink>
                    </div>
                </div>

            </div>

            {/* Activity calender*/}
            <ActivityCalendar />

            {/* Legend */}
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--purple)', display: 'inline-block' }} />
                    Workout + PR
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--purple-bg)', display: 'inline-block' }} />
                    Workout
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--border-light)', display: 'inline-block' }} />
                    Rest day
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, border: '0.5px solid var(--purple)', display: 'inline-block' }} />
                    Today
                </span>
            </div>

            {isLogModalOpen && (
                <LogWorkoutModal
                    onClose={() => setIsLogModalOpen(false)}
                    onLogged={() => setIsLogModalOpen(false)}
                />
            )}
        </div>
    )
}