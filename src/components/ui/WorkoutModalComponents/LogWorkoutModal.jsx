import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'
import { inputStyle } from '../../../lib/styles'

const inputClass = "w-full bg-bg-input border-half rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
const labelClass = "block text-text-muted text-sm mb-1.5"

export default function LogWorkoutModal({ onClose, onLogged, preselectedWorkoutId  }) {
    const { user } = useAuth()
    const [workouts, setWorkouts] = useState([])
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(preselectedWorkoutId || '')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [energyLevel, setEnergyLevel] = useState('5')
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    

    useEffect(() => {
        if (!user) return
        apiClient(`/api/workouts?userId=${user.id}`)
            .then(data => setWorkouts(data))
            .catch(err => console.error(err))
    }, [user])

    const handleSubmit = async () => {
        setError('')
        setFieldErrors({})

        const errors = {}
        if (!selectedWorkoutId) errors.workoutId = 'Please select a workout'
        if (!date) errors.date = 'Please select a date'
        if (energyLevel && (Number(energyLevel) < 1 || Number(energyLevel) > 10)) {
            errors.energyLevel = 'Energy level must be between 1 and 10'
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            return
        }

        try {
            const newLog = await apiClient(`/api/workoutlogs?userId=${user.id}`, {
                method: 'POST',
                body: JSON.stringify({
                    workoutId: Number(selectedWorkoutId),
                    date,
                    energyLevel: energyLevel ? Number(energyLevel) : 5
                })
            })
            onLogged(newLog)
            onClose()
        } catch (err) {
            if (err.fieldErrors) {
                setFieldErrors(err.fieldErrors)
            } else {
                setError(err.message || 'Something went wrong.')
            }
        }
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
            <div
                onClick={e => e.stopPropagation()}
                className="bg-bg-card border-half rounded-xl w-full max-w-md flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4">
                    <div className="font-bold text-text-primary">Log Workout</div>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none text-text-muted cursor-pointer text-lg hover:text-text-primary transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 flex flex-col gap-3">
                    <div>
                        <label className={labelClass}>Workout</label>
                        <select
                            value={selectedWorkoutId}
                            onChange={e => { setSelectedWorkoutId(e.target.value); setFieldErrors(prev => ({ ...prev, workoutId: null })) }}
                            className={`${inputClass} ${fieldErrors.workoutId ? 'border-half-red' : ''}`}
                        >
                            <option value=''>Select a workout</option>
                            {workouts.map(w => (
                                <option key={w.id} value={w.id}>{w.name} — {w.splitCategory}</option>
                            ))}
                        </select>
                        {fieldErrors.workoutId && <div className="text-red text-xs mt-1">{fieldErrors.workoutId}</div>}
                    </div>
                    <div>
                        <label className={labelClass}>Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => { setDate(e.target.value); setFieldErrors(prev => ({ ...prev, date: null })) }}
                            className={`${inputClass} ${fieldErrors.date ? 'border-half-red' : ''}`}
                        />
                        {fieldErrors.date && <div className="text-red text-xs mt-1">{fieldErrors.date}</div>}
                    </div>
                    <div>
                        <label className={labelClass}>Energy level (1-10)</label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={energyLevel}
                            onChange={e => { setEnergyLevel(e.target.value); setFieldErrors(prev => ({ ...prev, energyLevel: null })) }}
                            placeholder="5"
                            className={`${inputClass} ${fieldErrors.energyLevel ? 'border-half-red' : ''}`}
                        />
                        {fieldErrors.energyLevel && <div className="text-red text-xs mt-1">{fieldErrors.energyLevel}</div>}
                    </div>
                    {error && <div className="text-red text-sm">{error}</div>}
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-5 py-4">
                    <button
                        onClick={handleSubmit}
                        className="bg-purple text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        Log Workout
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-transparent text-text-muted border-half rounded-lg px-4 py-2 text-sm cursor-pointer hover:text-text-primary transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}