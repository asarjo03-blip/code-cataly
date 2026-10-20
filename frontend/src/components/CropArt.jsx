import cabbage from '../assets/crops/cabbage.svg';
import cashew from '../assets/crops/cashew.svg';
import cassava from '../assets/crops/cassava.svg';
import groundnut from '../assets/crops/groundnut.svg';
import maize from '../assets/crops/maize.svg';
import mango from '../assets/crops/mango.svg';
import millet from '../assets/crops/millet.svg';
import onion from '../assets/crops/onion.svg';
import rice from '../assets/crops/rice.svg';
import sorghum from '../assets/crops/sorghum.svg';
import tomato from '../assets/crops/tomato.svg';
import { getProducePhoto } from '../data/producePhotos.js';
import { formatCrop } from '../utils/format.js';

const CROP_SVGS = {
  cabbage,
  cashew,
  cassava,
  groundnut,
  maize,
  mango,
  millet,
  onion,
  rice,
  sorghum,
  tomato,
};

export function getCropSvg(crop) {
  return CROP_SVGS[crop] || groundnut;
}

export default function CropArt({ crop, alt, className = '' }) {
  const photo = getProducePhoto(crop);
  return (
    <img
      src={photo?.src || getCropSvg(crop)}
      alt={alt ?? photo?.alt ?? formatCrop(crop)}
      className={`${className}${photo ? ' crop-art--photo' : ''}`.trim()}
      loading="lazy"
    />
  );
}
