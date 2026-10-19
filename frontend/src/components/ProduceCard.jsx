import { Link } from 'react-router-dom';
import { formatCrop, formatGmd, formatRegion } from '../utils/format.js';
import { getCropImage } from '../data/cropImages.js';
import './ProduceCard.css';

export default function ProduceCard({ listing, to }) {
  const href = to || `/marketplace/${listing.id}`;

  return (
    <Link to={href} className="produce-card fade-in">
      <div className="produce-card__media">
        <img src={getCropImage(listing.crop)} alt={formatCrop(listing.crop)} loading="lazy" />
        <span className="produce-card__add" aria-hidden="true">
          +
        </span>
      </div>
      <div className="produce-card__body">
        <div className="produce-card__price-row">
          <span className="price">{formatGmd(listing.askingPrice, listing.unit)}</span>
        </div>
        <h3>{formatCrop(listing.crop)}</h3>
        <p>
          {listing.quantity}
          {listing.unit} · {listing.village || formatRegion(listing.region)}
        </p>
      </div>
    </Link>
  );
}
