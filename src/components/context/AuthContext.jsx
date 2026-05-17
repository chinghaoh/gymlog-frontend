import { createContext, useContext, useState, useEffect } from 'react'
import { apiClient } from '../../lib/ApiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const loadUser = () => {
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')

    if (userId && token) {
      apiClient(`/api/users/${userId}`)
        .then(data => setUser(data))
        .catch(() => setUser(null))
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