import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'dtect-theme';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'dark' || saved === 'light' ? saved : null;
  } catch (e) {
    return null; // localStorage no disponible (modo privado, etc.)
  }
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  // El script inline en index.html ya dejó <html data-theme="..."> antes
  // del primer paint (evita flash de tema incorrecto) — lo reusamos.
  const applied = document.documentElement.getAttribute('data-theme');
  if (applied === 'dark' || applied === 'light') return applied;
  return getStoredTheme() || getSystemTheme();
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  // Aplica el atributo en <html> cada vez que cambia el tema (tokens.css
  // reacciona a [data-theme="dark"]).
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Mientras el usuario no haya elegido manualmente un tema, seguimos la
  // preferencia del sistema en vivo (ej. su SO cambia a oscuro al
  // anochecer). En cuanto usa el toggle, se guarda su elección y dejamos
  // de escuchar cambios del sistema.
  useEffect(() => {
    if (getStoredTheme()) return undefined;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) { /* ignorar */ }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}