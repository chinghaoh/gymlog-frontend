import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'
import WeightProgressionChart from '../../ui/WeightProgressChart'
import SetHistoryList from '../../ui/SetHistoryList'
import AddExerciseToWorkoutModal from '../../ui/WorkoutModalComponents/AddExerciseToWorkoutModal'

const difficultyClasses = {
    BEGINNER: { bg: 'bg-teal-bg', text: 'text-teal' },
    INTERMEDIATE: { bg: 'bg-amber-bg', text: 'text-amber' },
    ADVANCED: { bg: 'bg-red-bg', text: 'text-red' },
}

export default function ExerciseDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [exercise, setExercise] = useState(null)
    const [sets, setSets] = useState([])
    const [pr, setPr] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [history, setHistory] = useState([])

    useEffect(() => {
        if (!user) return

        const fetchData = async () => {
            try {
                const [exerciseData, setsData, historyData, recordsData] = await Promise.all([
                    apiClient(`/api/exercises/${id}`),
                    apiClient(`/api/workoutlogs/sets?userId=${user.id}&exerciseId=${id}`),
                    apiClient(`/api/workoutlogs/sets/history?userId=${user.id}&exerciseId=${id}`),
                    apiClient(`/api/records?userId=${user.id}`),
                ])
                setExercise(exerciseData)
                setSets(setsData)
                setHistory(historyData)
                setPr(recordsData.find(r => r.exerciseId === Number(id)) || null)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user, id])

    if (loading) return <div className="text-text-muted p-5">Loading...</div>
    if (!exercise) return <div className="text-text-muted p-5">Exercise not found.</div>

    const difficulty = difficultyClasses[exercise.difficulty]

    return (
        <div className="flex flex-col gap-3">

            {/* Back */}
            <div
                onClick={() => navigate('/exercises')}
                className="flex items-center gap-1.5 text-text-muted cursor-pointer w-fit hover:text-text-primary transition-colors text-sm"
            >
                ← Back to exercises
            </div>

            {/* Exercise info */}
            <div className="bg-bg-card border-half rounded-xl px-4 py-3.5 flex gap-4 items-start">
                {/* GIF */}
                <div className="w-28 h-28 bg-bg-input border-half rounded-lg flex-shrink-0 overflow-hidden">
                    {exercise.gifUrl ? (
                        <>
                            <img
                                src={exercise.gifUrl}
                                alt={exercise.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                }}
                            />
                            <div className="hidden w-full h-full flex-col items-center justify-center gap-1 text-text-muted">
                                <span className="text-2xl">🏋️</span>
                                <span className="text-xs">No preview</span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-text-muted">
                            <span className="text-2xl">🏋️</span>
                            <span className="text-xs">No preview</span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="font-semibold text-text-primary mb-2">{exercise.name}</div>

                    <div className="flex gap-1.5 flex-wrap mb-2.5">
                        <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded">
                            {exercise.category}
                        </span>
                        <span className="bg-border-light text-text-secondary text-xs px-2 py-0.5 rounded">
                            {exercise.equipment}
                        </span>
                        {exercise.difficulty && difficulty && (
                            <span className={`text-xs px-2 py-0.5 rounded ${difficulty.bg} ${difficulty.text}`}>
                                {exercise.difficulty}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                        {exercise.targetMuscle && (
                            <>
                                <div className="text-text-muted text-sm">Target muscle</div>
                                <div className="text-text-primary text-sm">{exercise.targetMuscle}</div>
                            </>
                        )}
                        {exercise.exerciseType && (
                            <>
                                <div className="text-text-muted text-sm">Type</div>
                                <div className="text-text-primary text-sm">{exercise.exerciseType}</div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Instructions */}
            {exercise.instructions && (
                <div className="bg-bg-card border-half rounded-xl px-4 py-3.5">
                    <div className="font-semibold text-text-primary mb-2.5">Instructions</div>
                    <ol className="pl-5 flex flex-col gap-1.5">
                        {exercise.instructions.split('\n').map((step, i) => (
                            <li key={i} className="text-text-secondary text-sm leading-relaxed">
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* PR strip */}
            {pr && (
                <div className="bg-bg-card border-half rounded-xl px-4 py-3.5 flex gap-3">
                    {[
                        { val: `${pr.weight}kg`, lbl: 'Best weight' },
                        { val: pr.reps, lbl: 'Best reps' },
                        { val: sets.length, lbl: 'Total sets' },
                    ].map(({ val, lbl }) => (
                        <div key={lbl} className="flex-1 bg-bg-input border-half rounded-lg px-3 py-2.5 text-center">
                            <div className="font-semibold text-teal">{val}</div>
                            <div className="text-text-muted text-xs uppercase tracking-wider mt-0.5">{lbl}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Chart + history */}
            {sets.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    <WeightProgressionChart sets={sets} prWeight={pr?.weight} />
                    <SetHistoryList sets={history} prWeight={pr?.weight} prReps={pr?.reps} />
                </div>
            ) : (
                <div className="bg-bg-card border-half rounded-xl p-8 text-center text-text-muted">
                    No sets logged yet for this exercise.
                </div>
            )}

            {/* Add to workout */}
            <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple text-white border-none rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity w-fit"
            >
                + Add to workout
            </button>

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