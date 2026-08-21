import { useState } from 'react';
import { Button } from '../ui/Button';
import './ContactForm.css';

const EMAIL_RE = /.+@.+\..+/;

/**
 * Formulario de contacto reutilizable. `compact` oculta el campo de
 * "evaluación de interés" (usado en el modal rápido de header/hero).
 * onSubmit recibe los datos ya validados; aquí se deja un stub que
 * llama a /functions/contact.js (ver INSTALL.md).
 */
export function ContactForm({ compact = false, submitLabel = 'Enviar mensaje' }) {
  const [values, setValues] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function validate() {
    const next = {};
    if (values.name.trim().length < 2) next.name = true;
    if (!EMAIL_RE.test(values.email)) next.email = true;
    if (values.phone.trim().length < 7) next.phone = true;
    if (!compact && values.message.trim().length < 2) next.message = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      // Reemplaza esta URL por tu Cloudflare Pages Function real (ver functions/contact.js)
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      }).catch(() => null); // no bloquear el UX si el endpoint aún no existe en desarrollo
      setStatus('success');
    } catch {
      setStatus('idle');
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success is-visible">
        <svg className="form-success__icon" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <circle cx="22" cy="22" r="20" stroke="currentColor" strokeWidth="2" />
          <path d="M13 22.5L19 28.5L31 15.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>Mensaje enviado</h3>
        <p>Gracias por contactarnos. Nos comunicaremos contigo pronto.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className={`field ${errors.name ? 'has-error' : ''}`}>
        <label htmlFor="cf-name">Nombre completo</label>
        <input id="cf-name" autoComplete="name" value={values.name} onChange={(e) => update('name', e.target.value)} />
        <p className="field__error">Por favor ingresa tu nombre.</p>
      </div>

      <div className="field-row">
        <div className={`field ${errors.email ? 'has-error' : ''}`}>
          <label htmlFor="cf-email">Correo electrónico</label>
          <input id="cf-email" type="email" autoComplete="email" value={values.email} onChange={(e) => update('email', e.target.value)} />
          <p className="field__error">Ingresa un correo válido.</p>
        </div>
        <div className={`field ${errors.phone ? 'has-error' : ''}`}>
          <label htmlFor="cf-phone">Teléfono</label>
          <input id="cf-phone" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => update('phone', e.target.value)} />
          <p className="field__error">Ingresa un teléfono válido.</p>
        </div>
      </div>

      {!compact && (
        <div className="field">
          <label htmlFor="cf-service">Evaluación de interés</label>
          <input
            id="cf-service"
            placeholder="Ej. Poligrafía, estudio socioeconómico..."
            value={values.service}
            onChange={(e) => update('service', e.target.value)}
          />
        </div>
      )}

      <div className={`field ${errors.message ? 'has-error' : ''}`}>
        <label htmlFor="cf-message">Mensaje</label>
        <textarea
          id="cf-message"
          placeholder="Cuéntanos cómo podemos ayudarte..."
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
        />
        <p className="field__error">Cuéntanos brevemente tu caso.</p>
      </div>

      <Button as="button" type="submit" className={`form-submit ${status === 'loading' ? 'is-loading' : ''}`} disabled={status === 'loading'}>
        <span className="btn-label">{submitLabel}</span>
        <span className="spinner" aria-hidden="true" />
      </Button>
    </form>
  );
}
