import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../../lib/apiClient'
import FilterPills from '../../ui/FilterPills'
import Pagination from '../../ui/Pagination'
import { useSearchParams } from 'react-router-dom'
import AddExerciseToWorkoutModal from '../../ui/WorkoutModalComponents/AddExerciseToWorkoutModal'


export default function Exercises() {
    const [exercises, setExercises] = useState([])
    const [selectedExercise, setSelectedExercise] = useState(null)
    const [category, setCategory] = useState('All')
    const [equipment, setEquipment] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [searchParams] = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const navigate = useNavigate()

    const itemsPerPage = 8

    const paginatedExercises = exercises.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const EQUIPMENT = ['All', 'Barbell', 'Dumbbell', 'Cable', 'Body Weight', 'Machine', 'Kettlebell']
    const CATEGORIES = ['All', 'Chest', 'Back', 'Shoulders', 'Upper Arms', 'Upper Legs', 'Waist', 'Lower Legs', 'Lower Arms']

    const difficultyClasses = {
        BEGINNER: { bg: 'bg-teal-bg', text: 'text-teal' },
        INTERMEDIATE: { bg: 'bg-amber-bg', text: 'text-amber' },
        ADVANCED: { bg: 'bg-red-bg', text: 'text-red' },
    }

    useEffect(() => {
        setCurrentPage(1)
        const params = new URLSearchParams()
        if (category !== 'All') params.append('category', category)
        if (equipment !== 'All') params.append('equipment', equipment)
        if (search) params.append('name', search)

        apiClient(`/api/exercises?${params.toString()}`)
            .then(data => setExercises(data))
            .catch(err => console.error(err))
    }, [category, equipment, search])

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-text-primary">Exercises</h1>
                {/* <button className="bg-purple text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                    + Add Exercise
                </button> */}
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                    🔍
                </span>
                <input
                    type="text"
                    placeholder="Search exercises..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-bg-card border-half rounded-lg py-2.5 pl-9 pr-3 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
                />
            </div>

            {/* Category filter */}
            <div className="mb-4">
                <div className="text-text-muted text-sm mb-1.5">Category</div>
                <FilterPills options={CATEGORIES} active={category} onChange={setCategory} />
            </div>

            {/* Equipment filter */}
            <div className="mb-4">
                <div className="text-text-muted text-sm mb-1.5">Equipment</div>
                <FilterPills options={EQUIPMENT} active={equipment} onChange={setEquipment} />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 items-stretch mb-4">
                {paginatedExercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        onClick={() => navigate(`/exercises/${exercise.id}`)}
                        className="bg-bg-card border-half rounded-xl overflow-hidden flex flex-col cursor-pointer hover:border-half-purple transition-colors h-full"
                    >
                        {/* GIF */}
                        <div className="h-40 bg-border-light flex items-center justify-center overflow-hidden">
                            {exercise.gifUrl ? (
                                <>
                                    <img
                                        src={exercise.gifUrl}
                                        alt={exercise.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                            e.target.nextSibling.style.display = 'flex'
                                        }}
                                    />
                                    <div className="hidden w-full h-full flex-col items-center justify-center gap-1.5 text-text-muted">
                                        <span className="text-3xl">🏋️</span>
                                        <span className="text-xs">No preview</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-1.5 text-text-muted">
                                    <span className="text-3xl">🏋️</span>
                                    <span className="text-xs">Images coming soon</span>
                                </div>
                            )}
                        </div>

                        <div className="p-3 flex flex-col flex-1">
                            {/* Name */}
                            <div className="font-semibold text-text-primary text-sm mb-2">
                                {exercise.name}
                            </div>

                            {/* Badges */}
                            <div className="flex gap-1.5 flex-wrap mb-2">
                                <span className="bg-purple-bg text-purple-light text-xs px-2 py-0.5 rounded">
                                    {exercise.category}
                                </span>
                                <span className="bg-border-light text-text-secondary text-xs px-2 py-0.5 rounded">
                                    {exercise.equipment}
                                </span>
                                {exercise.difficulty && (() => {
                                    const d = difficultyClasses[exercise.difficulty] || {}
                                    return (
                                        <span className={`text-xs px-2 py-0.5 rounded ${d.bg} ${d.text}`}>
                                            {exercise.difficulty}
                                        </span>
                                    )
                                })()}
                            </div>

                            {/* Target muscle */}
                            {exercise.targetMuscle && (
                                <div className="text-text-muted text-xs mt-auto">
                                    Target: {exercise.targetMuscle}
                                </div>
                            )}

                            {/* Add to workout button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedExercise(exercise) }}
                                className="mt-2.5 w-full bg-purple text-white border-none rounded-md py-1.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                + Add to workout
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedExercise && (
                <AddExerciseToWorkoutModal
                    exercise={selectedExercise}
                    onClose={() => setSelectedExercise(null)}
                    onSuccess={() => setSelectedExercise(null)}
                />
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(exercises.length / itemsPerPage)}
                totalItems={exercises.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

            <div className="text-text-muted text-sm mt-2">{exercises.length} exercises</div>
        </div>
    )
}