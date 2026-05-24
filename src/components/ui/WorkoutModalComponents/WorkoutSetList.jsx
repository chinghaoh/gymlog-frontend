export default function WorkoutSetList({ sets, editingSetId, editSetWeight, editSetReps, setEditSetWeight, setEditSetReps, setEditingSetId, onUpdateSet, onDeleteSet }) {
  if (sets.length === 0) {
      return (
          <div className="text-text-muted text-center py-8">
              No sets logged yet
          </div>
      )
  }

  return sets.map((set, index) => (
      <div
          key={set.id}
          className="flex items-center justify-between py-2 border-b border-border-light"
      >
          <div>
              <div className="text-text-primary font-medium text-sm">{set.exerciseName}</div>
              <div className="text-text-muted text-xs mt-0.5">Set {index + 1}</div>
          </div>

          {editingSetId === set.id ? (
              <div className="flex items-center gap-1.5">
                  <input
                      type="number"
                      value={editSetWeight}
                      onChange={e => setEditSetWeight(e.target.value)}
                      placeholder="kg"
                      className="w-16 bg-bg-input border-half rounded-md px-2 py-1 text-sm text-text-primary outline-none"
                  />
                  <input
                      type="number"
                      value={editSetReps}
                      onChange={e => setEditSetReps(e.target.value)}
                      placeholder="reps"
                      className="w-14 bg-bg-input border-half rounded-md px-2 py-1 text-sm text-text-primary outline-none"
                  />
                  <button
                      onClick={() => onUpdateSet(set)}
                      className="bg-purple text-white border-none rounded-md px-2.5 py-1 text-sm cursor-pointer hover:opacity-90"
                  >
                      ✓
                  </button>
                  <button
                      onClick={() => setEditingSetId(null)}
                      className="bg-transparent border-none text-text-muted cursor-pointer hover:text-text-primary"
                  >
                      ✕
                  </button>
              </div>
          ) : (
              <div className="flex items-center gap-3">
                  <div className="text-teal font-semibold text-sm">{set.weight}kg × {set.reps}</div>
                  <button
                      onClick={() => {
                          setEditingSetId(set.id)
                          setEditSetReps(set.reps)
                          setEditSetWeight(set.weight)
                      }}
                      className="bg-transparent border-none text-text-muted cursor-pointer hover:text-text-primary transition-colors"
                  >
                      ✏
                  </button>
                  <button
                      onClick={() => onDeleteSet(set.id)}
                      className="bg-transparent border-none text-text-muted cursor-pointer hover:text-red transition-colors"
                  >
                      ✕
                  </button>
              </div>
          )}
      </div>
  ))
}