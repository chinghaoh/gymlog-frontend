import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/ApiClient'
import { useAuth } from '../context/AuthContext'
import CreateWorkoutModal from '../ui/WorkoutModalComponents/CreateWorkoutModal'
import LogWorkoutModal from "../ui/WorkoutModalComponents/LogWorkoutModal"
import WorkoutLogsView from './WorkoutLogsView'
import WorkoutView from './WorkoutView'

export default function Workouts() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [logs, setLogs] = useState([])
  const [view, setView] = useState('workouts')
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [isCreateWorkoutOpen, setIsCreateWorkoutOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    apiClient(`/api/workouts?userId=${user.id}`)
      .then(data => setWorkouts(data))
      .catch(err => console.error(err))

    apiClient(`/api/workoutlogs?userId=${user.id}`)
      .then(data => setLogs(data))
      .catch(err => console.error(err))
  }, [user])

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Workouts</h1>
      </div>


      {/* Content */}
      <WorkoutView
        workouts={workouts}
        onDelete={(id) => setWorkouts(prev => prev.filter(w => w.id !== id))}
      />
    
      {/* Create workout modal */}
      {isCreateWorkoutOpen && (
        <CreateWorkoutModal
          onClose={() => setIsCreateWorkoutOpen(false)}
          onCreated={(newWorkout) => {
            setWorkouts(prev => [newWorkout, ...prev])
            setIsCreateWorkoutOpen(false)
          }}
        />
      )}
    </div>
  )
}