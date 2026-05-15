import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'
import { useAuth } from '../context/AuthContext'
import WeightProgressionChart from '../ui/WeightProgressChart'
import SetHistoryList from '../ui/SetHistoryList'
import AddExerciseToWorkoutModal from '../ui/WorkoutModalComponents/AddExerciseToWorkoutModal'

export default function ExerciseDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [exercise, setExercise] = useState(null)
    const [sets, setSets] = useState([])
    const [pr, setPr] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)


    useEffect(() => {
        if (!user) return

        const fetchData = async () => {
            try {
                const [exerciseData, setsData, recordsData] = await Promise.all([
                    apiClient(`/api/exercises/${id}`),
                    apiClient(`/api/sets/by-exercise?userId=${user.id}&exerciseId=${id}`),
                    apiClient(`/api/records?userId=${user.id}`),
                ])
                setExercise(exerciseData)
                setSets(setsData)
                const exercisePr = recordsData.find(r => r.exerciseId === Number(id))
                setPr(exercisePr || null)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user, id])

    if (loading) return <div style={{ color: 'var(--text-muted)', padding: 20 }}>Loading...</div>
    if (!exercise) return <div style={{ color: 'var(--text-muted)', padding: 20 }}>Exercise not found.</div>

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div
                onClick={() => navigate('/exercises')}
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', cursor: 'pointer', width: 'fit-content' }}
            >
                ← Back to exercises
            </div>

            {/* Exercise info container */}
            <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* GIF */}
                <div style={{ width: 120, height: 120, background: 'var(--bg-input)', border: '0.5px solid var(--border)', borderRadius: 8, flexShrink: 0, overflow: 'hidden' }}>
                    {exercise.gifUrl ? (
                        <img src={exercise.gifUrl} alt={exercise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>▶</div>
                    )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{exercise.name}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        <span style={{ background: 'var(--purple-bg)', color: 'var(--purple-light)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{exercise.category}</span>
                        <span style={{ background: 'var(--border-light)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: 4 }}>{exercise.equipment}</span>
                        {exercise.difficulty && (
                            <span style={{
                                padding: '2px 8px', borderRadius: 4,
                                background: exercise.difficulty === 'BEGINNER' ? 'var(--teal-bg)' : exercise.difficulty === 'INTERMEDIATE' ? 'var(--amber-bg)' : 'var(--red-bg)',
                                color: exercise.difficulty === 'BEGINNER' ? 'var(--teal)' : exercise.difficulty === 'INTERMEDIATE' ? 'var(--amber)' : 'var(--red)',
                            }}>{exercise.difficulty}</span>
                        )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {exercise.targetMuscle && <><div style={{ color: 'var(--text-muted)' }}>Target muscle</div><div style={{ color: 'var(--text-primary)' }}>{exercise.targetMuscle}</div></>}
                        {exercise.exerciseType && <><div style={{ color: 'var(--text-muted)' }}>Type</div><div style={{ color: 'var(--text-primary)' }}>{exercise.exerciseType}</div></>}
                    </div>
                </div>
            </div>

            {/* PR strip */}
            {pr && (
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12 }}>
                    {[
                        { val: `${pr.weight}kg`, lbl: 'Best weight' },
                        { val: pr.reps, lbl: 'Best reps' },
                        { val: sets.length, lbl: 'Total sets' },
                    ].map(({ val, lbl }) => (
                        <div key={lbl} style={{ flex: 1, background: 'var(--bg-input)', border: '0.5px solid var(--border)', borderRadius: 7, padding: '10px 12px', textAlign: 'center' }}>
                            <div style={{ fontWeight: 600, color: 'var(--teal)' }}>{val}</div>
                            <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{lbl}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Weight progress chart and set  history */}
            {sets.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <WeightProgressionChart sets={sets} prWeight={pr?.weight} />
                    <SetHistoryList sets={sets} prWeight={pr?.weight} prReps={pr?.reps} />
                </div>
            )}

            {sets.length === 0 && (
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No sets logged yet for this exercise.
                </div>
            )}

            <button
                onClick={() => setShowAddModal(true)}
                style={{
                    background: 'var(--purple)', border: 'none', borderRadius: 8,
                    padding: '10px 20px', fontWeight: 600, color: 'white', cursor: 'pointer',
                }}
            >+ Add to workout</button>
            {showAddModal && (
                <AddExerciseToWorkoutModal
                    exercise={exercise}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => setShowAddModal(false)}
                />
            )}
        </div>


    )
}