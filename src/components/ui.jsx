import { useEffect } from 'react'
import ThiingIcon from './ThiingIcon'

export const PageHeader = ({ icon, title, subtitle, action, badge = null }) => (
  <div className="mb-6 flex animate-fade-up flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-accent ring-1 ring-inset ring-brand-500/20">
        <ThiingIcon name={icon} size={30} />
      </span>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-fg">{title}</h1>
          {badge && (
            <span className="pill pill-warning text-[10px] font-bold uppercase tracking-wider">{badge}</span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
)

export const StatCard = ({ icon, label, value, hint, delay = 0 }) => (
  <div className="glass glass-hover animate-fade-up p-5" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-start justify-between">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-accent ring-1 ring-inset ring-brand-500/20">
        <ThiingIcon name={icon} size={28} />
      </span>
      {hint && <span className="text-xs font-medium text-subtle">{hint}</span>}
    </div>
    <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-fg">{value}</p>
    <p className="mt-0.5 text-sm text-muted">{label}</p>
  </div>
)

export const StatusBadge = ({ tone = 'neutral', children }) => (
  <span className={`pill pill-${tone}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {children}
  </span>
)

export const EmptyState = ({ icon = 'empty', title, description, action }) => (
  <div className="glass animate-fade-up flex flex-col items-center justify-center px-6 py-14 text-center">
    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/10 text-accent ring-1 ring-inset ring-brand-500/20">
      <ThiingIcon name={icon} size={36} />
    </span>
    <h2 className="mt-4 font-display text-lg font-bold text-fg">{title}</h2>
    {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
)

export const Alert = ({ tone = 'danger', children }) => {
  if (!children) return null
  const tones = {
    danger: 'border-brand-500/30 bg-brand-500/10 text-accent',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600',
  }
  return (
    <div role="alert" className={`rounded-xl border px-3 py-2 text-sm ${tones[tone] ?? tones.danger}`}>
      {children}
    </div>
  )
}

export const Modal = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass relative max-h-[90vh] w-full max-w-lg animate-fade-up overflow-y-auto p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-fg">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="btn-ghost px-2.5 py-2">
            <ThiingIcon name="close" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
    {children}
  </label>
)
