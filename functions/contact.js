/**
 * Cloudflare Pages Function — recibe el POST del formulario de contacto
 * (ContactForm.jsx hace fetch a /api/contact) y lo reenvía a un servicio
 * de correo transaccional.
 *
 * Ruta de archivo: si este archivo vive en /functions/contact.js,
 * Cloudflare Pages lo expone automáticamente en /contact — ajusta el
 * fetch de ContactForm.jsx a esa ruta, o renombra este archivo a
 * /functions/api/contact.js para que coincida con /api/contact.
 *
 * Variables de entorno necesarias (configúralas en el dashboard de
 * Cloudflare Pages → Settings → Environment variables):
 *   RESEND_API_KEY   (o el proveedor de correo transaccional que uses)
 *   CONTACT_TO_EMAIL
 */
export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    const { name, email, phone, service, message } = data;
    if (!name || !email || !phone) {
      return new Response(JSON.stringify({ ok: false, error: 'Faltan campos requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ejemplo con Resend (https://resend.com) — sustituye por tu proveedor real
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'D-TECT Web <no-reply@d-tect.mx>',
        to: env.CONTACT_TO_EMAIL,
        subject: `Nueva solicitud de contacto — ${name}`,
        text: `Nombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone}\nEvaluación de interés: ${service || 'No especificada'}\nMensaje: ${message || '(sin mensaje)'}`,
      }),
    });

    if (!res.ok) throw new Error('Error al enviar el correo');

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
