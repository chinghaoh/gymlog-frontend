import { useNavigate } from 'react-router-dom'

export default function LogTable({ logs, onDelete }) {
    const navigate = useNavigate()

    return (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-border">
                        {['Workout', 'Date', 'Split', 'Duration', 'Energy', ''].map(col => (
                            <th key={col} className="px-4 py-2.5 text-left text-text-muted font-medium text-sm">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => (
                        <tr
                            key={log.id}
                            onClick={() => navigate(`/workouts/${log.workoutId}`)}
                            className={`cursor-pointer hover:bg-border-light transition-colors
                                ${index !== logs.length - 1 ? 'border-b border-border' : ''}`}
                        >
                            <td className="px-4 py-2.5 text-text-primary font-medium text-sm">
                                <div className="flex items-center gap-2">
                                    {log.workoutName}
                                    {log.aiGenerated && (
                                        <span className="bg-cyan-bg text-cyan border border-cyan text-xs font-semibold px-1.5 py-0.5 rounded">
                                            🤖 AI
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-2.5 text-text-secondary text-sm">{log.date}</td>
                            <td className="px-4 py-2.5">
                                <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded">
                                    {log.splitCategory}
                                </span>
                            </td>
                            <td className="px-4 py-2.5 text-text-secondary text-sm">
                                {log.durationMinutes ? `${log.durationMinutes} min` : '—'}
                            </td>
                            <td className="px-4 py-2.5 text-text-secondary text-sm">
                                {log.energyLevel ? `⚡ ${log.energyLevel}/10` : '—'}
                            </td>
                            <td className="px-4 py-2.5">
                                <div className="flex justify-end">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(log.id) }}
                                        className="bg-transparent text-red border border-red rounded-md px-2.5 py-1 text-xs cursor-pointer hover:bg-red-bg transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}