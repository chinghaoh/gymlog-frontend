import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/ApiClient'
import { useAuth } from '../context/AuthContext'
import LogWorkoutModal from '../ui/WorkoutModalComponents/LogWorkoutModal'
import WorkoutLogsView from './WorkoutLogsView'

export default function LogsPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    if (!user) return
    apiClient(`/api/workoutlogs?userId=${user.id}`)
      .then(data => setLogs(data))
      .catch(err => console.error(err))
  }, [user])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Logs</h1>
        <button onClick={() => setIsLogModalOpen(true)} style={{
          background: 'var(--purple)', color: 'white',
          border: 'none', borderRadius: 7, padding: '8px 16px',
          fontWeight: 600, cursor: 'pointer'
        }}>+ Log Workout</button>
      </div>

      <WorkoutLogsView
        workouts={logs}
        onDelete={(id) => setLogs(prev => prev.filter(l => l.id !== id))}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        currentPage={currentPage}
        totalPages={Math.ceil(logs.length / itemsPerPage)}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {isLogModalOpen && (
        <LogWorkoutModal
          onClose={() => setIsLogModalOpen(false)}
          onLogged={(newLog) => {
            setLogs(prev => [newLog, ...prev])
            setIsLogModalOpen(false)
          }}
        />
      )}
      
    </div>
  )
}