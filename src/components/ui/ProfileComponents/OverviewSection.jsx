import { useAuth } from '../../context/AuthContext'

export default function OverviewSection() {
  const { user } = useAuth()

  if (!user) return null

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Avatar card */}
      <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'var(--purple-bg)', border: '0.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600, color: 'var(--purple-light)', flexShrink: 0,
          }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
            <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{user.email}</div>
            <span style={{
              background: 'var(--purple-bg)', color: 'var(--purple-light)',
              padding: '2px 7px', borderRadius: 4, fontWeight: 600,
              display: 'inline-block', marginTop: 4,
            }}>{user.role}</span>
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)', marginTop: 12 }}>
          Member since {memberSince}
        </div>
      </div>

    </div>
  )
}