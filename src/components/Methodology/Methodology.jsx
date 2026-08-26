import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Eyebrow } from '../ui/Eyebrow';
import './Methodology.css';

const STEPS = [
  {
    n: '01',
    title: 'Entrevista',
    desc: 'Captura de datos iniciales, explicación del funcionamiento del polígrafo y entrevista de profundización para revisar las preguntas antes del examen.',
  },
  {
    n: '02',
    title: 'Evaluación fisiológica',
    desc: 'Colocación de sensores (respiración, conductancia cutánea, ritmo cardiaco y sensor de movimiento) y aplicación del protocolo de preguntas estructuradas en el equipo.',
  },
  {
    n: '03',
    title: 'Análisis',
    desc: 'Revisión detallada de las gráficas fisiológicas y evaluación de las alteraciones o patrones de respuesta registrados durante la prueba.',
  },
];

const RESULT_ROWS = [
  { color: 'green', label: 'Veraz', desc: 'Sin detección de reacciones de falta de veracidad.' },
  { color: 'yellow', label: 'Inconcluso', desc: 'Los registros fisiológicos no mostraron patrones lo suficientemente claros para clasificar al evaluado como veraz o no veraz.' },
  { color: 'red', label: 'No veraz', desc: 'Con detección de reacciones fisiológicas de falta de veracidad en al menos una de las preguntas.' },
];

const RISK_ROWS = [
  { color: 'green', label: 'Bajo riesgo', desc: 'Perfil confiable y alineado a los estándares. Candidato recomendado.' },
  { color: 'yellow', label: 'Riesgo medio', desc: 'Inconsistencias menores o áreas de atención situacionales. Requiere supervisión.' },
  { color: 'red', label: 'Riesgo alto', desc: 'Omisiones severas, conductas contrarias a la ética o no veracidad. No recomendado.' },
];

function Step({ step }) {
  const ref = useScrollReveal({ threshold: 0.2 });
  return (
    <div ref={ref} className="method-step reveal-up">
      <span className="method-step__n">{step.n}</span>
      <h3>{step.title}</h3>
      <p>{step.desc}</p>
    </div>
  );
}

function ScaleTable({ title, rows }) {
  const ref = useScrollReveal({ threshold: 0.15 });
  return (
    <div ref={ref} className="scale-table reveal-up">
      <h4>{title}</h4>
      <div className="scale-table__rows">
        {rows.map((r) => (
          <div className="scale-row" key={r.label}>
            <span className={`scale-row__dot scale-row__dot--${r.color}`} aria-hidden="true" />
            <div>
              <strong>{r.label}</strong>
              <p>{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Methodology() {
  return (
    <section className="methodology" id="metodologia">
      <div className="container">
        <div className="methodology__head">
          <Eyebrow style={{ marginBottom: 14 }}>SEÑAL / 04</Eyebrow>
          <h2>Cómo trabajamos</h2>
          <p>El examen poligráfico sigue tres etapas claras, y cada resultado se entrega con un criterio diagnóstico explícito — sin ambigüedad.</p>
        </div>

        <div className="method-steps">
          {STEPS.map((s) => <Step key={s.n} step={s} />)}
        </div>

        <div className="scale-tables">
          <ScaleTable title="Resultado categórico de polígrafo" rows={RESULT_ROWS} />
          <ScaleTable title="Escala de indicadores de niveles de riesgo" rows={RISK_ROWS} />
        </div>
      </div>
    </section>
  );
}