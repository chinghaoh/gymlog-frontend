import { inputStyle } from '../../../lib/styles'

export default function WorkoutEditForm({
  editName, setEditName,
  editSplitCategory, setEditSplitCategory,
  editDate, setEditDate,
  editDurationMinutes, setEditDurationMinutes,
  editEnergyLevel, setEditEnergyLevel,
  editNotes, setEditNotes
}) {
  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Name</label>
        <input className="input-field" value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Split</label>
        <select className="input-field" value={editSplitCategory} onChange={e => setEditSplitCategory(e.target.value)} style={inputStyle}>
          {['PUSH', 'PULL', 'LEGS', 'UPPER', 'FULL_BODY', 'CARDIO'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Date</label>
          <input className="input-field" type="date" value={editDate} onChange={e => setEditDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Duration (min)</label>
          <input className="input-field" type="number" value={editDurationMinutes} onChange={e => setEditDurationMinutes(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Energy (1-10)</label>
          <input className="input-field" type="number" min="1" max="10" value={editEnergyLevel} onChange={e => setEditEnergyLevel(e.target.value)} style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Notes</label>
        <input className="input-field" value={editNotes} onChange={e => setEditNotes(e.target.value)} style={inputStyle} />
      </div>
    </div>
  )
}