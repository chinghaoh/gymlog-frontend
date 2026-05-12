import FilterPills from './FilterPills'
import Pagination from './Pagination'

export default function WorkoutLogsView({ workouts, onRowClick, onFilterChange, activeFilter, currentPage, totalPages, itemsPerPage, onPageChange }) {
  const filters = ['All', 'Push', 'Pull', 'Legs', 'Upper', 'Full Body', 'Cardio']

  const filteredWorkouts = activeFilter === 'All'
    ? workouts
    : workouts.filter(w => w.splitCategory === activeFilter.toUpperCase())

  const paginatedWorkouts = filteredWorkouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <FilterPills options={filters} active={activeFilter} onChange={onFilterChange} />

      <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
              {['Workout', 'Date', 'Split', 'Duration', 'Energy'].map(col => (
                <th key={col} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedWorkouts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No workouts logged yet
                </td>
              </tr>
            ) : (
              paginatedWorkouts.map((workout, index) => (
                <tr key={workout.id}
                  onClick={() => onRowClick(workout)}
                  style={{ borderBottom: index === paginatedWorkouts.length - 1 ? 'none' : '0.5px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--border-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{workout.name}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{workout.date}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ background: 'var(--purple-bg)', color: 'var(--purple-light)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{workout.splitCategory}</span>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{workout.durationMinutes} min</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>⚡ {workout.energyLevel}/10</td>
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