import logoIcon from '../../assets/logo/dtect-icon.webp';

/**
 * Logo compuesto por 3 piezas independientes (sección 1 del brief):
 * ícono (imagen) + "D-TECT" (texto real) + "Truth and Lie" (texto real,
 * con split de color verde/rojo de marca). Reutilizado en Header y Footer.
 */
export function Logo({ dark = false }) {
  return (
    <a href="#inicio" className="logo" aria-label="D-TECT — Inicio">
      <img className="logo__mark" src={logoIcon} alt="" />
      <span>
        <span className="logo__wordmark" style={dark ? { color: '#fff' } : undefined}>D-TECT</span>
        <span className="logo__type">
          <span className="t-truth">Truth</span>
          <span className="t-and"> and </span>
          <span className="t-lie">Lie</span>
        </span>
      </span>
    </a>
  );
}
