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

    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

    const workoutDates = new Set(workouts.map(w => w.date))
    const prDates = new Set(prs.map(pr => pr.achievedAt?.split('T')[0]))

    const buildDateStr = (y, m, d) =>
        `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

    const checkIsToday = (y, m, d) => {
        const t = new Date()
        return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d
    }

    const isFutureDay = (y, m, d) => new Date(y, m, d) > new Date()

    const getDayClass = (hasPr, hasWorkout, future) => {
        if (future) return 'bg-transparent'
        if (hasPr) return 'bg-purple'
        if (hasWorkout) return 'bg-purple-bg'
        return 'bg-border-light'
    }

    return (
        <div className="bg-bg-card border-half rounded-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-text-primary">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                        className="bg-transparent border-none text-text-muted cursor-pointer text-2xl hover:text-text-primary transition-colors"
                    >
                        ‹
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                        className="bg-transparent border-none text-text-muted cursor-pointer text-2xl hover:text-text-primary transition-colors"
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                    <div key={d} className="text-center text-text-muted text-sm pb-1">{d}</div>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`offset-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = buildDateStr(year, month, day)
                    const future = isFutureDay(year, month, day)
                    const isToday = checkIsToday(year, month, day)
                    const hasPr = prDates.has(dateStr)
                    const hasWorkout = workoutDates.has(dateStr)

                    return (
                        <div
                            key={day}
                            className={`h-7 rounded flex items-center justify-center text-sm transition-opacity
                                ${getDayClass(hasPr, hasWorkout, future)}
                                ${future ? 'text-text-muted opacity-30' : 'text-text-primary'}
                                ${isToday ? 'border-half-purple' : 'border border-transparent'}
                                ${hasWorkout || hasPr ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {day}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}