import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Eyebrow } from '../ui/Eyebrow';
import apaLogo from '../../assets/certifications/apa.png';
import aippLogo from '../../assets/certifications/aipp.png';
import './Differentiators.css';

/* Copy tomado tal cual de "Beneficios clave" en la propuesta oficial del
   cliente (PDF), mapeado 1:1 sobre los 4 íconos que ya existían. */
const ITEMS = [
  {
    title: 'Reducción de riesgos internos',
    desc: 'Minimización de conductas no deseadas, fugas de información y fraude ocupacional.',
    icon: <path d="M20 5L33 10V19C33 27 27.6 33.5 20 36C12.4 33.5 7 27 7 19V10L20 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
  },
  {
    title: 'Confidencialidad absoluta',
    desc: 'Resguardo estricto de expedientes en cada etapa del proceso, sin excepción.',
    icon: <circle cx="20" cy="16" r="7" stroke="currentColor" strokeWidth="1.6" />,
  },
  {
    title: 'Procesos de selección confiables',
    desc: 'Optimización del filtro de contratación integrando personal alineado a la cultura organizacional.',
    icon: <rect x="7" y="10" width="26" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />,
  },
  {
    title: 'Reportes claros e interpretables',
    desc: 'Informes sintéticos, ejecutivos y de fácil lectura para comités de selección y directivos.',
    icon: <path d="M8 12H32M8 20H32M8 28H24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
  },
];

const CERTIFICATIONS = [
  { name: 'American Polygraph Association', logo: apaLogo },
  { name: 'Asociación Internacional de Profesionales en Poligrafía (AIPP)', logo: aippLogo },
];

function DiffItem({ item }) {
  const ref = useScrollReveal({ threshold: 0.2 });
  return (
    <div ref={ref} className="diff-item reveal-up">
      <svg className="diff-item__icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">{item.icon}</svg>
      <h3>{item.title}</h3>
      <p>{item.desc}</p>
    </div>
  );
}

export function Differentiators() {
  return (
    <section className="differentiators" id="nosotros">
      <div className="container">
        <div className="differentiators__head">
          <Eyebrow>SEÑAL / 05</Eyebrow>
          <h2>¿Por qué elegirnos?</h2>
        </div>
        <div className="diff-grid">
          {ITEMS.map((item) => <DiffItem key={item.title} item={item} />)}
        </div>

        <div className="cert-strip">
          <p className="cert-strip__label">Certificados por instituciones líderes en poligrafía a nivel mundial</p>
          <div className="cert-strip__logos">
            {CERTIFICATIONS.map((c) => (
              <span className="cert-strip__badge" key={c.name}>
                <img src={c.logo} alt={c.name} loading="lazy" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}