import { useNavigate } from 'react-router-dom'

export default function LogCard({ logs, onDelete }) {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col gap-2">
            {logs.map(log => (
                <div
                    key={log.id}
                    onClick={() => navigate(`/workouts/${log.workoutId}`)}
                    className="bg-bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-purple transition-colors"
                >
                    {/* Top row — name + split badge */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="font-semibold text-text-primary text-sm truncate">
                                {log.workoutName}
                            </div>
                            {log.aiGenerated && (
                                <span className="bg-cyan-bg text-cyan text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0">
                                    🤖 AI
                                </span>
                            )}
                        </div>
                        <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 ml-2">
                            {log.splitCategory}
                        </span>
                    </div>

                    {/* Middle row — date + duration + energy */}
                    <div className="flex gap-3 text-text-muted text-xs mb-2">
                        <span>{log.date}</span>
                        <span>{log.durationMinutes ? `${log.durationMinutes} min` : '—'}</span>
                        <span>{log.energyLevel ? `⚡ ${log.energyLevel}/10` : '—'}</span>
                    </div>

                    {/* Bottom row — delete */}
                    <div className="flex justify-end">
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(log.id) }}
                            className="bg-transparent text-red border border-red rounded-md px-2.5 py-1 text-xs cursor-pointer hover:bg-red-bg transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}