export default function WorkoutModalHeader({ workout, editing, editName, onClose }) {
    return (
      <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{editing ? editName : workout.name}</div>
          <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{workout.date} · {workout.durationMinutes} min</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: 'var(--purple-bg)', color: 'var(--purple-light)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
            {workout.splitCategory}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>
      </div>
    )
  }