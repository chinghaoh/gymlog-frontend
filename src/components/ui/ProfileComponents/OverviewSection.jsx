import { useAuth } from '../../context/AuthContext'
import { apiClient } from '../../../lib/apiClient'
import { useState } from 'react'

export default function OverviewSection() {
    const { user } = useAuth()
    const [migrating, setMigrating] = useState(false)
    const [migrationResult, setMigrationResult] = useState(null)

    if (!user) return null

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '??'

    const handleMigrateGifs = async () => {
        if (!window.confirm('Run GIF migration? This will download all GIFs from WorkoutX and upload to S3. Takes a few minutes.')) return
        setMigrating(true)
        setMigrationResult(null)
        try {
            const result = await apiClient('/api/admin/migrate/gifs', { method: 'POST' })
            setMigrationResult(result)
        } catch (err) {
            setMigrationResult(err.message || 'Migration failed')
        } finally {
            setMigrating(false)
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="bg-bg-card border border-border rounded-xl px-4 py-3.5">
                <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-full bg-purple-bg border border-border flex items-center justify-center font-semibold text-purple-light flex-shrink-0 text-lg">
                        {initials}
                    </div>
                    <div>
                        <div className="font-semibold text-text-primary">{user.name}</div>
                        <div className="text-text-muted text-sm mt-0.5">
                            {user.isDemo ? 'Demo Account' : user.email}
                        </div>
                        <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded inline-block mt-1">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Admin tools — only visible to ADMIN */}
            {user.role === 'ADMIN' && (
                <div className="bg-bg-card border border-border rounded-xl px-4 py-3.5">
                    <div className="font-semibold text-text-primary mb-3">Admin Tools</div>
                    <button
                        onClick={handleMigrateGifs}
                        disabled={migrating}
                        className={`px-3.5 py-1.5 rounded-md text-sm font-semibold border-none transition-opacity
                            ${migrating
                                ? 'bg-border text-text-muted cursor-not-allowed'
                                : 'bg-purple text-white cursor-pointer hover:opacity-90'
                            }`}
                    >
                        {migrating ? 'Migrating GIFs...' : '🖼 Migrate GIFs to S3'}
                    </button>
                    {migrationResult && (
                        <div className="text-teal text-sm mt-2">{migrationResult}</div>
                    )}
                </div>
            )}
        </div>
    )
}