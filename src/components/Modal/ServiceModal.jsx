import { Modal } from '../Modal/Modal';
import { Eyebrow } from '../ui/Eyebrow';
import './ServiceModal.css';

export function ServiceModal({ service, onClose, onRequestInfo }) {
  const isOpen = !!service;

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId="serviceModalTitle" ariaLabel={service?.name || 'Servicio'}>
      {service && (
        <div className="service-modal">
          <div className="service-modal__media" style={{ '--service-accent': `var(${service.accentVar})` }}>
            <img src={service.image} alt={service.name} />
          </div>
          <Eyebrow className="modal__eyebrow" style={{ '--dot-color': `var(${service.accentVar})` }}>
            {service.eyebrow}
          </Eyebrow>
          <h3 id="serviceModalTitle">{service.name}</h3>
          <p className="modal__sub">{service.detail}</p>
          <button
            type="button"
            className="service-modal__cta"
            onClick={() => onRequestInfo(service)}
          >
            Solicitar esta evaluación
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </Modal>
  );
}