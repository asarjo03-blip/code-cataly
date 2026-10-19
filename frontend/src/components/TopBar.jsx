import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { formatRegion } from '../utils/format.js';
import { useAuth } from '../context/AuthContext.jsx';
import './TopBar.css';

export default function TopBar({ title, subtitle, showLocation = false, right = null }) {
  const { user } = useAuth();

  return (
    <header className="top-bar fade-in">
      <div className="top-bar__row">
        <div>
          {showLocation && user?.region ? (
            <p className="top-bar__location">
              <span aria-hidden="true">📍</span> {user.village || formatRegion(user.region)}
            </p>
          ) : null}
          {title ? <h1 className="top-bar__title">{title}</h1> : null}
          {subtitle ? <p className="top-bar__subtitle">{subtitle}</p> : null}
        </div>
        <div className="top-bar__actions">
          <LanguageSwitcher compact />
          {right}
          <Link to="/profile" className="top-bar__bell" aria-label="Account">
            🔔
          </Link>
        </div>
      </div>
    </header>
  );
}
