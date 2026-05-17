import { useEffect, useState, useRef} from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'

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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-page)' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {status === 'verifying' && <div style={{ color: 'var(--text-muted)' }}>Verifying your email...</div>}
        {status === 'success' && (
          <>
            <div style={{ color: 'var(--teal)', fontWeight: 600 }}>✅ Email verified successfully!</div>
            <div style={{ color: 'var(--text-muted)' }}>Redirecting to login...</div>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ color: 'var(--red)', fontWeight: 600 }}>❌ Invalid or expired verification link.</div>
            <button onClick={() => navigate('/login')} style={{ background: 'var(--purple)', border: 'none', borderRadius: 6, padding: '8px 16px', color: 'white', cursor: 'pointer' }}>
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  )
}