import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'
import { inputStyle } from '../../lib/styles'
import Pagination from '../ui/Pagination'

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
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
  
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
        setSets(prev => [...prev, newSet])
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
  
    const paginatedSets = sets.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  
    if (!workout) return <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
  
    return (
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/workouts')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>←</button>
          <div>
            <h1 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{workout.name}</h1>
            <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{workout.splitCategory} · {workout.durationMinutes} min</div>
          </div>
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
              {paginatedSets.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No sets yet — add one below
                  </td>
                </tr>
              ) : (
                paginatedSets.map((set, index) => (
                  <tr key={set.id}
                    style={{ borderBottom: index === paginatedSets.length - 1 ? 'none' : '0.5px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--border-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{set.exerciseName}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{index + 1}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--teal)', fontWeight: 600 }}>{set.weight}kg</td>
                    <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>× {set.reps}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                      {editingSetId === set.id ? (
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                          <input type="number" value={editSetWeight} onChange={e => setEditSetWeight(e.target.value)}
                            className="input-field"
                            style={{ width: 70, background: 'var(--bg-input)', color: 'var(--text-primary)', borderRadius: 6, padding: '4px 8px', outline: 'none' }}
                            placeholder="kg" />
                          <input type="number" value={editSetReps} onChange={e => setEditSetReps(e.target.value)}
                            className="input-field"
                            style={{ width: 60, background: 'var(--bg-input)', color: 'var(--text-primary)', borderRadius: 6, padding: '4px 8px', outline: 'none' }}
                            placeholder="reps" />
                          <button onClick={() => handleUpdateSet(set)}
                            style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>✓</button>
                          <button onClick={() => setEditingSetId(null)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button onClick={() => {
                            setEditingSetId(set.id)
                            setEditSetWeight(set.weight)
                            setEditSetReps(set.reps)
                          }} style={{ background: 'transparent', color: 'var(--text-muted)', border: '0.5px solid var(--border)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>✏</button>
                          <button onClick={() => handleDeleteSet(set.id)}
                            style={{ background: 'transparent', color: 'var(--red)', border: '0.5px solid var(--red)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
  
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(sets.length / itemsPerPage)}
            totalItems={sets.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
  
        {/* Add set form - always visible */}
        <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1rem', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Exercise</label>
            <select value={selectedExerciseId} onChange={e => setSelectedExerciseId(e.target.value)}
              className="input-field" style={inputStyle}>
              <option value=''>Select an exercise</option>
              {exercises.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
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
      </div>
    )
  }