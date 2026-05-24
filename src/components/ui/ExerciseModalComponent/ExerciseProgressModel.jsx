import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'
import WeightProgressionChart from '../../ui/WeightProgressChart'
import SetHistoryList from '../../ui/SetHistoryList'

export default function ExerciseProgressModal({ record, onClose }) {
    const { user } = useAuth()
    const [sets, setSets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user || !record) return
        const fetchSets = async () => {
            try {
                const data = await apiClient(`/api/sets/by-exercise?userId=${user.id}&exerciseId=${record.exerciseId}`)
                setSets(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchSets()
    }, [user, record])

    return (
        <div
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
            <div className="bg-bg-card border-half rounded-xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-start justify-between px-4.5 py-4 border-b border-half flex-shrink-0">
                    <div>
                        <div className="font-semibold text-text-primary text-sm">{record.exerciseName}</div>
                        <div className="text-text-muted text-xs mt-0.5">
                            {record.category} · Current PR: {record.weight}kg × {record.reps}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-bg-input border-half rounded-md w-6 h-6 flex items-center justify-center text-text-muted cursor-pointer hover:text-text-primary transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="px-4.5 py-3.5 flex flex-col gap-3.5 overflow-y-auto flex-1">

                    {/* PR strip */}
                    <div className="bg-bg-input border-half rounded-lg p-3 flex gap-4">
                        {[
                            { val: `${record.weight}kg`, lbl: 'Best weight' },
                            { val: record.reps,          lbl: 'Best reps' },
                            { val: sets.length,          lbl: 'Total sets' },
                        ].map(({ val, lbl }, i, arr) => (
                            <div key={lbl} className="flex-1 text-center flex items-center">
                                <div className="flex-1">
                                    <div className="text-2xl font-semibold text-teal">{val}</div>
                                    <div className="text-text-muted text-xs uppercase tracking-wider mt-0.5">{lbl}</div>
                                </div>
                                {i < arr.length - 1 && <div className="w-px bg-border h-full" />}
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    {!loading && sets.length > 0 && (
                        <WeightProgressionChart sets={sets} prWeight={record.weight} />
                    )}

                    {/* Set history */}
                    <div>
                        {loading ? (
                            <div className="text-text-muted text-xs">Loading...</div>
                        ) : sets.length === 0 ? (
                            <div className="text-text-muted text-xs">No sets logged yet.</div>
                        ) : (
                            <SetHistoryList sets={sets} prWeight={record.weight} prReps={record.reps} />
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}