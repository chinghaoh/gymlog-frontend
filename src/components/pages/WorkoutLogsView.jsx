import FilterPills from '../ui/FilterPills'
import Pagination from '../ui/Pagination'
import { apiClient } from '../../lib/ApiClient'

export default function WorkoutLogsView({ workouts, onDelete, onFilterChange, activeFilter, currentPage, itemsPerPage, onPageChange }) {
  const filters = ['All', 'Push', 'Pull', 'Legs', 'Upper', 'Full Body', 'Cardio', ]

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

      <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
              {['Workout', 'Date', 'Split', 'Duration', 'Energy', ''].map(col => (
                <th key={col} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedWorkouts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ marginBottom: 8, fontSize: 24 }}>📋</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>No logs yet</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                    Complete a workout and log it here to track your progress.
                  </div>
                </td>
              </tr>
            ) : (
              paginatedWorkouts.map((workout, index) => (
                <tr key={workout.id}
                  style={{ borderBottom: index === paginatedWorkouts.length - 1 ? 'none' : '0.5px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--border-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{workout.workoutName}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{workout.date}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ background: 'var(--purple-bg)', color: 'var(--purple-light)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{workout.splitCategory}</span>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{workout.durationMinutes} min</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>
                    {workout.energyLevel ? `⚡ ${workout.energyLevel}/10` : '—'}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(workout.id)}
                      style={{ background: 'transparent', color: 'var(--red)', border: '0.5px solid var(--red)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                      Delete
                    </button>
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