import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { advisoryApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { formatCrop } from '../utils/format.js';
import './Advisory.css';

export default function AdvisoryDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setItem(null);
    setError('');
    setLoading(true);
    advisoryApi
      .get(id)
      .then(({ data }) => {
        if (active) setItem(data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, 'Could not load this article'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (!item) {
    return (
      <div className="advisory-detail">
        <p>{loading ? 'Loading advice…' : error || 'Article not found.'}</p>
        <Link to="/advisory">Back</Link>
      </div>
    );
  }

  return (
    <article className="advisory-detail fade-in">
      <Link to="/advisory" className="advisory-detail__back">
        ← Back
      </Link>
      <span className="badge badge--info">{item.category}</span>
      <h1>{item.title}</h1>
      <p className="advisory-detail__meta">
        {item.crop ? formatCrop(item.crop) : 'All crops'} · {item.language?.toUpperCase() || 'EN'}
      </p>
      <p className="advisory-detail__summary">{item.summary}</p>
      <div className="advisory-detail__body">
        {String(item.body || '')
          .split(/\n+/)
          .filter(Boolean)
          .map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
      </div>
    </article>
  );
}
