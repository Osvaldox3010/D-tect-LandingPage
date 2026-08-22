import { useScrollReveal } from '../../hooks/useScrollReveal';
import fingerprintMask from '../../assets/icons/fingerprint-mask.png';
import shieldCheckRed from '../../assets/icons/shield-check-red.png';
import './AudienceSections.css';

/**
 * NUEVO: reemplaza a los tres <ServiceSection /> que había antes en
 * App.jsx (sección "servicios" — Para empresas / Para personas / Para
 * organizaciones). Es el diseño de paneles diagonales que el usuario
 * proporcionó (clip-path, medallón sobre la costura, franjas de barras y
 * patrón de puntos de fondo), adaptado para:
 *  - usar el mismo sistema de scroll-reveal que ya usa el resto del sitio
 *    (useScrollReveal + las clases reveal-img/reveal-left/reveal-right/
 *    reveal-up de global.css) — antes el HTML no tenía ninguna animación
 *    de aparición, todo se mostraba de golpe.
 *  - usar la huella dactilar real del sitio (fingerprint-mask.png, la
 *    misma que ya se usa en la animación de "Antecedentes penales" del
 *    Hero) en vez del SVG dibujado a mano, para el medallón de
 *    "Para personas".
 *  - usar el ícono de escudo con check que proporcionó el usuario,
 *    re-coloreado a la paleta roja del sitio y con el fondo removido
 *    (ver shield-check-red.png), para el medallón de "Para organizaciones".
 *  - el medallón de "Para empresas" (lupa + señal de polígrafo) se dejó
 *    igual que en el HTML original, tal cual se aprobó.
 */

const ROWS = [
  {
    key: 'empresas',
    reverse: false,
    theme: 'blue',
    accent: 'var(--brand-red)',
    checks: '#2a3d6e',
    eyebrow: 'Para empresas',
    titleStart: 'Decisiones más informadas,',
    titleAccent: 'equipos más seguros.',
    desc: 'Integramos poligrafía, toxicología, psicometría, estudio socioeconómico y antecedentes penales en procesos de selección, permanencia e investigaciones internas.',
    bullets: [
      'Procesos de reclutamiento y permanencia',
      'Investigaciones internas por robo o fuga de información',
    ],
    bars: [30, 50, 38, 70, 55],
    barsOpacity: 0.14,
    medallion: (
      // Medallón original: lupa con señal poligráfica. Sin cambios.
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="27" cy="27" r="16" stroke="#2a3d6e" strokeWidth="3.2" />
        <path d="M14 27h5l3-7 4 13 3-9 3 5h6" stroke="#c0392f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="38.5" y1="38.5" x2="50" y2="50" stroke="#2a3d6e" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'personas',
    reverse: true,
    theme: 'gold',
    accent: '#b9832a',
    checks: '#b9832a',
    eyebrow: 'Para personas',
    titleStart: 'Respuestas claras,',
    titleAccent: 'tranquilidad real.',
    desc: 'Evaluaciones individuales en contextos personales, familiares y legales, con acompañamiento confidencial en cada etapa.',
    bullets: [
      'Casos particulares y asuntos legales',
      'Resultados con respaldo técnico y ético',
    ],
    bars: [40, 25, 60, 35, 48],
    barsOpacity: 0.16,
    // MODIFICADO: antes era un SVG de huella dibujado a mano; ahora es la
    // huella real del sitio (fingerprint-mask.png), pintada del dorado del
    // tema vía CSS mask.
    medallion: (
      <span
        className="aud-medallion__fp"
        style={{ '--fp-mask': `url(${fingerprintMask})` }}
        aria-hidden="true"
      />
    ),
  },
  {
    key: 'organizaciones',
    reverse: false,
    theme: 'red',
    accent: 'var(--brand-red)',
    checks: '#c0392f',
    eyebrow: 'Para organizaciones',
    titleStart: 'Prevención,',
    titleAccent: 'integridad y confianza.',
    desc: 'Diseñamos programas de control de confianza a la medida, con protocolos claros y reportes accionables para proteger lo que más importa.',
    bullets: [
      'Programas periódicos de control de confianza',
      'Verificación de personal activo y de nuevo ingreso',
    ],
    bars: [35, 55, 45, 65, 50],
    barsOpacity: 0.14,
    // MODIFICADO: antes era un SVG de escudo dibujado a mano; ahora es el
    // PNG del escudo que compartió el usuario, re-coloreado a la paleta
    // roja del sitio y con el fondo blanco removido (shield-check-red.png).
    medallion: <img className="aud-medallion__img" src={shieldCheckRed} alt="" aria-hidden="true" />,
  },
];

function AudienceRow({ row }) {
  const visualRef = useScrollReveal({ threshold: 0.25 });
  const contentRef = useScrollReveal({ threshold: 0.25 });

  return (
    <div className={`aud-row ${row.reverse ? 'aud-row--reverse' : ''}`} style={{ '--row-checks': row.checks }}>
      <div
        ref={visualRef}
        className={`aud-visual aud-theme-${row.theme} reveal-img ${row.reverse ? 'reveal-right' : 'reveal-left'}`}
      >
        <div className="aud-pattern" />
        <div className="aud-bars" style={{ opacity: row.barsOpacity }}>
          {row.bars.map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      <div ref={contentRef} className="aud-content reveal-up">
        <span className="aud-eyebrow">{row.eyebrow}</span>
        <h2 className="aud-h2">
          {row.titleStart} <span className="aud-accent" style={{ color: row.accent }}>{row.titleAccent}</span>
        </h2>
        <p className="aud-desc">{row.desc}</p>
        <ul className="aud-checks">
          {row.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <a className="aud-cta" href="#contacto">
          Conocer más
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>

      <div className="aud-medallion">{row.medallion}</div>
    </div>
  );
}

export function AudienceSections() {
  return (
    <div className="container aud-wrap" style={{ padding: 0 }}>
      {ROWS.map((row) => (
        <AudienceRow key={row.key} row={row} />
      ))}
    </div>
  );
}