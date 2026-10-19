import './AlertBanner.css';

const ICONS = {
  weather: '🌧',
  pest: '🐛',
  market: '📈',
  urgent: '⚠',
  seasonal: '🌱',
  general: 'ℹ',
};

export default function AlertBanner({ alert }) {
  const severity = alert.severity || alert.priority || 'info';
  const type = alert.type || alert.priority || 'general';

  return (
    <article className={`alert-banner alert-banner--${severity}`}>
      <span className="alert-banner__icon" aria-hidden="true">
        {ICONS[type] || ICONS.general}
      </span>
      <div>
        <h3>{alert.title || alert.event || 'Alert'}</h3>
        <p>{alert.message || alert.body || alert.description}</p>
      </div>
    </article>
  );
}
