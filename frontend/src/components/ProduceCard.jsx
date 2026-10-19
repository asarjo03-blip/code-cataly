import { Link } from 'react-router-dom';
import CropArt from './CropArt.jsx';
import { PlusIcon } from './Icons.jsx';
import { formatCrop, formatGmd, formatRegion } from '../utils/format.js';
import './ProduceCard.css';

export default function ProduceCard({ listing, to }) {
  const href = to || `/marketplace/${listing.id}`;

  return (
    <Link to={href} className="produce-card fade-in">
      <div className="produce-card__media">
        <CropArt crop={listing.crop} />
        <span className="produce-card__add" aria-hidden="true">
          <PlusIcon size={16} />
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
