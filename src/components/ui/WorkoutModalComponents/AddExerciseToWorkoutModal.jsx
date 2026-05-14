import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'

export default function AddExerciseToWorkoutModal({ exercise, onClose, onSuccess }) {
    const [workouts, setWorkouts] = useState([])
    const [selectedWorkoutId, setSelectedWorkoutId] = useState('')
    const [sets, setSets] = useState([{ weight: 0, reps: 0 }])
    const [fetchingWorkouts, setFetchingWorkouts] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { user } = useAuth()

    const updateSet = (index, field, value) => {
        setSets(prev => prev.map((s, i) =>
            i === index ? { ...s, [field]: value } : s
        ))
    }

    const addSet = () => {
        setSets(prev => [...prev, { weight: 0, reps: 0 }])
    }

    const removeSet = (index) => {
        if (sets.length === 1) return
        setSets(prev => prev.filter((_, i) => i !== index))
    }

    const handleConfirm = async () => {
        if (!selectedWorkoutId) {
            setError('Please select a workout.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            for (let i = 0; i < sets.length; i++) {
                await apiClient(`/api/sets?workoutId=${selectedWorkoutId}&exerciseId=${exercise.id}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        setNumber: i + 1,
                        reps: Number(sets[i].reps) || 0,
                        weight: Number(sets[i].weight) || 0,
                        notes: null,
                    }),
                })
            }
            if (onSuccess) onSuccess()
            onClose()
        } catch (err) {
            setError(err.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!user) return

        const fetchWorkouts = async () => {
            try {
                const data = await apiClient(`/api/workouts?userId=${user.id}`)
                setWorkouts(data)
                if (data.length > 0) setSelectedWorkoutId(data[0].id)
            } catch (err) {
                setError('Could not load workouts.')
            } finally {
                setFetchingWorkouts(false)
            }
        }

        fetchWorkouts()
    }, [user])

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            {/* Top headers*/}
            <div style={{
                background: '#1a1a24',
                border: '0.5px solid #2a2a38',
                borderRadius: 12,
                width: 440,
                maxWidth: '95vw',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh',
                overflow: 'hidden',
            }}>
                <div style={{
                    padding: '16px 18px 14px',
                    borderBottom: '0.5px solid #2a2a38',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <div>
                        <div style={{ fontWeight: 600, color: '#e8e8f0' }}>
                            Add exercise to workout
                        </div>
                        <div style={{ color: '#6b6b80', marginTop: 2 }}>
                            Choose a workout and log your sets
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: '#0f0f13',
                        border: '0.5px solid #2a2a38',
                        borderRadius: 5,
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9090a8',
                        cursor: 'pointer',
                    }}>×</button>
                </div>

                {/* Exercise name */}
                <div style={{
                    padding: '10px 18px',
                    background: '#141418',
                    borderBottom: '0.5px solid #2a2a38',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexShrink: 0,
                }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#e8e8f0' }}>
                            {exercise?.name}
                        </div>
                        <div style={{ color: '#6b6b80' }}>
                            {exercise?.category} · {exercise?.targetMuscle} · {exercise?.equipment}
                        </div>
                    </div>
                </div>

                {/* Workout dropdown */}
                <div style={{
                    padding: '14px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    overflowY: 'auto',
                    flex: 1,
                }}>
                    <div>
                        <div style={{ fontWeight: 600, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                            Select workout
                        </div>
                        {fetchingWorkouts ? (
                            <div style={{ color: '#6b6b80' }}>Loading workouts...</div>
                        ) : workouts.length === 0 ? (
                            <div style={{ color: '#6b6b80' }}>No workouts found. Create one first.</div>
                        ) : (
                            <select
                                value={selectedWorkoutId}
                                onChange={e => setSelectedWorkoutId(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    background: '#0f0f13',
                                    border: '0.5px solid #2a2a38',
                                    borderRadius: 7,
                                    padding: '9px 12px',
                                    color: '#e8e8f0',
                                    outline: 'none',
                                }}
                            >
                                {workouts.map(w => (
                                    <option key={w.id} value={w.id}>
                                        {w.name} · {w.splitCategory}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <span style={{ fontWeight: 600, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sets</span>
                            <div style={{ flex: 1, height: '0.5px', background: '#2a2a38' }} />
                            <span style={{ color: '#534AB7', fontWeight: 600 }}>{sets.length} {sets.length === 1 ? 'set' : 'sets'}</span>
                        </div>

                        {/* Workout set headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 28px', gap: 6, marginBottom: 6 }}>
                            <div />
                            <div style={{ color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.04em', paddingLeft: 8 }}>Weight (kg)</div>
                            <div style={{ color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.04em', paddingLeft: 8 }}>Reps</div>
                            <div />
                        </div>

                        {/* Sets */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {sets.map((set, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 28px', gap: 6, alignItems: 'center' }}>
                                    <div style={{
                                        width: 22, height: 22,
                                        background: '#1f1f30',
                                        borderRadius: 5,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 600, color: '#7B73E0',
                                    }}>{i + 1}</div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={set.weight}
                                        onChange={e => updateSet(i, 'weight', e.target.value)}
                                        style={{
                                            background: '#0f0f13',
                                            border: '0.5px solid #2a2a38',
                                            borderRadius: 6,
                                            padding: '7px 8px',
                                            color: '#e8e8f0',
                                            outline: 'none',
                                            width: '100%',
                                        }}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        value={set.reps}
                                        onChange={e => updateSet(i, 'reps', e.target.value)}
                                        style={{
                                            background: '#0f0f13',
                                            border: '0.5px solid #2a2a38',
                                            borderRadius: 6,
                                            padding: '7px 8px',
                                            color: '#e8e8f0',
                                            outline: 'none',
                                            width: '100%',
                                        }}
                                    />
                                    <button
                                        onClick={() => removeSet(i)}
                                        disabled={sets.length === 1}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: sets.length === 1 ? '#2a2a38' : '#E24B4A',
                                            cursor: sets.length === 1 ? 'default' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >X</button>
                                </div>
                            ))}
                        </div>

                        {/* Add set button */}
                        <div
                            onClick={addSet}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                marginTop: 8,
                                cursor: 'pointer',
                            }}
                        >
                            <div style={{
                                width: 22, height: 22,
                                borderRadius: 5,
                                background: '#141418',
                                border: '0.5px dashed #2a2a38',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#534AB7',
                            }}>+</div>
                            <span style={{ color: '#534AB7', fontWeight: 500 }}>Add another set</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '12px 18px',
                    borderTop: '0.5px solid #2a2a38',
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    flexShrink: 0,
                }}>
                    {error && (
                        <span style={{ color: '#E24B4A', flex: 1 }}>{error}</span>
                    )}
                    <button onClick={onClose} style={{
                        background: '#0f0f13',
                        border: '0.5px solid #2a2a38',
                        borderRadius: 6,
                        padding: '7px 14px',
                        color: '#9090a8',
                        cursor: 'pointer',
                    }}>Cancel</button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        style={{
                            background: loading ? '#2a2a38' : '#534AB7',
                            border: 'none',
                            borderRadius: 6,
                            padding: '7px 16px',
                            fontWeight: 600,
                            color: 'white',
                            cursor: loading ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        {loading ? 'Adding...' : `Add to workout`}
                        {!loading && (
                            <span style={{
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: 3,
                                padding: '1px 5px',
                            }}>{sets.length} {sets.length === 1 ? 'set' : 'sets'}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}