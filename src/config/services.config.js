import polygraphImg from '../assets/hero/polygraph.webp';
import toxicologyImg from '../assets/hero/toxicology.webp';
import psychometryImg from '../assets/hero/psychometry.webp';
import socioeconomicImg from '../assets/hero/socioeconomic.webp';
import backgroundCheckImg from '../assets/hero/background-check.webp';
import polygraphCompleteImg from '../assets/hero/polygraphComplete.webp';

/**
 * Fuente única de verdad para los 5 servicios de D-TECT.
 * Cualquier componente que necesite nombre, caption, eyebrow, acento,
 * imagen o animación de un servicio debe leerlo de aquí — nunca
 * hardcodear estos valores en un componente.
 */
export const services = [
  {
    id: 1,
    key: 'poligrafia',
    name: 'Poligrafía',
    caption: 'Evaluación de confianza',
    eyebrow: 'Examen poligráfico profesional',
    accentVar: '--accent-poligrafia',
    anim: 'pulse',
    image: polygraphImg,
  },
  {
    id: 2,
    key: 'toxicologia',
    name: 'Toxicología',
    caption: 'Detección especializada',
    eyebrow: 'Análisis toxicológico certificado',
    accentVar: '--accent-toxicologia',
    anim: 'bubbles',
    image: toxicologyImg,
  },
  {
    id: 3,
    key: 'psicometria',
    name: 'Psicometría',
    caption: 'Evaluación del potencial',
    eyebrow: 'Evaluación psicométrica profesional',
    accentVar: '--accent-psicometria',
    anim: 'nodes',
    image: psychometryImg,
  },
  {
    id: 4,
    key: 'socioeconomico',
    name: 'Estudio socioeconómico',
    caption: 'Análisis y verificación',
    eyebrow: 'Estudio socioeconómico y de entorno',
    accentVar: '--accent-socioeconomico',
    anim: 'eco',
    image: socioeconomicImg,
  },
  {
    id: 5,
    key: 'antecedentes',
    name: 'Antecedentes penales',
    caption: 'Investigación y validación',
    eyebrow: 'Verificación de antecedentes',
    accentVar: '--accent-antecedentes',
    anim: 'ring',
    image: backgroundCheckImg,
  },
];

export const servicesCarousel = [
  {
    id: 1,
    key: 'poligrafia',
    name: 'Poligrafía',
    caption: 'Evaluación de confianza',
    eyebrow: 'Examen poligráfico profesional',
    accentVar: '--accent-poligrafia',
    anim: 'pulse',
    image: polygraphCompleteImg,
  },
  {
    id: 2,
    key: 'toxicologia',
    name: 'Toxicología',
    caption: 'Detección especializada',
    eyebrow: 'Análisis toxicológico certificado',
    accentVar: '--accent-toxicologia',
    anim: 'bubbles',
    image: toxicologyImg,
  },
  {
    id: 3,
    key: 'psicometria',
    name: 'Psicometría',
    caption: 'Evaluación del potencial',
    eyebrow: 'Evaluación psicométrica profesional',
    accentVar: '--accent-psicometria',
    anim: 'nodes',
    image: psychometryImg,
  },
  {
    id: 4,
    key: 'socioeconomico',
    name: 'Estudio socioeconómico',
    caption: 'Análisis y verificación',
    eyebrow: 'Estudio socioeconómico y de entorno',
    accentVar: '--accent-socioeconomico',
    anim: 'eco',
    image: socioeconomicImg,
  },
  {
    id: 5,
    key: 'antecedentes',
    name: 'Antecedentes penales',
    caption: 'Investigación y validación',
    eyebrow: 'Verificación de antecedentes',
    accentVar: '--accent-antecedentes',
    anim: 'ring',
    image: backgroundCheckImg,
  },
];


/** Timing exacto de la sección 4.3 del brief */
export const HERO_TIMING = {
  // MODIFICADO: 7500 -> 9000. Cada estado del Hero (Poligrafía, Toxicología,
  // Psicometría, Estudio socioeconómico, Antecedentes penales) ahora se
  // queda 9s visible antes de rotar al siguiente, como se pidió.
  stateDuration: 9000,   // ms visibles por estado
  transitionDuration: 800, // ms de transición entre estados
  resumeDelay: 12000,    // ms de inactividad antes de reanudar
};