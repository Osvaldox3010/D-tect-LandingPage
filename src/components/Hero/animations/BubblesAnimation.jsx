// import { useEffect, useRef } from 'react';
// import { useReducedMotion } from '../../../hooks/useReducedMotion';

// /**
//  * 02 — Toxicología · Humo + burbujas (Canvas2D).
//  * Puerto de la lógica de "Humo y Burbujas" (blobs con pseudo-ruido para el
//  * humo, burbujas que suben y a veces explotan) adaptado a:
//  *  - un contenedor del tamaño de la sección, no de toda la pantalla,
//  *  - fondo claro (mix-blend-mode:screen se cambia por 'multiply', que es
//  *    el que funciona para aclarar/oscurecer sobre blanco en vez de negro),
//  *  - la paleta de la marca (teal de --accent-toxicologia) en vez de verde,
//  *  - menos densidad y alfa más bajo para que sea un fondo sutil, no el
//  *    protagonista.
//  */

// function rand(min, max) { return Math.random() * (max - min) + min; }

// function noise2(x, y, t) {
//   return (
//     Math.sin(x * 0.9 + t * 1.3) * 0.5 +
//     Math.sin(y * 1.3 - t * 0.8) * 0.3 +
//     Math.sin((x + y) * 0.5 + t * 0.5) * 0.2
//   );
// }

// class Blob {
//   constructor(parent, offX, offY, rBase) {
//     this.parent = parent;
//     this.offX = offX;
//     this.offY = offY;
//     this.rBase = rBase;
//     this.seed = rand(0, 1000);
//   }
//   getPos(t) {
//     const p = this.parent;
//     const nx = noise2(this.seed, p.seed, t * 0.15) * p.turbulence;
//     const ny = noise2(p.seed, this.seed, t * 0.12) * p.turbulence * 0.6;
//     return { x: p.x + this.offX + nx, y: p.y + this.offY + ny };
//   }
// }

// class SmokePlume {
//   constructor(W, H) { this.W = W; this.H = H; this.reset(true); }
//   reset(initial) {
//     const { W, H } = this;
//     this.x = rand(0, W);
//     this.y = initial ? rand(H * 0.2, H * 1.1) : H + rand(40, 110);
//     this.seed = rand(0, 1000);
//     this.vy = rand(-0.16, -0.06);
//     this.vx = rand(-0.05, 0.05);
//     this.turbulence = rand(10, 24);
//     this.hue = rand(165, 188); // teal — accent-toxicologia
//     this.sat = rand(35, 58);
//     this.baseAlpha = rand(0.045, 0.1);
//     this.life = 0;
//     this.maxLife = rand(1800, 3400);
//     this.maxR = rand(H * 0.16, H * 0.34);

//     this.blobs = [];
//     const n = Math.floor(rand(4, 7));
//     for (let i = 0; i < n; i++) {
//       const ang = (Math.PI * 2 * i) / n + rand(-0.3, 0.3);
//       const dist = rand(0.15, 0.85) * this.maxR;
//       const bx = Math.cos(ang) * dist;
//       const by = Math.sin(ang) * dist * 0.7;
//       const br = rand(0.35, 0.75) * this.maxR;
//       this.blobs.push(new Blob(this, bx, by, br));
//     }
//   }
//   update() {
//     this.life++;
//     this.x += this.vx;
//     this.y += this.vy;
//     if (this.life > this.maxLife || this.y < -this.maxR) this.reset(false);
//   }
//   draw(ctx) {
//     const t = this.life / this.maxLife;
//     const growth = Math.min(1, this.life / (this.maxLife * 0.25));
//     const shrink = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
//     const sizeMul = growth * shrink;
//     const fade = Math.sin(Math.PI * Math.min(t, 1));
//     const alpha = this.baseAlpha * fade;
//     if (alpha <= 0.001 || sizeMul <= 0.001) return;

