import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { buyRequestApi, listingApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useBackendRecovery } from '../hooks/useBackendRecovery.js';
import { REGION_LABELS, formatDate, formatGmd, formatRegion, telLink, whatsappLink } from '../utils/format.js';
import './Livestock.css';

const ANIMALS = [
  { id: 'broiler_chicken', label: 'Broiler chickens' },
  { id: 'layer_chicken', label: 'Layer chickens' },
  { id: 'sheep', label: 'Sheep' },
  { id: 'goat', label: 'Goats' },
  { id: 'cattle', label: 'Cattle' },
  { id: 'duck', label: 'Ducks' },
];

const ANIMAL_LABELS = Object.fromEntries(ANIMALS.map((animal) => [animal.id, animal.label]));

const ENTERPRISES = [
  {
    name: 'Poultry',
    subtitle: 'Layers and broilers',
    essentials: ['Secure, ventilated housing', 'Balanced feed and clean water', 'Vaccination and routine health checks'],
  },
  {
    name: 'Sheep and goats',
    subtitle: 'Small ruminants',
    essentials: ['Dry shelter and safe fencing', 'Grazing plus supplementary feed', 'Parasite checks and breeding records'],
  },
  {
    name: 'Cattle',
    subtitle: 'Beef and dairy',
    essentials: ['Reliable pasture or stored fodder', 'Shade, clean water and safe handling', 'Veterinary care and sale records'],
  },
];

const MARKETS = [
  {
    name: 'Lumo markets',
    location: 'Rotating regional market days',
    note: 'Livestock trading is often tied to weekly market days. Confirm the current day and animal availability locally before travelling.',
  },
  {
    name: 'Abuko',
    location: 'Abuko area, West Coast Region',
    note: 'Ask local livestock traders or extension staff about current trading arrangements, opening days and animal health requirements.',
  },
  {
    name: 'Kanilai Farm',
    location: 'Kanilai, Foni Kansala',
    note: 'Contact the farm or local authorities ahead of time to confirm whether livestock sales are available and arrange a visit.',
  },
];

