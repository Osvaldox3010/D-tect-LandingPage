/**
 * Worker de backend para el sitio D-TECT.
 *
 * IMPORTANTE: este proyecto se despliega como un Cloudflare Worker con
 * Vite (no como "Cloudflare Pages" clásico), así que la carpeta
 * `functions/` NO se usa aquí — esa convención es exclusiva de Pages.
 * En este tipo de proyecto, el backend es este archivo, apuntado por
 * `main` en wrangler.jsonc.
 *
 * Cómo funciona:
 *   - Si la petición es POST a /api/contact, la maneja esta función.
 *   - Cualquier otra petición se le pasa a los assets estáticos del sitio
 *     (env.ASSETS.fetch), que es donde vive tu build de React/Vite.
 *
 * Variable de entorno que SÍ necesitas configurar en Cloudflare
 * (Settings → Variables and secrets):
 *   RESEND_API_KEY   → tu API key de https://resend.com (como Secret)
 *
 * Variable opcional:
 *   FROM_EMAIL       → remitente, ej. "D-TECT <onboarding@resend.dev>"
 *   CONTACT_TO_EMAIL → a dónde llega la notificación de cada formulario
 *                       (si no se configura, usa el correo por defecto de abajo)
 */

// Se usa solo si CONTACT_TO_EMAIL no está configurada en el entorno.
const DEFAULT_COMPANY_EMAIL = 'jimenezosvaldo780@gmail.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Colores de marca de D-TECT (src/styles/tokens.css)
const BRAND = {
  navy: '#16243F',
  red: '#C1443A',
  green: '#2E8B57',
  bg: '#F4F1EC',
  text: '#1c1c1a',
  muted: '#6b6a66',
};

/**
 * Plantilla de correo con la marca de D-TECT. Usa estilos en línea y tablas
 * (en vez de <style> o flex/grid) porque muchos clientes de correo
 * (Outlook, Gmail en algunos casos) ignoran o rompen CSS moderno.
 */
function renderEmailHtml({ heading, introHtml, rows, footerNote }) {
  const rowsHtml = rows
    .map(
      (r) => `
        <tr>
          <td style="padding:10px 0; border-bottom:1px solid #eceae4; font-size:13px; color:${BRAND.muted}; width:130px; vertical-align:top;">${r.label}</td>
          <td style="padding:10px 0; border-bottom:1px solid #eceae4; font-size:14.5px; color:${BRAND.text}; vertical-align:top;">${r.value}</td>
        </tr>`
    )
    .join('');

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg}; padding:32px 16px; font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e6e3db;">
          <tr>
            <td style="background:${BRAND.navy}; padding:22px 28px;">
              <span style="font-size:17px; font-weight:700; letter-spacing:.02em; color:#ffffff;">D-TECT</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;">
              <h1 style="margin:0 0 14px; font-size:19px; color:${BRAND.text};">${heading}</h1>
              <div style="font-size:14.5px; line-height:1.55; color:${BRAND.text};">${introHtml}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 28px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rowsHtml}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#faf9f6; padding:16px 28px; font-size:12px; color:${BRAND.muted};">
              ${footerNote}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

async function sendResendEmail(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend respondió ${res.status}: ${detail}`);
  }
  return res;
}

async function handleContact(request, env) {
  try {
    const data = await request.json();
    const { name, email, phone, service, message, website } = data;

    // Honeypot: "website" es un campo invisible para personas (ver
    // ContactForm.jsx). Los bots que llenan todos los campos de un
    // formulario automáticamente sí lo rellenan. Si viene con algo,
    // respondemos como si todo hubiera salido bien pero NO mandamos
    // ningún correo — así el bot no reintenta ni sabe que fue detectado.
    if (website) {
      return new Response(JSON.stringify({ ok: true, userConfirmationSent: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!name || !email || !phone || !EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Faltan campos requeridos o el correo no es válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Falta configurar RESEND_API_KEY en el servidor.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const FROM_EMAIL = env.FROM_EMAIL || 'D-TECT Web <no-reply@mail.grupo-d-tect.com>';
    const COMPANY_EMAIL = env.CONTACT_TO_EMAIL || DEFAULT_COMPANY_EMAIL;

    const safeName = escapeHtml(name);
    const safeService = escapeHtml(service || 'No especificada');
    const safeMessage = escapeHtml(message || '(sin mensaje)').replace(/\n/g, '<br>');

    // Los dos envíos son independientes a propósito: si falla la
    // confirmación al visitante (por ejemplo, en el dominio de pruebas de
    // Resend, que solo puede enviar a tu propio correo de cuenta), NO
    // queremos que eso tumbe la notificación a la empresa.

    let companyEmailSent = false;
    let companyErrorMessage = null;
    try {
      await sendResendEmail(env.RESEND_API_KEY, {
        from: FROM_EMAIL,
        to: [COMPANY_EMAIL],
        reply_to: email,
        subject: `Nueva solicitud de contacto — ${name}`,
        html: renderEmailHtml({
          heading: 'Nueva solicitud de contacto',
          introHtml: `Alguien acaba de llenar el formulario del sitio. Puedes responderle directo a este correo, ya viene configurado para contestarle a <strong>${escapeHtml(email)}</strong>.`,
          rows: [
            { label: 'Nombre', value: safeName },
            { label: 'Correo', value: escapeHtml(email) },
            { label: 'Teléfono', value: escapeHtml(phone) },
            { label: 'Evaluación de interés', value: safeService },
            { label: 'Mensaje', value: safeMessage },
          ],
          footerNote: 'Notificación automática del formulario de contacto de d-tect.mx.',
        }),
      });
      companyEmailSent = true;
    } catch (err) {
      companyErrorMessage = err.message;
      console.log('Error enviando notificación a la empresa:', err.message);
    }

    let userEmailSent = false;
    try {
      await sendResendEmail(env.RESEND_API_KEY, {
        from: FROM_EMAIL,
        to: [email],
        subject: 'Hemos recibido tu solicitud — D-TECT',
        html: renderEmailHtml({
          heading: `Hola ${safeName}, ¡gracias por escribirnos!`,
          introHtml: 'Recibimos tu solicitud y un especialista se pondrá en contacto contigo pronto. Aquí tienes una copia de lo que nos enviaste:',
          rows: [
            { label: 'Evaluación de interés', value: safeService },
            { label: 'Tu mensaje', value: safeMessage },
          ],
          footerNote: 'Si tú no llenaste este formulario, puedes ignorar este correo.',
        }),
      });
      userEmailSent = true;
    } catch (err) {
      console.log('Aviso: no se pudo enviar confirmación al visitante:', err.message);
    }

    if (!companyEmailSent) {
      return new Response(
        JSON.stringify({ ok: false, error: companyErrorMessage || 'No se pudo notificar a la empresa.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ ok: true, userConfirmationSent: userEmailSent }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    // Cualquier otra ruta: que la sirvan los assets estáticos (tu sitio React).
    return env.ASSETS.fetch(request);
  },
};