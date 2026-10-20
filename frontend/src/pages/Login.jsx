import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import SettingsMenu from '../components/SettingsMenu.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import './Auth.css';

export default function Login() {
  const { t } = useLanguage();
  const { login, error, setError, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('farmer@agriconnect.gm');
  const [password, setPassword] = useState('Password123');
  const [submitting, setSubmitting] = useState(false);
  const allowAccountSwitch = new URLSearchParams(location.search).get('switch') === '1';

  if (!loading && isAuthenticated && !allowAccountSwitch) {
    return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch {
      /* error set in context */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-page__panel fade-in">
        <div className="auth-page__head">
          <Link to="/" className="auth-page__brand">
            AgriConnect
          </Link>
          <SettingsMenu />
        </div>
        <h1>{t('login')}</h1>
        <p className="auth-page__hint">Demo: farmer@agriconnect.gm / Password123</p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">{t('email')}</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? <p className="field-error">{error}</p> : null}
          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
            {submitting ? t('loading') : t('login')}
          </button>
        </form>
        <p className="auth-page__switch">
          New here? <Link to="/register">{t('register')}</Link>
        </p>
      </div>
    </section>
  );
}
