import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/ApiClient'
import { useAuth } from '../context/AuthContext'
import FilterPills from '../ui/FilterPills'
import Pagination from '../ui/Pagination'

export default function Workouts() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')

  const filters = ['All', 'Push', 'Pull', 'Legs', 'Upper', 'Full Body', 'Cardio']

  useEffect(() => {
    if (!user) return
    apiClient(`/api/workouts?userId=${user.id}`)
      .then(data => setWorkouts(data))
      .catch(err => console.error(err))
  }, [user])

  const filteredWorkouts = activeFilter === 'All'
    ? workouts
    : workouts.filter(w => w.splitCategory === activeFilter.toUpperCase())

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(filteredWorkouts.length / itemsPerPage)
  const paginatedWorkouts = filteredWorkouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Workouts</h1>
        <button style={{
          background: 'var(--purple)', color: 'white',
          border: 'none', borderRadius: 7, padding: '8px 16px',
          fontWeight: 600, cursor: 'pointer'
        }}>+ New Workout</button>
      </div>

      {/* Filters */}
      <FilterPills options={filters} active={activeFilter} onChange={setActiveFilter} />

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
              {['Workout', 'Date', 'Split', 'Duration', 'Energy'].map(col => (
                <th key={col} style={{
                  padding: '10px 16px', textAlign: 'left',
                  color: 'var(--text-muted)', fontWeight: 500
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedWorkouts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No workouts yet
                </td>
              </tr>
            ) : (
              paginatedWorkouts.map((workout, index) => (
                <tr key={workout.id} style={{
                  borderBottom: index === workouts.length - 1 ? 'none' : '0.5px solid var(--border)',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--border-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{workout.name}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{workout.date}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{
                      background: 'var(--purple-bg)', color: 'var(--purple-light)',
                      padding: '2px 8px', borderRadius: 4, fontWeight: 600
                    }}>{workout.splitCategory}</span>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{workout.durationMinutes} min</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>⚡ {workout.energyLevel}/10</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredWorkouts.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

    </div>
  )
}