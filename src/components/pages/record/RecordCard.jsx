export default function RecordCard({ records, onSelect }) {
    return (
        <div className="flex flex-col gap-2">
            {records.map(record => (
                <div
                    key={record.id}
                    onClick={() => onSelect(record)}
                    className="bg-bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-purple transition-colors"
                >
                    {/* Top row — trophy + name + category badge */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span>🏆</span>
                            <div className="min-w-0">
                                <div className="font-semibold text-text-primary text-sm truncate">
                                    {record.exerciseName}
                                </div>
                                <div className="text-text-muted text-xs mt-0.5">{record.category}</div>
                            </div>
                        </div>
                        <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 ml-2">
                            {record.category}
                        </span>
                    </div>

                    {/* Bottom row — weight, reps, date */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                            <span className="text-teal font-semibold text-sm">{record.weight}kg</span>
                            <span className="text-text-secondary text-sm">× {record.reps}</span>
                        </div>
                        <span className="text-text-muted text-xs">
                            {new Date(record.achievedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}