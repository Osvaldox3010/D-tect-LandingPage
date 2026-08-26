import { useState } from 'react';
import { Eyebrow } from '../ui/Eyebrow';
import { FAQItem } from './FAQItem';
import './FAQ.css';

const QUESTIONS = [
  {
    q: '¿Qué son las evaluaciones de control de confianza?',
    a: 'Son un conjunto de evaluaciones —psicológicas, poligráficas, toxicológicas, socioeconómicas y de antecedentes penales— que previenen riesgos internos y verifican que el personal actúe dentro del marco de valores de la organización.',
  },
  {
    q: '¿Qué evaluaciones ofrece D-TECT?',
    a: 'Poligrafía, toxicología, psicometría, estudio socioeconómico y verificación de antecedentes penales, de forma individual o como programa integral.',
  },
  {
    q: '¿Cuánto dura un proceso completo?',
    a: 'Depende de las evaluaciones solicitadas. Una poligrafía individual toma entre 1.5 y 3 horas; un programa integral con varias disciplinas se coordina en días conforme al volumen de personal.',
  },
  {
    q: '¿Es legal aplicar estas evaluaciones en México?',
    a: 'Sí. Todas nuestras evaluaciones son aplicadas por personal certificado, con el consentimiento informado del evaluado y en apego al marco legal vigente.',
    legal: true,
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq" id="faq">
      <div className="container faq__grid">
        <div className="faq__intro">
          <Eyebrow style={{ marginBottom: 16 }}>SEÑAL / 06</Eyebrow>
          <h2>Preguntas frecuentes</h2>
          <p>Resuelve tus dudas sobre nuestras evaluaciones y procesos.</p>
        </div>

        <div className="faq__list">
          {QUESTIONS.map((item, i) => (
            <FAQItem
              key={item.q}
              question={item.q}
              answer={item.a}
              legal={item.legal}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}