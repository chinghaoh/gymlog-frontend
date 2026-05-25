import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function WeightProgressionChart({ sets, prWeight }) {

    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        const [year, month, day] = dateStr.split('-')
        return `${day}/${month}/${year.slice(2)}`
    }

    // show all sets chronologically, not grouped
    const data = sets.slice(-20).map((set, i) => ({
        label: formatDate(set.logDate) || `Set ${i + 1}`,
        weight: Number(set.weight),
        reps: set.reps,
    }))

    if (data.length === 0) return null

    return (
        <div className="bg-bg-input border border-border rounded-lg p-3">
            <div className="text-text-muted text-xs uppercase tracking-wider mb-2.5">
                Weight Progression
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data}>
                    <XAxis
                        dataKey="label"
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                        width={35}
                        domain={[
                            (dataMin) => Math.floor(dataMin * 0.9),
                            (dataMax) => Math.ceil(dataMax * 1.05)
                        ]}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--color-bg-card)',
                            border: '0.5px solid var(--color-border)',
                            borderRadius: 6
                        }}
                        labelStyle={{ color: 'var(--color-text-muted)' }}
                        itemStyle={{ color: 'var(--color-purple)' }}
                        formatter={(value, name, props) => [
                            `${value}kg × ${props.payload.reps} reps`,
                            'Weight'
                        ]}
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