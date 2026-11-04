import { useState, useEffect } from 'react'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'
import useSEO from '../hooks/useSEO'
import { PageHeader, StatCard, StatusBadge, EmptyState, Modal, Field, Alert } from '../components/ui'
import ThiingIcon from '../components/ThiingIcon'

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

const dateFormatter = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' })

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date)
}

const emptyForm = { donor: '', amount: '', note: '', date: new Date().toISOString().slice(0, 10) }

const Donations = () => {
  const { user } = useAuth()
  const [donations, setDonations] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useSEO({
    title: 'Donaciones',
    description: 'registro y gestión de donaciones recibidas por el Cuerpo de Bomberos de Guática.',
    noindex: true,
  })

  const loadDonations = async () => {
    const res = await API.donations.get()
    if (res.success) {
      setDonations(res.donations)
      setError('')
    } else {
      setError(res.message)
    }
  }

  useEffect(() => {
    loadDonations()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    const res = await API.donations.create(form, user.id)
    setSaving(false)
    if (!res.success) {
      setError(res.message)
      return
    }
    setForm(emptyForm)
    setOpen(false)
    loadDonations()
  }

  const handleStatus = async (donation, status) => {
    const res = await API.donations.setStatus(donation.id, status)
    if (!res.success) setError(res.message)
    else loadDonations()
  }

  const handleDelete = async (donation) => {
    if (!window.confirm(`¿Eliminar la donación de "${donation.donor}"?`)) return
    const res = await API.donations.remove(donation.id)
    if (!res.success) setError(res.message)
    else loadDonations()
  }

  const total = donations.reduce((sum, donation) => sum + donation.amount, 0)
  const approved = donations.filter((donation) => donation.status === 'approved')
  const pending = donations.filter((donation) => donation.status === 'pending')
  const approvedAmount = approved.reduce((sum, donation) => sum + donation.amount, 0)

  const newDonationButton = (
    <button type="button" onClick={() => setOpen(true)} className="btn-primary">
      <ThiingIcon name="add" size={20} /> Registrar Donación
    </button>
  )

  return (
    <div>
      <PageHeader
        icon="donations"
        title="Donaciones"
        subtitle="Control de aportes y estado de aprobación"
        action={newDonationButton}
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

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
          action={newDonationButton}
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
                    <td className="px-5 py-4">
                      <p className="font-semibold text-fg">{donation.donor}</p>
                      {donation.note && <p className="text-xs text-muted">{donation.note}</p>}
                    </td>
                    <td className="px-5 py-4 font-medium text-muted">{currency.format(donation.amount)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-muted">{formatDate(donation.date)}</td>
                    <td className="px-5 py-4 text-right">
                      {user?.roleKey === 'admin' ? (
                        <div className="flex items-center justify-end gap-1">
                          {donation.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleStatus(donation, 'approved')}
                              className="btn-ghost px-2.5 py-1.5 text-xs"
                            >
                              Aprobar
                            </button>
                          )}
                          {donation.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleStatus(donation, 'rejected')}
                              className="btn-ghost px-2.5 py-1.5 text-xs"
                            >
                              Rechazar
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(donation)}
                            className="btn-ghost px-2.5 py-1.5 text-xs text-brand-600"
                          >
                            Eliminar
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-subtle">Solo lectura</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Registrar donación">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Donante">
            <input
              type="text"
              required
              value={form.donor}
              onChange={(e) => setForm({ ...form, donor: e.target.value })}
              className="input-glass"
              placeholder="Empresa, persona o Anónimo"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Monto (COP)">
              <input
                type="number"
                min="0"
                step="1"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="input-glass"
                placeholder="500000"
              />
            </Field>
            <Field label="Fecha">
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-glass"
              />
            </Field>
          </div>
          <Field label="Nota (opcional)">
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="input-glass"
              placeholder="Detalle o referencia"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
              {saving ? 'Guardando…' : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Donations
