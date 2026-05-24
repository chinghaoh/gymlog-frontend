import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../../lib/ApiClient'

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const token = searchParams.get('token')

    const handleSubmit = async () => {
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)
        setError('')

        try {
            await apiClient(`/api/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`, {
                method: 'POST',
                skipRedirect: true,
            })
            setSuccess('Password reset successfully! Redirecting to login...')
            setTimeout(() => navigate('/login'), 3000)
        } catch (err) {
            setError(err.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg-page flex items-center justify-center p-8">
            <div className="bg-bg-card border-half rounded-xl p-8 w-full max-w-sm">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-7 h-7 bg-purple rounded-md flex items-center justify-center text-white font-bold text-sm">
                        G
                    </div>
                    <span className="text-text-primary font-semibold text-base">GymLog</span>
                </div>

                <div className="font-semibold text-text-primary mb-1.5">Reset password</div>
                <div className="text-text-muted text-sm mb-6">
                    Enter your new password below.
                </div>

                <div className="mb-4">
                    <label className="block text-xs text-text-muted mb-2">New password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={e => { setNewPassword(e.target.value); setError('') }}
                        placeholder="Min. 6 characters"
                        className="w-full bg-bg-input border-half rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs text-text-muted mb-2">Confirm password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                        placeholder="Confirm your password"
                        className="w-full bg-bg-input border-half rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
                    />
                </div>

                {error && (
                    <div className="text-red text-xs mb-4 px-3 py-2 bg-red-bg rounded-md">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-teal text-xs mb-4 px-3 py-2 bg-teal-bg rounded-md">
                        {success}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold border-none transition-opacity
                        ${loading
                            ? 'bg-border text-text-muted cursor-not-allowed'
                            : 'bg-purple text-white cursor-pointer hover:opacity-90'
                        }`}
                >
                    {loading ? 'Resetting...' : 'Reset password'}
                </button>

            </div>
        </div>
    )
}