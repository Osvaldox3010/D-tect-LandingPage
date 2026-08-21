// import { useEffect, useRef } from 'react';
// import { useReducedMotion } from '../../../hooks/useReducedMotion';

// /**
//  * Overlay independiente que simula 3 canales de señal (EDA / cardio / pneumo)
//  * moviéndose sobre la pantalla del laptop, como en el mockup.
//  * No depende ni comparte estado con la animación ambiental (PulseAnimation)
//  * que corre detrás de toda la escena: cada una vive en su propio canvas.
//  */
// const CHANNELS = [
//   { color: '#3B6FD9', freq: 0.05, freq2: 0.13, speed: 1.00, amp: 0.30 },
//   { color: '#2E8B57', freq: 0.04, freq2: 0.11, speed: 0.82, amp: 0.22 },
//   { color: '#C1443A', freq: 0.06, freq2: 0.15, speed: 1.28, amp: 0.34 },
// ];

// export function ScreenWaves() {
//   const canvasRef = useRef(null);
//   const reducedMotion = useReducedMotion();

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     const dpr = Math.min(window.devicePixelRatio || 1, 2);

//     function resize() {
//       const r = canvas.getBoundingClientRect();
//       canvas.width = Math.max(r.width, 20) * dpr;
//       canvas.height = Math.max(r.height, 20) * dpr;
//       ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//     }
//     resize();
//     window.addEventListener('resize', resize);

//     const w = () => canvas.getBoundingClientRect().width;
//     const h = () => canvas.getBoundingClientRect().height;
//     const offsets = CHANNELS.map(() => Math.random() * 1000);

//     function laneY(i, hh) {
//       const pad = hh * 0.16;
//       const usable = hh - pad * 2;
//       return pad + (usable / (CHANNELS.length - 1)) * i;
//     }

//     function drawGrid(ww, hh) {
//       ctx.strokeStyle = 'rgba(59,111,217,0.08)';
//       ctx.lineWidth = 1;
//       const step = Math.max(14, ww / 20);
//       for (let x = 0; x <= ww; x += step) {
//         ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, hh); ctx.stroke();
//       }
//       for (let y = 0; y <= hh; y += step) {
//         ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ww, y); ctx.stroke();
//       }
//     }

//     function drawFrame() {
//       const ww = w(), hh = h();
//       if (!ww || !hh) return;
//       ctx.clearRect(0, 0, ww, hh);
//       drawGrid(ww, hh);
//       const laneH = hh / (CHANNELS.length + 1.4);
//       CHANNELS.forEach((ch, i) => {
//         const baseY = laneY(i, hh);
//         ctx.beginPath();
//         ctx.strokeStyle = ch.color;
//         ctx.lineWidth = 1.6;
//         ctx.globalAlpha = 0.92;
//         for (let x = 0; x <= ww; x += 3) {
//           const n = Math.sin(x * ch.freq + offsets[i]) * ch.amp
//                   + Math.sin(x * ch.freq2 + offsets[i] * 1.7) * ch.amp * 0.35;
//           const y = baseY + n * laneH;
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
//       CHANNELS.forEach((ch, i) => { offsets[i] += dt * 0.0025 * ch.speed; });
//       drawFrame();
//       raf = requestAnimationFrame(frame);
//     }
//     raf = requestAnimationFrame(frame);

//     return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
//   }, [reducedMotion]);

//   return <canvas ref={canvasRef} className="screen-waves-canvas" />;
// }


import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/**
 * Overlay independiente que simula 3 canales de señal (EDA / cardio / pneumo)
 * moviéndose sobre la pantalla del laptop, como en el mockup.
 * No depende ni comparte estado con la animación ambiental (PulseAnimation)
 * que corre detrás de toda la escena: cada una vive en su propio canvas.
 */
const CHANNELS = [
  { color: '#3B6FD9', freq: 0.05, freq2: 0.13, speed: 1.00, amp: 0.30 },
  { color: '#2E8B57', freq: 0.04, freq2: 0.11, speed: 0.82, amp: 0.22 },
  { color: '#C1443A', freq: 0.06, freq2: 0.15, speed: 1.28, amp: 0.34 },
];

export function ScreenWaves() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(r.width, 20) * dpr;
      canvas.height = Math.max(r.height, 20) * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    // getBoundingClientRect() al montar puede medir mal si la imagen del
    // laptop (que ahora define su propio alto) todavía no cargó — un
    // ResizeObserver sí detecta ese cambio de layout, no solo el resize
    // de ventana, y evita el canvas "estirado"/borroso.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const w = () => canvas.getBoundingClientRect().width;
    const h = () => canvas.getBoundingClientRect().height;
    const offsets = CHANNELS.map(() => Math.random() * 1000);

    function laneY(i, hh) {
      const pad = hh * 0.16;
      const usable = hh - pad * 2;
      return pad + (usable / (CHANNELS.length - 1)) * i;
    }

    function drawGrid(ww, hh) {
      ctx.strokeStyle = 'rgba(59,111,217,0.08)';
      ctx.lineWidth = 1;
      const step = Math.max(14, ww / 20);
      for (let x = 0; x <= ww; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, hh); ctx.stroke();
      }
      for (let y = 0; y <= hh; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ww, y); ctx.stroke();
      }
    }

    function drawFrame() {
      const ww = w(), hh = h();
      if (!ww || !hh) return;
      ctx.clearRect(0, 0, ww, hh);
      drawGrid(ww, hh);
      const laneH = hh / (CHANNELS.length + 1.4);
      CHANNELS.forEach((ch, i) => {
        const baseY = laneY(i, hh);
        ctx.beginPath();
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = 0.92;
        for (let x = 0; x <= ww; x += 3) {
          const n = Math.sin(x * ch.freq + offsets[i]) * ch.amp
                  + Math.sin(x * ch.freq2 + offsets[i] * 1.7) * ch.amp * 0.35;
          const y = baseY + n * laneH;
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
      CHANNELS.forEach((ch, i) => { offsets[i] += dt * 0.0025 * ch.speed; });
      drawFrame();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); ro.disconnect(); };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="screen-waves-canvas" />;
}