import { useState, useEffect } from 'react'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'
import useSEO from '../hooks/useSEO'
import { PageHeader, StatusBadge, EmptyState, Modal, Field, Alert } from '../components/ui'
import ThiingIcon from '../components/ThiingIcon'

const priorityMap = {
  high: { label: 'Prioridad alta', tone: 'danger' },
  medium: { label: 'Prioridad media', tone: 'warning' },
  low: { label: 'Prioridad baja', tone: 'info' },
}

const statusMap = {
  pending: { label: 'Pendiente', tone: 'neutral', next: 'in_progress', action: 'Iniciar' },
  in_progress: { label: 'En curso', tone: 'warning', next: 'completed', action: 'Completar' },
  completed: { label: 'Completada', tone: 'success', next: 'pending', action: 'Reabrir' },
}

const emptyForm = { title: '', description: '', priority: 'medium' }

const Tasks = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useSEO({
    title: 'Gestión de tareas',
    description: 'administración de tareas operativas del Cuerpo de Bomberos de Guática.',
    noindex: true,
  })

  const loadTasks = async () => {
    const res = await API.tasks.get()
    if (res.success) {
      setTasks(res.tasks)
      setError('')
    } else {
      setError(res.message)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    const res = await API.tasks.create(form, user.id)
    setSaving(false)
    if (!res.success) {
      setError(res.message)
      return
    }
    setForm(emptyForm)
    setOpen(false)
    loadTasks()
  }

  const handleStatus = async (task) => {
    const next = statusMap[task.status]?.next ?? 'pending'
    const res = await API.tasks.setStatus(task.id, next)
    if (!res.success) setError(res.message)
    else loadTasks()
  }

  const handleDelete = async (task) => {
    if (!window.confirm(`¿Eliminar la tarea "${task.title}"?`)) return
    const res = await API.tasks.remove(task.id)
    if (!res.success) setError(res.message)
    else loadTasks()
  }

  const newTaskButton = (
    <button type="button" onClick={() => setOpen(true)} className="btn-primary">
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

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

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
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
                  <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStatus(task)}
                      className="btn-ghost px-2.5 py-1 text-xs"
                    >
                      {status.action}
                    </button>
                    {user?.roleKey === 'admin' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(task)}
                        className="btn-ghost px-2.5 py-1 text-xs text-brand-600"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva tarea">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Título">
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-glass"
              placeholder="Ej. Revisar inventario"
            />
          </Field>
          <Field label="Descripción">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-glass"
              placeholder="Detalle de la actividad"
            />
          </Field>
          <Field label="Prioridad">
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="input-glass"
            >
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
              {saving ? 'Guardando…' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Tasks
