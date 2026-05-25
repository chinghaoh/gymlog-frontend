export default function RecordTable({ records, onSelect }) {
    return (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-border">
                        {['', 'Exercise', 'Category', 'Weight', 'Reps', 'Achieved'].map(col => (
                            <th key={col} className="px-4 py-2.5 text-left text-text-muted font-medium text-sm">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr
                            key={record.id}
                            onClick={() => onSelect(record)}
                            className={`cursor-pointer hover:bg-border-light transition-colors
                                ${index !== records.length - 1 ? 'border-b border-border' : ''}`}
                        >
                            <td className="px-4 py-2.5">🏆</td>
                            <td className="px-4 py-2.5">
                                <div className="font-semibold text-text-primary text-sm">{record.exerciseName}</div>
                                <div className="text-text-muted text-xs mt-0.5">{record.category}</div>
                            </td>
                            <td className="px-4 py-2.5">
                                <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded">
                                    {record.category}
                                </span>
                            </td>
                            <td className="px-4 py-2.5 text-teal font-semibold text-sm">
                                {record.weight}kg
                            </td>
                            <td className="px-4 py-2.5 text-text-secondary text-sm">
                                × {record.reps}
                            </td>
                            <td className="px-4 py-2.5 text-text-muted text-sm">
                                {new Date(record.achievedAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}