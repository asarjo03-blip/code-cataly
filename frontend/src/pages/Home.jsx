import { Link, Navigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import './Home.css';

export default function Home() {
  const { t } = useLanguage();
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <section className="landing">
      <div className="landing__sky" aria-hidden="true">
        <span className="landing__sun" />
        <span className="landing__cloud landing__cloud--1" />
        <span className="landing__cloud landing__cloud--2" />
        <span className="landing__mountain" />
        <span className="landing__field" />
        <span className="landing__tractor">🚜</span>
        <span className="landing__farmer">👩‍🌾</span>
        <span className="landing__cow">🐄</span>
      </div>

      <div className="landing__top">
        <p className="landing__brand">{t('appName')}</p>
        <LanguageSwitcher />
      </div>

      <div className="landing__copy fade-in">
        <h1>{t('tagline')}</h1>
        <p>{t('taglineBody')}</p>
        <ul className="landing__features">
          <li>
            <span aria-hidden="true">🍃</span> {t('featureFresh')}
          </li>
          <li>
            <span aria-hidden="true">◆</span> {t('featureWholesale')}
          </li>
          <li>
            <span aria-hidden="true">♡</span> {t('featureTrusted')}
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
