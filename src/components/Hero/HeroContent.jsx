import { Eyebrow } from '../ui/Eyebrow';
import { Button } from '../ui/Button';

/**
 * Contenido textual del Hero. El headline y la descripción son FIJOS
 * (sección 4.2 del brief) — nunca cambian con el servicio activo.
 * Solo el eyebrow y el color del CTA cambian por servicio.
 */
export function HeroContent({ service, onOpenModal }) {
  return (
    <div className="hero__content">
      <Eyebrow className="hero__label">{service.eyebrow}</Eyebrow>

      <h1 className="hero__headline">
        <span className="line"><span>La verdad deja huella.</span></span>
        <span className="line"><span className="g">Nosotros</span></span>
        <span className="line"><span className="r">la interpretamos.</span></span>
      </h1>

      <p className="hero__desc">
        Soluciones profesionales en evaluación, investigación y verificación para personas y organizaciones.
      </p>

      <div className="hero__actions">
        <Button style={{ background: `var(${service.accentVar})` }} onClick={() => onOpenModal('info')}>
          Solicitar información
        </Button>
        <Button variant="ghost" onClick={() => onOpenModal('video')}>
          Ver cómo funciona
        </Button>
      </div>
    </div>
  );
}
