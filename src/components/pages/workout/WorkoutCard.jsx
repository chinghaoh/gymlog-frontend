import { useNavigate } from 'react-router-dom'

export default function WorkoutCard({ workouts, onDelete }) {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col gap-2">
            {workouts.map(workout => (
                <div
                    key={workout.id}
                    onClick={() => navigate(`/workouts/${workout.id}`)}
                    className="bg-bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-purple transition-colors"
                >
                    {/* Top row — name + split badge */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="font-semibold text-text-primary text-sm truncate">
                                {workout.name}
                            </div>
                            {workout.aiGenerated && (
                                <span className="bg-cyan-bg text-cyan text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0">
                                    🤖 AI
                                </span>
                            )}
                        </div>
                        <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 ml-2">
                            {workout.splitCategory}
                        </span>
                    </div>

                    {/* Bottom row — stats + delete */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3 text-text-muted text-xs">
                            <span>{workout.durationMinutes ? `${workout.durationMinutes} min` : '—'}</span>
                            <span>{workout.totalSets} sets</span>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(workout.id) }}
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