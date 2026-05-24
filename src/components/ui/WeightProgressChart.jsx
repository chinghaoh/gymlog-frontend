import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function WeightProgressionChart({ sets, prWeight }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        const [year, month, day] = dateStr.split('-')
        return `${day}/${month}/${year.slice(2)}`
    }

    const byDate = sets.reduce((acc, set) => {
        const date = formatDate(set.logDate)
        if (!acc[date] || Number(set.weight) > Number(acc[date].weight)) {
            acc[date] = set
        }
        return acc
    }, {})

    const data = Object.values(byDate).slice(-10).map(set => ({
        date: formatDate(set.logDate),
        weight: Number(set.weight)
    }))

    if (data.length === 0) return null

    return (
        <div className="bg-bg-input border-half rounded-lg p-3">
            <div className="text-text-muted text-xs uppercase tracking-wider mb-2.5">
                Weight progression
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data}>
                    <XAxis dataKey="date" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} width={35} />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--color-bg-card)',
                            border: '0.5px solid var(--color-border)',
                            borderRadius: 6
                        }}
                        labelStyle={{ color: 'var(--color-text-muted)' }}
                        itemStyle={{ color: 'var(--color-purple)' }}
                    />
                    <ReferenceLine
                        y={Number(prWeight)}
                        stroke="var(--color-teal)"
                        strokeDasharray="4 4"
                        label={{ value: 'PR', fill: 'var(--color-teal)', fontSize: 10 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="var(--color-purple)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--color-purple)', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}