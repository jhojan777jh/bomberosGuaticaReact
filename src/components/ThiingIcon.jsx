import {
  Speedometer2,
  ListTask,
  Mortarboard,
  Heart,
  People,
  BoxArrowRight,
  ShieldShaded,
  List,
  XLg,
  PlusCircle,
  Inbox,
  PersonPlus,
  Sun,
  MoonStars,
} from 'react-bootstrap-icons'

const pngIcons = import.meta.glob('../assets/thiings/*.png', {
  eager: true,
  import: 'default',
})

const fallbackIcons = {
  dashboard: Speedometer2,
  tasks: ListTask,
  training: Mortarboard,
  donations: Heart,
  users: People,
  logout: BoxArrowRight,
  shield: ShieldShaded,
  menu: List,
  close: XLg,
  add: PlusCircle,
  userAdd: PersonPlus,
  empty: Inbox,
  sun: Sun,
  moon: MoonStars,
}

const findPng = (name) => {
  const entry = Object.entries(pngIcons).find(([path]) => path.endsWith(`/${name}.png`))
  return entry?.[1]
}

const ThiingIcon = ({ name, size = 24, className = '', alt = '' }) => {
  const src = findPng(name)

  if (src) {
    return (
      <img
        src={src}
        width={size}
        height={size}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`object-contain ${className}`}
      />
    )
  }

  const Fallback = fallbackIcons[name] ?? Inbox
  return <Fallback size={size} className={className} aria-hidden={alt ? undefined : 'true'} />
}

export default ThiingIcon
