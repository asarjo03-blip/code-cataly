import { useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { CROP_LABELS, REGION_LABELS, ROLE_LABELS } from '../utils/format.js';
import './Forms.css';
import './Profile.css';

export default function Profile() {
  const { t, setLanguage } = useLanguage();
  const { user, updateProfile, logout, isAdmin } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    region: user?.region || 'north_bank',
    village: user?.village || '',
    farmSizeHectares: user?.farmSizeHectares ?? '',
    language: user?.language || 'en',
    crops: user?.crops || [],
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleCrop = (crop) => {
    setForm((prev) => ({
      ...prev,
      crops: prev.crops.includes(crop)
        ? prev.crops.filter((c) => c !== crop)
        : [...prev.crops, crop],
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile({
        ...form,
        farmSizeHectares: form.farmSizeHectares === '' ? undefined : Number(form.farmSizeHectares),
      });
      setLanguage(form.language);
      setMessage('Profile saved.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <TopBar title={t('profile')} subtitle={ROLE_LABELS[user?.role] || user?.role} />

      <div className="profile-hero card">
        <div className="profile-hero__avatar" aria-hidden="true">
          {(user?.name || 'A').slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
      </div>

      {isAdmin ? (
        <Link to="/admin" className="btn btn-green btn-block" style={{ marginBottom: '1rem' }}>
          Open {t('admin')} panel
        </Link>
      ) : null}

      <nav className="profile-links">
        <Link to="/calendar">{t('calendar')}</Link>
        <Link to="/my-listings">{t('myListings')}</Link>
        <Link to="/buy-requests">{t('buyRequests')}</Link>
        <Link to="/markets">{t('markets')}</Link>
      </nav>

      {message ? <p className="form-page__toast">{message}</p> : null}
      {error ? <p className="field-error">{error}</p> : null}

      <form className="form-card" onSubmit={onSubmit}>
        <h2>Edit profile</h2>
        <div className="field">
          <label>{t('name')}</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </div>
        <div className="field">
          <label>{t('phone')}</label>
          <input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>
        <div className="field">
          <label>{t('region')}</label>
          <select value={form.region} onChange={(e) => set('region', e.target.value)}>
            {Object.entries(REGION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>{t('village')}</label>
          <input value={form.village} onChange={(e) => set('village', e.target.value)} />
        </div>
        <div className="field">
          <label>{t('farmSize')}</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.farmSizeHectares}
            onChange={(e) => set('farmSizeHectares', e.target.value)}
          />
        </div>
        <div className="field">
          <label>{t('language')}</label>
          <select value={form.language} onChange={(e) => set('language', e.target.value)}>
            <option value="en">English</option>
            <option value="mnk">Mandinka</option>
            <option value="wo">Wolof</option>
            <option value="ff">Fula</option>
          </select>
        </div>
        <div className="field">
          <label>{t('crops')}</label>
          <div className="chip-row" style={{ flexWrap: 'wrap', overflow: 'visible' }}>
            {Object.entries(CROP_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`chip ${form.crops.includes(value) ? 'chip--active' : ''}`}
                onClick={() => toggleCrop(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
          {saving ? t('loading') : t('save')}
        </button>
      </form>

      <button type="button" className="btn btn-outline btn-block" onClick={logout}>
        {t('logout')}
      </button>
    </div>
  );
}
