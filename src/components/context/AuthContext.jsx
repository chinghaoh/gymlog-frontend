import { createContext, useContext, useState, useEffect } from 'react'
import { apiClient } from '../../lib/ApiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')

    if (userId && token) {
      apiClient(`/api/users/${userId}`)
        .then(data => setUser(data))
        .catch(() => setUser(null))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}