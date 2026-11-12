import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlertBanner from '../components/AlertBanner.jsx';
import Loader, { Skeleton } from '../components/Loader.jsx';
import ProduceCard from '../components/ProduceCard.jsx';
import WeatherCard from '../components/WeatherCard.jsx';
import TopBar from '../components/TopBar.jsx';
import { dashboardApi, listingApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useBackendRecovery } from '../hooks/useBackendRecovery.js';
import { formatCrop, formatGmd, formatRegion, trendLabel } from '../utils/format.js';
import './Dashboard.css';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const backendRecovery = useBackendRecovery();
  const [data, setData] = useState(null);
  const [prices, setPrices] = useState([]);
  const [matches, setMatches] = useState([]);
  const [produce, setProduce] = useState([]);
  const [managedAlerts, setManagedAlerts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const [dash, produceResponse] = await Promise.all([
          dashboardApi.get(user),
          listingApi.list({ category: 'crop', limit: 12 }).catch(() => ({ data: [] })),
        ]);
        if (!active) return;
        setData(dash.data);
        setPrices(dash.data?.prices || []);
        setMatches(dash.data?.matches || []);
        setProduce(produceResponse?.data || []);
        setManagedAlerts(dash.data?.alerts || []);
      } catch (err) {
        if (active) setError(getErrorMessage(err, 'Could not load dashboard'));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user, backendRecovery]);

  const weather = data?.weather;
  const alerts = [
    ...managedAlerts,
    ...(data?.weather?.alerts || []).map((a) => ({
      ...a,
      type: 'weather',
      severity: a.severity || 'urgent',
      title: a.event || a.title || 'Weather alert',
      message: a.description || a.message,
    })),
    ...(data?.advice || [])
      .filter((a) => a.priority === 'urgent')
      .slice(0, 2)
      .map((a) => ({
        type: 'urgent',
        severity: 'urgent',
        title: a.title,
        message: a.body,
      })),
  ];
  const farmerView = user?.role === 'farmer';

  return (
    <div className="dashboard">
      <TopBar
        showLocation
        title={`Hello, ${(user?.name || 'Farmer').split(' ')[0]}`}
        subtitle={data?.season ? `${data.season.season} season · ${data.season.phase || ''}` : t('dashboard')}
      />

      {loading ? (
        <>
          <Skeleton height={140} />
          <div style={{ height: 12 }} />
          <Skeleton height={100} />
        </>
      ) : null}

      {error ? <p className="field-error">{error}</p> : null}

      {!loading && weather?.current ? (
        <WeatherCard weather={weather} season={data?.season || weather?.season} />
      ) : null}

      {!loading && produce.length ? (
        <section>
          <div className="section-head">
            <h2>{t('freshProduce')}</h2>
            <Link to="/marketplace" className="section-link">
              {t('seeAll')}
            </Link>
          </div>
          <div className="dash-produce">
            {produce.slice(0, 8).map((listing) => (
              <ProduceCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      ) : null}

      {!loading && alerts.length ? (
        <section>
          <div className="section-head">
            <h2>{t('alerts')}</h2>
          </div>
          <div className="dash-stack">
            {alerts.slice(0, 3).map((alert, index) => (
              <AlertBanner key={alert.id || index} alert={alert} />
            ))}
          </div>
        </section>
      ) : null}

      {!loading && data?.advice?.length ? (
        <section>
          <div className="section-head">
            <h2>{t('advice')}</h2>
            <Link to="/calendar" className="section-link">
              {t('calendar')}
            </Link>
          </div>
          <div className="dash-advice">
            {data.advice.slice(0, 4).map((item, index) => (
              <article key={item.id || index} className="dash-advice__card">
                <span className={`badge badge--${item.priority === 'urgent' ? 'danger' : 'success'}`}>
                  {item.priority || 'tip'}
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {item.crop ? <small>{formatCrop(item.crop)}</small> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!loading ? (
        <section>
          <div className="section-head">
            <h2>{t('prices')}</h2>
            <Link to="/markets" className="section-link">
              {t('seeAll')}
            </Link>
          </div>
          <div className="dash-prices">
            {prices.slice(0, 4).map((row) => (
              <article key={`${row.crop}-${row.marketId}`} className="dash-price-card">
                <div>
                  <h3>{formatCrop(row.crop)}</h3>
                  <p>{row.bestMarket || row.market?.name || formatRegion(row.market?.region)}</p>
                </div>
                <div className="dash-price-card__right">
                  <span className="price">{formatGmd(row.pricePerKg)}</span>
                  <span className={`trend trend--${row.trend}`}>{trendLabel(row.trend)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!loading && matches.length ? (
        <section>
          <div className="section-head">
            <h2>{farmerView ? 'Buyer matches' : 'Supply matches'}</h2>
            <Link to="/buy-requests" className="section-link">
              {t('seeAll')}
            </Link>
          </div>
          <div className="dash-stack">
            {matches.map((match) => {
              const opportunity = farmerView ? match.request : match.listing;
              if (!opportunity) return null;
              const quantity = opportunity.quantity;
              const unit = opportunity.unit || 'kg';
              const price = farmerView ? opportunity.offerPrice : opportunity.askingPrice;
              const contactName = farmerView ? opportunity.buyerName : opportunity.farmerName;
              return (
                <article key={match.requestId || match.listingId} className="dash-match">
                  <h3>
                    {formatCrop(opportunity.crop)} · {quantity} {unit}
                  </h3>
                  <p>
                    {contactName ? `${contactName} · ` : ''}
                    {farmerView ? 'offers' : 'asks'} {formatGmd(price, unit)} · {formatRegion(opportunity.region)}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {!loading && !data && !error ? <Loader /> : null}
    </div>
  );
}
