/** Etiqueta técnica reutilizable (punto + texto en mayúsculas/mono). */
export function Eyebrow({ children, style, className = '', ...rest }) {
  return (
    <p className={`eyebrow ${className}`} style={style} {...rest}>
      <span className="dot" />
      {children}
    </p>
  );
}
