// import { useRef } from 'react';
// import { services } from '../../config/services.config';
// import { useHeroRotation } from '../../hooks/useHeroRotation';
// import { HeroContent } from './HeroContent';
// import { HeroVisual } from './HeroVisual';
// import { HeroIndicator } from './HeroIndicator';
// import './Hero.css';

// /**
//  * Hero — sistema rotativo de 5 servicios (sección 4 del brief).
//  * Disparadores de pausa: botón explícito, hover sobre el Hero,
//  * foco por teclado, clic en un punto del indicador.
//  */
// export function Hero({ onOpenModal }) {
//   const sectionRef = useRef(null);
//   const {
//     index, goTo, stickyPause,
//     pauseTemporarily, releaseTemporaryPause, togglePlayPause,
//   } = useHeroRotation(services.length);

//   const service = services[index];

//   return (
//     <section
//       id="inicio"
//       className="hero"
//       ref={sectionRef}
//       style={{ '--service-accent': `var(${service.accentVar})` }}
//       onMouseEnter={pauseTemporarily}
//       onMouseLeave={releaseTemporaryPause}
//       onFocus={pauseTemporarily}
//       onBlur={releaseTemporaryPause}
//     >
//       <div className="container hero__grid">
//         <div>
//           <HeroContent service={service} onOpenModal={onOpenModal} />
//           <HeroIndicator
//             activeIndex={index}
//             service={service}
//             stickyPause={stickyPause}
//             onTogglePlayPause={togglePlayPause}
//             onSelect={(i) => { pauseTemporarily(); goTo(i); }}
//           />
//         </div>
//         <HeroVisual activeIndex={index} />
//       </div>
//     </section>
//   );
// }
import { useRef } from 'react';
import { services } from '../../config/services.config';
import { useHeroRotation } from '../../hooks/useHeroRotation';
import { HeroContent } from './HeroContent';
import { HeroVisual } from './HeroVisual';
import { HeroIndicator } from './HeroIndicator';
import { AmbientAnimation } from './animations/AmbientAnimation';
import './Hero.css';

/**
 * Hero — sistema rotativo de 5 servicios (sección 4 del brief).
 * Disparadores de pausa: botón explícito, hover sobre el Hero,
 * foco por teclado, clic en un punto del indicador.
 */
export function Hero({ onOpenModal }) {
  const sectionRef = useRef(null);
  const {
    index, goTo, stickyPause,
    pauseTemporarily, releaseTemporaryPause, togglePlayPause,
  } = useHeroRotation(services.length);

  const service = services[index];

  return (
    <section
      id="inicio"
      className="hero"
      ref={sectionRef}
      style={{ '--service-accent': `var(${service.accentVar})` }}
      onMouseEnter={pauseTemporarily}
      onMouseLeave={releaseTemporaryPause}
      onFocus={pauseTemporarily}
      onBlur={releaseTemporaryPause}
    >
      {/* Capa ambiental: cubre TODA la sección (texto + visual) y vive
          siempre detrás de .hero__grid — nunca se muestra por encima de
          ningún contenido. key fuerza un remount limpio al cambiar de servicio. */}
      <div className="hero__ambient" aria-hidden="true">
        <AmbientAnimation key={service.anim} anim={service.anim} />
      </div>

      <div className="container hero__grid">
        <div>
          <HeroContent service={service} onOpenModal={onOpenModal} />
          <HeroIndicator
            activeIndex={index}
            service={service}
            stickyPause={stickyPause}
            onTogglePlayPause={togglePlayPause}
            onSelect={(i) => { pauseTemporarily(); goTo(i); }}
          />
        </div>
        <HeroVisual activeIndex={index} />
      </div>
    </section>
  );
}