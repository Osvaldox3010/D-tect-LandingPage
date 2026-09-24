import { Modal } from '../Modal/Modal';

/**
 * Video en /public, servido tal cual en la raíz del sitio — ver
 * /public/videos/. Así evitamos que Vite intente procesar/hashear un
 * archivo binario grande de video como si fuera un módulo con import.
 */
const HOW_IT_WORKS_VIDEO_URL = '/videos/como-funciona-dtect.mp4';

export function VideoModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="video" ariaLabel="Cómo funciona una evaluación D-TECT">
      <div className="video-frame">
        {isOpen && (
          <video
            className="video-frame__el"
            src={HOW_IT_WORKS_VIDEO_URL}
            controls
            autoPlay
            playsInline
          />
        )}
      </div>
    </Modal>
  );
}
