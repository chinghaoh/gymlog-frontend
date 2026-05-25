export default function LogDetailCard({ grouped }) {
    return (
        <div className="flex flex-col gap-3">
            {Object.entries(grouped).map(([exerciseName, exerciseSets]) => (
                <div key={exerciseName} className="bg-bg-card border border-border rounded-xl p-4">

                    {/* Exercise header */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="font-semibold text-text-primary text-sm">{exerciseName}</div>
                            <div className="text-text-muted text-xs mt-0.5">
                                {exerciseSets.length} {exerciseSets.length === 1 ? 'set' : 'sets'}
                            </div>
                        </div>
                        <span className="text-teal text-xs font-medium">
                            {Math.max(...exerciseSets.map(s => Number(s.weight)))}kg best
                        </span>
                    </div>

                    {/* Set rows */}
                    <div className="flex flex-col gap-1.5 mb-3">
                        {exerciseSets.map((set, index) => (
                            <div
                                key={set.id}
                                className={`flex items-center justify-between py-1.5
                                    ${index !== exerciseSets.length - 1 ? 'border-b border-border' : ''}`}
                            >
                                <span className="text-text-muted text-xs">Set {set.setNumber}</span>
                                <div className="flex gap-3">
                                    <span className="text-teal font-semibold text-sm">{set.weight}kg</span>
                                    <span className="text-text-secondary text-sm">× {set.reps}</span>
                                    <span className="text-text-muted text-xs">
                                        {(set.weight * set.reps).toFixed(1)}kg
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-bg-page rounded-lg px-3 py-2 text-xs text-text-muted">
                        Total volume: <span className="text-text-primary font-medium">
                            {exerciseSets.reduce((sum, s) => sum + (s.weight * s.reps), 0).toFixed(1)}kg
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}