import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

const mapUser = (session, profile) => ({
  id: session.user.id,
  email: session.user.email,
  name: profile?.full_name || session.user.email,
  role: profile?.role === 'admin' ? 'Administrador' : 'Operador',
  roleKey: profile?.role ?? 'operador',
  isActive: profile?.is_active ?? true,
})

const readProfile = async (session) => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle()
  return mapUser(session, data)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      if (data.session) {
        const profile = await readProfile(data.session)
        if (!active) return
        setUser(profile)
        setIsAuthenticated(true)
      }
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      if (!session) {
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
      }
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const login = async ({ email, password }) => {
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase no configurado. Crea .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { success: false, message: 'Correo o contraseña incorrectos.' }
    }

    const profile = await readProfile(data.session)
    setUser(profile)
    setIsAuthenticated(true)
    return { success: true, user: profile }
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setIsAuthenticated(false)
    return { success: true }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
