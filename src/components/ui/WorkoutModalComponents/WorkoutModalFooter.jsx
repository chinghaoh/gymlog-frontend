export default function WorkoutModalFooter({ editing, addingSet, onSaveEdit, onCancelEdit, onSaveSet, onCancelSet, onAddSet, onEdit, onDelete }) {
    if (editing) {
      return (
        <div style={{ padding: '1rem 1.25rem', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8 }}>
          <button onClick={onSaveEdit} style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 7, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
            Save Changes
          </button>
          <button onClick={onCancelEdit} style={{ background: 'transparent', color: 'var(--text-muted)', border: '0.5px solid var(--border)', borderRadius: 7, padding: '8px 16px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      )
    }
  
    if (addingSet) {
      return (
        <div style={{ padding: '1rem 1.25rem', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8 }}>
          <button onClick={onSaveSet} style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 7, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
            Save Set
          </button>
          <button onClick={onCancelSet} style={{ background: 'transparent', color: 'var(--text-muted)', border: '0.5px solid var(--border)', borderRadius: 7, padding: '8px 16px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      )
    }
  
    return (
      <div style={{ padding: '1rem 1.25rem', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8 }}>
        <button onClick={onAddSet} style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 7, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
          + Add Set
        </button>
        <button onClick={onEdit} style={{ background: 'transparent', color: 'var(--text-muted)', border: '0.5px solid var(--border)', borderRadius: 7, padding: '8px 16px', cursor: 'pointer' }}>
          Edit
        </button>
        <button onClick={onDelete} style={{ background: 'transparent', color: 'var(--red)', border: '0.5px solid var(--red)', borderRadius: 7, padding: '8px 16px', cursor: 'pointer', marginLeft: 'auto' }}>
          Delete
        </button>
      </div>
    )
  }