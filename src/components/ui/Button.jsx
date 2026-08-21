import './Button.css';

/**
 * Botón reutilizable. variant: 'primary' | 'ghost'
 * Úsalo para cualquier CTA del sitio (Hero, header, modales, formularios).
 */
export function Button({ variant = 'primary', as = 'button', style, className = '', children, ...rest }) {
  const Tag = as;
  if (variant === 'ghost') {
    return (
      <Tag className={`btn-ghost ${className}`.trim()} {...rest}>
        <span className="play-circle">
          <svg viewBox="0 0 12 14" fill="none" aria-hidden="true">
            <path d="M1 1L11 7L1 13V1Z" fill="currentColor" />
          </svg>
        </span>
        {children}
      </Tag>
    );
  }
  return (
    <Tag className={`btn btn-primary ${className}`.trim()} style={style} {...rest}>
      {children}
      <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Tag>
  );
}
