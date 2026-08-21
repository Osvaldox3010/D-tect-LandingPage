/**
 * Botón de pausa/reproducción — markup obligatorio y accesible
 * por teclado, sección 4.3 del brief.
 */
export function PlayPauseButton({ paused, onToggle }) {
  return (
    <button
      type="button"
      className="hero__playpause"
      aria-pressed={paused}
      aria-label={paused ? 'Reanudar rotación automática de servicios' : 'Pausar rotación automática de servicios'}
      onClick={onToggle}
    >
      {paused ? (
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 1L11 6L2 11V1Z" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="2" y="1" width="2.6" height="10" rx="1" fill="currentColor" />
          <rect x="7.4" y="1" width="2.6" height="10" rx="1" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
