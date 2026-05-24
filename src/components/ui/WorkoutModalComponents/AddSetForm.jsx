import { inputStyle } from '../../../lib/styles'

const inputClass = "w-full bg-bg-input border-half rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
const labelClass = "block text-text-muted text-sm mb-1.5"

export default function AddSetForm({ exercises, selectedExerciseId, setSelectedExerciseId, reps, setReps, weight, setWeight }) {
    return (
        <div className="flex flex-col gap-3">
            <div>
                <label className={labelClass}>Exercise</label>
                <select
                    value={selectedExerciseId}
                    onChange={e => setSelectedExerciseId(e.target.value)}
                    className={inputClass}
                >
                    <option value=''>Select an exercise</option>
                    {exercises.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className={labelClass}>Weight (kg)</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div className="flex-1">
                    <label className={labelClass}>Reps</label>
                    <input
                        type="number"
                        value={reps}
                        onChange={e => setReps(e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>
        </div>
    )
}