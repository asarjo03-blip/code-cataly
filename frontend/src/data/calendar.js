/** Activity windows by crop (1–12 months). Tuned for The Gambia rainy/dry pattern. */
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
  okra: [
    { activity: 'plant', startMonth: 6, endMonth: 8, notes: 'Sow with the rains, or under irrigation from October.' },
    { activity: 'weed', startMonth: 7, endMonth: 9, notes: 'Keep beds clean and mulch to hold moisture.' },
    { activity: 'harvest', startMonth: 7, endMonth: 11, notes: 'Pick tender pods every two to three days.' },
  ],
  pepper: [
    { activity: 'plant', startMonth: 10, endMonth: 1, notes: 'Raise nursery, then transplant to irrigated beds.' },
    { activity: 'weed', startMonth: 11, endMonth: 3, notes: 'Mulch and keep beds weed-free.' },
    { activity: 'harvest', startMonth: 1, endMonth: 5, notes: 'Pick green or red depending on market.' },
  ],
  sweet_potato: [
    { activity: 'plant', startMonth: 6, endMonth: 8, notes: 'Plant vines on ridges early in the rains.' },
    { activity: 'weed', startMonth: 7, endMonth: 9, notes: 'Weed until vines cover the ground.' },
    { activity: 'harvest', startMonth: 10, endMonth: 12, notes: 'Lift from about three months.' },
  ],
  sesame: [
    { activity: 'plant', startMonth: 6, endMonth: 7, notes: 'Sow on well-drained soil with the early rains.' },
    { activity: 'weed', startMonth: 7, endMonth: 8, notes: 'Thin and weed within the first three weeks.' },
    { activity: 'harvest', startMonth: 9, endMonth: 10, notes: 'Cut before capsules shatter.' },
  ],
  cowpea: [
    { activity: 'plant', startMonth: 6, endMonth: 7, notes: 'Sow with the rains at recommended spacing.' },
    { activity: 'weed', startMonth: 7, endMonth: 8, notes: 'Keep young plants weed-free.' },
    { activity: 'harvest', startMonth: 9, endMonth: 10, notes: 'Pick mature pods and dry well.' },
  ],
  watermelon: [
    { activity: 'plant', startMonth: 11, endMonth: 1, notes: 'Plant irrigated dry-season beds.' },
    { activity: 'weed', startMonth: 12, endMonth: 2, notes: 'Keep beds clean and mulched.' },
    { activity: 'harvest', startMonth: 2, endMonth: 4, notes: 'Reduce watering as fruit ripens.' },
  ],
  papaya: [
    { activity: 'plant', startMonth: 6, endMonth: 8, notes: 'Establish seedlings on well-drained mounds.' },
    { activity: 'harvest', startMonth: 1, endMonth: 12, notes: 'Harvest fruit as it colours.' },
  ],
  banana: [
    { activity: 'plant', startMonth: 6, endMonth: 8, notes: 'Plant suckers with the rains.' },
    { activity: 'harvest', startMonth: 1, endMonth: 12, notes: 'Cut bunches when fruit fills.' },
  ],
  lime: [
    { activity: 'plant', startMonth: 6, endMonth: 8, notes: 'Plant young trees at the start of the rains.' },
    { activity: 'harvest', startMonth: 1, endMonth: 12, notes: 'Pick fruit as needed.' },
  ],
  cucumber: [
    { activity: 'plant', startMonth: 10, endMonth: 1, notes: 'Plant irrigated beds, preferably on trellis.' },
    { activity: 'weed', startMonth: 11, endMonth: 2, notes: 'Keep beds clean and water at the base.' },
    { activity: 'harvest', startMonth: 12, endMonth: 3, notes: 'Pick young fruit every few days.' },
  ],
  moringa: [
    { activity: 'plant', startMonth: 6, endMonth: 8, notes: 'Direct sow or transplant with the rains.' },
    { activity: 'harvest', startMonth: 1, endMonth: 12, notes: 'Cut young shoots for leaf harvest.' },
  ],
  tiger_nut: [
    { activity: 'plant', startMonth: 6, endMonth: 7, notes: 'Plant tubers early in the rains.' },
    { activity: 'weed', startMonth: 7, endMonth: 9, notes: 'Keep the crop weed-free while young.' },
    { activity: 'harvest', startMonth: 11, endMonth: 12, notes: 'Lift tubers after the rains.' },
  ],
};

export const ACTIVITY_LABELS = {
  plant: 'Planting',
  weed: 'Weeding',
  fertilise: 'Fertilising',
  harvest: 'Harvesting',
};

export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function monthInWindow(month, startMonth, endMonth) {
  if (startMonth <= endMonth) return month >= startMonth && month <= endMonth;
  return month >= startMonth || month <= endMonth;
}

export function getCropCalendar(crop) {
  return CROP_CALENDAR[crop] || [];
}

export function currentActivities(crops = [], month = new Date().getMonth() + 1) {
  const results = [];
  crops.forEach((crop) => {
    getCropCalendar(crop).forEach((entry) => {
      if (monthInWindow(month, entry.startMonth, entry.endMonth)) {
        results.push({ crop, ...entry, current: true });
      }
    });
  });
  return results;
}
