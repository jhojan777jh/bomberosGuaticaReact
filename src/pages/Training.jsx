import { useState, useEffect } from 'react'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'
import useSEO from '../hooks/useSEO'
import { PageHeader, StatCard, StatusBadge, EmptyState, Modal, Field, Alert } from '../components/ui'
import ThiingIcon from '../components/ThiingIcon'

const availability = (enrolled, capacity) => {
  const pct = capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0
  if (pct >= 100) return { label: 'Completo', tone: 'danger', pct: 100 }
  if (pct >= 80) return { label: 'Casi lleno', tone: 'warning', pct }
  return { label: 'Disponible', tone: 'success', pct }
}

const emptyForm = { name: '', date: '', time: '', capacity: 20 }

const Training = () => {
  const { user } = useAuth()
  const [trainings, setTrainings] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useSEO({
    title: 'Capacitaciones',
    description: 'programación y control de cupos de las capacitaciones del Cuerpo de Bomberos de Guática.',
    noindex: true,
  })

  const loadTrainings = async () => {
    const res = await API.training.get(user.id)
    if (res.success) {
      setTrainings(res.trainings)
      setError('')
    } else {
      setError(res.message)
    }
  }

  useEffect(() => {
    loadTrainings()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    const res = await API.training.create(form, user.id)
    setSaving(false)
    if (!res.success) {
      setError(res.message)
      return
    }
    setForm(emptyForm)
    setOpen(false)
    loadTrainings()
  }

  const handleEnrollment = async (training) => {
    if (!training.isEnrolled && training.enrolled >= training.capacity) {
      setError('No hay cupos disponibles para esta capacitación.')
      return
    }
    const res = training.isEnrolled
      ? await API.training.unenroll(training.id, user.id)
      : await API.training.enroll(training.id, user.id)
    if (!res.success) setError(res.message)
    else loadTrainings()
  }

  const handleDelete = async (training) => {
    if (!window.confirm(`¿Eliminar la capacitación "${training.name}"?`)) return
    const res = await API.training.remove(training.id)
    if (!res.success) setError(res.message)
    else loadTrainings()
  }

  const totalCapacity = trainings.reduce((sum, tr) => sum + tr.capacity, 0)
  const totalEnrolled = trainings.reduce((sum, tr) => sum + tr.enrolled, 0)

  const newTrainingButton = user?.roleKey === 'admin' && (
    <button type="button" onClick={() => setOpen(true)} className="btn-primary">
      <ThiingIcon name="add" size={20} /> Nueva Capacitación
    </button>
  )

  return (
    <div>
      <PageHeader
        icon="training"
        title="Capacitaciones"
        subtitle="Programación de cursos y control de cupos"
        action={newTrainingButton}
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="training" label="Capacitaciones" value={trainings.length} delay={0} />
        <StatCard icon="users" label="Cupos totales" value={totalCapacity} delay={80} />
        <StatCard icon="users" label="Inscritos" value={totalEnrolled} delay={160} />
      </div>

      {trainings.length === 0 ? (
        <EmptyState
          icon="training"
          title="No hay capacitaciones programadas"
          description="Cuando se registren cursos aparecerán aquí con su disponibilidad de cupos."
          action={newTrainingButton}
        />
      ) : (
        <div className="glass animate-fade-up overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-soft text-[11px] uppercase tracking-wider text-muted">
                <th className="px-5 py-3.5 font-semibold">Curso</th>
                <th className="px-5 py-3.5 font-semibold">Fecha y hora</th>
                <th className="px-5 py-3.5 font-semibold">Inscritos</th>
                <th className="px-5 py-3.5 font-semibold">Cupos</th>
                <th className="px-5 py-3.5 font-semibold">Estado</th>
                <th className="px-5 py-3.5 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {trainings.map((tr) => {
                const state = availability(tr.enrolled, tr.capacity)
                return (
                  <tr key={tr.id} className="transition hover:bg-hover">
                    <td className="px-5 py-4 font-semibold text-fg">{tr.name}</td>
                    <td className="px-5 py-4 text-muted">
                      {tr.date} · {tr.time}
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {tr.enrolled}/{tr.capacity}
                    </td>
                    <td className="w-48 px-5 py-4">
                      <div className="h-1.5 overflow-hidden rounded-full bg-track">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                          style={{ width: `${state.pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={state.tone}>{state.label}</StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleEnrollment(tr)}
                          disabled={!tr.isEnrolled && tr.enrolled >= tr.capacity}
                          className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-50"
                        >
                          {tr.isEnrolled ? 'Cancelar cupo' : 'Inscribirme'}
                        </button>
                        {user?.roleKey === 'admin' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(tr)}
                            className="btn-ghost px-3 py-1.5 text-xs text-brand-600"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva capacitación">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Nombre del curso">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-glass"
              placeholder="Ej. RCP Básico"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha">
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-glass"
              />
            </Field>
            <Field label="Hora">
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="input-glass"
              />
            </Field>
          </div>
          <Field label="Cupos">
            <input
              type="number"
              min="1"
              required
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="input-glass"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
              {saving ? 'Guardando…' : 'Crear capacitación'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Training
