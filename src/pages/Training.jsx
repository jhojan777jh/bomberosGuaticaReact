import { useState, useEffect } from 'react'
import API from '../services/api'
import useSEO from '../hooks/useSEO'
import { PageHeader, StatCard, StatusBadge, EmptyState } from '../components/ui'

const availability = (enrolled, capacity) => {
  const pct = capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0
  if (pct >= 100) return { label: 'Completo', tone: 'danger', pct: 100 }
  if (pct >= 80) return { label: 'Casi lleno', tone: 'warning', pct }
  return { label: 'Disponible', tone: 'success', pct }
}

const Training = () => {
  const [trainings, setTrainings] = useState([])

  useSEO({
    title: 'Capacitaciones',
    description: 'programación y control de cupos de las capacitaciones del Cuerpo de Bomberos de Guática.',
    noindex: true,
  })

  const loadTrainings = async () => {
    const res = await API.training.get()
    if (res.success) setTrainings(res.trainings)
  }

  useEffect(() => {
    loadTrainings()
  }, [])

  const totalCapacity = trainings.reduce((sum, tr) => sum + tr.capacity, 0)
  const totalEnrolled = trainings.reduce((sum, tr) => sum + tr.enrolled, 0)

  return (
    <div>
      <PageHeader
        icon="training"
        title="Capacitaciones"
        subtitle="Programación de cursos y control de cupos"
      />

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
        />
      ) : (
        <div className="glass animate-fade-up overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
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
                      <button
                        type="button"
                        onClick={() => alert('[TODO] Gestionar inscripción')}
                        className="btn-ghost px-3 py-1.5 text-xs"
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Training
