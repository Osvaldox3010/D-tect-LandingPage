import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_TIMING } from '../config/services.config';
import { useReducedMotion } from './useReducedMotion';

/**
 * Motor de rotación del Hero (sección 4.3 del brief):
 * - Cada estado visible 7.5s
 * - Disparadores de pausa: botón explícito, hover, foco por teclado, clic en indicador
 * - Reanudación automática a los 12s de inactividad (excepto pausa explícita por botón)
 *
 * @param {number} count  número total de estados (5)
 */
export function useHeroRotation(count) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);   // estado real del engine
  const [stickyPause, setStickyPause] = useState(false); // pausa explícita del botón

  const autoTimer = useRef(null);
  const resumeTimer = useRef(null);
  const reducedMotion = useReducedMotion();

  const goTo = useCallback((next) => {
    setIndex(((next % count) + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  // Pausa temporal (hover / foco / clic en dot): reanuda sola a los 12s
  const pauseTemporarily = useCallback(() => {
    if (stickyPause) return;
    setIsPlaying(false);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setIsPlaying(true), HERO_TIMING.resumeDelay);
  }, [stickyPause]);

  const releaseTemporaryPause = useCallback(() => {
    if (stickyPause) return;
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setIsPlaying(true), HERO_TIMING.resumeDelay);
  }, [stickyPause]);

  // Pausa explícita del botón: no se auto-reanuda, requiere click de nuevo
  const togglePlayPause = useCallback(() => {
    setStickyPause((prev) => {
      const next = !prev;
      setIsPlaying(!next);
      clearTimeout(resumeTimer.current);
      return next;
    });
  }, []);

  // Loop de autoplay
  useEffect(() => {
    if (reducedMotion) return; // sin autoplay si el usuario pide reduced motion
    clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => {
      if (isPlaying && !stickyPause) next();
    }, HERO_TIMING.stateDuration);
    return () => clearTimeout(autoTimer.current);
  }, [index, isPlaying, stickyPause, next, reducedMotion]);

  useEffect(() => () => {
    clearTimeout(autoTimer.current);
    clearTimeout(resumeTimer.current);
  }, []);

  return {
    index,
    goTo,
    isPlaying,
    stickyPause,
    pauseTemporarily,
    releaseTemporaryPause,
    togglePlayPause,
  };
}
