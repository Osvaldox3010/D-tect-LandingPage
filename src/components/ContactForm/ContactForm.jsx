import { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import './ContactForm.css';

const EMAIL_RE = /.+@.+\..+/;

/**
 * Formulario de contacto reutilizable. `compact` oculta el campo de
 * "evaluación de interés" (usado en el modal rápido de header/hero).
 * onSubmit recibe los datos ya validados; aquí se deja un stub que
 * llama a /functions/contact.js (ver INSTALL.md)
 */
export function ContactForm({ compact = false, submitLabel = 'Enviar mensaje' }) {
  const [values, setValues] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  // Honeypot antispam: campo invisible para personas. Si un bot lo llena,
  // el backend descarta el envío en silencio (ver worker/index.js).
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [terminos, setTerminos] = useState(false);
  const [serverError, setServerError] = useState('');
  const termsFieldRef = useRef(null);

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function triggerTermsShake() {
    const el = termsFieldRef.current;
    if (!el) return;
    // Se reinicia la clase para que la animación vuelva a correr
    // aunque el usuario intente enviar varias veces seguidas.
    el.classList.remove('shake');
    void el.offsetWidth; // fuerza reflow
    el.classList.add('shake');
  }

  function validate() {
    const next = {};
    if (values.name.trim().length < 2) next.name = true;
    if (!EMAIL_RE.test(values.email)) next.email = true;
    if (values.phone.trim().length < 7) next.phone = true;
    if (!compact && values.message.trim().length < 2) next.message = true;
    if (!terminos) {
      next.terminos = true;
      triggerTermsShake();
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || 'No se pudo enviar tu mensaje.');
      }
      setStatus('success');
    } catch (err) {
      setServerError(err.message || 'No se pudo enviar tu mensaje. Intenta de nuevo en unos minutos.');
      setStatus('error');
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
      {/* Honeypot: oculto visualmente y fuera del flujo de tab/lectores de
          pantalla. Una persona real nunca lo llena; un bot que autocompleta
          formularios sí. Ver worker/index.js. */}
      {/* <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hp-field"
      /> */}

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

      {status === 'error' && (
        <p className="form-error-banner" role="alert">
          {serverError || 'No se pudo enviar tu mensaje. Intenta de nuevo en unos minutos.'}
        </p>
      )}

      <div
        className={`terms-field ${errors.terminos ? 'has-error' : ''}`}
        ref={termsFieldRef}
        onAnimationEnd={() => termsFieldRef.current?.classList.remove('shake')}
      >
        <label className="terms-checkbox">
          <input
            className="CheckTermsNConditions"
            type="checkbox"
            checked={terminos}
            onChange={(e) => {
              const checked = e.target.checked;
              setTerminos(checked);
              if (checked) {
                setErrors((prev) => ({ ...prev, terminos: false }));
              }
            }}
            required
          />
          <span className="terms-checkbox__mark" aria-hidden="true" />
          <span className="terms-checkbox__text">
            Acepto los <a href="#" className="terms-link">términos y condiciones</a> <span aria-hidden="true">*</span>
          </span>
        </label>
        <p className="field__error">Debes aceptar los términos para continuar.</p>
      </div>

      <Button
        as="button"
        type="submit"
        className={`form-submit ${status === 'loading' ? 'is-loading' : ''}`}
        disabled={status === 'loading'}
      >
        <span className="btn-label">{submitLabel}</span>
        <span className="spinner" aria-hidden="true" />
      </Button>
    </form>
  );
}