import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

const DEV_USER = { id: 1, username: 'admin', role: 'Administrador', name: 'Administrador' }

export const AuthProvider = ({ children }) => {
  const isDev = import.meta.env.DEV
  const [user, setUser] = useState(isDev ? DEV_USER : null)
  const [isAuthenticated, setIsAuthenticated] = useState(isDev)

  const login = async (credentials) => {
    console.log('[API STUB] POST /auth/login - TODO: Implementar backend', credentials)
    await new Promise(r => setTimeout(r, 300))
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      const userData = DEV_USER
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true, user: userData }
    }
    return { success: false, message: 'Credenciales inválidas (demo: admin/admin)' }
  }

  const logout = async () => {
    console.log('[API STUB] POST /auth/logout - TODO: Implementar backend')
    await new Promise(r => setTimeout(r, 200))
    setUser(null)
    setIsAuthenticated(false)
    return { success: true }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
