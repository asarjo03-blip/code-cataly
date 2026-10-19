import { AlertMarketIcon, AlertPestIcon, AlertUrgentIcon, AlertWeatherIcon, AdviceIcon } from './Icons.jsx';
import './AlertBanner.css';

const ICONS = {
  weather: AlertWeatherIcon,
  pest: AlertPestIcon,
  market: AlertMarketIcon,
  urgent: AlertUrgentIcon,
  seasonal: AdviceIcon,
  general: AdviceIcon,
};

export default function AlertBanner({ alert }) {
  const severity = alert.severity || alert.priority || 'info';
  const type = alert.type || alert.priority || 'general';
  const Icon = ICONS[type] || AdviceIcon;

  return (
    <article className={`alert-banner alert-banner--${severity}`}>
      <span className="alert-banner__icon" aria-hidden="true">
        <Icon size={22} />
      </span>
      <div>
        <h3>{alert.title || alert.event || 'Alert'}</h3>
        <p>{alert.message || alert.body || alert.description}</p>
      </div>
    </article>
  );
}