//     const timeSec = this.life / 60;
//     for (const b of this.blobs) {
//       const pos = b.getPos(timeSec);
//       const r = b.rBase * sizeMul;
//       const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, Math.max(1, r));
//       const l1 = 42 + Math.sin(b.seed) * 8;
//       grad.addColorStop(0, `hsla(${this.hue}, ${this.sat}%, ${l1 + 12}%, ${alpha})`);
//       grad.addColorStop(0.45, `hsla(${this.hue}, ${this.sat}%, ${l1}%, ${alpha * 0.55})`);
//       grad.addColorStop(1, `hsla(${this.hue}, ${this.sat}%, ${l1 - 10}%, 0)`);
//       ctx.fillStyle = grad;
//       ctx.beginPath();
//       ctx.arc(pos.x, pos.y, Math.max(0, r), 0, Math.PI * 2);
//       ctx.fill();
//     }
//   }
// }

// class Bubble {
//   constructor(W, H) { this.W = W; this.H = H; this.reset(); this.y = rand(0, H); }
//   reset() {
//     const { W, H } = this;
//     this.x = rand(0, W);
//     this.y = H + rand(6, 40);
//     this.r = rand(2.5, 8);
//     this.speed = rand(0.3, 1.1) * (1 + (10 - this.r) / 22);
//     this.drift = rand(-0.25, 0.25);
//     this.wobblePhase = rand(0, Math.PI * 2);
//     this.wobbleAmp = rand(3, 10);
//     this.wobbleFreq = rand(0.01, 0.03);
//     this.hue = rand(168, 190);
//     this.alpha = rand(0.16, 0.34);
//     this.popChance = rand(0.0006, 0.0022);
//     this.state = 'rising';
//     this.popFrame = 0;
//     this.popDuration = rand(8, 16);
//   }
//   update() {
//     if (this.state === 'rising') {
//       this.y -= this.speed;
//       this.wobblePhase += this.wobbleFreq;
//       this.x += this.drift + Math.sin(this.wobblePhase) * 0.3;
//       if (this.y < this.H - 30 && Math.random() < this.popChance) this.state = 'popping';
//       if (this.y < -this.r) this.state = 'popping';
//     } else if (this.state === 'popping') {
//       this.popFrame++;
//       if (this.popFrame > this.popDuration) this.state = 'dead';
//     } else if (this.state === 'dead') {
//       this.reset();
//     }
//   }
//   draw(ctx) {
//     if (this.state === 'rising') {
//       ctx.save();
//       ctx.globalAlpha = this.alpha;
//       const grad = ctx.createRadialGradient(
//         this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.1,
//         this.x, this.y, Math.max(1, this.r)
//       );
//       grad.addColorStop(0, `hsla(${this.hue}, 55%, 46%, 0.85)`);
//       grad.addColorStop(0.6, `hsla(${this.hue}, 55%, 38%, 0.3)`);
//       grad.addColorStop(1, `hsla(${this.hue}, 55%, 32%, 0.06)`);
//       ctx.fillStyle = grad;
//       ctx.beginPath();
//       ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
//       ctx.fill();
//       ctx.lineWidth = 1;
//       ctx.strokeStyle = `hsla(${this.hue}, 55%, 34%, 0.4)`;
//       ctx.stroke();
//       ctx.restore();
//     } else if (this.state === 'popping') {
//       const t = this.popFrame / this.popDuration;
//       const expand = this.r * (1 + t * 1.8);
//       const alpha = this.alpha * (1 - t);
//       ctx.save();
//       ctx.globalAlpha = alpha;
//       const particles = 5;
//       for (let i = 0; i < particles; i++) {
//         const ang = (Math.PI * 2 / particles) * i;
//         const dist = expand * 0.9;
//         const px = this.x + Math.cos(ang) * dist;
//         const py = this.y + Math.sin(ang) * dist;
//         ctx.beginPath();
//         ctx.arc(px, py, Math.max(0.5, this.r * 0.15 * (1 - t)), 0, Math.PI * 2);
//         ctx.fillStyle = `hsla(${this.hue}, 55%, 36%, ${alpha})`;
//         ctx.fill();
//       }
//       ctx.restore();
//     }
//   }
// }

