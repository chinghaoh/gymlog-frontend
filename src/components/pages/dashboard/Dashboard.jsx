import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { apiClient } from "../../../lib/apiClient"
import { NavLink, useNavigate } from "react-router-dom"
import ActivityCalendar from "../../ui/ActivityCalendar"
import LogWorkoutModal from "../../ui/WorkoutModalComponents/LogWorkoutModal"

export default function Dashboard() {
    const { user } = useAuth()
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
        { label: 'Workouts this week', value: summary?.workoutsThisWeek ?? '—', color: 'text-purple' },
        { label: 'Personal Records', value: summary?.totalPrs ?? '—', color: 'text-teal' },
        { label: 'Current Streak', value: summary?.currentStreak ?? '—', color: 'text-amber' },
    ]

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
                    <p className="text-text-muted text-sm mt-1">Welcome back, {user?.name ?? '...'}</p>
                </div>
                <button
                    onClick={() => setIsLogModalOpen(true)}
                    className="bg-purple text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                >
                    + Log Workout
                </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {stats.map(({ label, value, color }) => (
                    <div key={label} className="bg-bg-card rounded-xl p-4 border border-border">
                        <div className="text-text-muted text-sm mb-2">{label}</div>
                        <div className={`font-bold text-lg ${color}`}>{value}</div>
                    </div>
                ))}
            </div>

            {/* Recent workouts / PRs */}
            <div className="grid grid-cols-2 gap-3 mb-6">

                {/* Recent Workouts */}
                <div className="bg-bg-card rounded-xl p-4 border border-border">
                    <div className="font-semibold text-text-primary mb-3">Recent Workouts</div>

                    {recentWorkouts.length === 0 ? (
                        <div className="text-center py-4">
                            <div className="text-2xl mb-2">👋</div>
                            <div className="font-semibold text-text-primary mb-1.5">Welcome to GymLog!</div>
                            <div className="text-text-muted text-sm mb-3">
                                Get started by letting your AI trainer create your first workout, or build one yourself.
                            </div>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => navigate('/ai')}
                                    className="bg-purple text-white rounded-lg px-3.5 py-1.5 text-sm font-semibold border-none cursor-pointer hover:opacity-90 transition-opacity"
                                >
                                    🤖 Try AI Trainer
                                </button>
                                <button
                                    onClick={() => navigate('/workouts')}
                                    className="bg-transparent text-text-muted border border-border rounded-lg px-3.5 py-1.5 text-sm font-semibold cursor-pointer hover:text-text-primary transition-colors"
                                >
                                    Create Workout
                                </button>
                            </div>
                        </div>
                    ) : (
                        recentWorkouts.map((workout, index) => (
                            <div
                                key={workout.id}
                                className={`flex items-center justify-between py-2 ${index !== recentWorkouts.length - 1 ? 'border-b border-border' : ''}`}
                            >
                                <div className="font-medium text-text-primary text-sm flex-1">{workout.workoutName}</div>
                                <div className="text-text-muted text-xs flex-1 text-center">
                                    {workout.date} · {workout.durationMinutes ? `${workout.durationMinutes} min` : '—'}
                                </div>
                                <div className="flex-1 flex justify-end">
                                <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded">
                                    {workout.splitCategory}
                                </span>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="mt-3 pt-2 border-t border-border">
                        <NavLink to="/logs" className="text-purple-light text-sm no-underline hover:text-purple transition-colors">
                            View all logs →
                        </NavLink>
                    </div>
                </div>

                {/* Latest PRs */}
                <div className="bg-bg-card rounded-xl p-4 border border-border">
                    <div className="font-semibold text-text-primary mb-3">Latest Personal Records</div>

                    {latestPrs.length === 0 ? (
                        <div className="text-text-muted text-sm">No personal records yet</div>
                    ) : (
                        latestPrs.map((pr, index) => (
                            <div
                                key={pr.id}
                                className={`flex items-center justify-between py-2 ${index !== latestPrs.length - 1 ? 'border-b border-border' : ''}`}
                            >
                                <div>
                                    <div className="font-medium text-text-primary text-sm">{pr.exerciseName}</div>
                                    <div className="text-text-muted text-xs mt-0.5">
                                        {pr.category} · {new Date(pr.achievedAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="font-semibold text-teal text-sm">{pr.weight}kg × {pr.reps}</div>
                            </div>
                        ))
                    )}

                    <div className="mt-3 pt-2 border-t border-border">
                        <NavLink to="/records" className="text-purple-light text-sm no-underline hover:text-purple transition-colors">
                            View all records →
                        </NavLink>
                    </div>
                </div>

            </div>

            {/* Activity calendar */}
            <ActivityCalendar />

            {/* Legend */}
            <div className="flex gap-3 mt-2.5 flex-wrap">
                <span className="flex items-center gap-1 text-text-muted text-sm">
                    <span className="w-2 h-2 rounded-sm bg-purple inline-block" />
                    Workout + PR
                </span>
                <span className="flex items-center gap-1 text-text-muted text-sm">
                    <span className="w-2 h-2 rounded-sm bg-purple-bg inline-block" />
                    Workout
                </span>
                <span className="flex items-center gap-1 text-text-muted text-sm">
                    <span className="w-2 h-2 rounded-sm bg-border-light inline-block" />
                    Rest day
                </span>
                <span className="flex items-center gap-1 text-text-muted text-sm">
                    <span className="w-2 h-2 rounded-sm border border-purple inline-block" />
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