import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useSEO from '../hooks/useSEO'
import ThiingIcon from '../components/ThiingIcon'
import ThemeToggle from '../components/ThemeToggle'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useSEO({
    title: 'Iniciar sesión',
    description:
      'Accede al panel administrativo del Cuerpo de Bomberos de Guática para gestionar tareas, capacitaciones, donaciones y usuarios.',
    path: '/login',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(credentials)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-40 h-[34rem] w-[34rem] animate-pulse-soft rounded-full bg-brand-500/25 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[30rem] w-[30rem] animate-float rounded-full bg-brand-700/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
      </div>

      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-6 text-center">
          <div className="relative mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-[0_16px_40px_rgba(220,38,38,0.45)]">
            <ThiingIcon name="shield" size={56} className="drop-shadow-lg" />
            <span className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-fg">
            Cuerpo de Bomberos de Guática
          </h1>
          <p className="mt-1 text-sm text-muted">Panel administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-6 sm:p-8">
          <h2 className="font-display text-lg font-bold text-fg">Iniciar sesión</h2>
          <p className="mb-5 mt-1 text-sm text-muted">Ingresa tus credenciales para continuar.</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-fg">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                className="input-glass"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-fg">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                className="input-glass"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-sm text-accent"
              >
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-70">
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-line bg-surface-soft px-3 py-2 text-center text-xs text-muted">
            <em>Modo visual · Demo: admin / admin · Backend pendiente</em>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
