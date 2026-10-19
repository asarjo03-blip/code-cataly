import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { CROP_LABELS, REGION_LABELS } from '../utils/format.js';
import './Auth.css';

const CROPS = Object.keys(CROP_LABELS);

export default function Register() {
  const { t } = useLanguage();
  const { register, error, setError, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'farmer',
    region: 'north_bank',
    village: '',
    farmSizeHectares: 1,
    language: 'en',
    crops: ['groundnut'],
    farmingType: 'rainfed',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleCrop = (crop) => {
    setForm((prev) => {
      const has = prev.crops.includes(crop);
      return {
        ...prev,
        crops: has ? prev.crops.filter((c) => c !== crop) : [...prev.crops, crop],
      };
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register({
        ...form,
        farmSizeHectares: Number(form.farmSizeHectares) || 0,
      });
      navigate('/dashboard', { replace: true });
    } catch {
      /* handled */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-page--wide">
      <div className="auth-page__panel fade-in">
        <div className="auth-page__head">
          <Link to="/" className="auth-page__brand">
            AgriConnect
          </Link>
          <LanguageSwitcher compact />
        </div>
        <h1>{t('register')}</h1>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>{t('role')}</label>
            <div className="role-pills">
              <button
                type="button"
                className={`chip ${form.role === 'farmer' ? 'chip--active' : ''}`}
                onClick={() => set('role', 'farmer')}
              >
                {t('roleFarmer')}
              </button>
              <button
                type="button"
                className={`chip ${form.role === 'vendor' ? 'chip--active' : ''}`}
                onClick={() => set('role', 'vendor')}
              >
                {t('roleBuyer')}
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="name">{t('name')}</label>
            <input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="email">{t('email')}</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="phone">{t('phone')}</label>
            <input id="phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="region">{t('region')}</label>
            <select id="region" value={form.region} onChange={(e) => set('region', e.target.value)}>
              {Object.entries(REGION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="village">{t('village')}</label>
            <input id="village" value={form.village} onChange={(e) => set('village', e.target.value)} />
          </div>
          {form.role === 'farmer' ? (
            <>
              <div className="field">
                <label htmlFor="farmSize">{t('farmSize')}</label>
                <input
                  id="farmSize"
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.farmSizeHectares}
                  onChange={(e) => set('farmSizeHectares', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Farming type</label>
                <select value={form.farmingType} onChange={(e) => set('farmingType', e.target.value)}>
                  <option value="rainfed">Rain-fed</option>
                  <option value="irrigated">Irrigated</option>
                </select>
              </div>
              <div className="field">
                <label>{t('crops')}</label>
                <div className="chip-row" style={{ flexWrap: 'wrap', overflow: 'visible' }}>
                  {CROPS.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      className={`chip ${form.crops.includes(crop) ? 'chip--active' : ''}`}
                      onClick={() => toggleCrop(crop)}
                    >
                      {CROP_LABELS[crop]}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}
          {error ? <p className="field-error">{error}</p> : null}
          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
            {submitting ? t('loading') : t('register')}
          </button>
        </form>
        <p className="auth-page__switch">
          Already registered? <Link to="/login">{t('login')}</Link>
        </p>
      </div>
    </section>
  );
}
