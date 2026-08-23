import { Eyebrow } from '../ui/Eyebrow';
import { ContactForm } from '../ContactForm/ContactForm';
import { MapView } from './MapView';
import './Contact.css';

const METHODS = [
  {
    label: 'WhatsApp',
    value: '55 6525 6934',
    href: `https://wa.me/525565256934?text=${encodeURIComponent(
      'Me gustaría solicitar más información.'
    )}`,
    icon: <path
      d="M4 17L5.1 13.3C4.3 12 3.9 10.5 3.9 9C3.9 4.6 7.5 1 12 1C16.4 1 20 4.6 20 9C20 13.4 16.4 17 12 17C10.6 17 9.3 16.6 8.1 15.9L4 17Z"
      stroke="currentColor"
      strokeWidth="1.4"
      transform="translate(-2,0.5) scale(0.85)"
    />,
  },
  {
    label: 'Llamadas', value: '+52 55 6525 6934', href: 'tel:+525565256934',
    icon: <path d="M4 3H8L10 8L7.5 9.5C8.4 11.5 9.9 13 11.9 13.9L13.5 11.5L18.5 13.5V17.5C18.5 18.6 17.6 19.5 16.5 19.5C9.6 19 1 10.4 0.5 3.5C0.5 2.4 1.4 1.5 2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: 'Correo electrónico', value: 'contacto@d-tect.mx', href: 'mailto:contacto@d-tect.mx',
    icon: <><rect x="2" y="4" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M3 5.5L10 11L17 5.5" stroke="currentColor" strokeWidth="1.4" /></>,
  },
];

// TODO: reemplazar por la dirección real de la oficina cuando se tenga
// definida — mientras tanto es un dato de ejemplo (ver MapView.jsx).
const OFFICE_ADDRESS = 'Av. Ejemplo 123, Col. Centro, Ciudad de México, CP 06000';
const OFFICE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_ADDRESS)}`;

export function Contact() {
  return (
    <section className="contact" id="contacto">
      <div className="container">
        <div className="contact__head">
          <Eyebrow style={{ marginBottom: 16 }}>SEÑAL / 05</Eyebrow>
          <h2>Hablemos</h2>
          <p>Estamos listos para ayudarte. Contáctanos por cualquiera de nuestros medios o envíanos un mensaje.</p>
        </div>

        <div className="contact__grid">
          <div className="contact__methods">
            {METHODS.map((m) => (
              <div className="contact-method" key={m.label}>
                <a href={m.href} target={m.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
                  <span className="contact-method__icon">
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">{m.icon}</svg>
                  </span>
                  <span>
                    <span className="contact-method__label">{m.label}</span>
                    <span className="contact-method__value">{m.value}</span>
                  </span>
                </a>
              </div>
            ))}
          </div>

          <div className="contact__form-wrap">
            <ContactForm />
          </div>

          <div className="contact__map-wrap">
            {/* MODIFICADO: MapView vuelve a ser un mapa real e interactivo
                (MapLibre GL + calles reales), pero ahora recoloreado con
                la paleta de la marca y con manejo de error/carga, en vez
                de dejar los tiles tal cual venían o mostrar una tarjeta
                en blanco si la petición fallaba. La tarjeta ya no es un
                link completo (así se puede arrastrar/hacer zoom al mapa
                sin salir de la página); el link a Google Maps queda
                dentro de la dirección. */}
            <div className="map-card">
              <MapView />
              <span className="map-card__label">Nuestra ubicación</span>
              <div className="map-card__addr">
                <strong>D-TECT — Oficina Central</strong>
                <span>{OFFICE_ADDRESS}</span>
                <a
                  className="map-card__addr-link"
                  href={OFFICE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cómo llegar ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}