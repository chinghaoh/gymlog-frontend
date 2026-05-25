import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../../lib/apiClient'
import LogDetailTable from './LogDetailTable'
import LogDetailCard from './LogDetailCard'

export default function LogDetail() {
    const { logId } = useParams()
    const navigate = useNavigate()

    const [sets, setSets] = useState([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        if (!logId || isNaN(Number(logId))) {
            navigate('/logs')
            return
        }

        apiClient(`/api/workoutlogs/${logId}/sets`)
            .then(data => setSets(data))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [logId])

    const grouped = sets.reduce((acc, set) => {
        const key = set.exerciseName
        if (!acc[key]) acc[key] = []
        acc[key].push(set)
        return acc
    }, {})

    if (loading) return <div className="text-text-muted">Loading...</div>

    if (notFound) return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate('/logs')}
                    className="bg-transparent border-none text-text-muted cursor-pointer text-lg hover:text-text-primary transition-colors"
                >
                    ←
                </button>
                <h1 className="text-xl font-bold text-text-primary">Session Detail</h1>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-semibold text-text-primary mb-1.5">Log not found</div>
                <div className="text-text-muted text-sm mb-4">
                    This session doesn't exist or you don't have access to it.
                </div>
                <button
                    onClick={() => navigate('/logs')}
                    className="bg-purple text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                >
                    Back to Logs
                </button>
            </div>
        </div>
    )

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate('/logs')}
                    className="bg-transparent border-none text-text-muted cursor-pointer text-lg hover:text-text-primary transition-colors"
                >
                    ←
                </button>
                <h1 className="text-xl font-bold text-text-primary">Session Detail</h1>
            </div>

            {sets.length === 0 ? (
                <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-semibold text-text-primary mb-1.5">No sets recorded</div>
                    <div className="text-text-muted text-sm">
                        This session was logged before set tracking was available.
                    </div>
                </div>
            ) : (
                <>
                    {/* Desktop */}
                    <div className="hidden md:block">
                        <LogDetailTable grouped={grouped} />
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden">
                        <LogDetailCard grouped={grouped} />
                    </div>
                </>
            )}
        </div>
    )
}