import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'
import ExerciseProgressModal from '../../ui/ExerciseModalComponent/ExerciseProgressModel'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../ui/Pagination'
import RecordCard from './RecordCard'
import RecordTable from './RecordTable'


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
                <div className="bg-bg-card border border-border rounded-lg px-3.5 py-3">
                    <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Total PRs</div>
                    <div className="font-semibold text-text-primary">{totalPRs} 🏆</div>
                </div>
                <div className="bg-bg-card border border-border rounded-lg px-3.5 py-3">
                    <div className="text-text-muted text-xs uppercase tracking-wider mb-1">PRs this month</div>
                    <div className="font-semibold text-teal">{prsThisMonth} ↑</div>
                </div>
                <div className="bg-bg-card border border-border rounded-lg px-3.5 py-3">
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
                                ? 'bg-purple-bg text-purple-light'
                                : 'bg-transparent text-text-muted hover:text-text-primary'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading ? (
                <div className="bg-bg-card border border-border rounded-xl p-8 text-center text-text-muted">
                    Loading...
                </div>
            ) : paginatedRecords.length === 0 ? (
                <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
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
                </div>
            ) : (
                <>
                    {/* Desktop */}
                    <div className="hidden md:block">
                        <RecordTable
                            records={paginatedRecords}
                            onSelect={setSelectedRecord}
                        />
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden">
                        <RecordCard
                            records={paginatedRecords}
                            onSelect={setSelectedRecord}
                        />
                    </div>
                </>
            )}

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