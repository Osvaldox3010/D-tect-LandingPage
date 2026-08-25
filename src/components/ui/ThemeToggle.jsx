import { useTheme } from '../../hooks/useTheme';
import './ThemeToggle.css';

export function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-pressed={isDark}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      <svg className="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 2.5V4.5M12 19.5V21.5M4.5 12H2.5M21.5 12H19.5M5.64 5.64L4.93 4.93M19.07 19.07L18.36 18.36M18.36 5.64L19.07 4.93M4.93 19.07L5.64 18.36"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        />
      </svg>
      <svg className="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z"
          stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}