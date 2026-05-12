export default function FilterPills({ options, active, onChange }) {
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
        {options.map(option => (
          <button
            key={option}
            onClick={() => onChange(option)}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              border: '0.5px solid var(--border)',
              cursor: 'pointer',
              background: active === option ? 'var(--purple)' : 'transparent',
              color: active === option ? 'white' : 'var(--text-secondary)',
              fontWeight: active === option ? 600 : 400,
            }}
          >
            {option}
          </button>
        ))}
      </div>
    )
  }