// export function BubblesAnimation() {
//   const smokeRef = useRef(null);
//   const bubbleRef = useRef(null);
//   const reducedMotion = useReducedMotion();

//   useEffect(() => {
//     const smokeCanvas = smokeRef.current;
//     const bubbleCanvas = bubbleRef.current;
//     if (!smokeCanvas || !bubbleCanvas) return;
//     const sctx = smokeCanvas.getContext('2d');
//     const bctx = bubbleCanvas.getContext('2d');
//     const dpr = Math.min(window.devicePixelRatio || 1, 2);
//     const isMobile = window.innerWidth < 768;

//     let W = 0, H = 0;
//     function resize() {
//       const r = smokeCanvas.getBoundingClientRect();
//       W = Math.max(r.width, 40);
//       H = Math.max(r.height, 40);
//       [smokeCanvas, bubbleCanvas].forEach((c) => {
//         c.width = W * dpr;
//         c.height = H * dpr;
//       });
//       sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//       bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//     }
//     resize();
//     window.addEventListener('resize', resize);

//     const plumeCount = isMobile ? 4 : 7;
//     const bubbleCount = isMobile ? 6 : 10;
//     let plumes = Array.from({ length: plumeCount }, () => new SmokePlume(W, H));
//     let bubbles = Array.from({ length: bubbleCount }, () => new Bubble(W, H));

//     function drawStatic() {
//       sctx.clearRect(0, 0, W, H);
//       bctx.clearRect(0, 0, W, H);
//       plumes.forEach((p) => p.draw(sctx));
//       bubbles.forEach((b) => b.draw(bctx));
//     }

//     if (reducedMotion) {
//       drawStatic();
//       return () => window.removeEventListener('resize', resize);
//     }

//     let raf;
//     function loop() {
//       sctx.clearRect(0, 0, W, H);
//       sctx.globalCompositeOperation = 'lighter';
//       for (const p of plumes) { p.W = W; p.H = H; p.update(); p.draw(sctx); }
//       sctx.globalCompositeOperation = 'source-over';

//       bctx.clearRect(0, 0, W, H);
//       for (const b of bubbles) { b.W = W; b.H = H; b.update(); b.draw(bctx); }

//       raf = requestAnimationFrame(loop);
//     }
//     raf = requestAnimationFrame(loop);

//     let resizeTimeout;
//     const onResize = () => {
//       clearTimeout(resizeTimeout);
//       resizeTimeout = setTimeout(() => {
//         plumes = Array.from({ length: plumeCount }, () => new SmokePlume(W, H));
//         bubbles = Array.from({ length: bubbleCount }, () => new Bubble(W, H));
//       }, 300);
//     };
//     window.addEventListener('resize', onResize);

//     return () => {
//       cancelAnimationFrame(raf);
//       clearTimeout(resizeTimeout);
//       window.removeEventListener('resize', resize);
//       window.removeEventListener('resize', onResize);
//     };
//   }, [reducedMotion]);

//   return (
//     <>
//       <canvas ref={smokeRef} className="amb-smoke-canvas" style={{ mixBlendMode: 'multiply' }} />
//       <canvas ref={bubbleRef} className="amb-smoke-canvas" />
//     </>
//   );
// }

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/**
 * 02 — Toxicología · Humo + burbujas (Canvas2D).
 * Puerto de la lógica de "Humo y Burbujas" (blobs con pseudo-ruido para el
 * humo, burbujas que suben y a veces explotan) adaptado a:
 *  - un contenedor del tamaño de la sección, no de toda la pantalla,
 *  - composición normal en vez de 'lighter'+'screen' (esas dos son para
 *    fondo oscuro; sobre el fondo claro del sitio se veían invisibles),
 *  - la paleta de la marca (teal de --accent-toxicologia) en vez de verde,
 *  - burbujas más grandes y translúcidas, humo con alfa suficiente para
 *    notarse pero sin ser el protagonista.
 */

function rand(min, max) { return Math.random() * (max - min) + min; }

