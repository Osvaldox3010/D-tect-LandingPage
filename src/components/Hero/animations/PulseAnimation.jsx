// // import { useEffect, useRef } from 'react';
// // import { useReducedMotion } from '../../../hooks/useReducedMotion';

// // /* Onda principal (color de acento del servicio) + dos ondas extra, a
// //    distinta altura, tenues — el mismo lenguaje visual de los 3 trazos que
// //    se ven en la pantalla del laptop, pero de fondo, apenas insinuadas. */
// // const EXTRA_CHANNELS = [
// //   { color: '#3B6FD9', yFrac: 0.26, freq: 0.045, freq2: 0.11, speed: 0.85, amp: 0.16, alpha: 0.22, width: 1.4 },
// //   { color: '#2E8B57', yFrac: 0.76, freq: 0.05,  freq2: 0.12, speed: 1.1,  amp: 0.14, alpha: 0.2,  width: 1.4 },
// // ];

// // /** 01 — Poligrafía · Pulse Signal (Canvas2D + requestAnimationFrame, sección 4.5) */
// // export function PulseAnimation() {
// //   const canvasRef = useRef(null);
// //   const reducedMotion = useReducedMotion();

// //   useEffect(() => {
// //     const canvas = canvasRef.current;
// //     if (!canvas) return;
// //     const ctx = canvas.getContext('2d');
// //     const dpr = Math.min(window.devicePixelRatio || 1, 2);
// //     const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-poligrafia').trim();

// //     function resize() {
// //       const r = canvas.getBoundingClientRect();
// //       canvas.width = Math.max(r.width, 40) * dpr;
// //       canvas.height = Math.max(r.height, 40) * dpr;
// //       ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
// //     }
// //     resize();
// //     window.addEventListener('resize', resize);

// //     const w = () => canvas.getBoundingClientRect().width;
// //     const h = () => canvas.getBoundingClientRect().height;
// //     let offset = Math.random() * 1000;
// //     const extraOffsets = EXTRA_CHANNELS.map(() => Math.random() * 1000);
// //     let ampBoost = 1, ampTarget = 1, lastBoost = performance.now();

// //     function drawExtras(ww, hh) {
// //       EXTRA_CHANNELS.forEach((ch, i) => {
// //         ctx.beginPath(); ctx.strokeStyle = ch.color; ctx.lineWidth = ch.width; ctx.globalAlpha = ch.alpha;
// //         for (let x = 0; x <= ww; x += 4) {
// //           const n = Math.sin(x * ch.freq + extraOffsets[i]) * ch.amp
// //                   + Math.sin(x * ch.freq2 + extraOffsets[i] * 1.6) * ch.amp * 0.35;
// //           const y = hh * ch.yFrac + n * hh;
// //           x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
// //         }
// //         ctx.stroke();
// //       });
// //       ctx.globalAlpha = 1;
// //     }

// //     function drawStatic() {
// //       const ww = w(), hh = h();
// //       ctx.clearRect(0, 0, ww, hh);
// //       drawExtras(ww, hh);
// //       ctx.beginPath(); ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.globalAlpha = 0.8;
// //       for (let x = 0; x <= ww; x += 4) {
// //         const n = Math.sin(x * 0.03 + offset) * 0.28;
// //         const y = hh / 2 + n * hh;
// //         x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
// //       }
// //       ctx.stroke(); ctx.globalAlpha = 1;
// //     }

// //     if (reducedMotion) {
// //       drawStatic();
// //       return () => window.removeEventListener('resize', resize);
// //     }

// //     let raf, t0 = performance.now();
// //     function frame(now) {
// //       const dt = now - t0; t0 = now;
// //       if (now - lastBoost > 2000 + Math.random() * 2000) { ampTarget = 0.7 + Math.random() * 0.9; lastBoost = now; }
// //       ampBoost += (ampTarget - ampBoost) * 0.02;
// //       offset += dt * 0.0035;
// //       EXTRA_CHANNELS.forEach((ch, i) => { extraOffsets[i] += dt * 0.0035 * ch.speed; });
// //       const ww = w(), hh = h();
// //       ctx.clearRect(0, 0, ww, hh);
// //       drawExtras(ww, hh);
// //       ctx.beginPath(); ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.globalAlpha = 0.85;
// //       for (let x = 0; x <= ww; x += 3) {
// //         const n = Math.sin(x * 0.035 + offset) * 0.24 * ampBoost + Math.sin(x * 0.09 + offset * 1.6) * 0.08 * ampBoost;
// //         const y = hh / 2 + n * hh;
// //         x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
// //       }
// //       ctx.stroke(); ctx.globalAlpha = 1;
// //       raf = requestAnimationFrame(frame);
// //     }
// //     raf = requestAnimationFrame(frame);

// //     return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
// //   }, [reducedMotion]);

// //   return <canvas ref={canvasRef} className="amb-pulse-canvas" />;
// // }


// import { useEffect, useRef } from 'react';
// import { useReducedMotion } from '../../../hooks/useReducedMotion';

