import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../../lib/piClient'

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const token = searchParams.get('token')

    const validate = () => {
        if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return false }
        if (!/[0-9]/.test(newPassword)) { setError('Password must contain at least one digit.'); return false }
        if (!/[A-Z]/.test(newPassword)) { setError('Password must contain at least one uppercase letter.'); return false }
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return false }
        return true
    }

    const handleSubmit = async () => {
        if (!validate()) return

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
        <div className="min-h-screen bg-bg-page flex items-center justify-center">
            <div className="bg-bg-card border border-border rounded-xl p-8 w-full max-w-sm">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-7 h-7 bg-purple rounded-md flex items-center justify-center text-white font-bold text-sm">G</div>
                    <span className="text-text-primary font-semibold">GymLog</span>
                </div>

                <div className="font-semibold text-text-primary mb-1.5">Reset password</div>
                <div className="text-text-muted text-sm mb-6">Enter your new password below.</div>

                <label className="block text-text-muted text-sm mb-1.5">New password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setError('') }}
                    placeholder="Min. 6 characters, 1 digit, 1 uppercase"
                    className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-purple transition-colors mb-3"
                />

                <label className="block text-text-muted text-sm mb-1.5">Confirm password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                    placeholder="Confirm your password"
                    className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-purple transition-colors mb-3"
                />

                {error && (
                    <div className="text-red text-sm mb-3 px-3 py-2 bg-red-bg rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-teal text-sm mb-3 px-3 py-2 bg-teal-bg rounded-lg">
                        {success}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full border-none rounded-lg py-2.5 text-sm font-semibold transition-opacity
                        ${loading ? 'bg-border text-text-muted cursor-not-allowed' : 'bg-purple text-white cursor-pointer hover:opacity-90'}`}
                >
                    {loading ? 'Resetting...' : 'Reset password'}
                </button>
            </div>
        </div>
    )
}