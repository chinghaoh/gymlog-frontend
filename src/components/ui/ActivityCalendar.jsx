import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/ApiClient'
import { useAuth } from '../context/AuthContext'

export default function ActivityCalendar() {
    const { user } = useAuth()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [workouts, setWorkouts] = useState([])
    const [prs, setPrs] = useState([])

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    useEffect(() => {
        if (!user) return

        const start = new Date(year, month, 1).toISOString().split('T')[0]
        const end = new Date(year, month + 1, 0).toISOString().split('T')[0]

        apiClient(`/api/workouts/range?userId=${user.id}&start=${start}&end=${end}`)
            .then(data => setWorkouts(data))
            .catch(err => console.error(err))

        apiClient(`/api/records?userId=${user.id}`)
            .then(data => setPrs(data))
            .catch(err => console.error(err))

    }, [user, year, month])

    // Build calendar days
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()

    const workoutDates = new Set(workouts.map(w => w.date))
    const prDates = new Set(prs.map(pr => pr.achievedAt?.split('T')[0]))

    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

    const getDayBackground = (hasPr, hasWorkout) => {
        if (hasPr) return 'var(--purple)'
        if (hasWorkout) return 'var(--purple-bg)'
        return 'var(--border-light)'
    }

    const buildDateStr = (year, month, day) =>
        `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    const checkIsToday = (year, month, day) => {
        const t = new Date()
        return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day
      }

    const isFutureDay = (year, month, day) =>
        new Date(year, month, day) > new Date()

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '0.5px solid var(--border)',
            borderRadius: 10,
            padding: '1rem',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 30 }}>‹</button>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 30 }}>›</button>
                </div>
            </div>

            {/* Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                    <div key={d} style={{ textAlign: 'center', color: 'var(--text-muted)', paddingBottom: 4 }}>{d}</div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {/* Offset */}
                {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = buildDateStr(year, month, day)
                    const future = isFutureDay(year, month, day)
                    const today = checkIsToday(year, month, day)
                    const hasPr = prDates.has(dateStr)
                    const hasWorkout = workoutDates.has(dateStr)


                    //TODO Add onClick for pr or workout
                    return (
                        <div key={day} style={{
                            height: 28,
                            borderRadius: 4,
                            background: future ? 'transparent' : getDayBackground(hasPr, hasWorkout),
                            border: today ? '0.5px solid var(--purple)' : '0.5px solid transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: future ? 'var(--text-muted)' : 'var(--text-primary)',
                            opacity: future ? 0.3 : 1,
                            cursor: hasWorkout || hasPr ? 'pointer' : 'default'
                        }}>
                            {day}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}