import { useAuth } from '../../context/AuthContext'

export default function OverviewSection() {
  const { user } = useAuth()

  if (!user) return null

  const initials = user.name
      ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : '??'

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
      <div className="flex flex-col gap-3">
          <div className="bg-bg-card border-half rounded-xl px-4 py-3.5">
              <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-full bg-purple-bg border-half flex items-center justify-center font-semibold text-purple-light flex-shrink-0 text-lg">
                      {initials}
                  </div>
                  <div>
                      <div className="font-semibold text-text-primary">{user.name}</div>
                      <div className="text-text-muted text-sm mt-0.5">{user.email}</div>
                      <span className="bg-purple-bg text-purple-light text-xs font-semibold px-2 py-0.5 rounded inline-block mt-1">
                          {user.role}
                      </span>
                  </div>
              </div>
              <div className="text-text-muted text-sm mt-3">
                  Member since {memberSince}
              </div>
          </div>
      </div>
  )
}