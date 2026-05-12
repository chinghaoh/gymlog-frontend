export default function WorkoutSetList({ sets, editingSetId, editSetWeight, editSetReps, setEditSetWeight, setEditSetReps, setEditingSetId, onUpdateSet, onDeleteSet }) {
    if (sets.length === 0) {
      return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No sets logged yet</div>
    }
  
    return sets.map((set, index) => (
      <div key={set.id} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 0', borderBottom: '0.5px solid var(--border-light)'
      }}>
        <div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{set.exerciseName}</div>
          <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>Set {index + 1}</div>
        </div>
  
        {editingSetId === set.id ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="number" value={editSetWeight} onChange={e => setEditSetWeight(e.target.value)}
              className="input-field"
              style={{ width: 70, background: 'var(--bg-input)', color: 'var(--text-primary)', borderRadius: 6, padding: '4px 8px', outline: 'none' }}
              placeholder="kg" />
            <input type="number" value={editSetReps} onChange={e => setEditSetReps(e.target.value)}
              className="input-field"
              style={{ width: 60, background: 'var(--bg-input)', color: 'var(--text-primary)', borderRadius: 6, padding: '4px 8px', outline: 'none' }}
              placeholder="reps" />
            <button onClick={() => onUpdateSet(set)}
              style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>✓</button>
            <button onClick={() => setEditingSetId(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: 'var(--teal)', fontWeight: 600 }}>{set.weight}kg × {set.reps}</div>
            <button onClick={() => {
              setEditingSetId(set.id)
              setEditSetReps(set.reps)
              setEditSetWeight(set.weight)
            }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✏</button>
            <button onClick={() => onDeleteSet(set.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
          </div>
        )}
      </div>
    ))
  }