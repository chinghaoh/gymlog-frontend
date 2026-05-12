import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/ApiClient'
import { useAuth } from '../../context/AuthContext'
import { inputStyle } from '../../../lib/styles'

export default function LogWorkoutModal({ onClose, onLogged }) {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [energyLevel, setEnergyLevel] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!user) return
    apiClient(`/api/workouts?userId=${user.id}`)
      .then(data => setWorkouts(data))
      .catch(err => console.error(err))
  }, [user])

  const handleSubmit = async () => {
    if (!selectedWorkoutId || !date) return

    try {
      const newLog = await apiClient(
        `/api/workoutlogs?workoutId=${selectedWorkoutId}&userId=${user.id}&date=${date}&energyLevel=${energyLevel}&notes=${notes}`,
        { method: 'POST' }
      )
      onLogged(newLog)
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Log Workout</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Workout</label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedWorkoutId}
                onChange={e => setSelectedWorkoutId(e.target.value)}
                className="input-field"
                style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', paddingRight: 32 }}
              >
                <option value=''>Select a workout</option>
                {workouts.map(w => (
                  <option key={w.id} value={w.id}>{w.name} — {w.splitCategory}</option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>▾</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Date</label>
            <input className="input-field" type="date" value={date}
              onChange={e => setDate(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Energy level (1-10)</label>
            <input className="input-field" type="number" min="1" max="10" value={energyLevel}
              onChange={e => setEnergyLevel(e.target.value)} placeholder="8" style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Notes (optional)</label>
            <input className="input-field" type="text" value={notes}
              onChange={e => setNotes(e.target.value)} placeholder="Any notes..." style={inputStyle} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8 }}>
          <button onClick={handleSubmit} style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 7, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
            Log Workout
          </button>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)', border: '0.5px solid var(--border)', borderRadius: 7, padding: '8px 16px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}