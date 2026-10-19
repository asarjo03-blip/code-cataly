import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlertBanner from '../components/AlertBanner.jsx';
import Loader, { Skeleton } from '../components/Loader.jsx';
import TopBar from '../components/TopBar.jsx';
import { alertApi, buyRequestApi, dashboardApi, marketApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { formatCrop, formatGmd, formatRegion, trendLabel } from '../utils/format.js';
import './Dashboard.css';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [prices, setPrices] = useState([]);
  const [matches, setMatches] = useState([]);
  const [managedAlerts, setManagedAlerts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const [dash, priceRes, requestRes, alertRes] = await Promise.all([
          dashboardApi.get(),
          marketApi.prices({}),
          buyRequestApi.list(),
          alertApi.list({ region: user?.region }),
        ]);
        if (!active) return;
        setData(dash.data);
        const cropSet = new Set(user?.crops || []);
        const mine = (priceRes.data || []).filter((p) => cropSet.has(p.crop));
        setPrices(mine.length ? mine : priceRes.data.slice(0, 4));
        setMatches(
          requestRes.data
            .filter((request) => cropSet.has(request.crop) && (!user?.region || request.region === user.region))
            .slice(0, 3),
        );
        setManagedAlerts(alertRes.data);
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
  }, [user?.crops, user?.region]);

  const weather = data?.weather?.current;
  const forecast = data?.weather?.forecast || [];
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

      {!loading && weather ? (
        <section className="dash-weather fade-in">
          <div className="dash-weather__now">
            <div>
              <p className="dash-weather__label">{t('weather')}</p>
              <p className="dash-weather__temp">{Math.round(weather.tempC)}°C</p>
              <p className="dash-weather__meta">
                Rain {weather.rainMm ?? weather.rainChance ?? 0}
                {weather.rainMm != null ? ' mm' : '%'} · {weather.condition || weather.description || '—'}
              </p>
            </div>
            <span className="dash-weather__icon" aria-hidden="true">
              {(weather.rainMm || 0) > 2 ? '🌧' : '☀️'}
            </span>
          </div>
          <div className="dash-weather__forecast">
            {forecast.slice(0, 5).map((day, index) => (
              <div key={day.date || index} className="dash-weather__day">
                <span>{day.label || day.day || `D${index + 1}`}</span>
                <strong>{Math.round(day.tempC ?? day.maxTempC ?? day.temp ?? 0)}°</strong>
              </div>
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
                  <p>{row.market?.name || formatRegion(row.market?.region)}</p>
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
            <h2>Buyer matches</h2>
            <Link to="/buy-requests" className="section-link">
              {t('seeAll')}
            </Link>
          </div>
          <div className="dash-stack">
            {matches.map((req) => (
              <article key={req.id} className="dash-match">
                <h3>
                  {formatCrop(req.crop)} · {req.quantity}
                  {req.unit}
                </h3>
                <p>
                  {req.buyerName} offers {formatGmd(req.offerPrice)} · {formatRegion(req.region)}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!loading && !data && !error ? <Loader /> : null}
    </div>
  );
}
