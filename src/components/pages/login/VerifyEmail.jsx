import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../../lib/apiClient'

export default function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState('verifying')
    const called = useRef(false)

    useEffect(() => {
        if (called.current) return
        called.current = true

        const token = searchParams.get('token')
        if (!token) {
            setStatus('error')
            return
        }

        apiClient(`/api/auth/verify?token=${token}`, { skipRedirect: true })
            .then(() => {
                setStatus('success')
                setTimeout(() => navigate('/login'), 3000)
            })
            .catch(() => setStatus('error'))
    }, [])

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-page">
            <div className="text-center flex flex-col gap-3">
                {status === 'verifying' && (
                    <div className="text-text-muted">Verifying your email...</div>
                )}
                {status === 'success' && (
                    <>
                        <div className="text-teal font-semibold">✅ Email verified successfully!</div>
                        <div className="text-text-muted">Redirecting to login...</div>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="text-red font-semibold">❌ Invalid or expired verification link.</div>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-purple text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                        >
                            Back to login
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}