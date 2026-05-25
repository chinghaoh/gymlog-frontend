export default function SetHistoryList({ sets, prWeight }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        const [year, month, day] = dateStr.split('-')
        return `${day}/${month}/${year.slice(2)}`
    }

    return (
        <div className="bg-bg-input border border-border rounded-lg p-3">
            <div className="text-text-muted text-xs uppercase tracking-wider mb-2.5">
                Set History
            </div>
            <div className="max-h-48 overflow-y-auto pr-2">
                {sets.map((set, i) => {
                    const isPR = Number(set.weight) === Number(prWeight)
                    return (
                        <div
                            key={i}
                            className={`flex items-center justify-between py-1.5
                                ${i !== sets.length - 1 ? 'border-b border-border' : ''}`}
                        >
                            <div className="text-text-muted text-sm">
                                {formatDate(set.logDate)}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="font-medium text-text-primary text-sm">
                                    {set.weight}kg × {set.reps}
                                </div>
                                {isPR && (
                                    <span className="bg-teal-bg text-teal text-xs font-semibold px-1.5 py-0.5 rounded">
                                        PR
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}