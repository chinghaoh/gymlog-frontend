import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/ApiClient'

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

        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Reset password</div>
        <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Enter your new password below.
        </div>

        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>New password</label>
        <input
          className="input-field"
          type="password"
          value={newPassword}
          onChange={e => { setNewPassword(e.target.value); setError('') }}
          placeholder="Min. 6 characters"
          style={{
            width: '100%', background: 'var(--bg-input)', borderRadius: 7,
            padding: '9px 12px', color: 'var(--text-primary)', outline: 'none', marginBottom: 12,
          }}
        />

        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 6 }}>Confirm password</label>
        <input
          className="input-field"
          type="password"
          value={confirmPassword}
          onChange={e => { setConfirmPassword(e.target.value); setError('') }}
          placeholder="Confirm your password"
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
          }}
        >{loading ? 'Resetting...' : 'Reset password'}</button>
      </div>
    </div>
  )
}