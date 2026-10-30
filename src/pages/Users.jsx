import useSEO from '../hooks/useSEO'
import { PageHeader, EmptyState } from '../components/ui'
import ThiingIcon from '../components/ThiingIcon'

const Users = () => {
  useSEO({
    title: 'Usuarios',
    description: 'gestión de usuarios y roles del panel administrativo del Cuerpo de Bomberos de Guática.',
    noindex: true,
  })

  const addButton = (
    <button
      type="button"
      onClick={() => alert('[TODO] Implementar CRUD de usuarios en backend')}
      className="btn-primary"
    >
      <ThiingIcon name="userAdd" size={20} /> Agregar Usuario
    </button>
  )

  return (
    <div>
      <PageHeader
        icon="users"
        title="Usuarios"
        subtitle="Administración de cuentas y roles del personal"
        action={addButton}
      />

      <EmptyState
        icon="users"
        title="Aún no hay usuarios registrados"
        description="La gestión de usuarios estará disponible cuando se conecte el backend. Podrás crear cuentas, asignar roles y controlar accesos."
        action={addButton}
      />

      <div className="glass animate-fade-up mt-5 p-5" style={{ animationDelay: '120ms' }}>
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-fg">
          <ThiingIcon name="shield" size={26} /> Funciones previstas
        </h2>
        <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-muted sm:grid-cols-3">
          <li className="rounded-xl border border-line bg-surface-soft px-3 py-2">Crear y editar usuarios</li>
          <li className="rounded-xl border border-line bg-surface-soft px-3 py-2">Asignar roles y permisos</li>
          <li className="rounded-xl border border-line bg-surface-soft px-3 py-2">Activar o suspender cuentas</li>
        </ul>
      </div>
    </div>
  )
}

export default Users
