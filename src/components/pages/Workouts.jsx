import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/ApiClient'
import { useAuth } from '../context/AuthContext'
import FilterPills from '../ui/FilterPills'
import Pagination from '../ui/Pagination'
import CreateWorkoutModal from '../ui/CreateWorkoutModal'
import LogWorkoutModal from "../ui/WorkoutModalComponents/LogWorkoutModal"
import WorkoutLogsView from '../ui/WorkoutLogsView'
import WorkoutView from '../ui/WorkoutView'

export default function Workouts() {  
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [logs, setLogs] = useState([])
  const [view, setView] = useState('workouts')
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [isCreateWorkoutOpen, setIsCreateWorkoutOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    apiClient(`/api/workouts?userId=${user.id}`)
      .then(data => setWorkouts(data))
      .catch(err => console.error(err))
  }, [user])

  const openModal = (workout) => {
    setSelectedWorkout(workout)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedWorkout(null)
    setIsModalOpen(false)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Workouts</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setIsCreateWorkoutOpen(true)} style={{
            background: 'transparent', color: 'var(--text-primary)',
            border: '0.5px solid var(--border)', borderRadius: 7, padding: '8px 16px',
            fontWeight: 600, cursor: 'pointer'
          }}>+ New Workout</button>
          <button onClick={() => setIsLogModalOpen(true)} style={{
            background: 'var(--purple)', color: 'white',
            border: 'none', borderRadius: 7, padding: '8px 16px',
            fontWeight: 600, cursor: 'pointer'
          }}>+ Log Workout</button>
        </div>
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1rem', background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 8, padding: 3, width: 'fit-content' }}>
        <button onClick={() => setView('workouts')} style={{
          padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
          background: view === 'workouts' ? 'var(--purple)' : 'transparent',
          color: view === 'workouts' ? 'white' : 'var(--text-muted)',
          fontWeight: view === 'workouts' ? 600 : 400
        }}>Workouts</button>
        <button onClick={() => setView('logs')} style={{
          padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
          background: view === 'logs' ? 'var(--purple)' : 'transparent',
          color: view === 'logs' ? 'white' : 'var(--text-muted)',
          fontWeight: view === 'logs' ? 600 : 400
        }}>Logs</button>
      </div>

      {/* Content */}
      {view === 'workouts' ? (
        <WorkoutView
          onRowClick={openModal}
          onCreateWorkout={() => setIsCreateWorkoutOpen(true)} />
      ) : (
        <WorkoutLogsView
          workouts={logs}
          onRowClick={openModal}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          currentPage={currentPage}
          totalPages={Math.ceil(logs.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Log workout modal */}
      {isLogModalOpen && (
        <LogWorkoutModal
          onClose={() => setIsLogModalOpen(false)}
          onLogged={(newLog) => setLogs(prev => [newLog, ...prev])}
        />
      )}

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