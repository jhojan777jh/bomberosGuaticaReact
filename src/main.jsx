import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Training from './pages/Training'
import Donations from './pages/Donations'
import Users from './pages/Users'
import Layout from './components/Layout'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-sm text-muted">Cargando sesión…</p>
      </div>
    )
  }
  return isAuthenticated ? children : <Navigate to="/login" />
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-sm text-muted">Cargando sesión…</p>
      </div>
    )
  }
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Layout><Tasks /></Layout></ProtectedRoute>} />
      <Route path="/training" element={<ProtectedRoute><Layout><Training /></Layout></ProtectedRoute>} />
      <Route path="/donations" element={<ProtectedRoute><Layout><Donations /></Layout></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename={basename}>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
