export const LIVESTOCK_PHOTOS = {
  broiler_chicken: {
    src: '/images/livestock-broiler-chicken.jpg',
    alt: 'A broiler chicken at a poultry shop',
    artist: 'Amrithraj',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Broiler_Chicken_kept_outside_of_a_Chicken_Shop_in_India.jpg',
  },
  layer_chicken: {
    src: '/images/livestock-layer-chicken.jpg',
    alt: 'Laying hens in a poultry shed',
    artist: 'Arnawakomang',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Ayam_petelor.jpg',
  },
  sheep: {
    src: '/images/livestock-sheep.jpg',
    alt: 'Sheep grazing in The Gambia',
    artist: 'Elgaard',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:GambiaSheep2009.jpg',
  },
  goat: {
    src: '/images/livestock-goat.jpg',
    alt: 'A West African Dwarf goat',
    artist: 'Oleg Yunakov',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:West_African_Dwarf_goat.jpg',
  },
  cattle: {
    src: '/images/livestock-cattle.jpg',
    alt: 'Cattle walking near Banjul, The Gambia',
    artist: 'Kotoviski',
    license: 'CC BY 2.5',
    source: 'https://commons.wikimedia.org/wiki/File:Gambia_cattle.jpg',
  },
  duck: {
    src: '/images/livestock-duck.jpg',
    alt: 'Ducks on a family duck farm',
    artist: 'MiNe (sfmine79)',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Taiwanese_duck_farm.jpg',
  },
};

export function getLivestockPhoto(animal) {
  return LIVESTOCK_PHOTOS[animal] || null;
}
