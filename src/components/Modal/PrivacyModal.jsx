import { Modal } from '../Modal/Modal';
import { Eyebrow } from '../ui/Eyebrow';

/**
 * Documento en /public, servido tal cual en la raíz del sitio (no pasa por
 * el pipeline de imports de Vite) — ver /public/documents/.
 */
const PRIVACY_PDF_URL = '/documents/aviso-privacidad-poligrafia.pdf';

export function PrivacyModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="document" titleId="privacyModalTitle" ariaLabel="Aviso de privacidad">
      <Eyebrow className="modal__eyebrow">LEGAL</Eyebrow>
      <h3 id="privacyModalTitle">Aviso de privacidad</h3>
      <p className="modal__sub">
        Si el documento no se muestra abajo, puedes{' '}
        <a href={PRIVACY_PDF_URL} target="_blank" rel="noopener noreferrer">abrirlo en una pestaña nueva</a>.
      </p>
      <div className="document-frame">
        <iframe src={PRIVACY_PDF_URL} title="Aviso de privacidad D-TECT" />
      </div>
    </Modal>
  );
}