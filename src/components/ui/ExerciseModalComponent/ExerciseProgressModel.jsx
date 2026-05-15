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

    const sortedSets = [...sets].sort((a, b) => Number(b.weight) - Number(a.weight))


    return (
        <div
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div style={{
                background: 'var(--bg-card)', border: '0.5px solid var(--border)',
                borderRadius: 12, width: 500, maxWidth: '95vw',
                display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden',
            }}>

                {/* Header */}
                <div style={{
                    padding: '16px 18px 14px', borderBottom: '0.5px solid var(--border)',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0,
                }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {record.exerciseName}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            {record.category} · Current PR: {record.weight}kg × {record.reps}
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'var(--bg-input)', border: '0.5px solid var(--border)',
                        borderRadius: 5, width: 24, height: 24, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16,
                    }}>×</button>
                </div>

                {/* Scrollable body */}
                <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', flex: 1 }}>

                    {/* PR hero strip */}
                    <div style={{
                        background: 'var(--bg-input)', border: '0.5px solid var(--border)',
                        borderRadius: 8, padding: 12, display: 'flex', gap: 16,
                    }}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--teal)' }}>{record.weight}kg</div>
                            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>Best weight</div>
                        </div>
                        <div style={{ width: '0.5px', background: 'var(--border)' }} />
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--teal)' }}>{record.reps}</div>
                            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>Best reps</div>
                        </div>
                        <div style={{ width: '0.5px', background: 'var(--border)' }} />
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--teal)' }}>{sets.length}</div>
                            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>Total sets</div>
                        </div>
                    </div>

                    {/* Weight progression bar chart */}
                    {!loading && sets.length > 0 && (
                        <WeightProgressionChart sets={sets} prWeight={record.weight} />
                    )}

                    {/* Set history */}
                    <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                            Set history
                        </div>
                        {loading ? (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Loading...</div>
                        ) : sets.length === 0 ? (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>No sets logged yet.</div>
                        ) : (
                            <SetHistoryList sets={sets} prWeight={record.weight} prReps={record.reps} />
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}