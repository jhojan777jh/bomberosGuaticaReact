import useSEO from '../hooks/useSEO'
import { PageHeader, StatCard, StatusBadge, EmptyState } from '../components/ui'

const donations = [
  { id: 1, donor: 'Empresa XYZ', amount: 500000, status: 'approved', date: '2026-10-28' },
  { id: 2, donor: 'Anónimo', amount: 200000, status: 'pending', date: '2026-10-29' },
]

const statusMap = {
  approved: { label: 'Aprobada', tone: 'success' },
  pending: { label: 'Pendiente', tone: 'warning' },
  rejected: { label: 'Rechazada', tone: 'danger' },
}

const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const Donations = () => {
  useSEO({
    title: 'Donaciones',
    description: 'registro y gestión de donaciones recibidas por el Cuerpo de Bomberos de Guática.',
    noindex: true,
  })

  const total = donations.reduce((sum, donation) => sum + donation.amount, 0)
  const approved = donations.filter((donation) => donation.status === 'approved')
  const pending = donations.filter((donation) => donation.status === 'pending')
  const approvedAmount = approved.reduce((sum, donation) => sum + donation.amount, 0)

  return (
    <div>
      <PageHeader
        icon="donations"
        title="Donaciones"
        subtitle="Control de aportes y estado de aprobación"
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="donations" label="Recaudado total" value={currency.format(total)} delay={0} />
        <StatCard icon="donations" label="Aprobadas" value={approved.length} hint={currency.format(approvedAmount)} delay={80} />
        <StatCard icon="donations" label="Pendientes" value={pending.length} delay={160} />
      </div>

      {donations.length === 0 ? (
        <EmptyState
          icon="donations"
          title="No hay donaciones registradas"
          description="Las donaciones recibidas se listarán aquí con su monto y estado."
        />
      ) : (
        <div className="glass animate-fade-up overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-soft text-[11px] uppercase tracking-wider text-muted">
                <th className="px-5 py-3.5 font-semibold">Donante</th>
                <th className="px-5 py-3.5 font-semibold">Monto</th>
                <th className="px-5 py-3.5 font-semibold">Estado</th>
                <th className="px-5 py-3.5 font-semibold">Fecha</th>
                <th className="px-5 py-3.5 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {donations.map((donation) => {
                const status = statusMap[donation.status] ?? statusMap.pending
                return (
                  <tr key={donation.id} className="transition hover:bg-hover">
                    <td className="px-5 py-4 font-semibold text-fg">{donation.donor}</td>
                    <td className="px-5 py-4 font-medium text-muted">{currency.format(donation.amount)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-muted">{donation.date}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert('[TODO] Aprobar/Rechazar donación')}
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

export default Donations
