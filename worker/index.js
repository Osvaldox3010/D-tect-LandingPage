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
 */

// Destino fijo: pase lo que pase, la notificación llega aquí.
const COMPANY_EMAIL = 'jimenezosvaldo780@gmail.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
    const { name, email, phone, service, message } = data;

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

    const FROM_EMAIL = env.FROM_EMAIL || 'D-TECT Web <no-reply@d-tect.mx>';

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
        html: `
          <p><strong>Nombre:</strong> ${safeName}</p>
          <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
          <p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Evaluación de interés:</strong> ${safeService}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${safeMessage}</p>
        `,
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
        html: `
          <p>Hola ${safeName},</p>
          <p>Gracias por contactar a D-TECT. Recibimos tu solicitud y un especialista se comunicará contigo pronto.</p>
          <p><strong>Resumen de tu mensaje:</strong></p>
          <p><strong>Evaluación de interés:</strong> ${safeService}</p>
          <p>${safeMessage}</p>
        `,
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