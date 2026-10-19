import './Loader.css';

export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__dot" />
      <span className="loader__dot" />
      <span className="loader__dot" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function Skeleton({ height = 120, className = '' }) {
  return <div className={`skeleton ${className}`} style={{ minHeight: height }} aria-hidden="true" />;
}
