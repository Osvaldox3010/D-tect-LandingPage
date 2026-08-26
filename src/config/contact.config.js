// Fuente única de los números de WhatsApp de D-TECT. Se usa tanto en la
// sección de Contacto (donde se listan como texto) como en el ícono del
// footer (que ahora abre un menú con estos mismos 3).
export const WHATSAPP_NUMBERS = [
  { digits: '525565256934', display: '55 6525 6934' },
  { digits: '525510111953', display: '55 1011 1953' },
  { digits: '525527452714', display: '55 2745 2714' },
];

export function waHref(digits, message = 'Me gustaría solicitar más información.') {
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}