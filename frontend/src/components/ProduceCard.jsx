import { Link } from 'react-router-dom';
import CropArt from './CropArt.jsx';
import { PlusIcon } from './Icons.jsx';
import { formatCrop, formatGmd, formatRegion } from '../utils/format.js';
import { getProducePhoto } from '../data/producePhotos.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import './ProduceCard.css';

export default function ProduceCard({ listing, to }) {
  const href = to || `/marketplace/${listing.id}`;
  const photo = getProducePhoto(listing.crop);
  const { t } = useLanguage();
  const soldOut = listing.status === 'sold' || Number(listing.quantity) <= 0;

  return (
    <article className={`produce-card fade-in${soldOut ? ' produce-card--sold-out' : ''}`}>
      <Link to={href} className="produce-card__link">
        <div className="produce-card__media">
          <CropArt crop={listing.crop} />
          {soldOut ? (
            <span className="produce-card__sold-out">{t('soldOut')}</span>
          ) : (
            <span className="produce-card__add" aria-hidden="true">
              <PlusIcon size={16} />
            </span>
          )}
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
      {photo ? (
        <a className="produce-card__credit" href={photo.source} target="_blank" rel="noreferrer">
          Photo: {photo.artist} · {photo.license}
        </a>
      ) : null}
    </article>
  );
}
