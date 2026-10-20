export const PRODUCE_PHOTOS = {
  groundnut: {
    src: '/images/fresh-groundnuts-closeup.jpg',
    alt: 'Fresh groundnut seeds and kernels ready for sale',
    artist: 'Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Peanuts_(Arachis_hypogaea)_-_in_shell,_shell_cracked_open,_shelled,_peeled.jpg',
  },
  onion: {
    src: '/images/fresh-onions.jpg',
    alt: 'A seller displaying onions at a West African market',
    artist: 'Amuzujoe',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Onion_Seller.jpg',
  },
  tomato: {
    src: '/images/fresh-tomatoes.jpg',
    alt: 'Tomatoes being sold at a wholesale market in Tanzania',
    artist: 'Steadfast Gazelle',
    license: 'CC BY 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Tomato_wholesale_market_in_Tanzania.jpg',
  },
  mango: {
    src: '/images/fresh-mangoes.jpg',
    alt: 'Fresh mangoes from Senegal',
    artist: 'Wuzyprod',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Mangoes_from_Senegal_01.jpg',
  },
  rice: {
    src: '/images/fresh-rice.jpg',
    alt: 'Broken rice grains sold as food',
    artist: 'T.K. Naliaka',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Broken_rice_bris%C3%A9e.jpg',
  },
  millet: {
    src: '/images/fresh-millet.jpg',
    alt: 'Millet grain from Senegal',
    artist: 'Wuzyprod',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Millet_from_Senegal_01.jpg',
  },
};

export function getProducePhoto(crop) {
  return PRODUCE_PHOTOS[crop] || null;
}
