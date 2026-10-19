import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { listingApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { CROP_LABELS, REGION_LABELS, formatCrop, formatGmd, formatRegion } from '../utils/format.js';
import './Forms.css';

const emptyForm = {
  crop: 'groundnut',
  quantity: 100,
  unit: 'kg',
  askingPrice: 40,
  region: 'north_bank',
  village: '',
  availableFrom: new Date().toISOString().slice(0, 10),
  notes: '',
};

export default function MyListings() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const [mine, setMine] = useState([]);
  const [form, setForm] = useState({
    ...emptyForm,
    region: user?.region || 'north_bank',
    village: user?.village || '',
    crop: user?.crops?.[0] || 'groundnut',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    listingApi
      .list({ mine: true, ownerId: user?.id, ownerName: user?.name })
      .then(({ data }) => {
        if (active) setMine(data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, 'Could not load your listings'));
      });
    return () => {
      active = false;
    };
  }, [user?.id, tick]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      quantity: Number(form.quantity),
      askingPrice: Number(form.askingPrice),
      image: form.crop,
      ownerId: user?.id,
      farmerName: user?.name || 'Demo farmer',
      farmerPhone: user?.phone || '+220 300 0000',
    };
    try {
      if (editingId) await listingApi.update(editingId, payload);
      else await listingApi.create(payload);
      setForm({ ...emptyForm, region: user?.region || 'north_bank', village: user?.village || '' });
      setEditingId(null);
      setMessage(editingId ? 'Listing updated.' : 'Listing posted.');
      setTick((n) => n + 1);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save listing'));
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (listing) => {
    setEditingId(listing.id);
    setForm({
      crop: listing.crop,
      quantity: listing.quantity,
      unit: listing.unit,
      askingPrice: listing.askingPrice,
      region: listing.region,
      village: listing.village || '',
      availableFrom: listing.availableFrom?.slice(0, 10) || '',
      notes: listing.notes || '',
    });
  };

  const onDelete = async (id) => {
    setError('');
    try {
      await listingApi.remove(id);
      setMessage('Listing removed.');
      setTick((n) => n + 1);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not remove listing'));
    }
  };

  return (
    <div className="form-page">
      <TopBar title={t('myListings')} subtitle="Post and manage your produce" />
      {message ? <p className="form-page__toast">{message}</p> : null}
      {error ? <p className="field-error">{error}</p> : null}

      <form className="form-card" onSubmit={onSubmit}>
        <h2>{editingId ? t('edit') : t('addListing')}</h2>
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
            <input type="number" min="1" value={form.quantity} onChange={(e) => set('quantity', e.target.value)} required />
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
          <label>Asking price (GMD/{form.unit})</label>
          <input type="number" min="1" value={form.askingPrice} onChange={(e) => set('askingPrice', e.target.value)} required />
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
          <label>Village</label>
          <input value={form.village} onChange={(e) => set('village', e.target.value)} />
        </div>
        <div className="field">
          <label>Available from</label>
          <input type="date" value={form.availableFrom} onChange={(e) => set('availableFrom', e.target.value)} />
        </div>
        <div className="field">
          <label>Notes</label>
          <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
          {saving ? t('loading') : editingId ? t('save') : t('create')}
        </button>
      </form>

      <div className="section-head">
        <h2>Your posts</h2>
      </div>
      <div className="list-stack">
        {mine.map((listing) => (
          <article key={listing.id} className="list-item">
            <div>
              <h3>
                {formatCrop(listing.crop)} · {listing.quantity}
                {listing.unit}
              </h3>
              <p>
                {formatGmd(listing.askingPrice)} · {listing.village || formatRegion(listing.region)} · {listing.status}
              </p>
            </div>
            <div className="list-item__actions">
              {listing.status === 'open' ? <Link to={`/marketplace/${listing.id}`}>View</Link> : null}
              <button type="button" onClick={() => onEdit(listing)}>
                {t('edit')}
              </button>
              <button type="button" className="danger" onClick={() => onDelete(listing.id)}>
                {t('delete')}
              </button>
            </div>
          </article>
        ))}
        {!mine.length ? <p className="page-subtitle">{t('noResults')}</p> : null}
      </div>
    </div>
  );
}
