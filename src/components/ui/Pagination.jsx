export default function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
    const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
    const to = Math.min(currentPage * itemsPerPage, totalItems)

    const getPages = () => {
        if (totalPages <= 6) {
            // show all if 6 or fewer pages — no need for dots
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        const lastThree = [totalPages - 2, totalPages - 1, totalPages]

        // current window of 3 starting from currentPage - 1 or 1
        const windowStart = Math.max(1, Math.min(currentPage - 1, totalPages - 5))
        const firstThree = [windowStart, windowStart + 1, windowStart + 2]

        // if first and last windows overlap or are adjacent, just show all
        if (windowStart + 2 >= totalPages - 2) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        return [...firstThree, '...', ...lastThree]
    }

    return (
        <div className="flex items-center justify-between mt-4">
            <span className="text-text-muted text-sm">
                Showing {from}–{to} of {totalItems}
            </span>

            <div className="flex gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2.5 py-1 rounded-md border-half text-sm bg-bg-card transition-colors
                        ${currentPage === 1
                            ? 'text-text-muted cursor-not-allowed'
                            : 'text-text-primary cursor-pointer hover:border-half-purple hover:text-purple-light'
                        }`}
                >
                    ‹ Prev
                </button>

                {getPages().map((page, i) => page === '...' ? (
                    <span key={`dots-${i}`} className="px-2 py-1 text-text-muted text-sm">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-2.5 py-1 rounded-md border-half text-sm cursor-pointer transition-colors
                            ${currentPage === page
                                ? 'bg-purple text-white'
                                : 'bg-bg-card text-text-primary hover:border-half-purple hover:text-purple-light'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2.5 py-1 rounded-md border-half text-sm bg-bg-card transition-colors
                        ${currentPage === totalPages
                            ? 'text-text-muted cursor-not-allowed'
                            : 'text-text-primary cursor-pointer hover:border-half-purple hover:text-purple-light'
                        }`}
                >
                    Next ›
                </button>
            </div>
        </div>
    )
}