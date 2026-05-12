import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/ApiClient'
import WorkoutModalHeader from './WorkoutModalComponents/WorkoutModalHeader'
import WorkoutEditForm from './WorkoutModalComponents/WorkoutEditForm'
import AddSetForm from './WorkoutModalComponents/AddSetForm'
import WorkoutSetList from './WorkoutModalComponents/WorkoutSetList'
import WorkoutModalFooter from './WorkoutModalComponents/WorkoutModalFooter'


export default function WorkoutModal({ workout, onClose, onDeleted, onUpdated }) {
  const [sets, setSets] = useState([])
  const [exercises, setExercises] = useState([])
  const [addingSet, setAddingSet] = useState(false)
  const [editing, setEditing] = useState(false)
  const [selectedExerciseId, setSelectedExerciseId] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')

  const [editName, setEditName] = useState(workout.name)
  const [editSplitCategory, setEditSplitCategory] = useState(workout.splitCategory)
  const [editDate, setEditDate] = useState(workout.date)
  const [editDurationMinutes, setEditDurationMinutes] = useState(workout.durationMinutes)
  const [editEnergyLevel, setEditEnergyLevel] = useState(workout.energyLevel)
  const [editNotes, setEditNotes] = useState(workout.notes || '')

  const [editingSetId, setEditingSetId] = useState(null)
  const [editSetReps, setEditSetReps] = useState('')
  const [editSetWeight, setEditSetWeight] = useState('')

  useEffect(() => {
    if (!workout) return
    apiClient(`/api/sets?workoutId=${workout.id}`)
      .then(data => setSets(data))
      .catch(err => console.error(err))

    apiClient('/api/exercises')
      .then(data => setExercises(data))
      .catch(err => console.error(err))
  }, [workout])

  const getNextSetNumber = (exerciseId) => {
    const setsForExercise = sets.filter(s => s.exerciseId === Number(exerciseId))
    return setsForExercise.length + 1
  }

  const handleAddSet = async () => {
    if (!selectedExerciseId || !reps || !weight) return
    try {
      const newSet = await apiClient(
        `/api/sets?workoutId=${workout.id}&exerciseId=${selectedExerciseId}`,
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
      setAddingSet(false)
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

  const handleEdit = async () => {
    try {
      const updated = await apiClient(`/api/workouts/${workout.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editName,
          splitCategory: editSplitCategory,
          date: editDate,
          durationMinutes: Number(editDurationMinutes),
          energyLevel: Number(editEnergyLevel),
          notes: editNotes
        })
      })
      onUpdated(updated)
      setEditing(false)
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

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${workout.name}"?`)) return
    try {
      await apiClient(`/api/workouts/${workout.id}`, { method: 'DELETE' })
      onDeleted()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>

      {/* Header */}
      <WorkoutModalHeader
        workout={workout}
        editing={editing}
        editName={editName}
        onClose={onClose}
      />

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
        {editing ? (
          <WorkoutEditForm
            editName={editName} setEditName={setEditName}
            editSplitCategory={editSplitCategory} setEditSplitCategory={setEditSplitCategory}
            editDate={editDate} setEditDate={setEditDate}
            editDurationMinutes={editDurationMinutes} setEditDurationMinutes={setEditDurationMinutes}
            editEnergyLevel={editEnergyLevel} setEditEnergyLevel={setEditEnergyLevel}
            editNotes={editNotes} setEditNotes={setEditNotes}
          />
        ) :
          addingSet ? (
            <AddSetForm
              exercises={exercises}
              selectedExerciseId={selectedExerciseId}
              setSelectedExerciseId={setSelectedExerciseId}
              reps={reps} setReps={setReps}
              weight={weight} setWeight={setWeight}
            />
          ) : (
            sets.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No sets logged yet</div>
            ) : (
              <WorkoutSetList
                sets={sets}
                editingSetId={editingSetId}
                editSetWeight={editSetWeight}
                editSetReps={editSetReps}
                setEditSetWeight={setEditSetWeight}
                setEditSetReps={setEditSetReps}
                setEditingSetId={setEditingSetId}
                onUpdateSet={handleUpdateSet}
                onDeleteSet={handleDeleteSet}
              />
            )
          )}
      </div>

      {/* Footer */}
      <WorkoutModalFooter
        editing={editing}
        addingSet={addingSet}
        onSaveEdit={handleEdit}
        onCancelEdit={() => setEditing(false)}
        onSaveSet={handleAddSet}
        onCancelSet={() => setAddingSet(false)}
        onAddSet={() => setAddingSet(true)}
        onEdit={() => setEditing(true)}
        onDelete={handleDelete}
      />

    </div>
  )
}