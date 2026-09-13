// Fuente única de los números de WhatsApp de D-TECT. Se usa tanto en la
// sección de Contacto (donde se listan como texto) como en el ícono del
// footer (que ahora abre un menú con estos mismos 3).
export const WHATSAPP_NUMBERS = [
  { digits: '525510111953', display: '55 1011 1953' },
  { digits: '525527452714', display: '55 2745 2714' },
  { digits: '525531495321', display: '55 3149 5321' },
];

export function waHref(digits, message = 'Me gustaría solicitar más información.') {
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

// Correo público que se muestra en la sección de Contacto.
export const CONTACT_EMAIL = 'contacto@grupo-d-tect.com';

// Coordenadas: usa Google Maps -> clic derecho en el punto exacto -> el
// primer número es la latitud y el segundo la longitud.
export const OFFICE = {
  address: 'Av. México-Tenochtitlán 42-103A, Tabacalera, Cuauhtémoc, 06030 Ciudad de México, CDMX',
  mapsUrl: 'https://maps.app.goo.gl/8ZDQ2GGBkamcy9m88',
  lat: 19.4381584,
  lng: -99.1513015,
};