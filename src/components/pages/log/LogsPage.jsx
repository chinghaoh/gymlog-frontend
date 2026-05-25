import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/ApiClient'
import { useAuth } from '../../context/AuthContext'
import LogWorkoutModal from '../../ui/WorkoutModalComponents/LogWorkoutModal'
import WorkoutLogsView from './WorkoutLogsView'
import { useLocation } from 'react-router-dom'


export default function LogsPage() {
  const { user } = useAuth()
  const location = useLocation() 
  const [logs, setLogs] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [preselectedWorkoutId, setPreselectedWorkoutId] = useState(null)
  const itemsPerPage = 10

  useEffect(() => {
      if (!user) return
      apiClient(`/api/workoutlogs?userId=${user.id}`)
          .then(data => setLogs(data))
          .catch(err => console.error(err))
  }, [user])

  useEffect(() => {
    if (location.state?.openModal) {
        setIsLogModalOpen(true)
        setPreselectedWorkoutId(location.state.workoutId)
    }
}, [])

  return (
      <div>
          <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-text-primary">Logs</h1>
              <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="bg-purple text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              >
                  + Log Workout
              </button>
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
                  preselectedWorkoutId={preselectedWorkoutId}
                  onLogged={(newLog) => {
                      setLogs(prev => [newLog, ...prev])
                      setIsLogModalOpen(false)
                  }}
              />
          )}
      </div>
  )
}