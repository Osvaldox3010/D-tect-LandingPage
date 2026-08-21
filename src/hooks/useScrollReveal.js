import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Revela un elemento (agrega la clase .is-revealed) cuando entra al viewport.
 * Úsalo junto con las clases utilitarias .reveal-img / .reveal-up de global.css.
 *
 * const ref = useScrollReveal();
 * <div ref={ref} className="reveal-up">...</div>
 */
export function useScrollReveal(options = { threshold: 0.25 }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.classList.add('is-revealed');
      return;
    }

    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-revealed');
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add('is-revealed');
          io.disconnect();
        }
      });
    }, options);

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return ref;
}
