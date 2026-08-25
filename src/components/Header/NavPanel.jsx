import { useEffect } from 'react';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

const LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#faq', label: 'Preguntas frecuentes' },
  { href: '#contacto', label: 'Contacto' },
];

export function NavPanel({ isOpen, onClose, onOpenModal }) {
  useEffect(() => {
    document.body.classList.toggle('no-scroll', isOpen);
  }, [isOpen]);

  return (
    <div className={`nav-panel ${isOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Menú de navegación">
      <div className="nav-panel__top">
        <Logo />
        <div className="nav-panel__top-actions">
          <ThemeToggle />
          <button className="nav-panel__close" onClick={onClose} aria-label="Cerrar menú">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="nav-panel__body">
        <svg className="nav-panel__wave" viewBox="0 0 400 60" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M0 30 H140 L155 5 L172 55 L188 30 H210 L222 40 L235 20 L248 30 H400" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <ul className="nav-panel__links">
          {LINKS.map((l) => (
            <li key={l.href}><a href={l.href} onClick={onClose}>{l.label}</a></li>
          ))}
        </ul>
        <Button className="nav-panel__cta" onClick={() => { onClose(); onOpenModal('info'); }}>
          Solicitar información
        </Button>
      </div>
    </div>
  );
}