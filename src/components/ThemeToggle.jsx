import { useTheme } from '../context/ThemeContext'
import ThiingIcon from './ThiingIcon'

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`btn-ghost px-2.5 py-2 ${className}`}
    >
      <ThiingIcon name={isDark ? 'sun' : 'moon'} size={18} />
    </button>
  )
}

export default ThemeToggle
