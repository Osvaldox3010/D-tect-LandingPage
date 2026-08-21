import { PulseAnimation } from './PulseAnimation';
import { BubblesAnimation } from './BubblesAnimation';
import { NodesAnimation } from './NodesAnimation';
import { EcoAnimation } from './EcoAnimation';
import { RingAnimation } from './RingAnimation';

const ANIMATIONS = {
  pulse: PulseAnimation,
  bubbles: BubblesAnimation,
  nodes: NodesAnimation,
  eco: EcoAnimation,
  ring: RingAnimation,
};

/**
 * Monta la animación de fondo correspondiente al servicio activo.
 * La `key` en el padre fuerza un remount limpio al cambiar de servicio
 * (sin necesidad de lógica manual de cleanup entre animaciones).
 */
export function AmbientAnimation({ anim }) {
  const Comp = ANIMATIONS[anim];
  return Comp ? <Comp /> : null;
}
