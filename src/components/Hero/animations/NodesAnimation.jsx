import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/**
 * 03 — Psicometría · Puntos que forman una silueta (Canvas2D).
 * Base: el algoritmo de formación (selección de puntos libres más cercanos
 * a cada vértice del perfil, curva de Bézier, sostenimiento y liberación)
 * sigue siendo el mismo — incluye las dos colas al inicio/final de PROFILE
 * para que el contorno se desvanezca en vez de cortarse en seco. Ajustes
 * de esta vuelta:
 *  - el temblor de "asentado" ahora se mueve por tiempo real (no por
 *    fracción de la duración total), así que aunque la reunión sea rápida
 *    se ve como un temblor suave y no como vibración acelerada;
 *  - easing ease-out (en vez de sine simétrico) para una llegada más
 *    natural, tipo "vuela y se posa" en vez de acelerar-frenar parejo;
 *  - los puntos de nariz/boca se encogen conforme se van formando;
 *  - el contorno se dibuja progresivamente (uniendo puntos poco a poco)
 *    en vez de aparecer de golpe, y se desvanece también en sus dos
 *    extremos (la "parte de abajo"/cuello), no solo en las colas sueltas.
 */

const PROFILE = [
  [0.10, 1.06],
  [0.136, 0.964], [0.164, 0.858], [0.155, 0.748], [0.111, 0.630],
  [0.038, 0.532], [0.002, 0.437], [0.000, 0.311], [0.061, 0.177],
  [0.167, 0.073], [0.281, 0.018], [0.413, 0.000], [0.572, 0.002],
  [0.708, 0.047], [0.819, 0.113], [0.867, 0.193], [0.916, 0.349],
  [0.889, 0.394], [0.898, 0.418], [1.000, 0.547], [1.000, 0.575],
  [0.978, 0.595], [0.934, 0.609], [0.923, 0.634], [0.942, 0.654],
  [0.908, 0.687], [0.921, 0.695], [0.925, 0.717], [0.898, 0.748],
  [0.909, 0.820], [0.853, 0.870], [0.705, 0.881], [0.661, 0.914],
  [0.667, 1.000],
  [0.72, 1.08],
];
// zona de nariz/boca dentro del array (para el encogido extra)
const DETAIL_RANGE = [17, 28];

function rand(a, b) { return a + Math.random() * (b - a); }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function smoothstep(t) { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); }

function makeDot(W, H) {
  return {
    x: rand(0, W), y: rand(0, H),
    vx: rand(-0.15, 0.15), vy: rand(-0.15, 0.15),
    r: rand(1, 2.2),
    hue: rand(225, 250),
    state: 'free',
    isDetail: false,
    sx: 0, sy: 0, cx: 0, cy: 0, tx: 0, ty: 0,
    phase_: rand(0, Math.PI * 2),
    wig: rand(6, 12),
    progress: 0,
    baseAlpha: rand(0.45, 0.78),
  };
}

function pointInPolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y;
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function quadBezier(x0, y0, cx, cy, x1, y1, t) {
  const it = 1 - t;
  const x = it * it * x0 + 2 * it * t * cx + t * t * x1;
  const y = it * it * y0 + 2 * it * t * cy + t * t * y1;
  return [x, y];
}

