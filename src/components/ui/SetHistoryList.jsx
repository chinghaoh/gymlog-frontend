export default function SetHistoryList({ sets, prWeight, prReps }) {
  const sortedSets = [...sets].sort((a, b) => new Date(b.workoutCreatedAt) - new Date(a.workoutCreatedAt))

  const prIndex = sortedSets.findIndex(s => Number(s.weight) === Number(prWeight))
  
    return (
      <div style={{ background: 'var(--bg-input)', border: '0.5px solid var(--border)', borderRadius: 8, padding: 12 }}>
        <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Set history
        </div>
        <div style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 8 }}>
          {sortedSets.map((set, i) => {
                  const isPR = i === prIndex
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 0', borderBottom: i === sortedSets.length - 1 ? 'none' : '0.5px solid var(--border-light)',
              }}>
                <div style={{ color: 'var(--text-muted)' }}>
                  {new Date(set.workoutCreatedAt).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                    {set.weight}kg × {set.reps}
                  </div>
                  {isPR && (
                    <span style={{ background: 'var(--teal-bg)', color: 'var(--teal)', padding: '1px 6px', borderRadius: 3, fontWeight: 600 }}>
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