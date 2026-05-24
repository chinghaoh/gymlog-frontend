import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/apiClient'

const inputClass = "w-full bg-bg-input border-half rounded-md px-2.5 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"

export default function WorkoutSetForm({ workoutId, exercises, sets, onSetAdded }) {
    const [selectedExerciseId, setSelectedExerciseId] = useState('')
    const [reps, setReps] = useState('')
    const [weight, setWeight] = useState('')
    const [exerciseSearch, setExerciseSearch] = useState('')
    const [showExerciseDropdown, setShowExerciseDropdown] = useState(false)

    useEffect(() => {
        const handleClickOutside = () => setShowExerciseDropdown(false)
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const getNextSetNumber = (exerciseId) => {
        return sets.filter(s => s.exerciseId === Number(exerciseId)).length + 1
    }

    const handleAddSet = async () => {
        if (!selectedExerciseId || !reps || !weight) return
        try {
            await apiClient(`/api/sets?workoutId=${workoutId}&exerciseId=${selectedExerciseId}`, {
                method: 'POST',
                body: JSON.stringify({
                    setNumber: getNextSetNumber(selectedExerciseId),
                    reps: Number(reps),
                    weight: Number(weight)
                })
            })
            const updatedSets = await apiClient(`/api/sets?workoutId=${workoutId}`)
            onSetAdded(updatedSets)
            setSelectedExerciseId('')
            setReps('')
            setWeight('')
            setExerciseSearch('')
        } catch (err) {
            console.error(err)
        }
    }

    const filteredExercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(exerciseSearch.toLowerCase())
    )

    return (
        <div className="bg-bg-card border-half rounded-xl p-4 flex gap-3 items-end mb-4 relative z-10">

            {/* Exercise search */}
            <div className="flex-[2] relative">
                <label className="block text-text-muted text-sm mb-1.5">Exercise</label>
                <input
                    value={exerciseSearch}
                    onChange={e => {
                        setExerciseSearch(e.target.value)
                        setShowExerciseDropdown(true)
                        setSelectedExerciseId('')
                    }}
                    onFocus={() => setShowExerciseDropdown(true)}
                    onClick={e => e.stopPropagation()}
                    placeholder="Search exercise..."
                    className={inputClass}
                />
                {showExerciseDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-bg-card border-half rounded-md max-h-48 overflow-y-auto z-50">
                        {filteredExercises.length === 0 ? (
                            <div className="px-3 py-2 text-text-muted text-sm">No exercises found</div>
                        ) : (
                            filteredExercises.map(ex => (
                                <div
                                    key={ex.id}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedExerciseId(ex.id)
                                        setExerciseSearch(ex.name)
                                        setShowExerciseDropdown(false)
                                    }}
                                    className="px-3 py-2 text-sm text-text-primary cursor-pointer hover:bg-border-light transition-colors border-b border-half last:border-b-0"
                                >
                                    {ex.name}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Weight */}
            <div className="flex-1">
                <label className="block text-text-muted text-sm mb-1.5">Weight (kg)</label>
                <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className={inputClass}
                />
            </div>

            {/* Reps */}
            <div className="flex-1">
                <label className="block text-text-muted text-sm mb-1.5">Reps</label>
                <input
                    type="number"
                    value={reps}
                    onChange={e => setReps(e.target.value)}
                    className={inputClass}
                />
            </div>

            <button
                onClick={handleAddSet}
                className="bg-purple text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
                + Add Set
            </button>
        </div>
    )
}