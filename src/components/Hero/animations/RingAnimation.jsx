import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/** 05 — Antecedentes penales · Anillo de verificación (sección 4.5). */
export function RingAnimation() {
  const reducedMotion = useReducedMotion();
  const [verified, setVerified] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) { setVerified(true); return; }
    const iv = setInterval(() => setVerified((v) => !v), 2600);
    return () => clearInterval(iv);
  }, [reducedMotion]);

  return (
    <>
      <div className="verify-ring" />
      <div className={`verify-status ${verified ? 'is-verified' : ''}`}>
        {verified ? 'VERIFICADO' : 'VERIFICANDO…'}
      </div>
    </>
  );
}
