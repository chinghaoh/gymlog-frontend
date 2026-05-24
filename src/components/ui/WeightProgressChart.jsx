import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function WeightProgressionChart({ sets, prWeight }) {
  const byDate = sets.reduce((acc, set) => {
    const date = new Date(set.workoutCreatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
    if (!acc[date] || Number(set.weight) > Number(acc[date].weight)) {
      acc[date] = set
    }
    return acc
  }, {})

  const data = Object.values(byDate).slice(-10).map(set => ({
    date: new Date(set.workoutCreatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
    weight: Number(set.weight)
  }))

  if (data.length === 0) return null

  return (
    <div style={{ background: 'var(--bg-input)', border: '0.5px solid var(--border)', borderRadius: 8, padding: 12 }}>
      <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        Weight progression
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={35} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 6 }}
            labelStyle={{ color: 'var(--text-muted)' }}
            itemStyle={{ color: 'var(--purple)' }}
          />
          <ReferenceLine y={Number(prWeight)} stroke="var(--teal)" strokeDasharray="4 4" label={{ value: 'PR', fill: 'var(--teal)', fontSize: 10 }} />
          <Line type="monotone" dataKey="weight" stroke="var(--purple)" strokeWidth={2} dot={{ fill: 'var(--purple)', r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}