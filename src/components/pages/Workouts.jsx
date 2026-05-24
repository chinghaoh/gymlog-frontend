import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/ApiClient'
import { useAuth } from '../context/AuthContext'
import CreateWorkoutModal from '../ui/WorkoutModalComponents/CreateWorkoutModal'
import WorkoutView from './WorkoutView'
import { useNavigate } from 'react-router-dom'


export default function Workouts() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [workouts, setWorkouts] = useState([])
  const [isCreateWorkoutOpen, setIsCreateWorkoutOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    apiClient(`/api/workouts?userId=${user.id}`)
      .then(data => setWorkouts(data))
      .catch(err => console.error(err))
  }, [user])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Workouts</h1>
        <button onClick={() => setIsCreateWorkoutOpen(true)} style={{
          background: 'var(--purple)', color: 'white',
          border: 'none', borderRadius: 7, padding: '8px 16px',
          fontWeight: 600, cursor: 'pointer'
        }}>+ New Workout</button>
      </div>

      <WorkoutView
        workouts={workouts}
        onDelete={(id) => setWorkouts(prev => prev.filter(w => w.id !== id))}
      />

      {isCreateWorkoutOpen && (
        <CreateWorkoutModal
          onClose={() => setIsCreateWorkoutOpen(false)}
          onCreated={(newWorkout) => {
            setWorkouts(prev => [newWorkout, ...prev])
            setIsCreateWorkoutOpen(false)
            navigate(`/workouts/${newWorkout.id}`)
          }}
        />
      )}
    </div>
  )
}