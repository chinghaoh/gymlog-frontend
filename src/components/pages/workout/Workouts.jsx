import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'
import CreateWorkoutModal from '../../ui/WorkoutModalComponents/CreateWorkoutModal'
import WorkoutView from '../workout/WorkoutView'
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
          <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-text-primary">Workouts</h1>
              <button
                  onClick={() => setIsCreateWorkoutOpen(true)}
                  className="bg-purple text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              >
                  + New Workout
              </button>
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