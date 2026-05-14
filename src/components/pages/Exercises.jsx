import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/apiClient'
import FilterPills from '../ui/FilterPills'
import Pagination from '../ui/Pagination'
import { useSearchParams } from 'react-router-dom'
import AddExerciseToWorkoutModal from '../ui/WorkoutModalComponents/AddExerciseToWorkoutModal'


export default function Exercises() {
    const [exercises, setExercises] = useState([])
    const [selectedExercise, setSelectedExercise] = useState(null)
    const [category, setCategory] = useState('All')
    const [equipment, setEquipment] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [searchParams] = useSearchParams()
    const [search, setSearch] =  useState(searchParams.get('search') || '')

    const itemsPerPage = 10


    const paginatedExercises = exercises.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const EQUIPMENT = ['All', 'Barbell', 'Dumbbell', 'Cable', 'Body Weight', 'Machine', 'Kettlebell']
    const CATEGORIES = ['All', 'Chest', 'Back', 'Shoulders', 'Upper Arms', 'Upper Legs', 'Waist', 'Lower Legs', 'Lower Arms']



    useEffect(() => {
        setCurrentPage(1)
        const params = new URLSearchParams()
        if (category !== 'All') params.append('category', category)
        if (equipment !== 'All') params.append('equipment', equipment)
        if (search) params.append('name', search)

        apiClient(`/api/exercises?${params.toString()}`)
            .then(data => (setExercises(data)
            ))
            .catch(err => console.error(err))
    }, [category, equipment, search])

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h1 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Exercises</h1>
                <button style={{
                    background: 'var(--purple)', color: 'white',
                    border: 'none', borderRadius: 7, padding: '8px 16px',
                    fontWeight: 600, cursor: 'pointer'
                }}>+ Add Exercise</button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
                <input
                    className="input-field"
                    type="text"
                    placeholder="Search exercises..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'var(--bg-card)',
                        borderRadius: 8,
                        padding: '10px 12px 10px 36px',
                        color: 'var(--text-primary)',
                        outline: 'none'
                    }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>Category</div>
                <FilterPills options={CATEGORIES} active={category} onChange={setCategory} />
            </div>

            {/* Equipment filter */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>Equipment</div>
                <FilterPills options={EQUIPMENT} active={equipment} onChange={setEquipment} />
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {paginatedExercises.map((exercise) => (
                    <div key={exercise.id} style={{ background: 'var(--bg-card)', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                        {/* GIF */}
                        <div style={{ height: 160, background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {exercise.gifUrl ? (
                                <img src={exercise.gifUrl} alt={exercise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: 'var(--text-muted)' }}>▶</span>
                            )}
                        </div>

                        <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            {/* Name */}
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{exercise.name}</div>

                            {/* Badges */}
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                                <span style={{ background: 'var(--purple-bg)', color: 'var(--purple-light)', padding: '2px 8px', borderRadius: 4 }}>
                                    {exercise.category}
                                </span>
                                <span style={{ background: 'var(--border-light)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: 4 }}>
                                    {exercise.equipment}
                                </span>
                                {exercise.difficulty && (
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 4,
                                        background: exercise.difficulty === 'BEGINNER' ? 'var(--teal-bg)' : exercise.difficulty === 'INTERMEDIATE' ? 'var(--amber-bg)' : 'var(--red-bg)',
                                        color: exercise.difficulty === 'BEGINNER' ? 'var(--teal)' : exercise.difficulty === 'INTERMEDIATE' ? 'var(--amber)' : 'var(--red)'
                                    }}>
                                        {exercise.difficulty}
                                    </span>
                                )}
                            </div>

                            {/* Target muscle */}
                            {exercise.targetMuscle && (
                                <div style={{ color: 'var(--text-muted)', marginTop: 'auto' }}>Target: {exercise.targetMuscle}</div>
                            )}

                            {/* Add to workout button */}
                            <button
                                onClick={() => setSelectedExercise(exercise)}
                                style={{
                                    marginTop: 10,
                                    width: '100%',
                                    background: '#534AB7',
                                    border: 'none',
                                    borderRadius: 6,
                                    padding: '7px 0',
                                    fontWeight: 600,
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                            >+ Add to workout</button>
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
            <div style={{ color: 'var(--text-muted)' }}>{exercises.length} exercises</div>
        </div>
    )
}