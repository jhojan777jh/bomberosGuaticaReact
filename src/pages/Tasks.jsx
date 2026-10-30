import { useState, useEffect } from 'react'
import API from '../services/api'
import useSEO from '../hooks/useSEO'
import { PageHeader, StatusBadge, EmptyState } from '../components/ui'
import ThiingIcon from '../components/ThiingIcon'

const priorityMap = {
  high: { label: 'Prioridad alta', tone: 'danger' },
  medium: { label: 'Prioridad media', tone: 'warning' },
  low: { label: 'Prioridad baja', tone: 'info' },
}

const statusMap = {
  pending: { label: 'Pendiente', tone: 'neutral' },
  in_progress: { label: 'En curso', tone: 'warning' },
  completed: { label: 'Completada', tone: 'success' },
}

const Tasks = () => {
  const [tasks, setTasks] = useState([])

  useSEO({
    title: 'Gestión de tareas',
    description: 'administración de tareas operativas del Cuerpo de Bomberos de Guática.',
    noindex: true,
  })

  const loadTasks = async () => {
    const res = await API.tasks.get()
    if (res.success) setTasks(res.tasks)
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const newTaskButton = (
    <button
      type="button"
      onClick={() => alert('[TODO] Implementar creación de tareas en backend')}
      className="btn-primary"
    >
      <ThiingIcon name="add" size={20} /> Nueva Tarea
    </button>
  )

  return (
    <div>
      <PageHeader
        icon="tasks"
        title="Gestión de Tareas"
        subtitle="Seguimiento de las actividades operativas y administrativas"
        action={newTaskButton}
      />

      {tasks.length === 0 ? (
        <EmptyState
          icon="tasks"
          title="No hay tareas registradas"
          description="Crea la primera tarea para organizar el trabajo del cuerpo de bomberos."
          action={newTaskButton}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tasks.map((task, index) => {
            const priority = priorityMap[task.priority] ?? priorityMap.medium
            const status = statusMap[task.status] ?? statusMap.pending
            return (
              <article
                key={task.id}
                className="glass glass-hover animate-fade-up flex flex-col p-5"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 ring-1 ring-inset ring-brand-500/20">
                      <ThiingIcon name="tasks" size={24} />
                    </span>
                    <h2 className="font-display text-base font-bold leading-tight text-fg">{task.title}</h2>
                  </div>
                  <StatusBadge tone={priority.tone}>{priority.label}</StatusBadge>
                </div>
                <p className="text-sm text-muted">{task.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  <button
                    type="button"
                    onClick={() => alert('[TODO] Ver detalle de tarea')}
                    className="btn-ghost px-2.5 py-1 text-xs"
                  >
                    Ver detalle
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Tasks
