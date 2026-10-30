import { useEffect, useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThiingIcon from './ThiingIcon'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/tasks', label: 'Tareas', icon: 'tasks' },
  { to: '/training', label: 'Capacitaciones', icon: 'training' },
  { to: '/donations', label: 'Donaciones', icon: 'donations' },
  { to: '/users', label: 'Usuarios', icon: 'users' },
]

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const todayLabel = dateFormatter.format(new Date())
const today = todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1)

const Layout = ({ children }) => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const isDev = import.meta.env.DEV

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const userName = user?.name ?? 'Administrador'

  const navContent = (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-6 pt-8 text-center">
        <div className="relative mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-[0_10px_30px_rgba(220,38,38,0.35)]">
          <ThiingIcon name="shield" size={40} className="drop-shadow" />
          <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
        </div>
        <p className="font-display text-sm font-extrabold tracking-[0.28em] text-fg">BOMBEROS</p>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-accent/70">Guática</p>
      </div>

      <nav aria-label="Navegación principal" className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-[0_8px_24px_rgba(220,38,38,0.28)]'
                  : 'text-muted hover:bg-hover hover:text-accent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                    isActive ? 'bg-white/20' : 'bg-brand-500/10 text-accent group-hover:bg-brand-500/15'
                  }`}
                >
                  <ThiingIcon name={icon} size={24} />
                </span>
                {label}
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-line bg-brand-500/5 p-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-fg">{userName}</p>
            <p className="truncate text-xs text-muted">{user?.role ?? 'Invitado'}</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="btn-primary w-full">
          <ThiingIcon name="logout" size={20} /> Cerrar Sesión
        </button>
        <div className="mt-3 text-center text-[10px] uppercase tracking-widest text-subtle">
          Backend pendiente
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative min-h-screen">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>

      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-40 h-[32rem] w-[32rem] animate-pulse-soft rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-brand-700/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 animate-float rounded-full bg-amber-400/15 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 p-4 lg:block">
          <div className="glass h-full overflow-hidden">{navContent}</div>
        </aside>

        <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-line bg-surface-strong px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-white">
              <ThiingIcon name="shield" size={24} />
            </span>
            <span className="font-display text-sm font-extrabold tracking-widest text-fg">BOMBEROS</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Abrir menú de navegación"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="btn-ghost px-2.5 py-2"
            >
              <ThiingIcon name="menu" size={20} />
            </button>
          </div>
        </div>

        <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`}>
          <div
            onClick={() => setOpen(false)}
            aria-hidden="true"
            className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <aside
            aria-label="Menú de navegación"
            className={`absolute left-0 top-0 h-full w-72 max-w-[85%] transform border-r border-line bg-surface-strong backdrop-blur-2xl transition-transform duration-300 ${
              open ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <button
              type="button"
              aria-label="Cerrar menú de navegación"
              onClick={() => setOpen(false)}
              className="btn-ghost absolute right-3 top-3 px-2.5 py-2"
            >
              <ThiingIcon name="close" size={18} />
            </button>
            {navContent}
          </aside>
        </div>

        <main id="contenido" className="min-w-0 flex-1 px-4 pb-10 pt-20 sm:px-6 lg:pt-4">
          <div className="mx-auto max-w-7xl">
            <header className="mb-6 hidden items-center justify-between lg:flex">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/80">
                  Panel de administración
                </p>
                <p className="mt-1 text-sm text-muted">{today}</p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_2px_rgba(16,185,129,0.4)]" />
                  {isDev ? 'Modo desarrollo · sin login' : 'Sesión activa'}
                </div>
              </div>
            </header>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
