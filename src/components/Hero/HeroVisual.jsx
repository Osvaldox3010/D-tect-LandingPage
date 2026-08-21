import { services } from '../../config/services.config';
import { ScreenWaves } from './animations/ScreenWaves';

/**
 * Visual del Hero: los 5 stages con la imagen real de cada servicio.
 * Son PNG recortados (fondo transparente) sin tarjeta/caja detrás, para que
 * floten directo sobre la sección y la capa ambiental se vea a través de
 * ellos. Solo el stage del índice activo es visible; el resto queda
 * montado con opacity:0 para que el fundido sea instantáneo.
 */
export function HeroVisual({ activeIndex }) {
  return (
    <div className="hero__visual">
      <div className="hero__stage-wrap">
        {services.map((svc, i) => (
          <div key={svc.key} className={`hero__stage ${i === activeIndex ? 'is-active' : ''}`}>
            <div className="stage-frame" style={{ '--service-accent': `var(${svc.accentVar})` }}>
              <img src={svc.image} alt={svc.name} loading={i === 0 ? 'eager' : 'lazy'} />
              {svc.key === 'poligrafia' && (
                /* Pantalla del laptop = hueco transparente en el PNG.
                   Tiene su propio fondo para que la línea ambiental de atrás
                   nunca se asome aquí — solo se ven estas 3 ondas propias. */
                <div className="stage-frame__screen" aria-hidden="true">
                  <ScreenWaves />
                </div>
              )}
            </div>
            {/* Fuera de .stage-frame a propósito: .stage-frame cambia de alto
                según la proporción natural de cada imagen, así que si el tag
                colgara de ahí, saltaría de posición al cambiar de servicio.
                Anclado a .hero__stage (tamaño fijo) siempre queda a la misma
                altura, a nivel del indicador de texto. */}
            <span className="stage-frame__tag" style={{ '--service-accent': `var(${svc.accentVar})` }}>{svc.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}