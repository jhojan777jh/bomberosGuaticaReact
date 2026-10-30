import ThiingIcon from './ThiingIcon'

export const PageHeader = ({ icon, title, subtitle, action, badge = 'VISUAL' }) => (
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
