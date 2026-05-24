export default function WorkoutModalHeader({ workout, editing, editName, onClose }) {
  return (
      <div className="flex items-center justify-between px-5 py-4">
          <div>
              <div className="font-bold text-text-primary">
                  {editing ? editName : workout.name}
              </div>
              <div className="text-text-muted text-sm mt-0.5">
                  {workout.date} · {workout.durationMinutes} min
              </div>
          </div>
          <div className="flex items-center gap-2.5">
              <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded">
                  {workout.splitCategory}
              </span>
              <button
                  onClick={onClose}
                  className="bg-transparent border-none text-text-muted cursor-pointer text-lg hover:text-text-primary transition-colors"
              >
                  ✕
              </button>
          </div>
      </div>
  )
}