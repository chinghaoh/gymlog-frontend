import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'
import { inputStyle } from '../../lib/styles'

const SPLITS = ['PUSH', 'PULL', 'LEGS', 'UPPER_BODY', 'FULL_BODY', 'CARDIO',]

export default function WorkoutDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workout, setWorkout] = useState(null)
  const [sets, setSets] = useState([])
  const [exercises, setExercises] = useState([])
  const [selectedExerciseId, setSelectedExerciseId] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [editingSetId, setEditingSetId] = useState(null)
  const [editSetWeight, setEditSetWeight] = useState('')
  const [editSetReps, setEditSetReps] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editSplit, setEditSplit] = useState('')
  const [editDuration, setEditDuration] = useState('')
  const [exerciseSearch, setExerciseSearch] = useState('')
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false)

  useEffect(() => {
    apiClient(`/api/workouts/${id}`)
      .then(data => setWorkout(data))
      .catch(err => console.error(err))

    apiClient(`/api/sets?workoutId=${id}`)
      .then(data => setSets(data))
      .catch(err => console.error(err))

    apiClient('/api/exercises')
      .then(data => setExercises(data))
      .catch(err => console.error(err))
  }, [id])

  const getNextSetNumber = (exerciseId) => {
    const setsForExercise = sets.filter(s => s.exerciseId === Number(exerciseId))
    return setsForExercise.length + 1
  }

  const handleAddSet = async () => {
    if (!selectedExerciseId || !reps || !weight) return
    try {
      const newSet = await apiClient(
        `/api/sets?workoutId=${id}&exerciseId=${selectedExerciseId}`,
        {
          method: 'POST',
          body: JSON.stringify({
            setNumber: getNextSetNumber(selectedExerciseId),
            reps: Number(reps),
            weight: Number(weight)
          })
        }
      )
      const updatedSets = await apiClient(`/api/sets?workoutId=${id}`)
      setSets(updatedSets)
      setSelectedExerciseId('')
      setReps('')
      setWeight('')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteSet = async (setId) => {
    if (!window.confirm('Delete this set?')) return
    try {
      await apiClient(`/api/sets/${setId}`, { method: 'DELETE' })
      setSets(prev => prev.filter(s => s.id !== setId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateSet = async (set) => {
    try {
      const updated = await apiClient(`/api/sets/${set.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          setNumber: set.setNumber,
          reps: Number(editSetReps),
          weight: Number(editSetWeight),
          notes: set.notes
        })
      })
      setSets(prev => prev.map(s => s.id === updated.id ? updated : s))
      setEditingSetId(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveEdit = async () => {
    try {
      await apiClient(`/api/workouts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editName,
          splitCategory: editSplit,
          durationMinutes: editDuration ? Number(editDuration) : null,
          notes: workout.notes
        })
      })
      setWorkout(prev => ({ ...prev, name: editName, splitCategory: editSplit, durationMinutes: editDuration ? Number(editDuration) : null }))
      setIsEditing(false)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const handleClickOutside = () => setShowExerciseDropdown(false)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])


  if (!workout) return <div style={{ color: 'var(--text-muted)' }}>Loading...</div>

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/workouts')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>←</button>

        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="input-field"
              style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', border: '0.5px solid var(--border)', fontWeight: 700, fontSize: 18 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={editSplit}
                onChange={e => setEditSplit(e.target.value)}
                className="input-field"
                style={{ background: 'var(--bg-input)', color: 'var(--text-muted)', borderRadius: 6, padding: '4px 8px', border: '0.5px solid var(--border)' }}
              >
                {SPLITS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                type="number"
                value={editDuration}
                onChange={e => setEditDuration(e.target.value)}
                placeholder="Duration (min)"
                className="input-field"
                style={{ background: 'var(--bg-input)', color: 'var(--text-muted)', borderRadius: 6, padding: '4px 8px', border: '0.5px solid var(--border)', width: 140 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSaveEdit}
                style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, cursor: 'pointer' }}>
                Save
              </button>
              <button onClick={() => setIsEditing(false)}
                style={{ background: 'transparent', color: 'var(--text-muted)', border: '0.5px solid var(--border)', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            <h1 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{workout.name}</h1>
            <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>
              {workout.splitCategory} · {workout.durationMinutes ? `${workout.durationMinutes} min` : '—'}
            </div>
          </div>
        )}

        {!isEditing && (
          <button onClick={() => {
            setEditName(workout.name)
            setEditSplit(workout.splitCategory)
            setEditDuration(workout.durationMinutes || '')
            setIsEditing(true)
          }}
            style={{
              background: 'var(--purple)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '6px 10px',
              cursor: 'pointer'
            }}>
            ✏
          </button>
        )}
      </div>

      {/* Add set form */}
      <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1rem', display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>
      <div style={{ flex: 2, position: 'relative' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Exercise</label>
          <input
            className="input-field"
            value={exerciseSearch}
            onChange={e => {
              setExerciseSearch(e.target.value)
              setShowExerciseDropdown(true)
              setSelectedExerciseId('')
            }}
            onFocus={() => setShowExerciseDropdown(true)}
            onClick={e => e.stopPropagation()}
            placeholder="Search exercise..."
            style={inputStyle}
          />
          {showExerciseDropdown && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: 'var(--bg-card)', border: '0.5px solid var(--border)',
              borderRadius: 6, maxHeight: 200, overflowY: 'auto', zIndex: 100
            }}>
              {exercises
                .filter(ex => ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()))
                .map(ex => (
                  <div
                    key={ex.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedExerciseId(ex.id)
                      setExerciseSearch(ex.name)
                      setShowExerciseDropdown(false)
                    }}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      borderBottom: '0.5px solid var(--border)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--border-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {ex.name}
                  </div>
                ))
              }
              {exercises.filter(ex => ex.name.toLowerCase().includes(exerciseSearch.toLowerCase())).length === 0 && (
                <div style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>No exercises found</div>
              )}
            </div>
          )}
        </div>
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
        <button onClick={handleAddSet} style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 7, padding: '9px 16px', fontWeight: 600, cursor: 'pointer' }}>
          + Add Set
        </button>
      </div>

      {/* Sets table */}
      <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
              {['Exercise', 'Set', 'Weight', 'Reps', ''].map(col => (
                <th key={col} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sets.map.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No sets yet — add one below
                </td>
              </tr>
            ) : (
              sets.map(set => (
                <tr key={set.id}
                  style={{ borderBottom: '0.5px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--border-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td
                    onClick={(e) => { e.stopPropagation(); navigate(`/exercises/${set.exerciseId}`) }}
                    style={{ padding: '10px 16px', color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'var(--border)' }}
                  >
                    {set.exerciseName}
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{set.setNumber}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--teal)', fontWeight: 600 }}>{set.weight}kg</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>× {set.reps}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                    {editingSetId === set.id ? (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <input type="number" value={editSetWeight} onChange={e => setEditSetWeight(e.target.value)}
                          onClick={e => e.stopPropagation()}
                          className="input-field"
                          style={{ width: 70, background: 'var(--bg-input)', color: 'var(--text-primary)', borderRadius: 6, padding: '4px 8px', outline: 'none' }}
                          placeholder="kg" />
                        <input type="number" value={editSetReps} onChange={e => setEditSetReps(e.target.value)}
                          onClick={e => e.stopPropagation()}
                          className="input-field"
                          style={{ width: 60, background: 'var(--bg-input)', color: 'var(--text-primary)', borderRadius: 6, padding: '4px 8px', outline: 'none' }}
                          placeholder="reps" />
                        <button onClick={(e) => { e.stopPropagation(); handleUpdateSet(set) }}
                          style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>✓</button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingSetId(null) }}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button onClick={(e) => {
                          e.stopPropagation()
                          setEditingSetId(set.id)
                          setEditSetWeight(set.weight)
                          setEditSetReps(set.reps)
                        }} style={{ background: 'transparent', color: 'var(--text-muted)', border: '0.5px solid var(--border)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>✏</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteSet(set.id) }}
                          style={{ background: 'transparent', color: 'var(--red)', border: '0.5px solid var(--red)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}