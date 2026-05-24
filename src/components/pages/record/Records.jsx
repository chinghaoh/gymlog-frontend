import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'
import ExerciseProgressModal from '../../ui/ExerciseModalComponent/ExerciseProgressModel'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../ui/Pagination'


export default function Records() {
    const { user } = useAuth()
    const navigate = useNavigate()

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
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-text-primary">Personal Records</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-bg-card border-half rounded-lg px-3.5 py-3">
                    <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Total PRs</div>
                    <div className="font-semibold text-text-primary">{totalPRs} 🏆</div>
                </div>
                <div className="bg-bg-card border-half rounded-lg px-3.5 py-3">
                    <div className="text-text-muted text-xs uppercase tracking-wider mb-1">PRs this month</div>
                    <div className="font-semibold text-teal">{prsThisMonth} ↑</div>
                </div>
                <div className="bg-bg-card border-half rounded-lg px-3.5 py-3">
                    <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Latest PR</div>
                    <div className="font-semibold text-text-primary mt-1">
                        {latestPR ? latestPR.exerciseName : '—'}
                    </div>
                    <div className="text-text-muted text-sm">
                        {latestPR ? `${latestPR.weight}kg × ${latestPR.reps}` : ''}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-1.5 flex-wrap mb-4">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => { setCategory(cat); setCurrentPage(1) }}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors border-none
                            ${category === cat
                                ? 'bg-purple-bg text-purple-light border-half-purple'
                                : 'bg-transparent text-text-muted border-half hover:text-text-primary'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-bg-card border-half rounded-xl overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-half">
                            {['', 'Exercise', 'Category', 'Weight', 'Reps', 'Achieved'].map(col => (
                                <th key={col} className="px-4 py-2.5 text-left text-text-muted font-medium text-sm">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-text-muted">
                                    Loading...
                                </td>
                            </tr>
                        ) : paginatedRecords.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center">
                                    <div className="text-2xl mb-2">🏆</div>
                                    <div className="font-semibold text-text-primary mb-1.5">No personal records yet</div>
                                    <div className="text-text-muted text-sm mb-3">
                                        Log a workout to start tracking your PRs.
                                    </div>
                                    <button
                                        onClick={() => navigate('/logs')}
                                        className="bg-purple text-white border-none rounded-lg px-3.5 py-1.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                                    >
                                        Log a Workout
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            paginatedRecords.map((record, index) => (
                                <tr
                                    key={record.id}
                                    onClick={() => setSelectedRecord(record)}
                                    className={`cursor-pointer hover:bg-border-light transition-colors
                                        ${index !== paginatedRecords.length - 1 ? 'border-b border-half' : ''}`}
                                >
                                    <td className="px-4 py-2.5">🏆</td>
                                    <td className="px-4 py-2.5">
                                        <div className="font-semibold text-text-primary text-sm">{record.exerciseName}</div>
                                        <div className="text-text-muted text-xs mt-0.5">{record.category}</div>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded">
                                            {record.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-teal font-semibold text-sm">
                                        {record.weight}kg
                                    </td>
                                    <td className="px-4 py-2.5 text-text-secondary text-sm">
                                        × {record.reps}
                                    </td>
                                    <td className="px-4 py-2.5 text-text-muted text-sm">
                                        {new Date(record.achievedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredRecords.length / itemsPerPage)}
                totalItems={filteredRecords.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

            {selectedRecord && (
                <ExerciseProgressModal
                    record={selectedRecord}
                    onClose={() => setSelectedRecord(null)}
                />
            )}
        </div>
    )
}