const initialForm = {
  animal: 'broiler_chicken',
  quantity: 10,
  price: 1000,
  region: 'west_coast',
  village: '',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

export default function Livestock() {
  const backendRecovery = useBackendRecovery();
  const { user, isFarmer, isBuyer, isAdmin } = useAuth();
  const [view, setView] = useState('buy');
  const [tick, setTick] = useState(0);
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saleForm, setSaleForm] = useState({
    ...initialForm,
    region: user?.region || initialForm.region,
    village: user?.village || '',
  });
  const [buyForm, setBuyForm] = useState({
    ...initialForm,
    region: user?.region || 'kanifing',
    date: new Date().toISOString().slice(0, 10),
  });
  const canSell = isFarmer || isAdmin;
  const canBuy = isBuyer || isAdmin;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([
      listingApi.list({ category: 'livestock' }),
      buyRequestApi.list({ category: 'livestock' }),
    ])
      .then(([listingResponse, requestResponse]) => {
        if (!active) return;
        setListings(listingResponse.data);
        setRequests(requestResponse.data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, 'Could not load livestock listings'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tick, backendRecovery]);

  const updateForm = (formSetter, key, value) => {
    formSetter((current) => ({ ...current, [key]: value }));
  };

  const submitListing = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await listingApi.create({
        category: 'livestock',
        crop: saleForm.animal,
        quantity: Number(saleForm.quantity),
        unit: 'head',
        askingPrice: Number(saleForm.price),
        region: saleForm.region,
        village: saleForm.village,
        availableFrom: saleForm.date,
        notes: saleForm.notes,
        ownerId: user?.id,
        farmerName: user?.name || 'Demo seller',
        farmerPhone: user?.phone || '',
      });
      setMessage('Livestock sale posted.');
      setSaleForm({ ...initialForm, region: user?.region || initialForm.region, village: user?.village || '' });
      setTick((current) => current + 1);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not post livestock for sale'));
    } finally {
      setSaving(false);
    }
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await buyRequestApi.create({
        category: 'livestock',
        crop: buyForm.animal,
        quantity: Number(buyForm.quantity),
        unit: 'head',
        offerPrice: Number(buyForm.price),
        region: buyForm.region,
        neededBy: buyForm.date,
        notes: buyForm.notes,
        ownerId: user?.id,
        buyerName: user?.name || 'Demo buyer',
        buyerPhone: user?.phone || '',
      });
      setMessage('Livestock buy request posted.');
      setTick((current) => current + 1);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not post livestock buy request'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="livestock-page">
      <TopBar title="Livestock & poultry" subtitle="Buy and sell animals, find markets and get animal-health guidance" />

      {message ? <p className="form-page__toast">{message}</p> : null}
      {error ? <p className="field-error" role="alert">{error}</p> : null}

      <div className="livestock-tabs" role="tablist" aria-label="Livestock marketplace">
        <button
          id="livestock-buy-tab"
          type="button"
          role="tab"
          aria-selected={view === 'buy'}
          aria-controls="livestock-buy-panel"
          className={view === 'buy' ? 'is-active' : ''}
          onClick={() => setView('buy')}
        >
          Buy livestock
        </button>
        <button
          id="livestock-sell-tab"
          type="button"
          role="tab"
          aria-selected={view === 'sell'}
          aria-controls="livestock-sell-panel"
          className={view === 'sell' ? 'is-active' : ''}
          onClick={() => setView('sell')}
        >
          Sell livestock
        </button>
      </div>

      {view === 'buy' ? (
        <section id="livestock-buy-panel" role="tabpanel" aria-labelledby="livestock-buy-tab" className="livestock-panel">
          {canBuy ? (
            <form className="form-card livestock-form" onSubmit={submitRequest}>
              <h2>Post what you want to buy</h2>
              <AnimalFields form={buyForm} updateForm={updateForm} setter={setBuyForm} dateLabel="Needed by" priceLabel="Offer per animal (GMD)" />
              <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
                {saving ? 'Posting…' : 'Post buy request'}
              </button>
            </form>
          ) : (
            <p className="livestock-note">
              <Link to="/login">Sign in as a buyer or trader</Link> to post a livestock buy request.
            </p>
          )}
          <div className="section-head"><h2>Livestock for sale</h2></div>
          {loading ? <p className="page-subtitle">Loading livestock offers…</p> : null}
          {!loading && !listings.length ? <p className="page-subtitle">No livestock sale listings yet.</p> : null}
          <div className="livestock-market-list">
            {listings.map((listing) => (
              <article className="livestock-market-card" key={listing.id}>
                <div>
                  <h3>{ANIMAL_LABELS[listing.crop] || listing.crop} · {listing.quantity} head</h3>
                  <p>{formatGmd(listing.askingPrice, 'head')} each · {listing.village || formatRegion(listing.region)}</p>
                  <p>Available {formatDate(listing.availableFrom)} · Seller: {listing.farmerName || 'Farmer'}</p>
                  {listing.notes ? <p>{listing.notes}</p> : null}
                </div>
                {listing.farmerPhone ? (
                  <div className="livestock-market-card__actions">
                    <a href={telLink(listing.farmerPhone)}>Call seller</a>
                    <a href={whatsappLink(listing.farmerPhone, `Hello, I am interested in your ${ANIMAL_LABELS[listing.crop] || listing.crop} listing on AgriConnect.`)} target="_blank" rel="noreferrer">WhatsApp</a>
                  </div>
                ) : <p className="livestock-market-card__contact">Contact details unavailable</p>}
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section id="livestock-sell-panel" role="tabpanel" aria-labelledby="livestock-sell-tab" className="livestock-panel">
          {canSell ? (
            <form className="form-card livestock-form" onSubmit={submitListing}>
              <h2>List animals for sale</h2>
              <AnimalFields form={saleForm} updateForm={updateForm} setter={setSaleForm} dateLabel="Available from" priceLabel="Asking price per animal (GMD)" includeVillage />
              <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
                {saving ? 'Posting…' : 'Post sale listing'}
              </button>
            </form>
          ) : (
            <p className="livestock-note">
              <Link to="/login">Sign in as a farmer</Link> to list livestock for sale.
            </p>
          )}
          <div className="section-head"><h2>Livestock buyers are looking for</h2></div>
          {loading ? <p className="page-subtitle">Loading livestock requests…</p> : null}
          {!loading && !requests.length ? <p className="page-subtitle">No livestock buy requests yet.</p> : null}
          <div className="livestock-market-list">
            {requests.map((request) => (
              <article className="livestock-market-card" key={request.id}>
                <div>
                  <h3>{ANIMAL_LABELS[request.crop] || request.crop} · {request.quantity} head wanted</h3>
                  <p>{formatGmd(request.offerPrice, 'head')} offered each · {formatRegion(request.region)}</p>
                  <p>Needed by {formatDate(request.neededBy)} · Buyer: {request.buyerName || 'Buyer'}</p>
                  {request.notes ? <p>{request.notes}</p> : null}
                </div>
                {request.buyerPhone ? (
                  <div className="livestock-market-card__actions">
                    <a href={telLink(request.buyerPhone)}>Call buyer</a>
                    <a href={whatsappLink(request.buyerPhone, `Hello, I can supply ${ANIMAL_LABELS[request.crop] || request.crop} via AgriConnect.`)} target="_blank" rel="noreferrer">WhatsApp</a>
                  </div>
                ) : <p className="livestock-market-card__contact">Contact details unavailable</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="livestock-section" aria-labelledby="livestock-enterprises-title">
        <div className="section-head"><h2 id="livestock-enterprises-title">Livestock business options</h2></div>
        <div className="livestock-guide-grid">
          {ENTERPRISES.map((enterprise) => (
            <article className="livestock-guide-card" key={enterprise.name}>
              <p className="livestock-card__type">{enterprise.subtitle}</p>
              <h3>{enterprise.name}</h3>
              <ul>
                {enterprise.essentials.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="livestock-section" aria-labelledby="livestock-markets-title">
        <div className="section-head"><h2 id="livestock-markets-title">Livestock markets in The Gambia</h2></div>
        <div className="livestock-market-guide">
          {MARKETS.map((market) => (
            <article className="livestock-market-guide__card" key={market.name}>
              <h3>{market.name}</h3>
              <strong>{market.location}</strong>
              <p>{market.note}</p>
            </article>
          ))}
        </div>
        <p className="livestock-note">
          Check market days, prices, transport rules and animal health requirements before travelling. Inspect
          animals in person and agree on price, ownership and transport arrangements before payment.
        </p>
      </section>

      <section className="livestock-vet" aria-labelledby="livestock-vet-title">
        <h2 id="livestock-vet-title">When animals are sick or infected</h2>
        <p>
          Contact a qualified veterinary professional, the nearest veterinary service or a livestock extension
          officer promptly for diagnosis and treatment advice. Do not rely on this app for diagnosis or give
          medicines without professional guidance.
        </p>
        <ul>
          <li>Separate sick animals from the healthy flock or herd where safe to do so.</li>
          <li>Provide clean water and avoid moving or selling animals until you have veterinary advice.</li>
          <li>Report sudden deaths or suspected contagious disease promptly to veterinary services.</li>
        </ul>
      </section>
    </div>
  );
}

function AnimalFields({ form, updateForm, setter, dateLabel, priceLabel, includeVillage = false }) {
  return (
    <>
      <div className="field">
        <label>Animal</label>
        <select value={form.animal} onChange={(event) => updateForm(setter, 'animal', event.target.value)}>
          {ANIMALS.map((animal) => <option key={animal.id} value={animal.id}>{animal.label}</option>)}
        </select>
      </div>
      <div className="livestock-form__row">
        <div className="field">
          <label>Number of animals</label>
          <input type="number" min="1" value={form.quantity} onChange={(event) => updateForm(setter, 'quantity', event.target.value)} required />
        </div>
        <div className="field">
          <label>{priceLabel}</label>
          <input type="number" min="1" value={form.price} onChange={(event) => updateForm(setter, 'price', event.target.value)} required />
        </div>
      </div>
      <div className="field">
        <label>Region</label>
        <select value={form.region} onChange={(event) => updateForm(setter, 'region', event.target.value)}>
          {Object.entries(REGION_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      {includeVillage ? (
        <div className="field">
          <label>Village or town</label>
          <input value={form.village} onChange={(event) => updateForm(setter, 'village', event.target.value)} />
        </div>
      ) : null}
      <div className="field">
        <label>{dateLabel}</label>
        <input type="date" value={form.date} onChange={(event) => updateForm(setter, 'date', event.target.value)} />
      </div>
      <div className="field">
        <label>Notes</label>
        <textarea value={form.notes} onChange={(event) => updateForm(setter, 'notes', event.target.value)} maxLength="1000" />
      </div>
    </>
  );
}
