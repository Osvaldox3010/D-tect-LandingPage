import './SignalDivider.css';

export function SignalDivider() {
  return (
    <div className="signal-divider">
      <div className="container signal-divider__inner">
        {/* <span className="signal-divider__label">LA SEÑAL CONTINÚA</span> */}
        <div className="signal-divider__wave">
          <svg viewBox="0 0 1000 20" preserveAspectRatio="none">
            <path d="M0 10 H420 L430 2 L440 18 L450 10 H560 L568 4 L578 16 L588 10 H1000" stroke="currentColor" strokeWidth="1.3" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <span className="eyebrow status"><span className="dot" />ACTIVO</span>
      </div>
    </div>
  );
}
