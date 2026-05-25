import { useState } from 'react'
import { apiClient } from '../../../lib/ApiClient'
import { useAuth } from '../../context/AuthContext'

const inputClass = "w-full bg-bg-input border-half rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
const labelClass = "block text-text-muted text-sm mb-1.5"

export default function CreateWorkoutModal({ onClose, onCreated }) {
    const { user } = useAuth()
    const [name, setName] = useState('')
    const [splitCategory, setSplitCategory] = useState('PUSH')
    const [durationMinutes, setDurationMinutes] = useState('60')
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})

    const handleSubmit = async () => {
        if (!name.trim()) {
            setFieldErrors({ name: 'Please enter a workout name' })
            return
        }
        setError('')
        setFieldErrors({})
        try {
            const newWorkout = await apiClient(`/api/workouts?userId=${user.id}`, {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    splitCategory,
                    durationMinutes: Number(durationMinutes)
                })
            })
            onCreated(newWorkout)
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
                    <div className="font-bold text-text-primary">New Workout</div>
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
                        <label className={labelClass}>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: null })) }}
                            placeholder="e.g. Push Day"
                            className={`${inputClass} ${fieldErrors.name ? 'border-half-red' : ''}`}
                        />
                        {fieldErrors.name && <div className="text-red text-xs mt-1">{fieldErrors.name}</div>}
                    </div>
                    <div>
                        <label className={labelClass}>Split</label>
                        <select
                            value={splitCategory}
                            onChange={e => setSplitCategory(e.target.value)}
                            className={inputClass}
                        >
                            {['PUSH', 'PULL', 'LEGS', 'UPPER_BODY', 'FULL_BODY', 'CARDIO', 'OTHER'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {fieldErrors.splitCategory && <div className="text-red text-xs mt-1">{fieldErrors.splitCategory}</div>}
                    </div>
                    <div>
                        <label className={labelClass}>Duration (min)</label>
                        <input
                            type="number"
                            value={durationMinutes}
                            onChange={e => setDurationMinutes(e.target.value)}
                            placeholder="60"
                            className={`${inputClass} ${fieldErrors.durationMinutes ? 'border-half-red' : ''}`}
                        />
                        {fieldErrors.durationMinutes && <div className="text-red text-xs mt-1">{fieldErrors.durationMinutes}</div>}
                    </div>
                    {error && <div className="text-red text-sm">{error}</div>}
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-5 py-4">
                    <button
                        onClick={handleSubmit}
                        className="bg-purple text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        Create Workout
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