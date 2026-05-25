import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'


const inputClass = "w-full bg-bg-input border-half rounded-md px-2 py-1.5 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"

export default function AddExerciseToWorkoutModal({ exercise, onClose, onSuccess }) {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [workouts, setWorkouts] = useState([])
    const [selectedWorkoutId, setSelectedWorkoutId] = useState('')
    const [sets, setSets] = useState([{ weight: 0, reps: 0 }])
    const [fetchingWorkouts, setFetchingWorkouts] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [fieldErrors, setFieldErrors] = useState({})

    useEffect(() => {
        if (!user) return
        const fetchWorkouts = async () => {
            try {
                const data = await apiClient(`/api/workouts?userId=${user.id}`)
                setWorkouts(data)
                if (data.length > 0) setSelectedWorkoutId(data[0].id)
            } catch {
                setError('Could not load workouts.')
            } finally {
                setFetchingWorkouts(false)
            }
        }
        fetchWorkouts()
    }, [user])

    const updateSet = (index, field, value) => {
        setSets(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
        // clear set errors when user types
        setFieldErrors({})
    }

    const addSet = () => setSets(prev => [...prev, { weight: 0, reps: 0 }])

    const removeSet = (index) => {
        if (sets.length === 1) return
        setSets(prev => prev.filter((_, i) => i !== index))
    }

    const validateSets = () => {
        const errors = {}
        sets.forEach((set, i) => {
            if (set.reps === '' || set.reps === null || Number(set.reps) < 1) {
                errors[`set_${i}_reps`] = 'Required'
            }
            if (set.weight === '' || set.weight === null || Number(set.weight) < 0) {
                errors[`set_${i}_weight`] = 'Required'
            }
        })
        return errors
    }

    const handleConfirm = async () => {
        if (!selectedWorkoutId) { setError('Please select a workout.'); return }

        const errors = validateSets()
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            return
        }

        setLoading(true)
        setError(null)
        setFieldErrors({})

        try {
            await apiClient(`/api/sets/bulk?workoutId=${selectedWorkoutId}&exerciseId=${exercise.id}`, {
                method: 'POST',
                body: JSON.stringify(sets.map((set, i) => ({
                    setNumber: i + 1,
                    reps: Number(set.reps) || 0,
                    weight: Number(set.weight) || 0,
                    notes: null,
                })))
            })
            if (onSuccess) onSuccess()
            navigate(`/workouts/${selectedWorkoutId}`)
            onClose()
        } catch (err) {
            if (err.fieldErrors) {
                setFieldErrors(err.fieldErrors)
            } else {
                setError(err.message || 'Something went wrong.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
            <div className="bg-bg-card border-half rounded-xl w-full max-w-[440px] flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-start justify-between px-4 py-4 flex-shrink-0">
                    <div>
                        <div className="font-semibold text-text-primary">Add exercise to workout</div>
                        <div className="text-text-muted text-sm mt-0.5">Choose a workout and log your sets</div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-bg-input border-half rounded-md w-6 h-6 flex items-center justify-center text-text-secondary cursor-pointer hover:text-text-primary transition-colors text-sm"
                    >
                        ×
                    </button>
                </div>

                {/* Exercise strip */}
                <div className="px-4 py-2.5 bg-bg-page flex-shrink-0">
                    <div className="font-semibold text-text-primary text-sm">{exercise?.name}</div>
                    <div className="text-text-muted text-xs mt-0.5">
                        {exercise?.category} · {exercise?.targetMuscle} · {exercise?.equipment}
                    </div>
                </div>

                {/* Body */}
                <div className="px-4 py-3.5 flex flex-col gap-3.5 overflow-y-auto flex-1">

                    {/* Workout select */}
                    <div>
                        <div className="text-text-muted text-xs uppercase tracking-wider font-semibold mb-1.5">
                            Select workout
                        </div>
                        {fetchingWorkouts ? (
                            <div className="text-text-muted text-sm">Loading workouts...</div>
                        ) : workouts.length === 0 ? (
                            <div className="text-text-muted text-sm">No workouts found. Create one first.</div>
                        ) : (
                            <select
                                value={selectedWorkoutId}
                                onChange={e => setSelectedWorkoutId(Number(e.target.value))}
                                className="w-full bg-bg-input border-half rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
                            >
                                {workouts.map(w => (
                                    <option key={w.id} value={w.id}>{w.name} · {w.splitCategory}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Sets */}
                    <div>
                        <div className="flex items-center gap-2 mb-2.5">
                            <span className="text-text-muted text-xs uppercase tracking-wider font-semibold">Sets</span>
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-purple text-sm font-semibold">
                                {sets.length} {sets.length === 1 ? 'set' : 'sets'}
                            </span>
                        </div>

                        {/* Column headers */}
                        <div className="grid grid-cols-[28px_1fr_1fr_28px] gap-1.5 mb-1.5">
                            <div />
                            <div className="text-text-muted text-xs uppercase tracking-wider pl-2">Weight (kg)</div>
                            <div className="text-text-muted text-xs uppercase tracking-wider pl-2">Reps</div>
                            <div />
                        </div>

                        {/* Set rows */}
                        <div className="flex flex-col gap-1.5">
                            {sets.map((set, i) => (
                                <div key={i} className="flex flex-col gap-0.5">
                                    <div className="grid grid-cols-[28px_1fr_1fr_28px] gap-1.5 items-center">
                                        <div className="w-5 h-5 bg-purple-bg rounded flex items-center justify-center font-semibold text-purple-light text-xs">
                                            {i + 1}
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            value={set.weight}
                                            onChange={e => updateSet(i, 'weight', e.target.value)}
                                            className={`${inputClass} ${fieldErrors[`set_${i}_weight`] ? 'border-half-red' : ''}`}
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            value={set.reps}
                                            onChange={e => updateSet(i, 'reps', e.target.value)}
                                            className={`${inputClass} ${fieldErrors[`set_${i}_reps`] ? 'border-half-red' : ''}`}
                                        />
                                        <button
                                            onClick={() => removeSet(i)}
                                            disabled={sets.length === 1}
                                            className={`bg-transparent border-none flex items-center justify-center text-sm
                                                ${sets.length === 1 ? 'text-border cursor-not-allowed' : 'text-red cursor-pointer hover:opacity-70'}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    {/* per-set errors */}
                                    {(fieldErrors[`set_${i}_weight`] || fieldErrors[`set_${i}_reps`]) && (
                                        <div className="text-red text-xs pl-8">
                                            {fieldErrors[`set_${i}_weight`] && <span>Weight required · </span>}
                                            {fieldErrors[`set_${i}_reps`] && <span>Reps required</span>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add set */}
                        <div onClick={addSet} className="flex items-center gap-1.5 mt-2 cursor-pointer">
                            <div className="w-5 h-5 rounded bg-bg-page border border-dashed border-border flex items-center justify-center text-purple text-sm">
                                +
                            </div>
                            <span className="text-purple text-sm font-medium">Add another set</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-4 py-3 flex-shrink-0">
                    {error && <span className="text-red text-sm flex-1">{error}</span>}
                    <button
                        onClick={onClose}
                        className="bg-bg-input border-half rounded-md px-3.5 py-1.5 text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex items-center gap-1.5 border-none rounded-md px-4 py-1.5 text-sm font-semibold transition-opacity
                            ${loading ? 'bg-border text-text-muted cursor-not-allowed' : 'bg-purple text-white cursor-pointer hover:opacity-90'}`}
                    >
                        {loading ? 'Adding...' : 'Add to workout'}
                        {!loading && (
                            <span className="bg-white/20 rounded px-1.5 py-0.5 text-xs">
                                {sets.length} {sets.length === 1 ? 'set' : 'sets'}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}