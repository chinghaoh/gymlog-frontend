export default function LogDetailTable({ grouped }) {
    return (
        <div className="flex flex-col gap-3">
            {Object.entries(grouped).map(([exerciseName, exerciseSets]) => (
                <div key={exerciseName} className="bg-bg-card border border-border rounded-xl overflow-hidden">

                    {/* Exercise header */}
                    <div className="px-4 py-3 border-b border-border">
                        <div className="font-semibold text-text-primary">{exerciseName}</div>
                        <div className="text-text-muted text-xs mt-0.5">
                            {exerciseSets.length} {exerciseSets.length === 1 ? 'set' : 'sets'}
                        </div>
                    </div>

                    {/* Sets table */}
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="px-4 py-2 text-left text-text-muted font-medium text-sm">Set</th>
                                <th className="px-4 py-2 text-left text-text-muted font-medium text-sm">Weight</th>
                                <th className="px-4 py-2 text-left text-text-muted font-medium text-sm">Reps</th>
                                <th className="px-4 py-2 text-left text-text-muted font-medium text-sm">Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exerciseSets.map((set, index) => (
                                <tr
                                    key={set.id}
                                    className={index !== exerciseSets.length - 1 ? 'border-b border-border' : ''}
                                >
                                    <td className="px-4 py-2.5 text-text-secondary text-sm">{set.setNumber}</td>
                                    <td className="px-4 py-2.5 text-teal font-semibold text-sm">{set.weight}kg</td>
                                    <td className="px-4 py-2.5 text-text-secondary text-sm">× {set.reps}</td>
                                    <td className="px-4 py-2.5 text-text-muted text-sm">
                                        {(set.weight * set.reps).toFixed(1)}kg
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Exercise summary */}
                    <div className="px-4 py-2.5 bg-bg-page flex gap-4">
                        <div className="text-xs text-text-muted">
                            Total volume: <span className="text-text-primary font-medium">
                                {exerciseSets.reduce((sum, s) => sum + (s.weight * s.reps), 0).toFixed(1)}kg
                            </span>
                        </div>
                        <div className="text-xs text-text-muted">
                            Best set: <span className="text-teal font-medium">
                                {Math.max(...exerciseSets.map(s => Number(s.weight)))}kg × {exerciseSets.find(s => Number(s.weight) === Math.max(...exerciseSets.map(s => Number(s.weight))))?.reps} reps
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}