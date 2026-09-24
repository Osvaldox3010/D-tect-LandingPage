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
    // MODIFICADO: texto exacto del documento "POL (1)", que describe la
    // Poligrafía como 3 modalidades (Pre-empleo / Permanencia /
    // Específica). Se mantiene el modal simple de siempre (un solo
    // párrafo), así que las 3 se unen respetando el texto tal cual está
    // en el documento, solo agregando la etiqueta de cada modalidad.
    detail: 'Pre-empleo: Herramienta para evaluar la confiabilidad de un candidato antes de su contratación y prevenir riesgos desde el proceso de selección.\nPermanencia: Herramienta para evaluar la confiabilidad de empleados activos dentro de una organización, para mitigar amenazas internas durante el desarrollo laboral.\nEspecífica: Herramienta para investigar hechos concretos tales como fraude y robos. Esclareciendo situaciones para una toma de decisiones certera.',
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
    // MODIFICADO: texto exacto del documento "POL (1)" (sección "Pruebas
    // toxicológicas").
    detail: 'Detecta la presencia de sustancias tóxicas en el cuerpo mediante una muestra de orina.',
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
    // MODIFICADO: texto exacto del documento "POL (1)" (sección
    // "Psicometría").
    detail: 'Exámenes estandarizados que miden de forma objetiva la inteligencia, aptitudes, competencias, y rasgos de personalidad. Proporcionando herramientas para la selección de personal o brindar promociones y ascensos a empleados activos.',
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
    // MODIFICADO: texto exacto del documento "POL (1)" (sección "Estudio
    // socioeconómico").
    detail: 'Permite identificar riesgos en el entorno de los candidatos o personal activo, mediante una investigación en diversas áreas como familiar, laboral, económico, escolar, etc.',
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
    detail: 'Consulta de antecedentes legales y judiciales (Investigación judicial).',
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