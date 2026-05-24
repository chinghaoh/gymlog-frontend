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

  const inputClass = "w-full bg-bg-input border-half rounded-md px-2.5 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
  const labelClass = "text-text-muted text-xs uppercase tracking-wider block mb-1.5"

  return (
      <div className="bg-bg-card border-half rounded-xl px-4 py-3.5">
          <div className="font-semibold text-text-primary pb-2.5 mb-3">
              Change password
          </div>

          <div className="mb-2.5">
              <label className={labelClass}>Current password</label>
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={inputClass} />
          </div>

          <div className="mb-2.5">
              <label className={labelClass}>New password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputClass} />
          </div>

          <div className="mb-2.5">
              <label className={labelClass}>Confirm new password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} />
          </div>

          {error && <div className="text-red text-sm mb-2">{error}</div>}
          {success && <div className="text-teal text-sm mb-2">Password changed successfully.</div>}

          <button
              onClick={handleChangePassword}
              disabled={loading}
              className={`mt-1 px-3.5 py-1.5 rounded-md text-sm font-semibold border-none transition-opacity
                  ${loading
                      ? 'bg-border text-text-muted cursor-not-allowed'
                      : 'bg-purple text-white cursor-pointer hover:opacity-90'
                  }`}
          >
              {loading ? 'Updating...' : 'Update password'}
          </button>
      </div>
  )
}