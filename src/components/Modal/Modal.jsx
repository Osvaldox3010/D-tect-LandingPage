import { useEffect, useRef } from 'react';
import './Modal.css';

/**
 * Modal genérico reutilizable. Usado por el modal de "Solicitar información"
 * y por el modal de video ("Ver cómo funciona").
 *
 * <Modal isOpen={open} onClose={...} variant="video" ariaLabel="...">...</Modal>
 */
export function Modal({ isOpen, onClose, children, variant = 'default', ariaLabel, titleId }) {
  const overlayRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    if (isOpen) {
      lastFocused.current = document.activeElement;
      document.body.classList.add('no-scroll');
      const focusable = overlayRef.current?.querySelector('input, textarea, button');
      const t = setTimeout(() => focusable?.focus(), 300);
      return () => clearTimeout(t);
    }
    document.body.classList.remove('no-scroll');
    lastFocused.current?.focus?.();
  }, [isOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <div
      ref={overlayRef}
      className={`modal-overlay ${isOpen ? 'is-open' : ''}`}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      aria-hidden={!isOpen}
    >
      <div
        className={`modal ${variant === 'video' ? 'modal--video' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={titleId}
      >
        <button className="modal__close" onClick={onClose} aria-label="Cerrar">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
