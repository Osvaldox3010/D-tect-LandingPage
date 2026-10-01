import { useEffect, useRef, useState } from 'react';
import { Modal } from '../Modal/Modal';
import { Eyebrow } from '../ui/Eyebrow';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// MODIFICADO: antes se mostraba con <iframe>, que delega el render al
// visor de PDF del propio navegador (su barra de herramientas, su botón
// de descarga/impresión, y en algunos navegadores/celulares directamente
// no lo muestra inline). Ahora el PDF se dibuja a mano, página por
// página, sobre <canvas> dentro del modal — el navegador nunca "abre" el
// PDF con su propia herramienta, solo se ven imágenes dentro de nuestro
// propio diseño.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

/**
 * Documento en /public, servido tal cual en la raíz del sitio (no pasa por
 * el pipeline de imports de Vite) — ver /public/documents/.
 */
const PRIVACY_PDF_URL = '/documents/aviso-privacidad-poligrafia.pdf';

export function PrivacyModal({ isOpen, onClose }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error

  useEffect(() => {
    if (!isOpen) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    container.innerHTML = '';
    setStatus('loading');

    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument(PRIVACY_PDF_URL).promise;
        const containerWidth = container.clientWidth || 680;
        const outputScale = window.devicePixelRatio || 1;

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNumber);
          const unscaledViewport = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: containerWidth / unscaledViewport.width });

          const canvas = document.createElement('canvas');
          canvas.className = 'privacy-pdf__page';
          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;
          if (cancelled) return;
          container.appendChild(canvas);

          const ctx = canvas.getContext('2d');
          const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;
          // eslint-disable-next-line no-await-in-loop
          await page.render({ canvasContext: ctx, viewport, transform }).promise;
        }

        if (!cancelled) setStatus('ready');
      } catch (err) {
        console.error('No se pudo renderizar el aviso de privacidad:', err);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => { cancelled = true; };
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="document" titleId="privacyModalTitle" ariaLabel="Aviso de privacidad">
      <Eyebrow className="modal__eyebrow">LEGAL</Eyebrow>
      <h3 id="privacyModalTitle">Aviso de privacidad</h3>
      <p className="modal__sub">
        Si prefieres descargarlo, puedes{' '}
        <a href={PRIVACY_PDF_URL} target="_blank" rel="noopener noreferrer" download>descargarlo aquí</a>.
      </p>
      <div className="document-frame">
        <div ref={containerRef} className="privacy-pdf" />
        {status === 'loading' && <p className="privacy-pdf__status">Cargando documento…</p>}
        {status === 'error' && (
          <p className="privacy-pdf__status privacy-pdf__status--error">
            No se pudo mostrar el documento aquí. Usa el enlace de arriba para descargarlo.
          </p>
        )}
      </div>
    </Modal>
  );
}