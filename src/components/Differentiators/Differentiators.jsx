import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Eyebrow } from '../ui/Eyebrow';
import './Differentiators.css';

const ITEMS = [
  {
    title: 'Experiencia',
    desc: 'Examinadores y evaluadores certificados con años de práctica en las cinco disciplinas.',
    icon: <path d="M20 5L33 10V19C33 27 27.6 33.5 20 36C12.4 33.5 7 27 7 19V10L20 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
  },
  {
    title: 'Confidencialidad',
    desc: 'Tu información se mantiene protegida en cada etapa del proceso, sin excepción.',
    icon: <circle cx="20" cy="16" r="7" stroke="currentColor" strokeWidth="1.6" />,
  },
  {
    title: 'Metodología integral',
    desc: 'Cinco disciplinas coordinadas —poligrafía, toxicología, psicometría, socioeconómico y antecedentes— bajo un solo protocolo.',
    icon: <rect x="7" y="10" width="26" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />,
  },
  {
    title: 'Ética y legalidad',
    desc: 'Procesos científicos, éticos y apegados al marco legal vigente en México.',
    icon: <path d="M8 12H32M8 20H32M8 28H24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
  },
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
          <Eyebrow>SEÑAL / 03</Eyebrow>
          <h2>¿Por qué elegirnos?</h2>
        </div>
        <div className="diff-grid">
          {ITEMS.map((item) => <DiffItem key={item.title} item={item} />)}
        </div>
      </div>
    </section>
  );
}
