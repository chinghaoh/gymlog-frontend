import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/apiClient'
import { useAuth } from '../context/AuthContext'
import ExerciseProgressModal from '../ui/ExerciseModalComponent/ExerciseProgressModel'

export default function Records() {
    const { user } = useAuth()

    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('All')
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const CATEGORIES = ['All', 'Chest', 'Back', 'Shoulders', 'Upper Arms', 'Upper Legs', 'Lower Arms', 'Lower Legs']

    const filteredRecords = category === 'All'
        ? records
        : records.filter(r => r.category === category)

    const paginatedRecords = filteredRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const totalPRs = records.length

    const now = new Date()
    const prsThisMonth = records.filter(r => {
        const achieved = new Date(r.achievedAt)
        return achieved.getMonth() === now.getMonth() &&
            achieved.getFullYear() === now.getFullYear()
    }).length

    const latestPR = records.length > 0 ? records[0] : null

    useEffect(() => {
        if (!user) return

        const fetchRecords = async () => {
            try {
                const data = await apiClient(`/api/records?userId=${user.id}`)
                setRecords(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchRecords()
    }, [user])

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h1 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Personal Records</h1>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Total PRs</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{totalPRs} 🏆</div>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>PRs this month</div>
                    <div style={{ fontWeight: 600, color: 'var(--teal)' }}>{prsThisMonth} ↑</div>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Latest PR</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                        {latestPR ? latestPR.exerciseName : '—'}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                        {latestPR ? `${latestPR.weight}kg × ${latestPR.reps}` : ''}
                    </div>
                </div>
            </div>

            {/* Filterss */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
                {CATEGORIES.map(cat => (
                    <div
                        key={cat}
                        onClick={() => { setCategory(cat); setCurrentPage(1) }}
                        style={{
                            padding: '4px 12px',
                            borderRadius: 20,
                            border: '0.5px solid',
                            borderColor: category === cat ? 'var(--purple)' : 'var(--border)',
                            background: category === cat ? 'var(--purple-bg)' : 'transparent',
                            color: category === cat ? 'var(--purple-light)' : 'var(--text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        {cat}
                    </div>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
                            {['', 'Exercise', 'Category', 'Weight', 'Reps', 'Achieved'].map(col => (
                                <th key={col} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
                        ) : paginatedRecords.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No personal records yet — start logging sets!</td></tr>
                        ) : (
                            paginatedRecords.map((record, index) => (
                                <tr
                                    key={record.id}
                                    className="clickable"
                                    onClick={() => setSelectedRecord(record)}
                                    style={{ borderBottom: index === paginatedRecords.length - 1 ? 'none' : '0.5px solid var(--border)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--border-light)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '10px 16px' }}>🏆</td>
                                    <td style={{ padding: '10px 16px' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{record.exerciseName}</div>
                                        <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{record.category}</div>
                                    </td>
                                    <td style={{ padding: '10px 16px' }}>
                                        <span style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--purple-bg)', color: 'var(--purple-light)', fontWeight: 600 }}>
                                            {record.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px 16px', color: 'var(--teal)', fontWeight: 600 }}>{record.weight}kg</td>
                                    <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>× {record.reps}</td>
                                    <td style={{ padding: '10px 16px', color: 'var(--text-muted)', }}>
                                        {new Date(record.achievedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                <div style={{ color: 'var(--text-muted)' }}>
                    Showing {filteredRecords.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{
                            background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 6,
                            padding: '4px 10px', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                            cursor: currentPage === 1 ? 'default' : 'pointer'
                        }}
                    >‹ Prev</button>

                    {Array.from({ length: Math.ceil(filteredRecords.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{
                                background: page === currentPage ? 'var(--purple)' : 'var(--bg-card)',
                                border: '0.5px solid', borderColor: page === currentPage ? 'var(--purple)' : 'var(--border)',
                                borderRadius: 6, padding: '4px 10px', fontSize: 11,
                                color: page === currentPage ? 'white' : 'var(--text-primary)',
                                cursor: 'pointer'
                            }}
                        >{page}</button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredRecords.length / itemsPerPage), p + 1))}
                        disabled={currentPage === Math.ceil(filteredRecords.length / itemsPerPage)}
                        style={{
                            background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 6,
                            padding: '4px 10px',
                            color: currentPage === Math.ceil(filteredRecords.length / itemsPerPage) ? 'var(--text-muted)' : 'var(--text-primary)',
                            cursor: currentPage === Math.ceil(filteredRecords.length / itemsPerPage) ? 'default' : 'pointer'
                        }}
                    >Next ›</button>
                </div>
            </div>

            {selectedRecord && (
                <ExerciseProgressModal
                    record={selectedRecord}
                    onClose={() => setSelectedRecord(null)}
                />
            )}
        </div>
    )
}