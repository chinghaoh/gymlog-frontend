const btnPrimary = "bg-purple text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
const btnGhost = "bg-transparent text-text-muted border-half rounded-lg px-4 py-2 text-sm cursor-pointer hover:text-text-primary transition-colors"
const btnDanger = "bg-transparent text-red border-half-red rounded-lg px-4 py-2 text-sm cursor-pointer hover:bg-red-bg transition-colors ml-auto"

export default function WorkoutModalFooter({ editing, addingSet, onSaveEdit, onCancelEdit, onSaveSet, onCancelSet, onAddSet, onEdit, onDelete }) {
    if (editing) {
        return (
            <div className="flex gap-2 px-5 py-4">
                <button onClick={onSaveEdit} className={btnPrimary}>Save Changes</button>
                <button onClick={onCancelEdit} className={btnGhost}>Cancel</button>
            </div>
        )
    }

    if (addingSet) {
        return (
            <div className="flex gap-2 px-5 py-4">
                <button onClick={onSaveSet} className={btnPrimary}>Save Set</button>
                <button onClick={onCancelSet} className={btnGhost}>Cancel</button>
            </div>
        )
    }

    return (
        <div className="flex gap-2 px-5 py-4">
            <button onClick={onAddSet} className={btnPrimary}>+ Add Set</button>
            <button onClick={onEdit} className={btnGhost}>Edit</button>
            <button onClick={onDelete} className={btnDanger}>Delete</button>
        </div>
    )
}