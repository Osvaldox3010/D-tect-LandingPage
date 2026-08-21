import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import fingerprintMask from '../../../assets/icons/fingerprint-mask.png';

/**
 * 05 — Antecedentes penales · Escaneo de huella dactilar (sección 4.5).
 *
 * MODIFICADO: esto reemplaza el "anillo VERIFICANDO.../VERIFICADO" que
 * había antes (ver estilos .verify-ring/.verify-status, que ya no se usan,
 * documentados en el historial de Hero.css) por lo que se pidió:
 *  - La huella dactilar (el PNG que subió el usuario) aparece en una
 *    posición aleatoria dentro de la sección.
 *  - Una franja roja neón la escanea de arriba a abajo.
 *  - A medida que la línea avanza, la huella se va "dibujando" en verde
 *    (clip-path sincronizado con la posición de la línea).
 *  - Al terminar, el grupo completo (huella + línea) se desvanece y se
 *    vuelve a lanzar en otra posición aleatoria.
 *
 * El PNG original del usuario no traía canal alfa (fondo negro sólido), así
 * que se generó una copia con alfa = luminosidad del PNG original
 * (fingerprint-mask.png, en src/assets/icons/) para poder usarla como
 * máscara CSS (mask-image) y pintarla del color que haga falta (gris para
 * la base, verde para el "escaneado") sin la caja negra de fondo.
 */

const CYCLE_MS = 4200; // debe coincidir con la duración de las animaciones en Hero.css

function rand(min, max) { return Math.random() * (max - min) + min; }

function buildScanEl(size, left, top) {
  const el = document.createElement('div');
  el.className = 'fp-scan';
  el.style.setProperty('--fp-size', `${size}px`);
  el.style.setProperty('--fp-mask', `url(${fingerprintMask})`);
  el.style.left = `${left}%`;
  el.style.top = `${top}%`;
  el.innerHTML = `
    <div class="fp-scan__base"></div>
    <div class="fp-scan__green"></div>
    <span class="fp-scan__line"></span>
  `;
  return el;
}

export function RingAnimation() {
  const stageRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    if (reducedMotion) {
      // Estático: una sola huella centrada, ya "verificada" (en verde), sin
      // línea de escaneo ni parpadeo.
      const el = buildScanEl(110, 50, 50);
      el.classList.add('is-static');
      stage.appendChild(el);
      return () => { stage.innerHTML = ''; };
    }

    let stopped = false;
    let timeoutId;
    const isMobile = window.innerWidth < 768;

    function spawnScan() {
      if (stopped) return;
      const size = rand(isMobile ? 60 : 74, isMobile ? 96 : 130);
      const left = rand(14, 86);
      const top = rand(16, 82);
      const el = buildScanEl(size, left, top);
      stage.appendChild(el);
      // Un frame después para que el navegador registre el estado inicial
      // (opacity:0) antes de arrancar la animación — si no, a veces el
      // primer ciclo "salta" directo al estado final sin transición.
      requestAnimationFrame(() => el.classList.add('is-running'));

      timeoutId = setTimeout(() => {
        el.remove();
        if (!stopped) timeoutId = setTimeout(spawnScan, rand(300, 900));
      }, CYCLE_MS);
    }

    timeoutId = setTimeout(spawnScan, rand(150, 500));

    return () => {
      stopped = true;
      clearTimeout(timeoutId);
      stage.innerHTML = '';
    };
  }, [reducedMotion]);

  return <div ref={stageRef} className="fp-scan-stage" aria-hidden="true" />;
}