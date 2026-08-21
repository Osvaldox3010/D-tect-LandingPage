import { Logo } from '../Header/Logo';
import './Footer.css';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1400 60" preserveAspectRatio="none">
          <path d="M0 30 H500 L515 8 L535 52 L555 30 H700 L715 14 L735 46 L755 30 H1400" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      </div>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo dark />
            <p>Evaluaciones profesionales de control de confianza con ética, precisión y confidencialidad.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.4" /><circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.4" /><circle cx="14.6" cy="5.4" r="1" fill="currentColor" /></svg></a>
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 20 20" fill="none"><path d="M12.5 6.5H14V3.5H12.2C10.1 3.5 9 4.6 9 6.6V8.5H7V11.5H9V17H12V11.5H14L14.5 8.5H12V7C12 6.4 12.1 6.5 12.5 6.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg></a>
              <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.4" /><path d="M6.5 8.5V14M6.5 6V6.05M10 14V10.7C10 9.2 10.8 8.5 11.9 8.5C13 8.5 13.5 9.3 13.5 10.7V14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navegación</h4>
            <ul>
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#nosotros">Nosotros</a></li>
              <li><a href="#faq">Preguntas frecuentes</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Evaluaciones</h4>
            <ul>
              <li><a href="#aplicaciones">Poligrafía</a></li>
              <li><a href="#aplicaciones">Toxicología</a></li>
              <li><a href="#aplicaciones">Psicometría</a></li>
              <li><a href="#aplicaciones">Estudio socioeconómico</a></li>
              <li><a href="#aplicaciones">Antecedentes penales</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Aviso de privacidad</a></li>
              <li><a href="#">Términos y condiciones</a></li>
            </ul>
            <h4 style={{ marginTop: 26 }}>Certificaciones</h4>
            <div className="footer-certs">
              <span className="cert-badge">ISO<br />9001</span>
              <span className="cert-badge">APA<br />ACC.</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">© {new Date().getFullYear()} D-TECT. Todos los derechos reservados.</div>
      </div>
    </footer>
  );
}
