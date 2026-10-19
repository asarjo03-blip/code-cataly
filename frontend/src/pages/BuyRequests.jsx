import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import { buyRequestApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  CROP_LABELS,
  REGION_LABELS,
  formatCrop,
  formatDate,
  formatGmd,
  formatRegion,
  telLink,
  whatsappLink,
} from '../utils/format.js';
import './Forms.css';

export default function BuyRequests() {
  const { t } = useLanguage();
  const { user, isBuyer } = useAuth();
  const [tick, setTick] = useState(0);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    crop: 'groundnut',
    quantity: 200,
    unit: 'kg',
    offerPrice: 45,
    region: user?.region || 'kanifing',
    neededBy: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  useEffect(() => {
    let active = true;
    buyRequestApi
      .list()
      .then(({ data }) => {
        if (active) setRequests(data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, 'Could not load buy requests'));
      });
    return () => {
      active = false;
    };
  }, [tick]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await buyRequestApi.create({
        ...form,
        quantity: Number(form.quantity),
        offerPrice: Number(form.offerPrice),
        ownerId: user?.id,
        buyerName: user?.name || 'Demo buyer',
        buyerPhone: user?.phone || '+220 200 0000',
      });
      setMessage('Buy request posted.');
      setTick((n) => n + 1);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not post buy request'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-page">
      <TopBar title={t('buyRequests')} subtitle="What traders and institutions need" />
      {message ? <p className="form-page__toast">{message}</p> : null}
      {error ? <p className="field-error">{error}</p> : null}

      {isBuyer ? (
        <form className="form-card" onSubmit={onSubmit}>
          <h2>{t('addRequest')}</h2>
          <div className="field">
            <label>Crop</label>
            <select value={form.crop} onChange={(e) => set('crop', e.target.value)}>
              {Object.entries(CROP_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Quantity</label>
              <input type="number" min="1" value={form.quantity} onChange={(e) => set('quantity', e.target.value)} />
            </div>
            <div className="field">
              <label>Unit</label>
              <select value={form.unit} onChange={(e) => set('unit', e.target.value)}>
                <option value="kg">kg</option>
                <option value="bag">bag</option>
                <option value="crate">crate</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Offer (D/{form.unit})</label>
            <input type="number" min="1" value={form.offerPrice} onChange={(e) => set('offerPrice', e.target.value)} />
          </div>
          <div className="field">
            <label>Region</label>
            <select value={form.region} onChange={(e) => set('region', e.target.value)}>
              {Object.entries(REGION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Needed by</label>
            <input type="date" value={form.neededBy} onChange={(e) => set('neededBy', e.target.value)} />
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
            {saving ? t('loading') : t('create')}
          </button>
        </form>
      ) : null}

      <div className="list-stack">
        {requests.map((req) => (
          <article key={req.id} className="list-item">
            <div>
              <h3>
                {formatCrop(req.crop)} · {req.quantity}
                {req.unit}
              </h3>
              <p>
                {req.buyerName} offers {formatGmd(req.offerPrice, req.unit)} · {formatRegion(req.region)} · by{' '}
                {formatDate(req.neededBy)}
              </p>
              {req.notes ? <p>{req.notes}</p> : null}
            </div>
            <div className="list-item__actions">
              <a href={telLink(req.buyerPhone)}>{t('call')}</a>
              <a href={whatsappLink(req.buyerPhone, `Hello, I can supply ${formatCrop(req.crop)} via AgriConnect.`)} target="_blank" rel="noreferrer">
                {t('whatsapp')}
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
