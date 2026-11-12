import {
  BulbIcon,
  DropletIcon,
  PinIcon,
  SunriseIcon,
  SunsetIcon,
  UmbrellaIcon,
  UvIcon,
  WindIcon,
  weatherIconFor,
} from './Icons.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import './WeatherCard.css';

function round(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isNaN(number) ? null : Math.round(number);
}

function uvLabelKey(value) {
  const uv = Number(value);
  if (value === null || value === undefined || Number.isNaN(uv)) return null;
  if (uv < 3) return 'uvLow';
  if (uv < 6) return 'uvModerate';
  if (uv < 8) return 'uvHigh';
  if (uv < 11) return 'uvVeryHigh';
  return 'uvExtreme';
}

function formatUpdated(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fieldNoteKey(current) {
  const rainChance = Number(current.rainChance) || 0;
  const rainMm = Number(current.rainMm) || 0;
  const high = Number(current.highTempC ?? current.tempC) || 0;
  const wind = Number(current.windKph) || 0;
  const uv = Number(current.uvIndex) || 0;
  if (rainMm >= 2 || rainChance >= 60) return 'fieldNoteRain';
  if (wind >= 25) return 'fieldNoteWind';
  if (high >= 35) return 'fieldNoteHeat';
  if (uv >= 8) return 'fieldNoteUv';
  return 'fieldNoteClear';
}

export default function WeatherCard({ weather, season }) {
  const { t } = useLanguage();
  const current = weather?.current || {};
  const forecast = weather?.forecast || [];
  const temp = round(current.tempC);
  const feelsLike = round(current.feelsLikeC ?? current.tempC);
  const humidity = round(current.humidity);
  const windKph = round(current.windKph);
  const rainChance = round(current.rainChance);
  const rainMm = round(current.rainMm);
  const uvIndex = round(current.uvIndex);
  const high = round(current.highTempC);
  const low = round(current.lowTempC);
  const isLive = weather?.source === 'open-meteo';
  const updated = formatUpdated(weather?.updatedAt);
  const Icon = weatherIconFor(current.code, current.rainMm, current.isDay !== false);
  const note = t(fieldNoteKey(current));

  const stats = [
    {
      icon: DropletIcon,
      label: t('humidity'),
      value: humidity === null ? '—' : `${humidity}%`,
    },
    {
      icon: WindIcon,
      label: t('wind'),
      value: windKph === null ? '—' : `${windKph} km/h`,
      hint: current.windDir || null,
    },
    {
      icon: UmbrellaIcon,
      label: t('rainChance'),
      value: rainChance === null ? '—' : `${rainChance}%`,
      hint: rainMm ? `${rainMm} mm ${t('rainToday')}` : null,
    },
    {
      icon: UvIcon,
      label: t('uvIndex'),
      value: uvIndex === null ? '—' : String(uvIndex),
      hint: uvLabelKey(current.uvIndex) ? t(uvLabelKey(current.uvIndex)) : null,
    },
  ];

  return (
    <section className="weather-card fade-in" aria-label={t('weather')}>
      <div className="weather-card__glow" aria-hidden="true" />

      <div className="weather-card__place">
        <span className="weather-card__location">
          <PinIcon size={15} />
          <span>{weather?.location?.label || t('weather')}</span>
        </span>
        <span className={`weather-card__source${isLive ? ' weather-card__source--live' : ''}`}>
          {isLive ? t('liveForecast') : t('seasonalEstimate')}
        </span>
      </div>

      <div className="weather-card__hero">
        <div className="weather-card__reading">
          <span className="weather-card__temp">
            {temp === null ? '—' : temp}
            <sup>°C</sup>
          </span>
          <div className="weather-card__summary">
            <strong>{current.condition || '—'}</strong>
            {feelsLike !== null ? (
              <span>
                {t('feelsLike')} {feelsLike}°
              </span>
            ) : null}
            {high !== null && low !== null ? (
              <span className="weather-card__range">
                H {high}° · L {low}°
              </span>
            ) : null}
          </div>
        </div>
        <span className="weather-card__icon" aria-hidden="true">
          <Icon size={76} />
        </span>
      </div>

      <div className="weather-card__stats">
        {stats.map(({ icon: StatIcon, label, value, hint }) => (
          <div key={label} className="weather-card__stat">
            <span className="weather-card__stat-icon" aria-hidden="true">
              <StatIcon size={18} />
            </span>
            <span className="weather-card__stat-body">
              <span className="weather-card__stat-label">{label}</span>
              <span className="weather-card__stat-value">{value}</span>
              {hint ? <span className="weather-card__stat-hint">{hint}</span> : null}
            </span>
          </div>
        ))}
      </div>

      {current.sunrise || current.sunset || season?.label ? (
        <div className="weather-card__sunline">
          {current.sunrise ? (
            <span title={t('sunrise')}>
              <SunriseIcon size={14} /> {current.sunrise}
            </span>
          ) : null}
          {current.sunset ? (
            <span title={t('sunset')}>
              <SunsetIcon size={14} /> {current.sunset}
            </span>
          ) : null}
          {season?.label ? <span className="weather-card__season">{season.label}</span> : null}
        </div>
      ) : null}

      <div className="weather-card__note">
        <span className="weather-card__note-icon" aria-hidden="true">
          <BulbIcon size={16} />
        </span>
        <p>
          <strong>{t('fieldNote')}</strong> {note}
        </p>
      </div>

      {forecast.length ? (
        <div className="weather-card__forecast">
          <div className="weather-card__forecast-head">
            <h3>{t('fiveDayForecast')}</h3>
            {updated ? (
              <span>
                {t('updated')} {updated}
              </span>
            ) : null}
          </div>
          <div className="weather-card__days">
            {forecast.slice(0, 5).map((day, index) => {
              const DayIcon = weatherIconFor(day.code, day.rainMm, true);
              const max = round(day.maxTempC ?? day.tempC);
              const min = round(day.minTempC);
              const chance = round(day.rainChance);
              return (
                <div
                  key={day.date || index}
                  className="weather-card__day"
                  title={day.condition || undefined}
                >
                  <span className="weather-card__day-name">{day.label || `D${index + 1}`}</span>
                  <span className="weather-card__day-icon" aria-hidden="true">
                    <DayIcon size={26} />
                  </span>
                  <span className="weather-card__day-temps">
                    <strong>{max === null ? '—' : `${max}°`}</strong>
                    {min === null ? null : <small>{min}°</small>}
                  </span>
                  <span className="weather-card__day-rain">
                    <DropletIcon size={11} />
                    {chance === null ? '—' : `${chance}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
