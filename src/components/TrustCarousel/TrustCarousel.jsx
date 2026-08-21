import { useEffect, useRef, useState } from 'react';
import { services } from '../../config/services.config';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Eyebrow } from '../ui/Eyebrow';
import './TrustCarousel.css';

const DOUBLED = [...services, ...services]; // set duplicado para el loop continuo

export function TrustCarousel() {
  const trackRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const interacting = useRef(false);
  const resumeTimer = useRef(null);
  const reducedMotion = useReducedMotion();

  const pause = () => { interacting.current = true; clearTimeout(resumeTimer.current); };
  const resumeSoon = () => { resumeTimer.current = setTimeout(() => { interacting.current = false; }, 1600); };

  function cardStep() {
    const track = trackRef.current;
    return track ? track.children[0].offsetWidth + 18 : 0;
  }

  function scrollByCards(dir) {
    pause();
    trackRef.current?.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
    resumeSoon();
  }

  function goToIndex(i) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.children[i].offsetLeft - 4, behavior: 'smooth' });
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      let setWidth = 0;
      for (let i = 0; i < services.length; i++) setWidth += track.children[i].offsetWidth + 18;
      if (track.scrollLeft >= setWidth) track.scrollLeft -= setWidth;
      const idx = Math.round((track.scrollLeft % setWidth) / (setWidth / services.length)) % services.length;
      setActiveDot(idx);
    }
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    if (!track) return;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.05 });
    io.observe(track);

    let raf;
    function loop() {
      if (!interacting.current && visible) track.scrollLeft += 0.45;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [reducedMotion]);

  return (
    <section className="applications" id="aplicaciones">
      <div className="container">
        <div className="applications__head">
          <div>
            <Eyebrow style={{ marginBottom: 14 }}>SEÑAL / 02</Eyebrow>
            <h2 className="applications__title">Evaluaciones de control de confianza</h2>
            <p className="applications__desc">
              Las pruebas de control de confianza son un conjunto de evaluaciones —psicológicas, poligráficas,
              toxicológicas, socioeconómicas y de antecedentes penales— implementadas con el objetivo de prevenir
              riesgos internos como robos o filtración de información. Garantizan que el personal de nuevo ingreso
              cumpla con los valores y principios de la organización, así mismo verifican que el personal activo
              actúe dentro del marco organizacional.
            </p>
          </div>
          <div className="applications__controls">
            <button className="carousel-btn" aria-label="Anterior" onClick={() => scrollByCards(-1)}>
              <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button className="carousel-btn" aria-label="Siguiente" onClick={() => scrollByCards(1)}>
              <svg viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div
          className="carousel-track"
          ref={trackRef}
          tabIndex={0}
          aria-label="Evaluaciones — desliza para ver más"
          onMouseEnter={pause}
          onMouseLeave={resumeSoon}
          onTouchStart={pause}
          onTouchEnd={resumeSoon}
        >
          {DOUBLED.map((svc, i) => (
            <div className="app-card" key={`${svc.key}-${i}`} style={{ borderTopColor: `var(${svc.accentVar})` }}>
              <div className="app-card__media">
                <img src={svc.image} alt={svc.name} loading="lazy" />
              </div>
              <div className="app-card__body">
                <span className="app-card__icon" style={{ background: `var(${svc.accentVar})` }}>
                  <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" /></svg>
                </span>
                <span className="app-card__title">{svc.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="carousel-dots">
          {services.map((svc, i) => (
            <button
              key={svc.key}
              aria-label={`Ir a la tarjeta ${i + 1}`}
              className={i === activeDot ? 'is-active' : ''}
              onClick={() => goToIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
