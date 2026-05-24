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
      } finally {
          setUser(null)
          navigate('/login')
      }
  }

  const navItems = [
      { to: '/dashboard', label: 'Dashboard', color: 'bg-purple' },
      { to: '/workouts',  label: 'Workouts',  color: 'bg-teal' },
      { to: '/logs',      label: 'Logs',       color: 'bg-purple-light' },
      { to: '/exercises', label: 'Exercises',  color: 'bg-amber' },
      { to: '/records',   label: 'Records',    color: 'bg-blue' },
      { to: '/ai',        label: 'AI Trainer', color: 'bg-cyan' },
  ]

  const initials = user?.name
      ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : '?'

  return (
      <aside className="w-[180px] bg-bg-card min-h-screen px-3 py-5 flex flex-col flex-shrink-0 border-r border-half">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 px-0.5">
              <div className="w-7 h-7 bg-purple rounded-md flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  G
              </div>
              <span className="text-text-primary font-semibold text-sm">GymLog</span>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-0.5 flex-1">
              {navItems.map(({ to, label, color }) => (
                  <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                          `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm no-underline transition-colors
                          ${isActive
                              ? 'text-text-primary bg-purple-bg'
                              : 'text-text-muted hover:text-text-primary hover:bg-border-light'
                          }`
                      }
                  >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`} />
                      {label}
                  </NavLink>
              ))}
          </nav>

          {/* Profile */}
          <div className="mt-2">
              <NavLink to="/profile" className="no-underline">
                  <div className="flex items-center gap-2 px-2.5 py-2 rounded-md border-half overflow-hidden hover:border-half-purple transition-colors">
                      <div className="w-6 h-6 rounded-full bg-purple flex items-center justify-center text-xs text-white font-semibold flex-shrink-0">
                          {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="text-text-primary font-medium text-xs truncate">{user?.name}</div>
                          <div className="text-text-muted text-xs">{user?.role}</div>
                      </div>
                      <span
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLogout() }}
                          className="text-text-muted text-xs flex-shrink-0 cursor-pointer hover:text-red transition-colors"
                      >
                          Logout
                      </span>
                  </div>
              </NavLink>
          </div>

      </aside>
  )
}