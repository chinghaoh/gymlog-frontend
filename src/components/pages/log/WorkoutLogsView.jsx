import FilterPills from '../../ui/FilterPills'
import Pagination from '../../ui/Pagination'
import { apiClient } from '../../../lib/ApiClient'
import { useNavigate } from 'react-router-dom'
import LogCard from './LogCard'
import LogTable from './LogTable'

export default function WorkoutLogsView({ workouts, onDelete, onFilterChange, activeFilter, currentPage, itemsPerPage, onPageChange }) {

    const filters = ['All', 'Push', 'Pull', 'Legs', 'Upper', 'Full Body', 'Cardio']

    const filterMap = {
        'Push':      'PUSH',
        'Pull':      'PULL',
        'Legs':      'LEGS',
        'Upper':     'UPPER_BODY',
        'Full Body': 'FULL_BODY',
        'Cardio':    'CARDIO',
        'Other':     'OTHER'
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

            {paginatedWorkouts.length === 0 ? (
                <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-semibold text-text-primary mb-1.5">No logs yet</div>
                    <div className="text-text-muted text-sm">
                        Complete a workout and log it here to track your progress.
                    </div>
                </div>
            ) : (
                <>
                    {/* Desktop */}
                    <div className="hidden md:block">
                        <LogTable logs={paginatedWorkouts} onDelete={handleDelete} />
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden">
                        <LogCard logs={paginatedWorkouts} onDelete={handleDelete} />
                    </div>
                </>
            )}

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