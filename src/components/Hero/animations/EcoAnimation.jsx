// /** 04 — Estudio socioeconómico · Marcadores de contexto (sección 4.5). */
// const GLYPHS = ['$', '⌂', '✓', '◈'];

// export function EcoAnimation() {
//   return (
//     <>
//       {GLYPHS.map((g, i) => (
//         <span
//           key={g}
//           className="eco-marker"
//           style={{
//             left: `${14 + i * 22 + Math.random() * 6}%`,
//             animationDuration: `${4 + Math.random() * 2}s`,
//             animationDelay: `${i * 0.6}s`,
//           }}
//         >
//           {g}
//         </span>
//       ))}
//     </>
//   );
// }


import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/**
 * 04 — Estudio socioeconómico · Íconos flotantes (DOM + Web Animations API).
 * Puerto de "Símbolos Socioeconómicos Flotantes": mismos SVG e igual
 * mecánica de spawn/animate/remove, adaptado a un contenedor del tamaño
 * de la sección (no toda la pantalla) — tamaños y desplazamientos más
 * chicos, menos íconos a la vez y spawn más lento para que sea un fondo
 * discreto, y color llevado a --accent-socioeconomico.
 */
const ICON_PATHS = [
  '<path d="M12 7v10M9.5 9.5c0-1.4 1.2-2.2 2.5-2.2s2.5.9 2.5 2.1c0 3-5 1.6-5 4.5 0 1.3 1.2 2.1 2.5 2.1s2.5-.8 2.5-2.1"/><circle cx="12" cy="12" r="9"/>',
  '<rect x="2" y="6" width="20" height="12" rx="1.5"/><circle cx="12" cy="12" r="3"/><path d="M5 9v0M19 15v0"/>',
  '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9.5h14V10"/><path d="M9.5 19.5V14h5v5.5"/>',
  '<path d="M3 9 12 3l9 6"/><path d="M4 9h16v11H4z"/><path d="M8 20v-7M12 20v-7M16 20v-7"/>',
  '<path d="M4 20V10M10 20V4M16 20v-7M22 20h-20"/>',
  '<path d="M3 17l5-6 4 3 8-9"/><path d="M15 5h5v5"/>',
  '<rect x="3" y="8" width="18" height="12" rx="1.5"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  '<path d="M12 3v18M8 21h8"/><path d="M4 7h16"/><path d="M4 7 2 12a2.5 2.5 0 0 0 5 0L4 7Z"/><path d="M20 7l-2 5a2.5 2.5 0 0 0 5 0l-3-5Z"/>',
  '<circle cx="8" cy="7" r="2.3"/><circle cx="16" cy="7" r="2.3"/><path d="M3 19c0-3 2.2-5 5-5s5 2 5 5"/><path d="M11 19c0-3 2.2-5 5-5s5 2 5 5"/>',
  '<path d="M2 9l10-4 10 4-10 4-10-4Z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/>',
];

function rand(min, max) { return Math.random() * (max - min) + min; }

export function EcoAnimation() {
  const stageRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const gold = getComputedStyle(document.documentElement).getPropertyValue('--accent-socioeconomico').trim() || '#B8873B';
    const isMobile = window.innerWidth < 768;

    const timeouts = [];
    const anims = [];
    let stopped = false;

    function svgFor(path) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="${gold}" stroke-width="1.5">${path}</svg>`;
    }

    function createSymbol() {
      if (stopped) return;
      const el = document.createElement('div');
      el.className = 'eco-symbol';
      el.innerHTML = svgFor(ICON_PATHS[Math.floor(Math.random() * ICON_PATHS.length)]);

      const size = rand(16, isMobile ? 26 : 32);
      const startX = rand(4, 92);
      const startY = rand(6, 88);
      const drift = rand(-46, 46);
      const rise = rand(-70, -26);
      const rotStart = rand(0, 360);
      const rotEnd = rotStart + rand(-140, 140);
      const duration = rand(8, 15);

      el.style.left = `${startX}%`;
      el.style.top = `${startY}%`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.opacity = '0';
      stage.appendChild(el);

      const animation = el.animate([
        { transform: `translate(0px, 0px) rotate(${rotStart}deg) scale(0.6)`, opacity: 0 },
        { transform: `translate(${drift * 0.3}px, ${rise * 0.4}px) rotate(${(rotStart + rotEnd) / 2}deg) scale(1)`, opacity: 0.55, offset: 0.35 },
        { transform: `translate(${drift * 0.7}px, ${rise * 0.75}px) rotate(${rotEnd}deg) scale(1)`, opacity: 0.4, offset: 0.7 },
        { transform: `translate(${drift}px, ${rise}px) rotate(${rotEnd + rand(-30, 30)}deg) scale(0.7)`, opacity: 0 },
      ], { duration: duration * 1000, easing: 'ease-in-out', fill: 'forwards' });

      anims.push(animation);
      animation.onfinish = () => {
        el.remove();
        const idx = anims.indexOf(animation);
        if (idx > -1) anims.splice(idx, 1);
      };
    }

    if (reducedMotion) {
      // estático: un puñado de íconos quietos, sin spawn continuo
      const count = isMobile ? 3 : 5;
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'eco-symbol';
        el.innerHTML = svgFor(ICON_PATHS[Math.floor(Math.random() * ICON_PATHS.length)]);
        const size = rand(16, 26);
        el.style.left = `${rand(6, 88)}%`;
        el.style.top = `${rand(8, 82)}%`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.opacity = '0.32';
        stage.appendChild(el);
      }
      return () => { stage.innerHTML = ''; };
    }

    const initialCount = isMobile ? 4 : 7;
    for (let i = 0; i < initialCount; i++) {
      const t = setTimeout(createSymbol, i * 500);
      timeouts.push(t);
    }

    function spawnLoop() {
      if (stopped) return;
      createSymbol();
      const t = setTimeout(spawnLoop, rand(350, 900));
      timeouts.push(t);
    }
    const startTimeout = setTimeout(spawnLoop, rand(250, 900));
    timeouts.push(startTimeout);

    return () => {
      stopped = true;
      timeouts.forEach(clearTimeout);
      anims.forEach((a) => { try { a.cancel(); } catch { /* noop */ } });
      stage.innerHTML = '';
    };
  }, [reducedMotion]);

  return <div ref={stageRef} className="eco-symbols" aria-hidden="true" />;
}