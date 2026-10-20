import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CropArt from '../components/CropArt.jsx';
import ProduceCard from '../components/ProduceCard.jsx';
import { SearchIcon } from '../components/Icons.jsx';
import TopBar from '../components/TopBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { listingApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useBackendRecovery } from '../hooks/useBackendRecovery.js';
import { CROP_LABELS, REGION_LABELS, formatCrop } from '../utils/format.js';
import './Marketplace.css';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'groundnut', label: 'Groundnut' },
  { id: 'onion', label: 'Onion' },
  { id: 'tomato', label: 'Tomato' },
  { id: 'mango', label: 'Mango' },
  { id: 'rice', label: 'Rice' },
  { id: 'millet', label: 'Millet' },
];

export default function Marketplace() {
  const { t } = useLanguage();
  const backendRecovery = useBackendRecovery();
  const { isFarmer, isBuyer, isAuthenticated } = useAuth();
  const [q, setQ] = useState('');
  const [crop, setCrop] = useState('all');
  const [region, setRegion] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => {
      setLoading(true);
      setError('');
      listingApi
        .list({
          q: q || undefined,
          crop: crop === 'all' ? undefined : crop,
          region: region || undefined,
          maxPrice: maxPrice || undefined,
        })
        .then(({ data }) => {
          if (active) setListings(data);
        })
        .catch((err) => {
          if (active) setError(getErrorMessage(err, 'Could not load produce listings'));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, q ? 250 : 0);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [q, crop, region, maxPrice, backendRecovery]);

  return (
    <div className="marketplace-page">
      <TopBar showLocation title={t('marketplace')} subtitle="Find produce from Gambian farms" />

      <figure className="marketplace-market-photo">
        <img
          src="/images/serrekunda-market-chilli.jpg"
          alt="Fresh chilli peppers for sale at Serrekunda Market in The Gambia"
          fetchPriority="high"
        />
        <figcaption>
          Serrekunda Market, The Gambia · Photo by{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:Chilli_by_the_dozen,_Serrekunda_market,_The_Gambia_(6646713697).jpg"
            target="_blank"
            rel="noreferrer"
          >
            Forbes Johnston
          </a>{' '}
          ·{' '}
          <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">
            CC BY 2.0
          </a>
        </figcaption>
      </figure>

      <label className="search-bar">
        <SearchIcon size={18} />
        <input
          type="search"
          placeholder={t('search')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>

      <div className="promo-row">
        <article className="promo-card promo-card--blue">
          <h3>Same day contact</h3>
          <p>Call or WhatsApp farmers directly</p>
        </article>
        <article className="promo-card promo-card--green">
          <h3>Best prices</h3>
          <p>Compare markets before you sell</p>
        </article>
        <article className="promo-card promo-card--amber">
          <h3>Buy requests</h3>
          <p>Traders posting what they need</p>
        </article>
      </div>

      <div className="section-head">
        <h2>Categories</h2>
      </div>
      <div className="chip-row">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`chip ${crop === cat.id ? 'chip--active' : ''}`}
            onClick={() => setCrop(cat.id)}
          >
            {cat.id !== 'all' ? <CropArt crop={cat.id} alt="" className="chip-crop" /> : null}
            {cat.label}
          </button>
        ))}
      </div>

      <div className="filters-row">
        <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Region filter">
          <option value="">All regions</option>
          {Object.entries(REGION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Max D/kg"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          aria-label="Max price"
        />
      </div>

      <div className="section-head">
        <h2>{t('freshProduce')}</h2>
        {isAuthenticated ? (
          <Link to={isFarmer ? '/my-listings' : '/buy-requests'} className="section-link">
            {isFarmer ? t('addListing') : t('addRequest')}
          </Link>
        ) : (
          <Link to="/login" className="section-link">
            {t('signInOrJoin')}
          </Link>
        )}
      </div>

      <div className="produce-grid">
        {listings.map((listing) => (
          <ProduceCard key={listing.id} listing={listing} />
        ))}
      </div>
      {error ? <p className="field-error">{error}</p> : null}
      {!loading && !error && !listings.length ? <p className="page-subtitle">{t('noResults')}</p> : null}
      {loading ? <p className="page-subtitle">{t('loading')}</p> : null}

      {isBuyer ? (
        <p className="marketplace-note">
          Looking for bulk? Browse <Link to="/buy-requests">buy requests</Link> or post one.
        </p>
      ) : null}

      <p className="marketplace-note muted">
        Showing {listings.length} open listings
        {crop !== 'all' ? ` for ${formatCrop(crop)}` : ''}. Crops: {Object.keys(CROP_LABELS).length} tracked.
      </p>
    </div>
  );
}
