import { useScrollReveal } from '../../hooks/useScrollReveal';
import './ServiceSection.css';

/**
 * Sección editorial reutilizable (Para empresas / Para personas / Para organizaciones).
 * Recibe todo por props para no duplicar markup en App.jsx.
 *
 * @param {object} props
 * @param {'left'|'right'} props.mediaSide  lado de la imagen en escritorio
 * @param {string} props.gradient           degradé CSS de fondo del bloque media
 * @param {string} props.category           eyebrow ("PARA EMPRESAS", etc.)
 * @param {string} props.titleStart         primera parte del título (color navy)
 * @param {string} props.titleAccent        segunda parte del título (color rojo de marca)
 * @param {string} props.desc               párrafo descriptivo
 * @param {string[]} props.bullets          lista de puntos con check verde
 * @param {string} [props.bg]               color de fondo de la sección completa
 */
export function ServiceSection({ mediaSide = 'left', gradient, category, titleStart, titleAccent, desc, bullets, bg }) {
  const mediaRef = useScrollReveal({ threshold: 0.25 });
  const textRef = useScrollReveal({ threshold: 0.25 });

  return (
    <article className="service" style={bg ? { background: bg } : undefined}>
      <div className="container" style={{ padding: 0 }}>
        <div className={`service__inner ${mediaSide === 'right' ? 'service--reverse' : ''}`}>
          <div
            ref={mediaRef}
            className={`service__media reveal-img ${mediaSide === 'right' ? 'reveal-right' : 'reveal-left'}`}
            style={{ background: gradient }}
          />
          <div ref={textRef} className="service__text reveal-up">
            <p className="eyebrow service__category">{category}</p>
            <h3 className="service__title">{titleStart} <span className="accent">{titleAccent}</span></h3>
            <p className="service__desc">{desc}</p>
            <ul className="service__list">
              {bullets.map((b) => (
                <li key={b}>
                  <svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {b}
                </li>
              ))}
            </ul>
            <a href="#contacto" className="service__cta">
              Conocer más
              <svg viewBox="0 0 14 14" fill="none"><path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
