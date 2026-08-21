import { Eyebrow } from '../ui/Eyebrow';
import { ContactForm } from '../ContactForm/ContactForm';
import './Contact.css';

const METHODS = [
  {
    label: 'WhatsApp',
    value: '5565256934',
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
    label: 'Llamadas', value: '55 1234 5678', href: 'tel:+525565256934',
    icon: <path d="M4 3H8L10 8L7.5 9.5C8.4 11.5 9.9 13 11.9 13.9L13.5 11.5L18.5 13.5V17.5C18.5 18.6 17.6 19.5 16.5 19.5C9.6 19 1 10.4 0.5 3.5C0.5 2.4 1.4 1.5 2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: 'Correo electrónico', value: 'contacto@d-tect.mx', href: 'mailto:contacto@d-tect.mx',
    icon: <><rect x="2" y="4" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M3 5.5L10 11L17 5.5" stroke="currentColor" strokeWidth="1.4" /></>,
  },
];

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
            <div className="map-card">
              <span className="map-card__label">Nuestra ubicación</span>
              <span className="map-card__pin" tabIndex={0} role="button" aria-label="Ver ubicación">
                <svg viewBox="0 0 24 30" fill="none" aria-hidden="true">
                  <path d="M12 29C12 29 22 18 22 11C22 5.5 17.5 1 12 1C6.5 1 2 5.5 2 11C2 18 12 29 12 29Z" fill="currentColor" />
                  <circle cx="12" cy="11" r="4" fill="var(--bg-base)" />
                </svg>
              </span>
              <div className="map-card__addr">
                <strong>D-TECT — Oficina Central</strong>
                Av. Ejemplo 123, Col. Centro, Ciudad de México, CP 06000
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