function noise2(x, y, t) {
  return (
    Math.sin(x * 0.9 + t * 1.3) * 0.5 +
    Math.sin(y * 1.3 - t * 0.8) * 0.3 +
    Math.sin((x + y) * 0.5 + t * 0.5) * 0.2
  );
}

class Blob {
  constructor(parent, offX, offY, rBase) {
    this.parent = parent;
    this.offX = offX;
    this.offY = offY;
    this.rBase = rBase;
    this.seed = rand(0, 1000);
  }
  getPos(t) {
    const p = this.parent;
    const nx = noise2(this.seed, p.seed, t * 0.15) * p.turbulence;
    const ny = noise2(p.seed, this.seed, t * 0.12) * p.turbulence * 0.6;
    return { x: p.x + this.offX + nx, y: p.y + this.offY + ny };
  }
}

class SmokePlume {
  constructor(W, H) { this.W = W; this.H = H; this.reset(true); }
  reset(initial) {
    const { W, H } = this;
    this.x = rand(0, W);
    this.y = initial ? rand(H * 0.2, H * 1.1) : H + rand(40, 110);
    this.seed = rand(0, 1000);
    this.vy = rand(-0.16, -0.06);
    this.vx = rand(-0.05, 0.05);
    this.turbulence = rand(10, 24);
    this.hue = rand(165, 188); // teal — accent-toxicologia
    this.sat = rand(45, 65);
    this.baseAlpha = rand(0.16, 0.3);
    this.life = 0;
    this.maxLife = rand(1800, 3400);
    this.maxR = rand(H * 0.16, H * 0.34);

    this.blobs = [];
    const n = Math.floor(rand(4, 7));
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + rand(-0.3, 0.3);
      const dist = rand(0.15, 0.85) * this.maxR;
      const bx = Math.cos(ang) * dist;
      const by = Math.sin(ang) * dist * 0.7;
      const br = rand(0.35, 0.75) * this.maxR;
      this.blobs.push(new Blob(this, bx, by, br));
    }
  }
  update() {
    this.life++;
    this.x += this.vx;
    this.y += this.vy;
    if (this.life > this.maxLife || this.y < -this.maxR) this.reset(false);
  }
  draw(ctx) {
    const t = this.life / this.maxLife;
    const growth = Math.min(1, this.life / (this.maxLife * 0.25));
    const shrink = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
    const sizeMul = growth * shrink;
    const fade = Math.sin(Math.PI * Math.min(t, 1));
    const alpha = this.baseAlpha * fade;
    if (alpha <= 0.002 || sizeMul <= 0.001) return;

    const timeSec = this.life / 60;
    for (const b of this.blobs) {
      const pos = b.getPos(timeSec);
      const r = b.rBase * sizeMul;
      const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, Math.max(1, r));
      const l1 = 46 + Math.sin(b.seed) * 6;
      grad.addColorStop(0, `hsla(${this.hue}, ${this.sat}%, ${l1 + 8}%, ${alpha})`);
      grad.addColorStop(0.45, `hsla(${this.hue}, ${this.sat}%, ${l1}%, ${alpha * 0.6})`);
      grad.addColorStop(1, `hsla(${this.hue}, ${this.sat}%, ${l1 - 8}%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, Math.max(0, r), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

class Bubble {
  constructor(W, H) { this.W = W; this.H = H; this.reset(); this.y = rand(0, H); }
  reset() {
    const { W, H } = this;
    this.x = rand(0, W);
    this.y = H + rand(6, 40);
    this.r = rand(5, 15);
    this.speed = rand(0.28, 1) * (1 + (14 - this.r) / 26);
    this.drift = rand(-0.25, 0.25);
    this.wobblePhase = rand(0, Math.PI * 2);
    this.wobbleAmp = rand(3, 10);
    this.wobbleFreq = rand(0.01, 0.03);
    this.hue = rand(168, 190);
    this.alpha = rand(0.22, 0.4);
    this.popChance = rand(0.0006, 0.0022);
    this.state = 'rising';
    this.popFrame = 0;
    this.popDuration = rand(8, 16);
  }
  update() {
    if (this.state === 'rising') {
      this.y -= this.speed;
      this.wobblePhase += this.wobbleFreq;
      this.x += this.drift + Math.sin(this.wobblePhase) * 0.3;
      if (this.y < this.H - 30 && Math.random() < this.popChance) this.state = 'popping';
      if (this.y < -this.r) this.state = 'popping';
    } else if (this.state === 'popping') {
      this.popFrame++;
      if (this.popFrame > this.popDuration) this.state = 'dead';
    } else if (this.state === 'dead') {
      this.reset();
    }
  }
  draw(ctx) {
    if (this.state === 'rising') {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      const grad = ctx.createRadialGradient(
        this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.1,
        this.x, this.y, Math.max(1, this.r)
      );
      grad.addColorStop(0, `hsla(${this.hue}, 60%, 62%, 0.5)`);
      grad.addColorStop(0.6, `hsla(${this.hue}, 55%, 50%, 0.18)`);
      grad.addColorStop(1, `hsla(${this.hue}, 55%, 42%, 0.04)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `hsla(${this.hue}, 55%, 46%, 0.3)`;
      ctx.stroke();
      ctx.restore();
    } else if (this.state === 'popping') {
      const t = this.popFrame / this.popDuration;
      const expand = this.r * (1 + t * 1.8);
      const alpha = this.alpha * (1 - t);
      ctx.save();
      ctx.globalAlpha = alpha;
      const particles = 5;
      for (let i = 0; i < particles; i++) {
        const ang = (Math.PI * 2 / particles) * i;
        const dist = expand * 0.9;
        const px = this.x + Math.cos(ang) * dist;
        const py = this.y + Math.sin(ang) * dist;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, this.r * 0.15 * (1 - t)), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 55%, 46%, ${alpha})`;
        ctx.fill();
      }
      ctx.restore();
    }
  }
}

export function BubblesAnimation() {
  const smokeRef = useRef(null);
  const bubbleRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const smokeCanvas = smokeRef.current;
    const bubbleCanvas = bubbleRef.current;
    if (!smokeCanvas || !bubbleCanvas) return;
    const sctx = smokeCanvas.getContext('2d');
    const bctx = bubbleCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = window.innerWidth < 768;

    let W = 0, H = 0;
    function resize() {
      const r = smokeCanvas.getBoundingClientRect();
      W = Math.max(r.width, 40);
      H = Math.max(r.height, 40);
      [smokeCanvas, bubbleCanvas].forEach((c) => {
        c.width = W * dpr;
        c.height = H * dpr;
      });
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const plumeCount = isMobile ? 4 : 7;
    const bubbleCount = isMobile ? 6 : 10;
    let plumes = Array.from({ length: plumeCount }, () => new SmokePlume(W, H));
    let bubbles = Array.from({ length: bubbleCount }, () => new Bubble(W, H));

    function drawStatic() {
      sctx.clearRect(0, 0, W, H);
      bctx.clearRect(0, 0, W, H);
      plumes.forEach((p) => p.draw(sctx));
      bubbles.forEach((b) => b.draw(bctx));
    }

    if (reducedMotion) {
      drawStatic();
      return () => window.removeEventListener('resize', resize);
    }

    let raf;
    function loop() {
      sctx.clearRect(0, 0, W, H);
      for (const p of plumes) { p.W = W; p.H = H; p.update(); p.draw(sctx); }

      bctx.clearRect(0, 0, W, H);
      for (const b of bubbles) { b.W = W; b.H = H; b.update(); b.draw(bctx); }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        plumes = Array.from({ length: plumeCount }, () => new SmokePlume(W, H));
        bubbles = Array.from({ length: bubbleCount }, () => new Bubble(W, H));
      }, 300);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', onResize);
    };
  }, [reducedMotion]);

  return (
    <>
      <canvas ref={smokeRef} className="amb-smoke-canvas" />
      <canvas ref={bubbleRef} className="amb-smoke-canvas" />
    </>
  );
}