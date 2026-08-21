import { useEffect, useRef } from 'react';
import { Modal } from '../Modal/Modal';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function ScopeCanvas() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const colors = ['#16243F', '#8A7894', '#E9E2EA'];

    function resize() {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(r.width, 40) * dpr;
      canvas.height = Math.max(r.height, 40) * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const traces = colors.map((color, i) => ({
      color, offset: Math.random() * 1000, speed: 0.006 + i * 0.0015, amp: 0.18 + i * 0.05, freq: 2.2 + i * 0.6,
    }));

    const w = () => canvas.getBoundingClientRect().width;
    const h = () => canvas.getBoundingClientRect().height;

    function drawStatic() {
      const ww = w(), hh = h();
      ctx.clearRect(0, 0, ww, hh);
      traces.forEach((t) => {
        ctx.beginPath(); ctx.strokeStyle = t.color; ctx.globalAlpha = 0.75; ctx.lineWidth = 1.4;
        for (let x = 0; x <= ww; x += 4) {
          const n = Math.sin(x * 0.02 + t.offset) * t.amp + Math.sin(x * 0.05 + t.offset * 1.7) * t.amp * 0.4;
          const y = hh / 2 + n * hh * 0.5;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    }

    if (reducedMotion) { drawStatic(); return () => window.removeEventListener('resize', resize); }

    let raf, t0 = performance.now();
    function frame(now) {
      const dt = now - t0; t0 = now;
      const ww = w(), hh = h();
      ctx.clearRect(0, 0, ww, hh);
      traces.forEach((tr) => {
        tr.offset += dt * tr.speed;
        ctx.beginPath(); ctx.strokeStyle = tr.color; ctx.globalAlpha = 0.78; ctx.lineWidth = 1.4;
        for (let x = 0; x <= ww; x += 4) {
          const wobble = Math.sin(tr.offset * 0.15) * 0.06;
          const n = Math.sin(x * 0.025 * tr.freq + tr.offset * 0.06) * (tr.amp + wobble) + Math.sin(x * 0.06 + tr.offset * 0.1) * tr.amp * 0.3;
          const y = hh / 2 + n * hh * 0.55;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="scope-canvas" />;
}

export function VideoModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="video" ariaLabel="Cómo funciona una evaluación D-TECT">
      <div className="video-frame">
        <ScopeCanvas />
        <p>Video — Cómo funciona una evaluación D-TECT</p>
      </div>
    </Modal>
  );
}
