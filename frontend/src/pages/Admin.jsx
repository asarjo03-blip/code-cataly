import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import { advisoryApi, alertApi, marketApi, userApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { CROP_LABELS, REGION_LABELS, ROLE_LABELS, formatCrop, formatRegion } from '../utils/format.js';
import './Forms.css';
import './Admin.css';

export default function Admin() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('prices');
  const [users, setUsers] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [priceForm, setPriceForm] = useState({
    crop: 'groundnut',
    marketId: 'farafenni',
    pricePerKg: 45,
    note: '',
  });
  const [alertForm, setAlertForm] = useState({
    type: 'weather',
    severity: 'urgent',
    region: 'north_bank',
    title: '',
    message: '',
  });
  const [advisoryForm, setAdvisoryForm] = useState({
    title: '',
    summary: '',
    body: '',
    category: 'general',
    crop: 'groundnut',
  });

  useEffect(() => {
    userApi
      .listUsers()
      .then((res) => {
        const payload = res.data;
        setUsers(payload?.users || (Array.isArray(payload) ? payload : []));
      })
      .catch((err) => setError(getErrorMessage(err, 'Could not load users')));
  }, []);

  useEffect(() => {
    marketApi
      .list()
      .then((res) => setMarkets(res.data || []))
      .catch((err) => setError(getErrorMessage(err, 'Could not load markets')));
  }, []);

  const notify = (text) => {
    setToast(text);
    setTimeout(() => setToast(''), 2500);
  };

  const submitPrice = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await marketApi.submitPrice({
        ...priceForm,
        pricePerKg: Number(priceForm.pricePerKg),
      });
      notify('Market price published.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not publish market price'));
    } finally {
      setSaving(false);
    }
  };

  const submitAlert = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await alertApi.create(alertForm);
      notify('Alert created.');
      setAlertForm((prev) => ({ ...prev, title: '', message: '' }));
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create alert'));
    } finally {
      setSaving(false);
    }
  };

  const submitAdvisory = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await advisoryApi.create(advisoryForm);
      notify('Advisory published.');
      setAdvisoryForm({ title: '', summary: '', body: '', category: 'general', crop: 'groundnut' });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not publish advisory'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <TopBar title={t('admin')} subtitle="Manage prices, alerts, advisories and users" />
      {toast ? <p className="form-page__toast">{toast}</p> : null}
      {error ? <p className="field-error">{error}</p> : null}

      <div className="chip-row">
        {['prices', 'alerts', 'advisories', 'users'].map((id) => (
          <button
            key={id}
            type="button"
            className={`chip ${tab === id ? 'chip--active' : ''}`}
            onClick={() => setTab(id)}
          >
            {id}
          </button>
        ))}
      </div>

      {tab === 'prices' ? (
        <form className="form-card" onSubmit={submitPrice}>
          <h2>Submit market price</h2>
          <div className="field">
            <label>Crop</label>
            <select
              value={priceForm.crop}
              onChange={(e) => setPriceForm((p) => ({ ...p, crop: e.target.value }))}
            >
              {Object.entries(CROP_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Market</label>
            <select
              value={priceForm.marketId}
              onChange={(e) => setPriceForm((p) => ({ ...p, marketId: e.target.value }))}
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Price (GMD/kg)</label>
            <input
              type="number"
              min="1"
              value={priceForm.pricePerKg}
              onChange={(e) => setPriceForm((p) => ({ ...p, pricePerKg: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Note</label>
            <input
              value={priceForm.note}
              onChange={(e) => setPriceForm((p) => ({ ...p, note: e.target.value }))}
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
            Submit price
          </button>
        </form>
      ) : null}

      {tab === 'alerts' ? (
        <form className="form-card" onSubmit={submitAlert}>
          <h2>Create alert</h2>
          <div className="form-grid">
            <div className="field">
              <label>Type</label>
              <select
                value={alertForm.type}
                onChange={(e) => setAlertForm((p) => ({ ...p, type: e.target.value }))}
              >
                <option value="weather">Weather</option>
                <option value="pest">Pest</option>
                <option value="market">Market</option>
              </select>
            </div>
            <div className="field">
              <label>Severity</label>
              <select
                value={alertForm.severity}
                onChange={(e) => setAlertForm((p) => ({ ...p, severity: e.target.value }))}
              >
                <option value="urgent">Urgent</option>
                <option value="seasonal">Seasonal</option>
                <option value="info">Info</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Region</label>
            <select
              value={alertForm.region}
              onChange={(e) => setAlertForm((p) => ({ ...p, region: e.target.value }))}
            >
              {Object.entries(REGION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Title</label>
            <input
              value={alertForm.title}
              onChange={(e) => setAlertForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label>Message</label>
            <textarea
              value={alertForm.message}
              onChange={(e) => setAlertForm((p) => ({ ...p, message: e.target.value }))}
              required
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
            Publish alert
          </button>
        </form>
      ) : null}

      {tab === 'advisories' ? (
        <form className="form-card" onSubmit={submitAdvisory}>
          <h2>Create advisory</h2>
          <div className="field">
            <label>Title</label>
            <input
              value={advisoryForm.title}
              onChange={(e) => setAdvisoryForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Category</label>
              <select
                value={advisoryForm.category}
                onChange={(e) => setAdvisoryForm((p) => ({ ...p, category: e.target.value }))}
              >
                <option value="pest">Pest</option>
                <option value="disease">Disease</option>
                <option value="soil">Soil</option>
                <option value="storage">Storage</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="field">
              <label>Crop</label>
              <select
                value={advisoryForm.crop}
                onChange={(e) => setAdvisoryForm((p) => ({ ...p, crop: e.target.value }))}
              >
                {Object.entries(CROP_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Summary</label>
            <input
              value={advisoryForm.summary}
              onChange={(e) => setAdvisoryForm((p) => ({ ...p, summary: e.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label>Body</label>
            <textarea
              value={advisoryForm.body}
              onChange={(e) => setAdvisoryForm((p) => ({ ...p, body: e.target.value }))}
              required
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
            Publish advisory
          </button>
        </form>
      ) : null}

      {tab === 'users' ? (
        <div className="list-stack">
          {(Array.isArray(users) ? users : []).map((u) => (
            <article key={u.id || u._id || u.email} className="list-item">
              <div>
                <h3>{u.name}</h3>
                <p>
                  {u.email} · {ROLE_LABELS[u.role] || u.role} · {formatRegion(u.region)}
                </p>
                {u.crops?.length ? (
                  <p>{u.crops.map((c) => formatCrop(c)).join(', ')}</p>
                ) : null}
              </div>
            </article>
          ))}
          {!users?.length ? <p className="page-subtitle">No users loaded (admin/extension only).</p> : null}
        </div>
      ) : null}
    </div>
  );
}
