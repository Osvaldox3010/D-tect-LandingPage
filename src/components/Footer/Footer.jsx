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
              <a href={`https://wa.me/525565256934?text=${encodeURIComponent('Me gustaría solicitar más información.')}`} aria-label="WhatsApp"><svg viewBox="-1.66 0 740.824 740.824" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M630.056 107.658C560.727 38.271 468.525.039 370.294 0 167.891 0 3.16 164.668 3.079 367.072c-.027 64.699 16.883 127.855 49.016 183.523L0 740.824l194.666-51.047c53.634 29.244 114.022 44.656 175.481 44.682h.151c202.382 0 367.128-164.689 367.21-367.094.039-98.088-38.121-190.32-107.452-259.707m-259.758 564.8h-.125c-54.766-.021-108.483-14.729-155.343-42.529l-11.146-6.613-115.516 30.293 30.834-112.592-7.258-11.543c-30.552-48.58-46.689-104.729-46.665-162.379C65.146 198.865 202.065 62 370.419 62c81.521.031 158.154 31.81 215.779 89.482s89.342 134.332 89.311 215.859c-.07 168.242-136.987 305.117-305.211 305.117m167.415-228.514c-9.176-4.591-54.286-26.782-62.697-29.843-8.41-3.061-14.526-4.591-20.644 4.592-6.116 9.182-23.7 29.843-29.054 35.964-5.351 6.122-10.703 6.888-19.879 2.296-9.175-4.591-38.739-14.276-73.786-45.526-27.275-24.32-45.691-54.36-51.043-63.542-5.352-9.183-.569-14.148 4.024-18.72 4.127-4.11 9.175-10.713 13.763-16.07 4.587-5.356 6.116-9.182 9.174-15.303 3.059-6.122 1.53-11.479-.764-16.07-2.294-4.591-20.643-49.739-28.29-68.104-7.447-17.886-15.012-15.466-20.644-15.746-5.346-.266-11.469-.323-17.585-.323-6.117 0-16.057 2.296-24.468 11.478-8.41 9.183-32.112 31.374-32.112 76.521s32.877 88.763 37.465 94.885c4.587 6.122 64.699 98.771 156.741 138.502 21.891 9.45 38.982 15.093 52.307 19.323 21.981 6.979 41.983 5.994 57.793 3.633 17.628-2.633 54.285-22.19 61.932-43.616 7.646-21.426 7.646-39.791 5.352-43.617-2.293-3.826-8.41-6.122-17.585-10.714" fill="currentColor"/></svg></a>
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

          {/* <div className="footer-col">
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
          </div> */}
        </div>

        <div className="footer-bottom">© {new Date().getFullYear()} D-TECT. Todos los derechos reservados.</div>
      </div>
    </footer>
  );
}
