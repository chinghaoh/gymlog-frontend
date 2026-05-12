export default function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
    const from = (currentPage - 1) * itemsPerPage + 1
    const to = Math.min(currentPage * itemsPerPage, totalItems)
  
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '0.5px solid var(--border)' }}>
        <span style={{ color: 'var(--text-muted)' }}>Showing {from}–{to} of {totalItems}</span>
  
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '5px 10px', borderRadius: 6, border: '0.5px solid var(--border)',
              background: 'transparent', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}>‹ Prev</button>
  
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i + 1}
              onClick={() => onPageChange(i + 1)}
              style={{
                padding: '5px 10px', borderRadius: 6, border: '0.5px solid var(--border)',
                background: currentPage === i + 1 ? 'var(--purple)' : 'transparent',
                color: currentPage === i + 1 ? 'white' : 'var(--text-primary)',
                cursor: 'pointer'
              }}>{i + 1}</button>
          ))}
  
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '5px 10px', borderRadius: 6, border: '0.5px solid var(--border)',
              background: 'transparent', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}>Next ›</button>
        </div>
      </div>
    )
  }