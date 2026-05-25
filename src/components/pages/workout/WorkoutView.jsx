import { useAuth } from '../../context/AuthContext'
import { apiClient } from '../../../lib/ApiClient'
import { useState, useEffect } from 'react'
import FilterPills from '../../ui/FilterPills'
import Pagination from '../../ui/Pagination'
import WorkoutTable from './WorkoutTable'
import WorkoutCard from './WorkoutCard'
import { useNavigate } from 'react-router-dom'



export default function WorkoutView({ workouts, onDelete }) {
    const navigate = useNavigate()
    const [activeFilter, setActiveFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filters = ['All', 'Push', 'Pull', 'Legs', 'Upper', 'Full Body', 'Cardio']

    const filterMap = {
        'Push':      'PUSH',
        'Pull':      'PULL',
        'Legs':      'LEGS',
        'Upper':     'UPPER_BODY',
        'Full Body': 'FULL_BODY',
        'Cardio':    'CARDIO',
    }

    const filteredWorkouts = activeFilter === 'All'
        ? workouts
        : workouts.filter(w => w.splitCategory === filterMap[activeFilter])

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

    if (paginatedWorkouts.length === 0 && activeFilter === 'All') {
        return (
            <div>
                <FilterPills options={filters} active={activeFilter} onChange={setActiveFilter} />
                <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
                    <div className="text-2xl mb-2">🏋️</div>
                    <div className="font-semibold text-text-primary mb-1.5">No workouts yet</div>
                    <div className="text-text-muted text-sm mb-3">
                        Create your first workout manually or let the AI Trainer build one for you.
                    </div>
                    <button
                        onClick={() => navigate('/ai')}
                        className="bg-purple text-white border-none rounded-lg px-3.5 py-1.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        Try AI Trainer
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <FilterPills options={filters} active={activeFilter} onChange={(f) => { setActiveFilter(f); setCurrentPage(1) }} />

            {/* Desktop */}
            <div className="hidden md:block">
                <WorkoutTable
                    workouts={paginatedWorkouts}
                    onDelete={handleDelete}
                />
            </div>

            {/* Mobile */}
            <div className="md:hidden">
                <WorkoutCard
                    workouts={paginatedWorkouts}
                    onDelete={handleDelete}
                />
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