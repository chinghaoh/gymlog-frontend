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
    const confirmed = window.confirm('Are you sure you want to delete your account? This cannot be undone.')
    if (!confirmed) return

    try {
      await apiClient(`/api/users/${user.id}`, { method: 'DELETE' })
      setUser(null)
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ background: 'var(--bg-card)', border: '0.5px solid #4a1a1a', borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ fontWeight: 600, color: 'var(--red)', paddingBottom: 10, borderBottom: '0.5px solid #4a1a1a', marginBottom: 12 }}>
        Danger zone
      </div>

      {/* Logout */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '0.5px solid #2a1010', marginBottom: 12 }}>
        <div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Log out</div>
          <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>Sign out of your account on this device</div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'var(--red-bg)', border: '0.5px solid #4a1a1a',
            borderRadius: 6, padding: '7px 14px',
            color: 'var(--red)', cursor: 'pointer', flexShrink: 0,
          }}
        >Log out</button>
      </div>

      {/* Delete account */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Delete account</div>
          <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>Permanently delete your account and all data</div>
        </div>
        <button
          onClick={handleDeleteAccount}
          style={{
            background: 'transparent', border: 'none',
            color: '#4a2020', cursor: 'pointer', flexShrink: 0,
          }}
        >Delete account</button>
      </div>
    </div>
  )
}