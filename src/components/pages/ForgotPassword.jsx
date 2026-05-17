import { useState } from 'react'
import { apiClient } from '../../lib/ApiClient'
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
    <div style={{
      minHeight: '100vh', background: 'var(--bg-page)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--bg-card)', border: '0.5px solid var(--border)',
        borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 360,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: '1.5rem' }}>
          <div style={{
            width: 28, height: 28, background: 'var(--purple)',
            borderRadius: 6, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontWeight: 700
          }}>G</div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>GymLog</span>
        </div>

        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Forgot password</div>
        <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Enter your email and we'll send you a reset link.
        </div>

        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Email address</label>
        <input
          className="input-field"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError('') }}
          placeholder="you@example.com"
          style={{
            width: '100%', background: 'var(--bg-input)', borderRadius: 7,
            padding: '9px 12px', color: 'var(--text-primary)', outline: 'none', marginBottom: 12,
          }}
        />

        {error && (
          <div style={{ color: 'var(--red)', marginBottom: 8, padding: '8px 12px', background: 'var(--red-bg)', borderRadius: 6 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ color: 'var(--teal)', marginBottom: 8, padding: '8px 12px', background: 'var(--teal-bg)', borderRadius: 6 }}>
            {success}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', background: loading ? 'var(--border)' : 'var(--purple)',
            border: 'none', borderRadius: 7, padding: '10px',
            fontWeight: 600, color: 'white', cursor: loading ? 'default' : 'pointer',
            marginBottom: 12,
          }}
        >{loading ? 'Sending...' : 'Send reset link'}</button>

        <div
          onClick={() => navigate('/login')}
          style={{ textAlign: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
        >← Back to login</div>
      </div>
    </div>
  )
}