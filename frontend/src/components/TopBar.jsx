import SettingsMenu from './SettingsMenu.jsx';
import { PinIcon } from './Icons.jsx';
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
              <PinIcon size={16} /> {user.village || formatRegion(user.region)}
            </p>
          ) : null}
          {title ? <h1 className="top-bar__title">{title}</h1> : null}
          {subtitle ? <p className="top-bar__subtitle">{subtitle}</p> : null}
        </div>
        <div className="top-bar__actions">
          {right}
          <SettingsMenu />
        </div>
      </div>
    </header>
  );
}
