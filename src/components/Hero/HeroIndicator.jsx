import { services } from '../../config/services.config';
import { PlayPauseButton } from '../ui/PlayPauseButton';

export function HeroIndicator({ activeIndex, service, stickyPause, onTogglePlayPause, onSelect }) {
  return (
    <div className="hero__indicator">
      <PlayPauseButton paused={stickyPause} onToggle={onTogglePlayPause} />

      <div className="hero__indicator-text">
        <span className="hero__indicator-num">{String(activeIndex + 1).padStart(2, '0')}/{String(services.length).padStart(2, '0')}</span>
        <span className="hero__indicator-name" style={{ color: `var(${service.accentVar})` }}>{service.name}</span>
        <span className="hero__indicator-caption">{service.caption}</span>
      </div>

      <div className="hero__dots" role="tablist" aria-label="Seleccionar servicio del Hero">
        {services.map((svc, i) => (
          <button
            key={svc.key}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Ver ${svc.name}`}
            className={i === activeIndex ? 'is-active' : ''}
            style={i === activeIndex ? { background: `var(${svc.accentVar})` } : undefined}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
}
