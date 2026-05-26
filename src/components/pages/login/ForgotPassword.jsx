import { useState } from 'react'
import { apiClient } from '../../../lib/apiClient'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (!email.includes('@')) {
            setError('Please enter a valid email.')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            await apiClient(`/api/auth/forgot-password?email=${email}`, {
                method: 'POST',
                skipRedirect: true,
            })
            setSuccess('Password reset email sent! Check your inbox.')
            setEmail('')
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

                <div className="font-semibold text-text-primary mb-1.5">Forgot password</div>
                <div className="text-text-muted text-sm mb-6">
                    Enter your email and we'll send you a reset link.
                </div>

                <div className="mb-4">
                    <label className="block text-xs text-text-muted mb-2">Email address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError('') }}
                        placeholder="you@example.com"
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
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold border-none mb-3 transition-opacity
                        ${loading
                            ? 'bg-border text-text-muted cursor-not-allowed'
                            : 'bg-purple text-white cursor-pointer hover:opacity-90'
                        }`}
                >
                    {loading ? 'Sending...' : 'Send reset link'}
                </button>

                <div
                    onClick={() => navigate('/login')}
                    className="text-center text-text-muted text-sm cursor-pointer hover:text-text-primary transition-colors"
                >
                    ← Back to login
                </div>

            </div>
        </div>
    )
}