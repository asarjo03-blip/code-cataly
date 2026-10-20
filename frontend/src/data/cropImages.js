import { getCropSvg } from '../components/CropArt.jsx';
import { getProducePhoto } from './producePhotos.js';

export function getCropImage(crop) {
  return getProducePhoto(crop)?.src || getCropSvg(crop);
}
