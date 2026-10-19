const PRODUCE_PHOTOS = {
  groundnut:
    'https://images.pexels.com/photos/38571498/pexels-photo-38571498/free-photo-of-natural-organic-peanuts-in-shell-stock-photo.jpeg?h=1000&w=1500&fit=crop',
  onion:
    'https://images.pexels.com/photos/38088072/pexels-photo-38088072/free-photo-of-piles-of-fresh-red-and-brown-onions.jpeg?h=1000&w=1500&fit=crop',
  tomato:
    'https://images.pexels.com/photos/38990977/pexels-photo-38990977/free-photo-of-close-up-of-green-tomatoes-on-the-vine.jpeg?h=1000&w=1500&fit=crop',
  mango:
    'https://images.pexels.com/photos/30893226/pexels-photo-30893226/free-photo-of-fresh-mangos-on-display-at-outdoor-market.jpeg?h=1000&w=1500&fit=crop',
  rice:
    'https://images.pexels.com/photos/36346840/pexels-photo-36346840/free-photo-of-close-up-of-uncooked-white-rice-grains.jpeg?h=1000&w=1500&fit=crop',
  millet: 'https://images.pexels.com/photos/10738421/pexels-photo-10738421.jpeg?h=1000&w=1500&fit=crop',
  sorghum:
    'https://images.pexels.com/photos/18275951/pexels-photo-18275951/free-photo-of-abundance-of-raw-corn.jpeg?h=1000&w=1500&fit=crop',
  cabbage:
    'https://images.pexels.com/photos/34973888/pexels-photo-34973888/free-photo-of-fresh-green-cabbages-in-a-garden.jpeg?h=1000&w=1500&fit=crop',
  cassava: 'https://images.pexels.com/photos/9568902/pexels-photo-9568902.jpeg?h=1000&w=1500&fit=crop',
  maize: 'https://images.pexels.com/photos/5601957/pexels-photo-5601957.jpeg?h=1000&w=1500&fit=crop',
  cashew:
    'https://images.pexels.com/photos/36631827/pexels-photo-36631827/free-photo-of-bowl-of-raw-cashew-nuts-on-a-table-healthy-snack.jpeg?h=1000&w=1500&fit=crop',
};

export function getCropImage(crop) {
  return PRODUCE_PHOTOS[crop] || PRODUCE_PHOTOS.groundnut;
}