export function NodesAnimation() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = window.innerWidth < 768;
    const NUM_DOTS = isMobile ? 60 : 100;

    let W = 0, H = 0;
    function resize() {
      const r = canvas.getBoundingClientRect();
      W = Math.max(r.width, 40);
      H = Math.max(r.height, 40);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    let dots = [];
    for (let i = 0; i < NUM_DOTS; i++) dots.push(makeDot(W, H));

    let seq = {
      phase: 'idle',
      timer: rand(1400, 3200),
      formIds: [],
      gatherTimer: 0, gatherDuration: 6000,
      holdTimer: 0, holdDuration: 2600,
      releaseTimer: 0, releaseDuration: 1100,
      drawDuration: 1220,
      polygon: null,
    };
    let lastTime = performance.now();

    function pickFormation() {
      const scale = rand(Math.min(W, H) * 0.3, Math.min(W, H) * 0.42);
      const flip = Math.random() < 0.5 ? -1 : 1;
      const originX = rand(scale * 0.55, W - scale * 0.55);
      const originY = rand(scale * 0.55, H - scale * 0.7);

      const targets = PROFILE.map(([px, py]) => {
        const x = (flip === 1 ? px : (1 - px)) * scale + originX - scale / 2;
        const y = py * scale + originY - scale / 2;
        return { x, y };
      });

      const available = dots.map((d, i) => i);
      const chosen = [];
      targets.forEach((t, idx) => {
        if (available.length === 0) return;
        // No se busca el punto libre más cercano en todo el lienzo — eso
        // es lo que hacía que algunos viajaran de un lado a otro. En vez
        // de eso, el punto "nace" ya cerca de su lugar en la silueta y
        // solo recorre un tramo corto hasta el objetivo.
        const pick = Math.floor(Math.random() * available.length);
        const bestIdx = available[pick];
        available.splice(pick, 1);
        chosen.push(bestIdx);
        const d = dots[bestIdx];
        d.state = 'gathering'; d.progress = 0;
        d.isDetail = idx >= DETAIL_RANGE[0] && idx <= DETAIL_RANGE[1];

        const spawnDist = rand(45, 150);
        const spawnAng = rand(0, Math.PI * 2);
        d.sx = t.x + Math.cos(spawnAng) * spawnDist;
        d.sy = t.y + Math.sin(spawnAng) * spawnDist;
        d.tx = t.x; d.ty = t.y;

        const dx = t.x - d.sx, dy = t.y - d.sy;
        const dist2 = Math.max(1, Math.hypot(dx, dy));
        const nx = -dy / dist2, ny = dx / dist2;
        const side = Math.random() < 0.5 ? -1 : 1;
        const bow = dist2 * rand(0.12, 0.32) * side;
        d.cx = (d.sx + t.x) / 2 + nx * bow;
        d.cy = (d.sy + t.y) / 2 + ny * bow;
        d.phase_ = rand(0, Math.PI * 2);
        d.wig = rand(6, 12);
      });
      seq.formIds = chosen;
      seq.polygon = targets.slice(1, targets.length - 1);
      seq.gatherDuration = rand(4800, 7000);
    }

    function update(dt) {
      if (seq.phase === 'idle') {
        seq.timer -= dt;
        if (seq.timer <= 0) {
          pickFormation();
          seq.phase = 'gathering';
          seq.gatherTimer = 0;
        }
      } else if (seq.phase === 'gathering') {
        seq.gatherTimer += dt;
        const raw = Math.min(1, seq.gatherTimer / seq.gatherDuration);
        const e = easeOutCubic(raw);
        // el temblor de "asentado" corre en tiempo real (ms), no en
        // fracción del trayecto — así no se acelera si la duración es corta.
        const tSec = seq.gatherTimer / 1000;
        for (const i of seq.formIds) {
          const d = dots[i];
          let [x, y] = quadBezier(d.sx, d.sy, d.cx, d.cy, d.tx, d.ty, e);
          const damp = Math.max(0, 1 - raw * 1.15); // se apaga un poco antes de llegar
          const wob = Math.sin(tSec * 5.4 + d.phase_) * d.wig * damp;
          x += wob * 0.6;
          y += Math.cos(tSec * 4.1 + d.phase_) * d.wig * damp * 0.6;
          d.x = x; d.y = y;
          d.progress = raw;
        }
        if (raw >= 1) {
          seq.phase = 'hold'; seq.holdTimer = 0;
          for (const i of seq.formIds) { dots[i].state = 'formed'; dots[i].x = dots[i].tx; dots[i].y = dots[i].ty; }
        }
      } else if (seq.phase === 'hold') {
        seq.holdTimer += dt;
        if (seq.holdTimer >= seq.holdDuration) {
          seq.phase = 'releasing'; seq.releaseTimer = 0;
          for (const i of seq.formIds) dots[i].state = 'returning';
        }
      } else if (seq.phase === 'releasing') {
        seq.releaseTimer += dt;
        const p = Math.min(1, seq.releaseTimer / seq.releaseDuration);
        for (const i of seq.formIds) dots[i].progress = 1 - p;
        if (p >= 1) {
          for (const i of seq.formIds) {
            const d = dots[i];
            d.state = 'free'; d.vx = rand(-0.15, 0.15); d.vy = rand(-0.15, 0.15);
          }
          seq.phase = 'idle'; seq.timer = rand(1400, 3200); seq.formIds = [];
        }
      }

      for (const d of dots) {
        if (d.state === 'free') {
          d.x += d.vx * dt * 0.06; d.y += d.vy * dt * 0.06;
          if (d.x < 0) { d.x = 0; d.vx *= -1; } if (d.x > W) { d.x = W; d.vx *= -1; }
          if (d.y < 0) { d.y = 0; d.vy *= -1; } if (d.y > H) { d.y = H; d.vy *= -1; }
          if (Math.random() < 0.003) {
            d.vx = Math.max(-0.25, Math.min(0.25, d.vx + rand(-0.05, 0.05)));
            d.vy = Math.max(-0.25, Math.min(0.25, d.vy + rand(-0.05, 0.05)));
          }
        }
      }
    }

    // dibuja el contorno interpolando el último tramo revelado, para que
    // el "uniendo puntos poco a poco" avance con fluidez y no a saltos.
    function strokePartialPath(pts, revealFrac, alphaFn, baseWidth) {
      const segCount = pts.length - 1;
      if (segCount <= 0) return;
      const exact = revealFrac * segCount;
      const full = Math.floor(exact);
      const partial = exact - full;

      for (let k = 0; k < full; k++) {
        const a = pts[k], b = pts[k + 1];
        const alpha = alphaFn((k + 0.5) / segCount);
        if (alpha <= 0.002) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(75,78,143,${alpha})`;
        ctx.lineWidth = baseWidth;
        ctx.stroke();
      }
      if (full < segCount && partial > 0.001) {
        const a = pts[full], b = pts[full + 1];
        const mx = a.x + (b.x - a.x) * partial;
        const my = a.y + (b.y - a.y) * partial;
        const alpha = alphaFn((full + partial * 0.5) / segCount);
        if (alpha > 0.002) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(75,78,143,${alpha})`;
          ctx.lineWidth = baseWidth;
          ctx.stroke();
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      glow.addColorStop(0, 'rgba(75,78,143,0.05)');
      glow.addColorStop(1, 'rgba(75,78,143,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

      let lineAlpha = 0;
      let revealFrac = 1;
      if (seq.formIds.length > 0 && (seq.phase === 'hold' || seq.phase === 'releasing')) {
        if (seq.phase === 'hold') {
          lineAlpha = Math.min(1, seq.holdTimer / 300);
          revealFrac = smoothstep(seq.holdTimer / seq.drawDuration);
        }
        if (seq.phase === 'releasing') {
          lineAlpha = Math.max(0, 1 - (seq.releaseTimer / seq.releaseDuration) / 0.4);
          revealFrac = 1;
        }
        lineAlpha = Math.max(0, Math.min(1, lineAlpha));
        if (lineAlpha > 0 && revealFrac > 0) {
          ctx.save();
          const ids = seq.formIds;
          const n = ids.length;
          const contourPts = [];
          for (let k = 1; k <= n - 2; k++) contourPts.push(dots[ids[k]]);

          // relleno suave — solo una vez que el trazo va avanzado, para que
          // no aparezca de golpe antes que el contorno
          if (revealFrac > 0.4) {
            const fillAlpha = 0.07 * lineAlpha * smoothstep((revealFrac - 0.4) / 0.6);
            ctx.beginPath();
            contourPts.forEach((d, k) => (k === 0 ? ctx.moveTo(d.x, d.y) : ctx.lineTo(d.x, d.y)));
            ctx.closePath();
            ctx.fillStyle = `rgba(75,78,143,${fillAlpha})`;
            ctx.fill();
          }

          // contorno principal: se dibuja punto a punto (revealFrac) y se
          // desvanece en sus dos extremos (zona del cuello/base), no solo
          // en las colas sueltas — así "la parte de abajo" nunca es un
          // corte recto.
          ctx.shadowColor = 'rgba(75,78,143,0.5)';
          ctx.shadowBlur = 8 * lineAlpha;
          const edgeFade = (posFrac) => {
            const fadeIn = smoothstep(posFrac / 0.14);
            const fadeOut = smoothstep((1 - posFrac) / 0.14);
            return Math.min(fadeIn, fadeOut);
          };
          strokePartialPath(contourPts, revealFrac, (posFrac) => 0.55 * lineAlpha * edgeFade(posFrac), 1.4);
          ctx.shadowBlur = 0;

          // colas sueltas (siguen igual: se activan solo cuando el trazo
          // ya llegó a ese extremo)
          if (revealFrac > 0.97) {
            const dTailBack = dots[ids[0]], dP0 = dots[ids[1]];
            const gradA = ctx.createLinearGradient(dP0.x, dP0.y, dTailBack.x, dTailBack.y);
            gradA.addColorStop(0, `rgba(75,78,143,${0.5 * lineAlpha})`);
            gradA.addColorStop(1, 'rgba(75,78,143,0)');
            ctx.beginPath();
            ctx.moveTo(dP0.x, dP0.y);
            ctx.lineTo(dTailBack.x, dTailBack.y);
            ctx.strokeStyle = gradA;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            const dPLast = dots[ids[n - 2]], dTailFront = dots[ids[n - 1]];
            const gradB = ctx.createLinearGradient(dPLast.x, dPLast.y, dTailFront.x, dTailFront.y);
            gradB.addColorStop(0, `rgba(75,78,143,${0.5 * lineAlpha})`);
            gradB.addColorStop(1, 'rgba(75,78,143,0)');
            ctx.beginPath();
            ctx.moveTo(dPLast.x, dPLast.y);
            ctx.lineTo(dTailFront.x, dTailFront.y);
            ctx.strokeStyle = gradB;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      for (const d of dots) {
        let g = 0;
        if (d.state === 'gathering') g = d.progress * 0.5;
        else if (d.state === 'formed') g = 1;
        else if (d.state === 'returning') g = d.progress;
        let alpha = Math.min(1, d.baseAlpha + g * 0.4);
        if (lineAlpha > 0 && d.state === 'free' && seq.polygon && pointInPolygon(d.x, d.y, seq.polygon)) {
          alpha *= (1 - 0.65 * lineAlpha);
        }
        // nariz/boca: se van encogiendo conforme se completa el junte
        const detailShrink = d.isDetail ? (1 - 0.45 * g) : 1;
        const radius = (d.r + g * 1.4) * detailShrink;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${d.hue}, 62%, ${52 + g * 16}%, ${alpha})`;
        if (g > 0.05) { ctx.shadowColor = `hsla(${d.hue},70%,58%,${g})`; ctx.shadowBlur = 7 * g; }
        else { ctx.shadowBlur = 0; }
        ctx.arc(d.x, d.y, Math.max(0, radius), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    if (reducedMotion) {
      draw();
      return () => window.removeEventListener('resize', resize);
    }

    let raf;
    function loop(now) {
      const dt = Math.min(50, now - lastTime);
      lastTime = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="amb-smoke-canvas" />;
}