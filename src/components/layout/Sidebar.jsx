import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { apiClient } from "../../lib/apiClient"

export default function Sidebar() {

  const navigate = useNavigate()
  const { user, setUser } = useAuth()

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

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', color: 'var(--purple)' },
    { to: '/workouts', label: 'Workouts', color: 'var(--teal)' },
    { to: '/exercises', label: 'Exercises', color: 'var(--amber)' },
    { to: '/records', label: 'Records', color: 'var(--blue)' },
  ]

  return (
    <div style={{
      width: 180, background: 'var(--bg-card)', minHeight: '100vh',
      padding: '20px 12px', display: 'flex', flexDirection: 'column'
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <div style={{
          width: 28, height: 28, background: 'var(--purple)',
          borderRadius: 6, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'white', fontWeight: 700
        }}>G</div>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>GymLog</span>
      </div>

      {/* navigation tabs */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {navItems.map(({ to, label, color }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 6, textDecoration: 'none',
            color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
            background: isActive ? 'var(--purple-bg)' : 'transparent',
          })}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* profile */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <NavLink to="/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 6,
            border: '0.5px solid var(--border)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', background: 'var(--purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12,
              color: 'white', fontWeight: 600, flexShrink: 0
            }}>CH</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 12 }}>{user?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{user?.role}</div>
            </div>
            <span
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLogout() }}
              style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0, fontSize: 12 }}
            >Logout</span>
          </div>
        </NavLink>
      </div>

    </div>
  )
}