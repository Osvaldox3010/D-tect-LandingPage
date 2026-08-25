import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { NavPanel } from './NavPanel';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import './Header.css';

const LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#faq', label: 'Preguntas frecuentes' },
  { href: '#contacto', label: 'Contacto' },
];

export function Header({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#inicio');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    if (!('IntersectionObserver' in window) || !sections.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveHash('#' + entry.target.id);
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="site-header__inner">
          <Logo />

          <nav className="main-nav" aria-label="Navegación principal">
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={activeHash === l.href ? 'is-active' : ''}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-right">
            <ThemeToggle />
            <Button className="header-cta" onClick={() => onOpenModal('info')}>
              Solicitar información
            </Button>
            <button className="mini-cta" onClick={() => onOpenModal('info')} aria-label="Solicitar información">
              <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="hamburger"
              aria-expanded={navOpen}
              aria-controls="navPanel"
              aria-label="Abrir menú"
              onClick={() => setNavOpen(true)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <NavPanel isOpen={navOpen} onClose={() => setNavOpen(false)} onOpenModal={onOpenModal} />
    </>
  );
}