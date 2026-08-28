/**
 * Cloudflare Pages Function — recibe el POST del formulario de contacto
 * (ContactForm.jsx hace fetch a '/api/contact'). Como este archivo vive en
 * /functions/api/contact.js, Cloudflare lo expone automáticamente en
 * /api/contact, sin que tengas que tocar nada más.
 *
 * Qué hace:
 *   1. Manda la notificación de "nuevo contacto" SIEMPRE a
 *      jimenezosvaldo780@gmail.com (fijo abajo, no depende de ninguna
 *      variable de entorno, así que nunca se puede ir a otro lado por error
 *      de configuración).
 *   2. Manda un correo de confirmación al correo que la persona escribió
 *      en el formulario.
 *
 * Variable de entorno que SÍ necesitas configurar en Cloudflare Pages
 * (Settings → Environment variables):
 *   RESEND_API_KEY   → tu API key de https://resend.com
 *
 * Variable opcional:
 *   FROM_EMAIL       → remitente verificado en Resend, ej.
 *                       "D-TECT <no-reply@d-tect.mx>". Si no la configuras,
 *                       se usa un valor por defecto (ver abajo), pero para
 *                       que los correos lleguen de verdad necesitas tener
 *                       el dominio remitente verificado en Resend.
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

export async function onRequestPost({ request, env }) {
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

    // 1) Notificación a la empresa — siempre al mismo correo.
    await sendResendEmail(env.RESEND_API_KEY, {
      from: FROM_EMAIL,
      to: [COMPANY_EMAIL],
      reply_to: email, // para poder responder directo a quien llenó el formulario
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

    // 2) Confirmación para quien llenó el formulario.
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

    return new Response(JSON.stringify({ ok: true }), {
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

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 });
  }
  return onRequestPost({ request, env });
}