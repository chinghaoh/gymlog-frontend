export default function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const to = Math.min(currentPage * itemsPerPage, totalItems)

  const getPages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let prev

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
            range.push(i)
        }
    }

    for (let i of range) {
        if (prev) {
            if (i - prev === 2) {
                rangeWithDots.push(prev + 1)
            } else if (i - prev !== 1) {
                rangeWithDots.push('...')
            }
        }
        rangeWithDots.push(i)
        prev = i
    }

    return rangeWithDots
}

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

              {getPages().map((page, i) => page === '...' ? (
                  <span key={`ellipsis-${i}`} style={{ padding: '5px 8px', color: 'var(--text-muted)' }}>...</span>
              ) : (
                  <button key={page}
                      onClick={() => onPageChange(page)}
                      style={{
                          padding: '5px 10px', borderRadius: 6, border: '0.5px solid var(--border)',
                          background: currentPage === page ? 'var(--purple)' : 'transparent',
                          color: currentPage === page ? 'white' : 'var(--text-primary)',
                          cursor: 'pointer'
                      }}>{page}</button>
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