import { Modal } from '../Modal/Modal';
import { Eyebrow } from '../ui/Eyebrow';
import { ContactForm } from '../ContactForm/ContactForm';

export function InfoModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId="infoModalTitle" ariaLabel="Solicitar información">
      <Eyebrow className="modal__eyebrow">SOLICITUD</Eyebrow>
      <h3 id="infoModalTitle">Solicitar información</h3>
      <p className="modal__sub">Cuéntanos qué necesitas y un especialista te contactará en menos de 24 horas.</p>
      <ContactForm compact submitLabel="Enviar solicitud" />
    </Modal>
  );
}
