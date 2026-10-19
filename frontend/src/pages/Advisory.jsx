import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { ADVISORY_CATEGORIES } from '../data/advisories.js';
import { advisoryApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { CROP_LABELS, formatCrop } from '../utils/format.js';
import './Advisory.css';

export default function Advisory() {
  const { t } = useLanguage();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [crop, setCrop] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => {
      setLoading(true);
      setError('');
      advisoryApi
        .list({ q: q || undefined, category, crop: crop || undefined })
        .then(({ data }) => {
          if (active) setItems(data);
        })
        .catch((err) => {
          if (active) setError(getErrorMessage(err, 'Could not load advice'));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, q ? 250 : 0);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [q, category, crop]);

  return (
    <div className="advisory-page">
      <TopBar title={t('advisory')} subtitle="Pests, diseases, soil and storage tips" />

      <label className="search-bar">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          placeholder="Search advice…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>

      <div className="chip-row" style={{ marginTop: '0.85rem' }}>
        {ADVISORY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`chip ${category === cat.id ? 'chip--active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="field" style={{ marginTop: '0.85rem' }}>
        <label htmlFor="cropFilter">Filter by crop</label>
        <select id="cropFilter" value={crop} onChange={(e) => setCrop(e.target.value)}>
          <option value="">All crops</option>
          {Object.entries(CROP_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="advisory-list">
        {items.map((item) => (
          <Link key={item.id} to={`/advisory/${item.id}`} className="advisory-card fade-in">
            <span className={`badge badge--${item.category === 'pest' || item.category === 'disease' ? 'warn' : 'info'}`}>
              {item.category}
            </span>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            {item.crop ? <small>{formatCrop(item.crop)}</small> : <small>All crops</small>}
          </Link>
        ))}
        {error ? <p className="field-error">{error}</p> : null}
        {!loading && !error && !items.length ? <p className="page-subtitle">{t('noResults')}</p> : null}
        {loading ? <p className="page-subtitle">{t('loading')}</p> : null}
      </div>
    </div>
  );
}
