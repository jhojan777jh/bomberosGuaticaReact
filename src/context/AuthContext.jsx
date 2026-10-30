import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = async (credentials) => {
    console.log('[API STUB] POST /auth/login - TODO: Implementar backend', credentials)
    await new Promise(r => setTimeout(r, 300))
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      const userData = { id: 1, username: 'admin', role: 'Administrador', name: 'Administrador' }
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
