import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import useSEO from '../hooks/useSEO'
import { PageHeader, StatCard, StatusBadge } from '../components/ui'
import ThiingIcon from '../components/ThiingIcon'

const statusMap = {
  pending: { label: 'Pendiente', tone: 'neutral' },
  in_progress: { label: 'En curso', tone: 'warning' },
  completed: { label: 'Completada', tone: 'success' },
}

const Dashboard = () => {
  const [stats, setStats] = useState({ usuarios: 0, capacitaciones: 0, donaciones: 0, tareas: 0 })
  const [tasks, setTasks] = useState([])
  const [trainings, setTrainings] = useState([])

  useSEO({
    title: 'Dashboard',
    description: 'Resumen operativo del Cuerpo de Bomberos de Guática: usuarios, capacitaciones, donaciones y tareas.',
    noindex: true,
  })

  const loadData = async () => {
    const statsRes = await API.content.stats()
    if (statsRes.success) setStats(statsRes.stats)

    const tasksRes = await API.tasks.get()
    if (tasksRes.success) setTasks(tasksRes.tasks)

    const trainingsRes = await API.training.get()
    if (trainingsRes.success) setTrainings(trainingsRes.trainings)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div>
      <PageHeader
        icon="dashboard"
        title="Dashboard"
        subtitle="Resumen operativo del Cuerpo de Bomberos de Guática"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="users" label="Usuarios" value={stats.usuarios} hint="Activos" delay={0} />
        <StatCard icon="training" label="Capacitaciones" value={stats.capacitaciones} hint="Programadas" delay={80} />
        <StatCard icon="donations" label="Donaciones" value={stats.donaciones} hint="Registradas" delay={160} />
        <StatCard icon="tasks" label="Tareas" value={stats.tareas} hint="En gestión" delay={240} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="glass animate-fade-up overflow-hidden" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-fg">
              <ThiingIcon name="tasks" size={26} /> Tareas recientes
            </h2>
            <Link to="/tasks" className="text-xs font-semibold text-accent transition hover:text-accent-strong">
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-line">
            {tasks.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted">Sin tareas registradas.</p>
            ) : (
              tasks.slice(0, 3).map((task) => {
                const status = statusMap[task.status] ?? statusMap.pending
                return (
                  <div key={task.id} className="px-5 py-3.5 transition hover:bg-hover">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-fg">{task.title}</p>
                      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted">{task.description}</p>
                  </div>
                )
              })
            )}
          </div>
        </section>

        <section className="glass animate-fade-up overflow-hidden" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-fg">
              <ThiingIcon name="training" size={26} /> Próximas capacitaciones
            </h2>
            <Link to="/training" className="text-xs font-semibold text-accent transition hover:text-accent-strong">
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-line">
            {trainings.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted">Sin capacitaciones programadas.</p>
            ) : (
              trainings.map((tr) => {
                const pct = tr.capacity > 0 ? Math.min(100, Math.round((tr.enrolled / tr.capacity) * 100)) : 0
                return (
                  <div key={tr.id} className="px-5 py-3.5 transition hover:bg-hover">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-fg">{tr.name}</p>
                      <span className="text-xs font-semibold text-muted">
                        {tr.enrolled}/{tr.capacity}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted">
                      {tr.date} · {tr.time}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-track">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
