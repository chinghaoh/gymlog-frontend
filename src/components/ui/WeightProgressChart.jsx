export default function WeightProgressionChart({ sets, prWeight }) {
  const chartSets = (() => {
    const last10 = sets.slice(-10)
    const prSet = sets.find(s => Number(s.weight) === Number(prWeight))
    return last10.some(s => Number(s.weight) === Number(prWeight))
      ? last10
      : [...last10.slice(1), prSet]
  })()

  const maxWeight = Math.max(...chartSets.map(s => Number(s.weight)))

  return (
    <div style={{ background: 'var(--bg-input)', border: '0.5px solid var(--border)', borderRadius: 8, display: 'flex', flexDirection: 'column', padding: 12 }}>
      <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        Weight progression
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100, flex:1 }}>
        {chartSets.map((set, i) => {
          const height = maxWeight > 0 ? (Number(set.weight) / maxWeight) * 70 : 4
          const isPR = Number(set.weight) === Number(prWeight)
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
              <div style={{ color: 'var(--text-muted)' }}>
                {Number(set.weight) > 0 ? set.weight : ''}
              </div>
              <div style={{
                width: '100%', borderRadius: '3px 3px 0 0',
                height: `${height}px`,
                background: isPR ? 'var(--teal)' : 'var(--purple)',
                opacity: isPR ? 1 : 0.6,
                minHeight: 4,
              }} />
              <div style={{ color: 'var(--text-muted)' }}>#{i + 1}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}