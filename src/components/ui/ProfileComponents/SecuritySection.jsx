import { useState } from 'react'
import { apiClient } from '../../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'

export default function SecuritySection() {
  const { user } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await apiClient(`/api/users/${user.id}/password`, {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message || 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ fontWeight: 600, color: 'var(--text-primary)', paddingBottom: 10, borderBottom: '0.5px solid var(--border)', marginBottom: 12 }}>
        Change password
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Current password</label>
        <input
          className="input-field"
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          style={{ width: '100%', background: 'var(--bg-input)', borderRadius: 6, padding: '8px 10px', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>New password</label>
        <input
          className="input-field"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          style={{ width: '100%', background: 'var(--bg-input)', borderRadius: 6, padding: '8px 10px', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Confirm new password</label>
        <input
          className="input-field"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          style={{ width: '100%', background: 'var(--bg-input)', borderRadius: 6, padding: '8px 10px', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      {error && <div style={{ color: 'var(--red)', marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: 'var(--teal)', marginBottom: 8 }}>Password changed successfully.</div>}

      <button
        onClick={handleChangePassword}
        disabled={loading}
        style={{
          background: loading ? 'var(--border)' : 'var(--purple)',
          border: 'none', borderRadius: 6, padding: '7px 14px',
          fontWeight: 600, color: 'white', cursor: loading ? 'default' : 'pointer',
          marginTop: 4,
        }}
      >{loading ? 'Updating...' : 'Update password'}</button>
    </div>
  )
}