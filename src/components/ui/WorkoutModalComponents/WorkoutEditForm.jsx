import { inputStyle } from '../../../lib/styles'

const inputClass = "w-full bg-bg-input border-half rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
const labelClass = "block text-text-muted text-sm mb-1.5"

export default function WorkoutEditForm({
    editName, setEditName,
    editSplitCategory, setEditSplitCategory,
    editDate, setEditDate,
    editDurationMinutes, setEditDurationMinutes,
    editEnergyLevel, setEditEnergyLevel,
    editNotes, setEditNotes
}) {
    return (
        <div className="flex flex-col gap-3">
            <div>
                <label className={labelClass}>Name</label>
                <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className={inputClass}
                />
            </div>
            <div>
                <label className={labelClass}>Split</label>
                <select
                    value={editSplitCategory}
                    onChange={e => setEditSplitCategory(e.target.value)}
                    className={inputClass}
                >
                    {['PUSH', 'PULL', 'LEGS', 'UPPER', 'FULL_BODY', 'CARDIO'].map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className={labelClass}>Date</label>
                    <input
                        type="date"
                        value={editDate}
                        onChange={e => setEditDate(e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div className="flex-1">
                    <label className={labelClass}>Duration (min)</label>
                    <input
                        type="number"
                        value={editDurationMinutes}
                        onChange={e => setEditDurationMinutes(e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div className="flex-1">
                    <label className={labelClass}>Energy (1-10)</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={editEnergyLevel}
                        onChange={e => setEditEnergyLevel(e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>
            <div>
                <label className={labelClass}>Notes</label>
                <input
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    className={inputClass}
                />
            </div>
        </div>
    )
}