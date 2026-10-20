import { Link, Navigate } from 'react-router-dom';
import SettingsMenu from '../components/SettingsMenu.jsx';
import { LeafIcon } from '../components/Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import logo from '../assets/logo.svg';
import './Home.css';

export default function Home() {
  const { t } = useLanguage();
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <section className="landing">
      <div className="landing__art" aria-hidden="true">
        <img src="/images/gambian-rice-field.png" alt="" />
      </div>

      <div className="landing__top">
        <p className="landing__brand">
          <img src={logo} alt="" width="28" height="28" />
          {t('appName')}
        </p>
        <SettingsMenu />
      </div>

      <div className="landing__copy fade-in">
        <h1>{t('tagline')}</h1>
        <p className="landing__eyebrow">
          <LeafIcon size={19} /> Fresh from Gambian farms
        </p>
      </div>

      <div className="landing__actions fade-in">
        <Link to="/marketplace" className="btn btn-primary btn-block">
          {t('explore')}
        </Link>
        <Link to="/livestock" className="btn btn-outline btn-block">
          {t('navLivestock')} &amp; poultry
        </Link>
        <Link to="/login" className="landing__signin">
          {t('signInOrJoin')}
        </Link>
      </div>
    </section>
  );
}
