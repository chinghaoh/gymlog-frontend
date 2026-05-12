import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"

export default function Sidebar() {

  const navigate = useNavigate()
  const {user,setUser} = useAuth()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', color: 'var(--purple)' },
    { to: '/workouts', label: 'Workouts', color: 'var(--teal)' },
    { to: '/exercises', label: 'Exercises', color: 'var(--amber)' },
    { to: '/records', label: 'Records', color: 'var(--blue)' },
    { to: '/stats', label: 'Stats', color: 'var(--text-muted)' },
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
          justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14
        }}>G</div>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15 }}>GymLog</span>
      </div>

      {/* navigation tabs */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {navItems.map(({ to, label, color }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 6, textDecoration: 'none',
            fontSize: 13,
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
              color: 'white', fontSize: 10, fontWeight: 600, flexShrink: 0
            }}>CH</div>
            <div style={{ flex: 1,minWidth:0 }}>
              <div style={{ color: 'var(--text-primary)', fontSize: 11, fontWeight: 500 }}>{user?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{user?.role}</div>
            </div>
            <span
              onClick={(e) => { e.preventDefault(); handleLogout() }}
              style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, flexShrink: 0 }}
            >Logout</span>
          </div>
        </NavLink>
      </div>

    </div>
  )
}