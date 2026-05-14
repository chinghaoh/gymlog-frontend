import { useAuth } from '../context/AuthContext'
import { apiClient } from '../../lib/ApiClient'
import { useState, useEffect } from 'react'
import FilterPills from '../ui/FilterPills'
import Pagination from '../ui/Pagination'
import { useNavigate } from 'react-router-dom'


export default function WorkoutView({ workouts, onDelete }) {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filters = ['All', 'Push', 'Pull', 'Legs', 'Upper', 'Full Body', 'Cardio']

  const filteredWorkouts = activeFilter === 'All'
    ? workouts
    : workouts.filter(w => w.splitCategory === activeFilter.toUpperCase())

  const paginatedWorkouts = filteredWorkouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return
    try {
      await apiClient(`/api/workouts/${id}`, { method: 'DELETE' })
      onDelete(id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <FilterPills options={filters} active={activeFilter} onChange={setActiveFilter} />

      <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr 
            style={{ borderBottom: '0.5px solid var(--border)' }}>
              {['Name', 'Split', 'Duration', ''].map(col => (
                <th key={col} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedWorkouts.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No workouts yet — create one with "+ New Workout"
                </td>
              </tr>
            ) : (
              paginatedWorkouts.map((workout, index) => (
                <tr 
                key={workout.id}
                  style={{ borderBottom: index === paginatedWorkouts.length - 1 ? 'none' : '0.5px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--border-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{workout.name}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ background: 'var(--purple-bg)', color: 'var(--purple-light)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{workout.splitCategory}</span>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{workout.durationMinutes} min</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => navigate(`/workouts/${workout.id}`)}
                        style={{ background: 'transparent', color: 'var(--purple-light)', border: '0.5px solid var(--purple)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                        + Add Sets
                      </button>
                      <button onClick={() => handleDelete(workout.id)}
                        style={{ background: 'transparent', color: 'var(--red)', border: '0.5px solid var(--red)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
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
        onPageChange={setCurrentPage}
      />
    </div>
  )
}