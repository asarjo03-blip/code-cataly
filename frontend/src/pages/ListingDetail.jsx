import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CropArt from '../components/CropArt.jsx';
import ProduceCard from '../components/ProduceCard.jsx';
import { BackIcon, CalendarIcon, HeartIcon, PinIcon, ScaleIcon, ShareIcon } from '../components/Icons.jsx';
import { listingApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useBackendRecovery } from '../hooks/useBackendRecovery.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  formatCrop,
  formatDate,
  formatGmd,
  formatRegion,
  telLink,
  whatsappLink,
} from '../utils/format.js';
import './ListingDetail.css';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const backendRecovery = useBackendRecovery();
  const [listing, setListing] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [caseSize, setCaseSize] = useState('standard');

  useEffect(() => {
    let active = true;
    setListing(null);
    setSimilar([]);
    setError('');
    setLoading(true);
    setQty(1);
    setCaseSize('standard');
    listingApi
      .get(id)
      .then(({ data }) => {
        if (!active) return;
        setListing(data);
        return listingApi.list({ crop: data.crop }).then((response) => {
          if (active) setSimilar(response.data.filter((item) => item.id !== id).slice(0, 4));
        });
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, 'Could not load this listing'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, backendRecovery]);

  if (!listing) {
    return (
      <div className="listing-detail">
        <p>{loading ? t('loading') : error || t('noResults')}</p>
        <Link to="/marketplace">Back to marketplace</Link>
      </div>
    );
  }

  const standardQty = Math.min(listing.quantity, Math.max(10, Math.round(listing.quantity / 4)));
  const soldOut = listing.status === 'sold' || Number(listing.quantity) <= 0;
  const doubleQty = Math.min(listing.quantity, standardQty * 2);
  const selectedQty = caseSize === 'standard' ? standardQty : doubleQty;
  const maxLots = Math.max(1, Math.floor(listing.quantity / selectedQty));
  const selectedLots = Math.min(qty, maxLots);
  const total = selectedQty * listing.askingPrice * selectedLots;

  const message = `Hi ${listing.farmerName}, I saw your ${formatCrop(listing.crop)} listing on AgriConnect (${listing.quantity}${listing.unit} at ${formatGmd(listing.askingPrice)}). Interested in ${selectedQty * selectedLots}${listing.unit}.`;

  return (
    <div className="listing-detail">
      <header className="listing-detail__nav">
        <button type="button" onClick={() => navigate(-1)} aria-label="Back">
          <BackIcon />
        </button>
        <div>
          <button type="button" aria-label="Share" onClick={() => navigator.share?.({ title: listing.crop, url: window.location.href }).catch(() => {})}>
            <ShareIcon />
          </button>
          <button type="button" aria-label="Favourite">
            <HeartIcon />
          </button>
        </div>
      </header>

      <div className="listing-detail__hero">
        <CropArt crop={listing.crop} />
      </div>

      <div className="listing-detail__body fade-in">
        <h1>{formatCrop(listing.crop)} Fresh Farm Pick from {listing.village || formatRegion(listing.region)}</h1>
        {soldOut ? <p className="listing-detail__sold-out">{t('soldOut')}</p> : null}
        <div className="listing-detail__price">
          <span className="price">{formatGmd(listing.askingPrice, listing.unit)}</span>
        </div>

        <div className="listing-meta">
          <div>
            <PinIcon size={18} />
            <strong>Origin</strong>
            <p>{listing.village || formatRegion(listing.region)}</p>
          </div>
          <div>
            <CalendarIcon size={18} />
            <strong>Available</strong>
            <p>{formatDate(listing.availableFrom)}</p>
          </div>
          <div>
            <ScaleIcon size={18} />
            <strong>Stock</strong>
            <p>
              {listing.quantity}
              {listing.unit}
            </p>
          </div>
        </div>

        <section className="listing-seller" aria-labelledby="listing-seller-title">
          <div>
            <h2 id="listing-seller-title">{t('sellerContact')}</h2>
            <p className="listing-seller__name">{listing.farmerName || 'Farmer'}</p>
            {listing.farmerPhone ? (
              <a className="listing-seller__phone" href={telLink(listing.farmerPhone)}>
                {listing.farmerPhone}
              </a>
            ) : (
              <p className="listing-seller__unavailable">{t('contactNotAvailable')}</p>
            )}
          </div>
          {listing.farmerPhone ? (
            <a
              className="btn btn-outline"
              href={whatsappLink(listing.farmerPhone, `Hello ${listing.farmerName || 'farmer'}, I am contacting you about your ${formatCrop(listing.crop)} listing on AgriConnect.`)}
              target="_blank"
              rel="noreferrer"
            >
              {t('whatsapp')}
            </a>
          ) : null}
        </section>

        {listing.notes ? <p className="listing-detail__notes">{listing.notes}</p> : null}

        {!soldOut ? <h2>{t('selectCase')}</h2> : null}
        {!soldOut ? <div className="case-options">
          <button
            type="button"
            className={`case-card ${caseSize === 'standard' ? 'is-selected' : ''}`}
            onClick={() => {
              setCaseSize('standard');
              setQty((current) => Math.min(current, Math.max(1, Math.floor(listing.quantity / standardQty))));
            }}
          >
            <strong>Standard — {standardQty}{listing.unit}</strong>
            <span>{formatGmd(standardQty * listing.askingPrice, 'lot')}</span>
          </button>
          <button
            type="button"
            className={`case-card ${caseSize === 'double' ? 'is-selected' : ''}`}
            onClick={() => {
              setCaseSize('double');
              setQty((current) => Math.min(current, Math.max(1, Math.floor(listing.quantity / doubleQty))));
            }}
          >
            <strong>Double — {doubleQty}{listing.unit}</strong>
            <span>{formatGmd(doubleQty * listing.askingPrice, 'lot')}</span>
          </button>
        </div> : null}

        <div className="section-head">
          <h2>Similar products</h2>
        </div>
        <div className="similar-row">
          {similar.map((item) => (
            <div key={item.id} className="similar-row__item">
              <ProduceCard listing={item} />
            </div>
          ))}
        </div>
      </div>

      {!soldOut ? <footer className="listing-detail__footer">
        <div className="qty-control">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
            −
          </button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(maxLots, q + 1))} aria-label="Increase" disabled={qty >= maxLots}>
            +
          </button>
        </div>
        <div className="listing-detail__cta">
          <a className="btn btn-outline" href={telLink(listing.farmerPhone)}>
            {t('call')}
          </a>
          <a className="btn btn-primary" href={whatsappLink(listing.farmerPhone, message)} target="_blank" rel="noreferrer">
            {t('whatsapp')} · D{total.toFixed(0)}
          </a>
        </div>
      </footer> : null}
    </div>
  );
}
