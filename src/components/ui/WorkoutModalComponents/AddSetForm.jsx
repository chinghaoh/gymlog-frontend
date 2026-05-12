import { inputStyle } from '../../../lib/styles'

export default function AddSetForm({ exercises, selectedExerciseId, setSelectedExerciseId, reps, setReps, weight, setWeight }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Exercise</label>
        <select value={selectedExerciseId} onChange={e => setSelectedExerciseId(e.target.value)}
          className="input-field" style={inputStyle}>
          <option value=''>Select an exercise</option>
          {exercises.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Weight (kg)</label>
          <input className="input-field" type="number" value={weight}
            onChange={e => setWeight(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Reps</label>
          <input className="input-field" type="number" value={reps}
            onChange={e => setReps(e.target.value)} style={inputStyle} />
        </div>
      </div>
    </div>
  )
}