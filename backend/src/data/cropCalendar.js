export const CROP_CALENDAR = {
  groundnut: [
    { activity: 'plant', startMonth: 6, endMonth: 7, notes: 'Sow after reliable rains.' },
    { activity: 'weed', startMonth: 7, endMonth: 8, notes: 'Early weeding protects seedlings.' },
    { activity: 'fertilise', startMonth: 7, endMonth: 8, notes: 'Basal NPK where available.' },
    { activity: 'harvest', startMonth: 9, endMonth: 11, notes: 'Lift and dry promptly.' },
  ],
  rice: [
    { activity: 'plant', startMonth: 6, endMonth: 8, notes: 'Transplant or direct sow with rains.' },
    { activity: 'weed', startMonth: 7, endMonth: 9, notes: 'Keep bunds and drainage clear.' },
    { activity: 'fertilise', startMonth: 7, endMonth: 9, notes: 'Split nitrogen applications.' },
    { activity: 'harvest', startMonth: 10, endMonth: 12, notes: 'Harvest at dough stage.' },
  ],
  millet: [
    { activity: 'plant', startMonth: 6, endMonth: 7, notes: 'Early cereal on upland soils.' },
    { activity: 'weed', startMonth: 7, endMonth: 8, notes: 'Thin and weed early.' },
    { activity: 'harvest', startMonth: 9, endMonth: 10, notes: 'Protect from birds near maturity.' },
  ],
  maize: [
    { activity: 'plant', startMonth: 6, endMonth: 7, notes: 'Plant with onset of rains.' },
    { activity: 'weed', startMonth: 7, endMonth: 8, notes: 'Timely weeding is critical.' },
    { activity: 'fertilise', startMonth: 7, endMonth: 8, notes: 'Side-dress nitrogen.' },
    { activity: 'harvest', startMonth: 9, endMonth: 10, notes: 'Dry cobs well before storage.' },
  ],
  onion: [
    { activity: 'plant', startMonth: 11, endMonth: 1, notes: 'Dry-season irrigated beds.' },
    { activity: 'weed', startMonth: 12, endMonth: 2, notes: 'Keep beds clean and mulched.' },
    { activity: 'fertilise', startMonth: 12, endMonth: 2, notes: 'Light, frequent feeding.' },
    { activity: 'harvest', startMonth: 2, endMonth: 4, notes: 'Cure before storage.' },
  ],
  tomato: [
    { activity: 'plant', startMonth: 10, endMonth: 1, notes: 'Start nursery, then transplant.' },
    { activity: 'weed', startMonth: 11, endMonth: 2, notes: 'Stake and prune as needed.' },
    { activity: 'fertilise', startMonth: 11, endMonth: 2, notes: 'Balance N with K for fruiting.' },
    { activity: 'harvest', startMonth: 1, endMonth: 4, notes: 'Pick regularly to extend harvest.' },
  ],
  cabbage: [
    { activity: 'plant', startMonth: 11, endMonth: 1, notes: 'Cooler dry months form better heads.' },
    { activity: 'weed', startMonth: 12, endMonth: 2, notes: 'Protect from aphids.' },
    { activity: 'harvest', startMonth: 1, endMonth: 3, notes: 'Cut firm heads early morning.' },
  ],
  cassava: [
    { activity: 'plant', startMonth: 6, endMonth: 8, notes: 'Plant cuttings early in rains.' },
    { activity: 'weed', startMonth: 7, endMonth: 9, notes: 'Weed until canopy closes.' },
    { activity: 'harvest', startMonth: 1, endMonth: 12, notes: 'Harvest as needed year-round.' },
  ],
  mango: [
    { activity: 'plant', startMonth: 6, endMonth: 8, notes: 'Establish young trees in rains.' },
    { activity: 'harvest', startMonth: 4, endMonth: 7, notes: 'Peak dry-season harvest.' },
  ],
  sorghum: [
    { activity: 'plant', startMonth: 6, endMonth: 7, notes: 'Suited to drier inland zones.' },
    { activity: 'weed', startMonth: 7, endMonth: 8, notes: 'Early thinning and weeding.' },
    { activity: 'harvest', startMonth: 9, endMonth: 11, notes: 'Watch birds at grain fill.' },
  ],
  cashew: [
    { activity: 'plant', startMonth: 6, endMonth: 8, notes: 'Plant young trees in the rains.' },
    { activity: 'weed', startMonth: 7, endMonth: 9, notes: 'Keep firebreaks and undergrowth clear.' },
    { activity: 'harvest', startMonth: 2, endMonth: 5, notes: 'Collect nuts promptly in the dry season.' },
  ],
};

export const ACTIVITY_LABELS = {
  plant: 'Planting',
  weed: 'Weeding',
  fertilise: 'Fertilising',
  harvest: 'Harvesting',
};

export function monthInWindow(month, startMonth, endMonth) {
  if (startMonth <= endMonth) return month >= startMonth && month <= endMonth;
  return month >= startMonth || month <= endMonth;
}

export function getCropCalendar(crop, region) {
  const entries = CROP_CALENDAR[crop] || [];
  return entries.map((entry) => ({ ...entry, crop, region: region || null }));
}

export function currentActivities(crops = [], month = new Date().getMonth() + 1, region) {
  const results = [];
  crops.forEach((crop) => {
    getCropCalendar(crop, region).forEach((entry) => {
      if (monthInWindow(month, entry.startMonth, entry.endMonth)) {
        results.push({ ...entry, current: true });
      }
    });
  });
  return results;
}
