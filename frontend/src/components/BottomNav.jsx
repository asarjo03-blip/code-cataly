import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import './BottomNav.css';

const Icon = ({ children }) => <span className="bottom-nav__icon" aria-hidden="true">{children}</span>;

export default function BottomNav() {
  const { t } = useLanguage();
  const { isAuthenticated, isFarmer } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="bottom-nav" aria-label="Main">
      <div className="bottom-nav__inner">
        <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <Icon>⌂</Icon>
          <span>{t('navHome')}</span>
        </NavLink>
        <NavLink to="/markets" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <Icon>◎</Icon>
          <span>{t('navMarkets')}</span>
        </NavLink>
        <NavLink to="/marketplace" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <Icon>▣</Icon>
          <span>{t('navShop')}</span>
        </NavLink>
        <NavLink to="/advisory" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <Icon>✦</Icon>
          <span>{t('navAdvice')}</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <Icon>○</Icon>
          <span>{t('navAccount')}</span>
        </NavLink>
        {isFarmer && (
          <NavLink to="/my-listings" className="bottom-nav__cart" aria-label={t('myListings')}>
            +
          </NavLink>
        )}
      </div>
    </nav>
  );
}
