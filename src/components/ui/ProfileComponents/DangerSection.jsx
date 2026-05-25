import { useAuth } from '../../context/AuthContext'
import { apiClient } from '../../../lib/apiClient'
import { useNavigate } from 'react-router-dom'

export default function DangerSection() {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await apiClient('/api/auth/logout', { method: 'POST' })
        } catch (err) {
            console.error(err)
        } finally {
            setUser(null)
            navigate('/login')
        }
    }

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return
        try {
            await apiClient(`/api/users/${user.id}`, { method: 'DELETE' })
            setUser(null)
            navigate('/login')
        } catch (err) {
            console.error(err)
        }
    }

    if (user?.isDemo) {
        return (
            <div className="bg-bg-card border border-border rounded-xl px-4 py-8 text-center">
                <div className="text-2xl mb-2">🔒</div>
                <div className="font-semibold text-text-primary mb-1.5">Demo account</div>
                <div className="text-text-muted text-sm">
                    Profile changes are not available in demo mode.
                </div>
            </div>
        )
    }

    return (
        <div className="bg-bg-card rounded-xl px-4 py-3.5" style={{ border: '0.5px solid #4a1a1a' }}>
            <div className="font-semibold text-red pb-2.5 mb-3" style={{ borderBottom: '0.5px solid #4a1a1a' }}>
                Danger zone
            </div>

            {/* Logout */}
            <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: '0.5px solid #2a1010' }}>
                <div>
                    <div className="text-text-primary font-medium text-sm">Log out</div>
                    <div className="text-text-muted text-xs mt-0.5">Sign out of your account on this device</div>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-bg text-red text-sm px-3.5 py-1.5 rounded-md cursor-pointer flex-shrink-0 border-none hover:opacity-90 transition-opacity"
                >
                    Log out
                </button>
            </div>

            {/* Delete account */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-text-primary font-medium text-sm">Delete account</div>
                    <div className="text-text-muted text-xs mt-0.5">Permanently delete your account and all data</div>
                </div>
                <button
                    onClick={handleDeleteAccount}
                    className="text-sm px-3.5 py-1.5 rounded-md cursor-pointer flex-shrink-0 border-none bg-transparent hover:bg-red-bg transition-colors"
                    style={{ color: '#4a2020' }}
                >
                    Delete account
                </button>
            </div>
        </div>
    )
}