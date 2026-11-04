import { useState, useEffect } from 'react'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'
import useSEO from '../hooks/useSEO'
import { PageHeader, StatusBadge, EmptyState, Alert } from '../components/ui'
import ThiingIcon from '../components/ThiingIcon'

const Users = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useSEO({
    title: 'Usuarios',
    description: 'gestión de usuarios y roles del panel administrativo del Cuerpo de Bomberos de Guática.',
    noindex: true,
  })

  const loadUsers = async () => {
    const res = await API.users.get()
    if (res.success) {
      setUsers(res.users)
      setError('')
    } else {
      setError(res.message)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleChange = async (target, patch) => {
    const res = await API.users.update(target.id, patch)
    if (!res.success) setError(res.message)
    else loadUsers()
  }

  return (
    <div>
      <PageHeader
        icon="users"
        title="Usuarios"
        subtitle="Administración de cuentas y roles del personal"
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      {users.length === 0 ? (
        <EmptyState
          icon="users"
          title="Aún no hay usuarios registrados"
          description="Crea usuarios desde Supabase (Authentication > Users). Al registrarse se crea su perfil automáticamente."
        />
      ) : (
        <div className="glass animate-fade-up overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-soft text-[11px] uppercase tracking-wider text-muted">
                <th className="px-5 py-3.5 font-semibold">Usuario</th>
                <th className="px-5 py-3.5 font-semibold">Rol</th>
                <th className="px-5 py-3.5 font-semibold">Estado</th>
                <th className="px-5 py-3.5 font-semibold">Registro</th>
                {user?.roleKey === 'admin' && (
                  <th className="px-5 py-3.5 text-right font-semibold">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((item) => {
                const isSelf = item.id === user?.id
                return (
                  <tr key={item.id} className="transition hover:bg-hover">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-fg">
                            {item.name} {isSelf && <span className="text-xs font-normal text-subtle">(tú)</span>}
                          </p>
                          <p className="truncate text-xs text-muted">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={item.role === 'admin' ? 'danger' : 'info'}>
                        {item.role === 'admin' ? 'Administrador' : 'Operador'}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={item.isActive ? 'success' : 'neutral'}>
                        {item.isActive ? 'Activo' : 'Suspendido'}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {new Date(item.createdAt).toLocaleDateString('es-CO')}
                    </td>
                    {user?.roleKey === 'admin' && (
                      <td className="px-5 py-4 text-right">
                        {isSelf ? (
                          <span className="text-xs text-subtle">Cuenta propia</span>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleChange(item, { role: item.role === 'admin' ? 'operador' : 'admin' })
                              }
                              className="btn-ghost px-2.5 py-1.5 text-xs"
                            >
                              {item.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleChange(item, { isActive: !item.isActive })}
                              className="btn-ghost px-2.5 py-1.5 text-xs"
                            >
                              {item.isActive ? 'Suspender' : 'Activar'}
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="glass animate-fade-up mt-5 p-5" style={{ animationDelay: '120ms' }}>
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-fg">
          <ThiingIcon name="shield" size={26} /> Crear nuevos usuarios
        </h2>
        <p className="mt-2 text-sm text-muted">
          Por seguridad, las cuentas se crean desde el panel de Supabase en{' '}
          <strong className="text-fg">Authentication → Users → Add user</strong>. El perfil se genera
          automáticamente. Luego asígnale rol desde esta tabla.
        </p>
      </div>
    </div>
  )
}

export default Users
