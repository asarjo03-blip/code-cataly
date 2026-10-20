import { NavLink } from 'react-router-dom';
import { AccountIcon, AdviceIcon, FarmIcon, HomeIcon, MarketsIcon, PlusIcon, ShopIcon } from './Icons.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import './BottomNav.css';

export default function BottomNav() {
  const { t } = useLanguage();
  const { isAuthenticated, isFarmer } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="bottom-nav" aria-label="Main">
      <div className="bottom-nav__inner">
        <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <HomeIcon />
          <span>{t('navHome')}</span>
        </NavLink>
        <NavLink to="/markets" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <MarketsIcon />
          <span>{t('navMarkets')}</span>
        </NavLink>
        <NavLink to="/marketplace" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <ShopIcon />
          <span>{t('navShop')}</span>
        </NavLink>
        <NavLink to="/livestock" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <FarmIcon />
          <span>{t('navLivestock')}</span>
        </NavLink>
        <NavLink to="/advisory" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <AdviceIcon />
          <span>{t('navAdvice')}</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <AccountIcon />
          <span>{t('navAccount')}</span>
        </NavLink>
        {isFarmer && (
          <NavLink to="/my-listings" className="bottom-nav__cart" aria-label={t('myListings')}>
            <PlusIcon />
          </NavLink>
        )}
      </div>
    </nav>
  );
}
