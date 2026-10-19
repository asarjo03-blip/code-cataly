import { useMemo, useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  ACTIVITY_LABELS,
  CROP_CALENDAR,
  MONTH_LABELS,
  getCropCalendar,
  monthInWindow,
} from '../data/calendar.js';
import { CROP_LABELS, formatCrop } from '../utils/format.js';
import './Calendar.css';

export default function Calendar() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const month = new Date().getMonth() + 1;
  const cropOptions = user?.crops?.length ? user.crops : Object.keys(CROP_CALENDAR);
  const [crop, setCrop] = useState(cropOptions[0] || 'groundnut');

  const entries = useMemo(() => getCropCalendar(crop), [crop]);

  return (
    <div className="calendar-page">
      <TopBar title={t('calendar')} subtitle="Planting to harvest windows for your crops" />

      <div className="chip-row">
        {cropOptions.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip ${crop === c ? 'chip--active' : ''}`}
            onClick={() => setCrop(c)}
          >
            {CROP_LABELS[c] || c}
          </button>
        ))}
      </div>

      <p className="calendar-page__now">
        Now: <strong>{MONTH_LABELS[month - 1]}</strong> · {formatCrop(crop)}
      </p>

      <div className="calendar-timeline">
        {entries.map((entry) => {
          const active = monthInWindow(month, entry.startMonth, entry.endMonth);
          return (
            <article key={`${entry.activity}-${entry.startMonth}`} className={`cal-card ${active ? 'is-current' : ''}`}>
              <div className="cal-card__head">
                <h3>{ACTIVITY_LABELS[entry.activity] || entry.activity}</h3>
                {active ? <span className="badge badge--success">Now</span> : null}
              </div>
              <p className="cal-card__months">
                {MONTH_LABELS[entry.startMonth - 1]} – {MONTH_LABELS[entry.endMonth - 1]}
              </p>
              <p>{entry.notes}</p>
              <div className="cal-card__bar" aria-hidden="true">
                {MONTH_LABELS.map((_, index) => {
                  const m = index + 1;
                  const on = monthInWindow(m, entry.startMonth, entry.endMonth);
                  return <span key={m} className={`cal-seg ${on ? 'is-on' : ''} ${m === month ? 'is-today' : ''}`} />;
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
