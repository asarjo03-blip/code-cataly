import { useEffect, useMemo, useState } from 'react';
import PriceChart from '../components/PriceChart.jsx';
import TopBar from '../components/TopBar.jsx';
import { marketApi } from '../api/services.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useBackendRecovery } from '../hooks/useBackendRecovery.js';
import { CROP_LABELS, formatCrop, formatGmd, formatRegion, trendLabel } from '../utils/format.js';
import './Markets.css';

export default function Markets() {
  const { t } = useLanguage();
  const backendRecovery = useBackendRecovery();
  const [markets, setMarkets] = useState([]);
  const [crop, setCrop] = useState('groundnut');
  const [compare, setCompare] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState('farafenni');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    marketApi
      .list()
      .then((res) => {
        if (active) setMarkets(res.data || []);
      })
      .catch(() => {
        if (active) setError('Could not load markets.');
      });
    return () => {
      active = false;
    };
  }, [backendRecovery]);

  useEffect(() => {
    let active = true;
    marketApi
      .compare(crop)
      .then((res) => {
        if (!active) return;
        setCompare(res.data);
        if (res.data?.bestMarket?.id) setSelectedMarket(res.data.bestMarket.id);
      })
      .catch(() => {
        if (active) setError('Could not load market prices.');
      });
    return () => {
      active = false;
    };
  }, [crop, backendRecovery]);

  useEffect(() => {
    let active = true;
    marketApi
      .history({ crop, marketId: selectedMarket })
      .then((res) => {
        if (active) setHistory(res.data || []);
      })
      .catch(() => {
        if (active) setError('Could not load price history.');
      });
    return () => {
      active = false;
    };
  }, [crop, selectedMarket, backendRecovery]);

  const crops = useMemo(() => Object.keys(CROP_LABELS), []);

  return (
    <div className="markets-page">
      <TopBar title={t('markets')} subtitle="Compare prices across Gambian markets" />
      {error ? <p className="field-error">{error}</p> : null}

      <div className="chip-row">
        {crops.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip ${crop === c ? 'chip--active' : ''}`}
            onClick={() => setCrop(c)}
          >
            {formatCrop(c)}
          </button>
        ))}
      </div>

      {compare?.bestMarket ? (
        <article className="markets-best fade-in">
          <p>{t('bestPrice')} for {formatCrop(crop)}</p>
          <h2>
            {formatGmd(compare.bestPrice)} · {compare.bestMarket.name}
          </h2>
        </article>
      ) : null}

      <div className="section-head">
        <h2>{t('compare')}</h2>
      </div>
      <div className="markets-compare">
        {(compare?.rows || []).map((row) => (
          <button
            key={row.marketId}
            type="button"
            className={`markets-row ${selectedMarket === row.marketId ? 'is-selected' : ''}`}
            onClick={() => setSelectedMarket(row.marketId)}
          >
            <div>
              <strong>{row.market?.name}</strong>
              <span>{formatRegion(row.market?.region)}</span>
            </div>
            <div className="markets-row__price">
              <span className="price">{formatGmd(row.pricePerKg)}</span>
              <span className={`trend trend--${row.trend}`}>{trendLabel(row.trend)}</span>
            </div>
          </button>
        ))}
        {!compare?.rows?.length ? <p className="page-subtitle">{t('noResults')}</p> : null}
      </div>

      <div className="section-head">
        <h2>7-day trend · {markets.find((m) => m.id === selectedMarket)?.name || 'Market'}</h2>
      </div>
      <PriceChart data={history} />

      <div className="section-head">
        <h2>All markets</h2>
      </div>
      <div className="markets-grid">
        {markets.map((market) => (
          <article key={market.id} className="market-card">
            <h3>{market.name}</h3>
            <p>{market.location} · {formatRegion(market.region)}</p>
            <p className="market-card__days">Open: {market.marketDays.join(', ')}</p>
            <div className="chip-row" style={{ marginTop: '0.65rem' }}>
              {market.cropsTraded.slice(0, 4).map((c) => (
                <span key={c} className="chip">
                  {formatCrop(c)}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
