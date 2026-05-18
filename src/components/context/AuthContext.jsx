import { createContext, useContext, useState, useEffect } from 'react'
import { apiClient } from '../../lib/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const loadUser = async () => {
    try {
      const data = await apiClient('/api/auth/me', { skipRedirect: true })
      setUser(data)
    } catch (err) {
      console.error('loadUser failed:', err)
      setUser(null)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loadUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}