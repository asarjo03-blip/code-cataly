import { Link, Navigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { CheckIcon, LeafIcon, MarketsIcon } from '../components/Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import landingFarm from '../assets/landing-farm.svg';
import logo from '../assets/logo.svg';
import './Home.css';

export default function Home() {
  const { t } = useLanguage();
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <section className="landing">
      <div className="landing__art" aria-hidden="true">
        <img src={landingFarm} alt="" />
      </div>

      <div className="landing__top">
        <p className="landing__brand">
          <img src={logo} alt="" width="28" height="28" />
          {t('appName')}
        </p>
        <LanguageSwitcher />
      </div>

      <div className="landing__copy fade-in">
        <h1>{t('tagline')}</h1>
        <p>{t('taglineBody')}</p>
        <ul className="landing__features">
          <li>
            <LeafIcon size={22} /> {t('featureFresh')}
          </li>
          <li>
            <MarketsIcon size={22} /> {t('featureWholesale')}
          </li>
          <li>
            <CheckIcon size={22} /> {t('featureTrusted')}
          </li>
        </ul>
      </div>

      <div className="landing__actions fade-in">
        <Link to="/marketplace" className="btn btn-primary btn-block">
          {t('explore')}
        </Link>
        <Link to="/login" className="landing__signin">
          {t('signInOrJoin')}
        </Link>
      </div>
    </section>
  );
}
