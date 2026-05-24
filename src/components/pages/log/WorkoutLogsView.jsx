import FilterPills from '../../ui/FilterPills'
import Pagination from '../../ui/Pagination'
import { apiClient } from '../../../lib/ApiClient'
import { useNavigate } from 'react-router-dom'

export default function WorkoutLogsView({ workouts, onDelete, onFilterChange, activeFilter, currentPage, itemsPerPage, onPageChange }) {
  const navigate = useNavigate()

  const filters = ['All', 'Push', 'Pull', 'Legs', 'Upper', 'Full Body', 'Cardio']

  const filterMap = {
      'Push': 'PUSH',
      'Pull': 'PULL',
      'Legs': 'LEGS',
      'Upper': 'UPPER_BODY',
      'Full Body': 'FULL_BODY',
      'Cardio': 'CARDIO',
      'Other': 'OTHER'
  }

  const filteredWorkouts = activeFilter === 'All'
      ? workouts
      : workouts.filter(w => w.splitCategory === filterMap[activeFilter])

  const paginatedWorkouts = filteredWorkouts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  )

  const handleDelete = async (id) => {
      if (!window.confirm('Delete this log?')) return
      try {
          await apiClient(`/api/workoutlogs/${id}`, { method: 'DELETE' })
          onDelete(id)
      } catch (err) {
          console.error(err)
      }
  }

  return (
      <div>
          <FilterPills options={filters} active={activeFilter} onChange={onFilterChange} />

          <div className="bg-bg-card border-half rounded-xl overflow-hidden">
              <table className="w-full border-collapse">
                  <thead>
                      <tr className="border-b border-half">
                          {['Workout', 'Date', 'Split', 'Duration', 'Energy', ''].map(col => (
                              <th key={col} className="px-4 py-2.5 text-left text-text-muted font-medium text-sm">
                                  {col}
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody>
                      {paginatedWorkouts.length === 0 ? (
                          <tr>
                              <td colSpan={6} className="p-8 text-center">
                                  <div className="text-2xl mb-2">📋</div>
                                  <div className="font-semibold text-text-primary mb-1.5">No logs yet</div>
                                  <div className="text-text-muted text-sm">
                                      Complete a workout and log it here to track your progress.
                                  </div>
                              </td>
                          </tr>
                      ) : (
                          paginatedWorkouts.map((workout, index) => (
                              <tr
                                  key={workout.id}
                                  onClick={() => navigate(`/workouts/${workout.workoutId}`)}
                                  className={`cursor-pointer hover:bg-border-light transition-colors
                                      ${index !== paginatedWorkouts.length - 1 ? 'border-b border-half' : ''}`}
                              >
                                  <td className="px-4 py-2.5 text-text-primary font-medium text-sm">
                                      <div className="flex items-center gap-2">
                                          {workout.workoutName}
                                          {workout.aiGenerated && (
                                              <span className="bg-cyan-bg text-cyan border-half-cyan text-xs font-semibold px-1.5 py-0.5 rounded">
                                                  🤖 AI
                                              </span>
                                          )}
                                      </div>
                                  </td>
                                  <td className="px-4 py-2.5 text-text-secondary text-sm">
                                      {workout.date}
                                  </td>
                                  <td className="px-4 py-2.5">
                                      <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded">
                                          {workout.splitCategory}
                                      </span>
                                  </td>
                                  <td className="px-4 py-2.5 text-text-secondary text-sm">
                                      {workout.durationMinutes ? `${workout.durationMinutes} min` : '—'}
                                  </td>
                                  <td className="px-4 py-2.5 text-text-secondary text-sm">
                                      {workout.energyLevel ? `⚡ ${workout.energyLevel}/10` : '—'}
                                  </td>
                                  <td className="px-4 py-2.5">
                                      <div className="flex justify-end">
                                          <button
                                              onClick={(e) => { e.stopPropagation(); handleDelete(workout.id) }}
                                              className="bg-transparent text-red border-half-red rounded-md px-2.5 py-1 text-xs cursor-pointer hover:bg-red-bg transition-colors"
                                          >
                                              Delete
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>

          <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredWorkouts.length / itemsPerPage)}
              totalItems={filteredWorkouts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
          />
      </div>
  )
}