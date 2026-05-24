import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../../lib/apiClient'

const SPLITS = ['PUSH', 'PULL', 'LEGS', 'UPPER_BODY', 'FULL_BODY', 'CARDIO']

export default function WorkoutDetailHeader({ workout, workoutId, onWorkoutUpdate }) {
    const navigate = useNavigate()

    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState('')
    const [editSplit, setEditSplit] = useState('')
    const [editDuration, setEditDuration] = useState('')

    const handleStartEdit = () => {
        setEditName(workout.name)
        setEditSplit(workout.splitCategory)
        setEditDuration(workout.durationMinutes || '')
        setIsEditing(true)
    }

    const handleSaveEdit = async () => {
        try {
            await apiClient(`/api/workouts/${workoutId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: editName,
                    splitCategory: editSplit,
                    durationMinutes: editDuration ? Number(editDuration) : null,
                    notes: workout.notes
                })
            })
            onWorkoutUpdate({
                name: editName,
                splitCategory: editSplit,
                durationMinutes: editDuration ? Number(editDuration) : null
            })
            setIsEditing(false)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex items-center gap-3 mb-6">
            <button
                onClick={() => navigate('/workouts')}
                className="bg-transparent border-none text-text-muted cursor-pointer text-lg hover:text-text-primary transition-colors"
            >
                ←
            </button>

            {isEditing ? (
                <div className="flex flex-col gap-2 flex-1">
                    <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="bg-bg-input border-half rounded-md px-2.5 py-1.5 text-text-primary font-bold text-lg outline-none focus:border-half-purple transition-colors"
                    />
                    <div className="flex gap-2">
                        <select
                            value={editSplit}
                            onChange={e => setEditSplit(e.target.value)}
                            className="bg-bg-input border-half rounded-md px-2 py-1.5 text-sm text-text-muted outline-none focus:border-half-purple transition-colors"
                        >
                            {SPLITS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={editDuration}
                            onChange={e => setEditDuration(e.target.value)}
                            placeholder="Duration (min)"
                            className="bg-bg-input border-half rounded-md px-2 py-1.5 text-sm text-text-muted outline-none w-36 focus:border-half-purple transition-colors"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveEdit}
                            className="bg-purple text-white border-none rounded-md px-3.5 py-1.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-transparent text-text-muted border-half rounded-md px-3.5 py-1.5 text-sm cursor-pointer hover:text-text-primary transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-text-primary">{workout.name}</h1>
                    <div className="text-text-muted text-sm mt-0.5">
                        {workout.splitCategory} · {workout.durationMinutes ? `${workout.durationMinutes} min` : '—'}
                    </div>
                </div>
            )}

            {!isEditing && (
                <button
                    onClick={handleStartEdit}
                    className="bg-purple text-white border-none rounded-md px-3 py-1.5 text-sm cursor-pointer hover:opacity-90 transition-opacity"
                >
                    ✏
                </button>
            )}
        </div>
    )
}