import { useState } from 'react'
import { apiClient } from '../../lib/ApiClient'
import { useAuth } from '../context/AuthContext'

export default function CreateWorkoutModal({ onClose, onCreated }) {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [splitCategory, setSplitCategory] = useState('PUSH')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [durationMinutes, setDurationMinutes] = useState('')
  const [energyLevel, setEnergyLevel] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async () => {
    if (!name || !durationMinutes) return

    try {
      const newWorkout = await apiClient(`/api/workouts?userId=${user.id}`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          splitCategory,
          durationMinutes: Number(durationMinutes),
          notes
        })
      })
      onCreated(newWorkout)
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg-input)', color: 'var(--text-primary)',
    borderRadius: 7, padding: '9px 12px', outline: 'none'
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>New Workout</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Name</label>
            <input className="input-field" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Push Day" style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Split</label>
            <select value={splitCategory} onChange={e => setSplitCategory(e.target.value)} className="input-field" style={inputStyle}>
              {['PUSH', 'PULL', 'LEGS', 'UPPER', 'FULL_BODY', 'CARDIO'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Duration (min)</label>
              <input className="input-field" type="number" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} placeholder="60" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Energy (1-10)</label>
              <input className="input-field" type="number" min="1" max="10" value={energyLevel} onChange={e => setEnergyLevel(e.target.value)} placeholder="8" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Notes (optional)</label>
            <input className="input-field" type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes..." style={inputStyle} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8 }}>
          <button onClick={handleSubmit} style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 7, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
            Create Workout
          </button>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)', border: '0.5px solid var(--border)', borderRadius: 7, padding: '8px 16px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}