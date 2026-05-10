import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
    const {theme, toggleTheme} = useTheme();
  return (
    <button onClick={toggleTheme} className="fixed top-6 right-6 z-50 p-2 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}

export default ThemeToggle