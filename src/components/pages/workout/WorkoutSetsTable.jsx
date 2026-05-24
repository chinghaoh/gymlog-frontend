import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../../lib/apiClient'

export default function WorkoutSetsTable({ sets, onSetUpdated, onSetDeleted }) {
    const navigate = useNavigate()

    const [editingSetId, setEditingSetId] = useState(null)
    const [editSetWeight, setEditSetWeight] = useState('')
    const [editSetReps, setEditSetReps] = useState('')

    const handleUpdateSet = async (set) => {
        try {
            const updated = await apiClient(`/api/sets/${set.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    setNumber: set.setNumber,
                    reps: Number(editSetReps),
                    weight: Number(editSetWeight),
                    notes: set.notes
                })
            })
            onSetUpdated(updated)
            setEditingSetId(null)
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteSet = async (setId) => {
        if (!window.confirm('Delete this set?')) return
        try {
            await apiClient(`/api/sets/${setId}`, { method: 'DELETE' })
            onSetDeleted(setId)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="bg-bg-card border-half rounded-xl overflow-hidden mb-4">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-half">
                        {['Exercise', 'Set', 'Weight', 'Reps', ''].map(col => (
                            <th key={col} className="px-4 py-2.5 text-left text-text-muted font-medium text-sm">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sets.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-text-muted">
                                No sets yet — add one above
                            </td>
                        </tr>
                    ) : (
                        sets.map((set, index) => (
                            <tr
                                key={set.id}
                                className={`hover:bg-border-light transition-colors
                                    ${index !== sets.length - 1 ? 'border-b border-half' : ''}`}
                            >
                                <td
                                    className="px-4 py-2.5 text-text-primary font-medium text-sm cursor-pointer underline decoration-border hover:text-purple-light transition-colors"
                                    onClick={() => navigate(`/exercises/${set.exerciseId}`)}
                                >
                                    {set.exerciseName}
                                </td>
                                <td className="px-4 py-2.5 text-text-secondary text-sm">
                                    {set.setNumber}
                                </td>
                                <td className="px-4 py-2.5 text-teal font-semibold text-sm">
                                    {set.weight}kg
                                </td>
                                <td className="px-4 py-2.5 text-text-secondary text-sm">
                                    × {set.reps}
                                </td>
                                <td className="px-4 py-2.5">
                                    {editingSetId === set.id ? (
                                        <div className="flex gap-1.5 justify-end items-center">
                                            <input
                                                type="number"
                                                value={editSetWeight}
                                                onChange={e => setEditSetWeight(e.target.value)}
                                                onClick={e => e.stopPropagation()}
                                                placeholder="kg"
                                                className="w-16 bg-bg-input border-half rounded-md px-2 py-1 text-sm text-text-primary outline-none"
                                            />
                                            <input
                                                type="number"
                                                value={editSetReps}
                                                onChange={e => setEditSetReps(e.target.value)}
                                                onClick={e => e.stopPropagation()}
                                                placeholder="reps"
                                                className="w-14 bg-bg-input border-half rounded-md px-2 py-1 text-sm text-text-primary outline-none"
                                            />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleUpdateSet(set) }}
                                                className="bg-purple text-white border-none rounded-md px-2.5 py-1 text-sm cursor-pointer hover:opacity-90"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingSetId(null) }}
                                                className="bg-transparent border-none text-text-muted cursor-pointer text-sm hover:text-text-primary"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setEditingSetId(set.id)
                                                    setEditSetWeight(set.weight)
                                                    setEditSetReps(set.reps)
                                                }}
                                                className="bg-transparent text-text-muted border-half rounded-md px-2.5 py-1 text-xs cursor-pointer hover:text-text-primary transition-colors"
                                            >
                                                ✏
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteSet(set.id) }}
                                                className="bg-transparent text-red border-half-red rounded-md px-2.5 py-1 text-xs cursor-pointer hover:bg-red-bg transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}