// /* Mismo lenguaje visual que las 3 ondas de la pantalla del poligrafo:
//    3 canales apilados en bandas horizontales (azul arriba, verde al medio,
//    rojo abajo), con poca amplitud — acá de fondo, más discretos. */
// const CHANNELS = [
//   { color: '#3B6FD9', yFrac: 0.22, freq: 0.045, freq2: 0.11, speed: 0.85, amp: 0.045, alpha: 0.42, width: 1.8 },
//   { color: '#2E8B57', yFrac: 0.52, freq: 0.05,  freq2: 0.12, speed: 1.05, amp: 0.04,  alpha: 0.4,  width: 1.8 },
//   { color: '#C1443A', yFrac: 0.80, freq: 0.04,  freq2: 0.10, speed: 0.95, amp: 0.05,  alpha: 0.42, width: 1.8 },
// ];

// /** 01 — Poligrafía · Pulse Signal (Canvas2D + requestAnimationFrame, sección 4.5) */
// export function PulseAnimation() {
//   const canvasRef = useRef(null);
//   const reducedMotion = useReducedMotion();

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     const dpr = Math.min(window.devicePixelRatio || 1, 2);

//     function resize() {
//       const r = canvas.getBoundingClientRect();
//       canvas.width = Math.max(r.width, 40) * dpr;
//       canvas.height = Math.max(r.height, 40) * dpr;
//       ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//     }
//     resize();
//     window.addEventListener('resize', resize);

//     const w = () => canvas.getBoundingClientRect().width;
//     const h = () => canvas.getBoundingClientRect().height;
//     const offsets = CHANNELS.map(() => Math.random() * 1000);

//     function drawFrame() {
//       const ww = w(), hh = h();
//       ctx.clearRect(0, 0, ww, hh);
//       CHANNELS.forEach((ch, i) => {
//         ctx.beginPath(); ctx.strokeStyle = ch.color; ctx.lineWidth = ch.width; ctx.globalAlpha = ch.alpha;
//         for (let x = 0; x <= ww; x += 4) {
//           const n = Math.sin(x * ch.freq + offsets[i]) * ch.amp
//                   + Math.sin(x * ch.freq2 + offsets[i] * 1.6) * ch.amp * 0.35;
//           const y = hh * ch.yFrac + n * hh;
//           x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
//         }
//         ctx.stroke();
//       });
//       ctx.globalAlpha = 1;
//     }

//     if (reducedMotion) {
//       drawFrame();
//       return () => window.removeEventListener('resize', resize);
//     }

//     let raf, t0 = performance.now();
//     function frame(now) {
//       const dt = now - t0; t0 = now;
//       CHANNELS.forEach((ch, i) => { offsets[i] += dt * 0.0035 * ch.speed; });
//       drawFrame();
//       raf = requestAnimationFrame(frame);
//     }
//     raf = requestAnimationFrame(frame);

//     return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
//   }, [reducedMotion]);

//   return <canvas ref={canvasRef} className="amb-pulse-canvas" />;
// }

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/* Mismo lenguaje visual que las 3 ondas de la pantalla del poligrafo:
   3 canales apilados en bandas horizontales (azul arriba, verde al medio,
   rojo abajo), con poca amplitud — acá de fondo, más discretos. */
const CHANNELS = [
  { color: '#3B6FD9', yFrac: 0.22, freq: 0.045, freq2: 0.11, speed: 0.85, amp: 0.045, alpha: 0.42, width: 1.8 },
  { color: '#2E8B57', yFrac: 0.52, freq: 0.05,  freq2: 0.12, speed: 1.05, amp: 0.04,  alpha: 0.4,  width: 1.8 },
  { color: '#C1443A', yFrac: 0.80, freq: 0.04,  freq2: 0.10, speed: 0.95, amp: 0.05,  alpha: 0.42, width: 1.8 },
];

/** 01 — Poligrafía · Pulse Signal (Canvas2D + requestAnimationFrame, sección 4.5) */
export function PulseAnimation() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(r.width, 40) * dpr;
      canvas.height = Math.max(r.height, 40) * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const w = () => canvas.getBoundingClientRect().width;
    const h = () => canvas.getBoundingClientRect().height;
    const offsets = CHANNELS.map(() => Math.random() * 1000);

    function drawFrame() {
      const ww = w(), hh = h();
      ctx.clearRect(0, 0, ww, hh);
      CHANNELS.forEach((ch, i) => {
        ctx.beginPath(); ctx.strokeStyle = ch.color; ctx.lineWidth = ch.width; ctx.globalAlpha = ch.alpha;
        for (let x = 0; x <= ww; x += 4) {
          const n = Math.sin(x * ch.freq + offsets[i]) * ch.amp
                  + Math.sin(x * ch.freq2 + offsets[i] * 1.6) * ch.amp * 0.35;
          const y = hh * ch.yFrac + n * hh;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    }

    if (reducedMotion) {
      drawFrame();
      return () => { window.removeEventListener('resize', resize); ro.disconnect(); };
    }

    let raf, t0 = performance.now();
    function frame(now) {
      const dt = now - t0; t0 = now;
      CHANNELS.forEach((ch, i) => { offsets[i] += dt * 0.0035 * ch.speed; });
      drawFrame();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); ro.disconnect(); };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="amb-pulse-canvas" />;
}