import { getCropCalendar, monthInWindow, MONTH_LABELS } from './calendar.js';
import { searchAdvisories } from './advisories.js';
import { formatCrop } from '../utils/format.js';

/**
 * Rule-based farm advice for the voice helper.
 *
 * The goal is conversation, not a calendar dump: when a farmer asks
 * "should I plant groundnut now or wait for rain?", the helper answers
 * yes/wait, explains why using the season and the live forecast, then
 * gives the next practical steps.
 *
 * Everything here is offline-friendly. Weather is optional; when it is
 * missing the advice falls back to the Gambian season and crop calendar.
 */

const CROP_PROFILES = {
  groundnut: {
    rainfed: true,
    days: 100,
    water: 'medium',
    plant:
      'Sow shelled seed 4–5 cm deep, 45 cm between rows and 15 cm within the row. Use certified seed and a little gypsum or phosphorus where you have it.',
    care:
      'Weed early and keep the field free of standing water. Go easy on nitrogen — too much leaf means fewer pods.',
    harvestSigns:
      'Pods feel full, the inside of the shell shows dark veins, and the plants begin to yellow. Lift before pods sit in wet soil.',
    storage:
      'Dry pods on a raised tarpaulin until they snap, sort out mouldy nuts, and store on pallets in a dry, ventilated room to limit aflatoxin.',
    problems: 'leaf spot, aphids, termites and white grubs',
  },
  rice: {
    rainfed: true,
    days: 120,
    water: 'high',
    plant:
      'Raise a nursery and transplant healthy seedlings, or direct-sow on well-prepared lowland. Keep bunds and drainage channels clear.',
    care:
      'Keep the field shallow-flooded where you can and split nitrogen applications. Watch for blast after long wet spells.',
    harvestSigns:
      'Grains at the dough stage turn firm and straw-coloured. Harvest before the panicles shatter.',
    storage:
      'Dry paddy to low moisture, bag clean, and keep off damp floors. Cover bags so rain cannot reach them.',
    problems: 'blast, stem borers and birds at grain fill',
  },
  millet: {
    rainfed: true,
    days: 90,
    water: 'low',
    plant:
      'Sow on upland soil with the early rains, 60–75 cm between rows. Thin to strong plants after emergence.',
    care:
      'Keep young plants weed-free and watch birds as the grain fills. Millet tolerates dry spells better than maize.',
    harvestSigns:
      'Heads turn brown and grain is hard. Cut and dry before birds take too much.',
    storage:
      'Dry heads on a mat, thresh, and store grain in clean bags in a dry room.',
    problems: 'birds, downy mildew and stem borers',
  },
  maize: {
    rainfed: true,
    days: 100,
    water: 'medium',
    plant:
      'Sow with reliable rains, 75 cm between rows and 25–30 cm within the row. Use improved seed where you can afford it.',
    care:
      'Maize is thirsty at tasselling. Weed early, top-dress nitrogen after the first weeding, and keep the field free of standing water.',
    harvestSigns:
      'Cobs fill and the husks dry. Harvest when grain is hard and the cobs bend down.',
    storage:
      'Shell and dry to low moisture. Store in sealed bags with a little approved protectant if weevils are a problem.',
    problems: 'fall armyworm, stem borers and striga',
  },
  sorghum: {
    rainfed: true,
    days: 110,
    water: 'low',
    plant:
      'Sow on upland fields with the early rains, 60–75 cm between rows. It suits drier inland zones better than maize.',
    care:
      'Thin and weed early. Birds are the main thief at grain fill, so plan your harvest timing.',
    harvestSigns:
      'Heads turn brown and grain is hard. Cut, dry and thresh on a clean mat.',
    storage:
      'Dry grain well, remove debris, and store in clean bags in a dry room.',
    problems: 'birds, stem borers and grain moulds',
  },
  cassava: {
    rainfed: true,
    days: 240,
    water: 'low',
    plant:
      'Plant healthy stem cuttings on ridges or flat beds at the start of the rains. Use clean planting material.',
    care:
      'Weed until the canopy closes. Cassava tolerates poor soil, but it still needs a weed-free start.',
    harvestSigns:
      'Lift when roots reach market size, usually from eight months. You can leave part of the crop in the ground and harvest as needed.',
    storage:
      'Fresh roots spoil quickly. Sell or process within a few days; dry into chips or flour if you need to keep them.',
    problems: 'mosaic virus, mealybug and root rot',
  },
  onion: {
    rainfed: false,
    days: 100,
    water: 'medium',
    plant:
      'Raise seedlings in a nursery, then transplant to well-drained beds. Irrigated dry-season beds give the best bulbs.',
    care:
      'Keep moisture steady, weed carefully, and stop heavy watering as bulbs mature. Too much nitrogen gives soft bulbs.',
    harvestSigns:
      'Tops fall over and necks dry. Lift on a dry day and cure in the shade.',
    storage:
      'Cure until skins rustle, then store in mesh bags or on racks in a dry, airy place. Check weekly for soft bulbs.',
    problems: 'thrips, purple blotch and storage rot',
  },
  tomato: {
    rainfed: false,
    days: 75,
    water: 'high',
    plant:
      'Raise seedlings and transplant to raised beds with good drainage. Stake or trellis to keep fruit off the soil.',
    care:
      'Water at the base, early in the day. Mulch to hold moisture and avoid overhead watering that spreads disease.',
    harvestSigns:
      'Fruit colours and gives slightly under pressure. Pick every few days and keep damaged fruit out of the crate.',
    storage:
      'Do not stack ripe tomatoes deep. Sell quickly or shade them; cool storage extends shelf life.',
    problems: 'aphids, whitefly, blight and fruit worm',
  },
  cabbage: {
    rainfed: false,
    days: 90,
    water: 'high',
    plant:
      'Raise seedlings and transplant to fertile, well-drained beds. Space about 45 cm apart so heads size well.',
    care:
      'Keep moisture steady and feed nitrogen in split doses. Watch caterpillars in the centre of the head.',
    harvestSigns:
      'Heads are firm and tight. Cut with a few wrapper leaves and keep them shaded after harvest.',
    storage:
      'Cabbage keeps better cool and moist. Sell quickly in hot weather and do not stack heavy.',
    problems: 'diamondback moth, aphids and black rot',
  },
  mango: {
    rainfed: true,
    days: 1460,
    water: 'low',
    plant:
      'Plant grafted trees at the start of the rains, in a wide hole with compost. Keep the graft union above soil level.',
    care:
      'Water young trees through dry spells, prune for airflow, and keep firebreaks clear. Collect fallen fruit.',
    harvestSigns:
      'Fruit shoulders fill, skin colour changes and the fruit gives slightly. Harvest with a short stalk.',
    storage:
      'Handle gently, pack in single layers, and keep out of the sun. Fruit fly damage shows as dark puncture marks.',
    problems: 'fruit fly, anthracnose and mealybug',
  },
  cashew: {
    rainfed: true,
    days: 1095,
    water: 'low',
    plant:
      'Plant grafted or improved seedlings at the start of the rains. Keep the orchard weed-free around young trees.',
    care:
      'Prune for shape, mulch young trees, and keep firebreaks clear before the hot dry months.',
    harvestSigns:
      'Nuts turn grey-brown and fall. Collect daily and dry on a clean mat.',
    storage:
      'Dry raw nuts well and store in a dry, ventilated place away from smoke and damp.',
    problems: 'tea mosquito bug, anthracnose and fire damage',
  },
  okra: {
    rainfed: true,
    days: 55,
    water: 'medium',
    plant:
      'Sow directly in beds about 60 cm between rows and 30 cm within the row. Okra also grows well under irrigation in the dry season.',
    care:
      'Keep beds weed-free and mulch to hold moisture. Pick regularly so plants keep flowering.',
    harvestSigns:
      'Pods are tender and snap easily, about 5–8 cm long. Pick every two to three days.',
    storage:
      'Okra loses quality fast. Keep pods shaded and cool, and sell within a day or two.',
    problems: 'whitefly, aphids and yellow mosaic virus',
  },
  pepper: {
    rainfed: false,
    days: 90,
    water: 'medium',
    plant:
      'Raise a nursery, then transplant to well-drained beds. Space about 50 cm between rows and 40 cm within the row.',
    care:
      'Water steadily and mulch. Avoid heavy nitrogen, which gives leaf and few fruit. Watch thrips in the flowers.',
    harvestSigns:
      'Pick green for fresh market or red for drying. Harvest regularly so plants keep setting fruit.',
    storage:
      'Fresh chilli keeps longer shaded and cool. For drying, spread in a thin layer and turn daily.',
    problems: 'thrips, aphids and pepper wilt',
  },
  sweet_potato: {
    rainfed: true,
    days: 100,
    water: 'medium',
    plant:
      'Plant healthy vines on ridges early in the rains. Ridges reduce waterlogging and make lifting easier.',
    care:
      'Weed until the vines cover the ground. Avoid planting vines that came from a weevil-infested field.',
    harvestSigns:
      'Roots size up from about three months and the leaves begin to yellow. Lift the largest roots first.',
    storage:
      'Cure roots in the shade for a few days, then store cool and dry. Remove any roots with weevil holes.',
    problems: 'sweet potato weevil, virus and root rot',
  },
  sesame: {
    rainfed: true,
    days: 90,
    water: 'low',
    plant:
      'Sow on well-drained soil with the early rains, in rows about 50 cm apart. Thin to the recommended spacing.',
    care:
      'Sesame is a weak early competitor. Weed within the first three weeks and keep the field free of standing water.',
    harvestSigns:
      'Lower capsules turn brown but before they open fully. Cut and bundle before seed shatters.',
    storage:
      'Dry bundles upright on a tarpaulin, shake out the seed, and dry it well before bagging.',
    problems: 'capsule shattering, webworm and leaf spot',
  },
  cowpea: {
    rainfed: true,
    days: 75,
    water: 'low',
    plant:
      'Sow with the rains at about 60 cm between rows and 20 cm within the row. It fixes nitrogen and fits well after cereals.',
    care:
      'Keep young plants weed-free and watch flower thrips. Do not overwater.',
    harvestSigns:
      'Pods turn brown and dry. Pick mature pods promptly before they split.',
    storage:
      'Dry grain well and store in clean sealed containers. Inspect monthly for bruchid holes.',
    problems: 'flower thrips, bruchids and pod borers',
  },
  watermelon: {
    rainfed: false,
    days: 90,
    water: 'medium',
    plant:
      'Plant irrigated beds in the dry season, about 2 m between rows and 1 m within the row. Place fruit on dry straw or a board.',
    care:
      'Water at the base and reduce overhead watering as fruit ripens. Watch fruit fly and avoid waterlogging.',
    harvestSigns:
      'The tendril near the fruit dries, the underside turns creamy, and the fruit sounds hollow when tapped.',
    storage:
      'Keep harvested fruit shaded. Do not drop or stack heavy; damaged fruit rots quickly.',
    problems: 'fruit fly, downy mildew and splitting',
  },
  papaya: {
    rainfed: false,
    days: 300,
    water: 'medium',
    plant:
      'Plant improved seedlings on raised mounds or beds that drain well. Keep the planting hole free of standing water.',
    care:
      'Water young trees through dry spells, mulch around the base, and stake plants that lean after wind.',
    harvestSigns:
      'Fruit colours from the tip and gives slightly. Harvest as it begins to turn for market.',
    storage:
      'Handle gently and keep shaded. Ripe papaya bruises easily, so pack in single layers.',
    problems: 'fruit fly, papaya ringspot virus and root rot',
  },
  banana: {
    rainfed: false,
    days: 300,
    water: 'high',
    plant:
      'Plant healthy suckers in a well-drained spot with wind protection. Keep two or three strong suckers per mat.',
    care:
      'Water regularly, mulch heavily, and prop heavy bunches before they pull the stem over.',
    harvestSigns:
      'Bunches fill and the first fingers begin to change colour. Cut with a short stalk.',
    storage:
      'Keep bunches shaded and handle gently. Green bunches ripen after harvest.',
    problems: 'panama disease, banana weevil and wind damage',
  },
  lime: {
    rainfed: false,
    days: 730,
    water: 'medium',
    plant:
      'Plant young trees at the start of the rains in a well-drained hole with compost. Keep the graft union above soil level.',
    care:
      'Water young trees through the dry season, prune for airflow, and mulch around the base.',
    harvestSigns:
      'Fruit colours and feels slightly soft. Pick as needed; limes hold well on the tree for a while.',
    storage:
      'Store in a cool, shaded place. Handle gently to avoid oil spotting and mould.',
    problems: 'citrus leaf miner, aphids and fruit fly',
  },
  cucumber: {
    rainfed: false,
    days: 60,
    water: 'high',
    plant:
      'Plant irrigated beds, preferably on a trellis, about 1 m between rows. Keep fruit off the soil.',
    care:
      'Water at the base early in the day and keep beds weed-free. Trellising improves airflow and fruit quality.',
    harvestSigns:
      'Fruit is young, firm and straight. Pick every few days so plants keep producing.',
    storage:
      'Cucumber loses water quickly. Keep shaded and cool, and sell within a few days.',
    problems: 'downy mildew, fruit fly and aphids',
  },
  moringa: {
    rainfed: true,
    days: 90,
    water: 'low',
    plant:
      'Direct sow or transplant with the rains. Moringa tolerates poor soil but needs good drainage.',
    care:
      'Cut back regularly to encourage tender leaf harvest. Avoid stripping the whole tree at once.',
    harvestSigns:
      'Harvest young shoots and leaves while tender. Leave enough stem for regrowth.',
    storage:
      'Dry leaves in the shade to keep colour, then store in airtight containers away from light.',
    problems: 'caterpillars, aphids and root rot in wet soil',
  },
  tiger_nut: {
    rainfed: true,
    days: 130,
    water: 'medium',
    plant:
      'Plant tubers early in the rains on loose, well-drained soil. Keep the field weed-free while the crop is young.',
    care:
      'Tiger nut likes steady moisture but not standing water. Weed until the plants close the rows.',
    harvestSigns:
      'Tops begin to die back after the rains. Loosen the soil and lift the tubers.',
    storage:
      'Wash, remove damaged tubers, and dry in the shade before bagging. Store cool and ventilated.',
    problems: 'weevils, root rot and poor tuber fill',
  },
};

const DEFAULT_PROFILE = {
  rainfed: true,
  days: 90,
  water: 'medium',
  plant: 'Prepare a fine, weed-free seedbed and sow with reliable moisture at the recommended spacing for your variety.',
  care: 'Keep the crop weed-free, water steadily, and inspect leaves for pests and disease every week.',
  harvestSigns: 'Harvest when the part you eat is mature and the plant begins to dry down.',
  storage: 'Dry the harvest well, sort out damaged produce, and store in a clean, dry, ventilated place.',
  problems: 'pests, leaf disease and moisture stress',
};

const PROBLEM_RULES = [
  {
    keys: ['yellow', 'yellowing', 'pale', 'chlorotic'],
    cause: 'a nutrient deficiency, water stress, or a virus spread by whitefly',
    actions: [
      'Check the undersides of the leaves for whitefly or aphids early in the morning.',
      'Compare old and young leaves: yellow old leaves usually mean nitrogen hunger; yellow young leaves can mean a virus.',
      'Remove badly affected plants and keep weeds and old crop debris down.',
    ],
  },
  {
    keys: ['wilt', 'wilting', 'droop', 'collapse'],
    cause: 'water stress, root rot, or root-knot nematodes',
    actions: [
      'Dig beside a wilting plant and look at the roots: brown, mushy roots point to rot; lumpy roots point to nematodes.',
      'Check that water drains away and that the plant is not sitting in a wet pocket.',
      'Water deeply but less often, and remove plants that stay wilted after the soil is moist.',
    ],
  },
  {
    keys: ['spot', 'spots', 'lesion', 'lesions', 'blight', 'rust'],
    cause: 'a fungal or bacterial leaf spot',
    actions: [
      'Pick off the worst leaves and keep them out of the field.',
      'Space plants and prune for airflow; avoid overhead watering in the evening.',
      'Rotate away from the same crop next season and use clean seed.',
    ],
  },
  {
    keys: ['hole', 'holes', 'chewed', 'eaten', 'caterpillar', 'worm', 'armyworm'],
    cause: 'caterpillars or beetles feeding on the leaves',
    actions: [
      'Inspect early morning and hand-pick caterpillars where the area is small.',
      'Look in the centre of cabbage or maize whorls, where larvae hide.',
      'Encourage birds and use a recommended product only when the damage is serious, following the label.',
    ],
  },
  {
    keys: ['curl', 'curled', 'curling', 'twisted', 'crinkle'],
    cause: 'aphids, thrips, or a virus',
    actions: [
      'Open the curled leaves and look for tiny insects or sticky honeydew.',
      'Wash small infestations with soapy water and remove badly curled shoots.',
      'Do not save seed from virus-infected plants.',
    ],
  },
  {
    keys: ['white', 'powder', 'powdery', 'mildew', 'grey', 'gray'],
    cause: 'powdery or downy mildew',
    actions: [
      'Remove affected leaves and improve airflow around the plants.',
      'Water at the base early in the day and avoid crowding.',
      'Rotate crops and keep old cucurbit or vegetable debris out of the field.',
    ],
  },
  {
    keys: ['rot', 'rotting', 'soft', 'mushy', 'smell'],
    cause: 'waterlogging and a fungal or bacterial rot',
    actions: [
      'Open drainage and move water away from the beds immediately.',
      'Remove rotting fruit or plants and do not add them to compost.',
      'Plant on raised beds or mounds next season and rotate the crop.',
    ],
  },
  {
    keys: ['dry', 'drying', 'crisp', 'burnt', 'scorch', 'brown edge'],
    cause: 'drought stress, salt, or fertiliser burn',
    actions: [
      'Check soil moisture 10 cm down before watering again.',
      'Water deeply in the early morning and mulch to hold moisture.',
      'Do not place fertiliser directly against the stem; water it in well.',
    ],
  },
  {
    keys: ['small', 'stunted', 'slow', 'poor growth'],
    cause: 'poor soil, nematodes, weeds, or early moisture stress',
    actions: [
      'Pull a weak plant and check the roots for lumps or rot.',
      'Weed around the plants and apply well-rotted compost or manure.',
      'Check that the spacing is right and that water reaches the root zone.',
    ],
  },
  {
    keys: ['aphid', 'whitefly', 'thrip', 'mite', 'mealybug', 'insect', 'bug'],
    cause: 'sap-sucking insects',
    actions: [
      'Inspect leaf undersides and young shoots early in the morning.',
      'Wash small infestations with soapy water and remove heavily infested shoots.',
      'Avoid broad-spectrum sprays that kill the natural enemies (ladybirds and spiders).',
    ],
  },
  {
    keys: ['termite', 'termites'],
    cause: 'termites attacking dry soil or old crop residues',
    actions: [
      'Remove old stumps and dry wood from around the field.',
      'Keep the crop growing vigorously; healthy plants resist termites better.',
      'Ask your extension officer about a recommended termite control method for your area.',
    ],
  },
];

const FOLLOW_UP_TERMS = ['why', 'how come', 'tell me more', 'more detail', 'and then', 'what else', 'anything else', 'explain', 'really', 'are you sure', 'ok', 'okay', 'yes', 'no', 'thanks', 'thank you'];
const REASON_TERMS = ['why', 'how come', 'explain', 'reason'];
const MORE_TERMS = ['what else', 'anything else', 'more', 'tell me more', 'and then', 'next'];
const AFFIRM_TERMS = ['yes', 'yeah', 'ok', 'okay', 'sure', 'alright'];

const PLANT_TERMS = ['plant', 'planting', 'sow', 'sowing', 'transplant', 'transplanting', 'nursery', 'seed'];
const HARVEST_TERMS = ['harvest', 'harvesting', 'reap', 'reaping', 'pick', 'picking', 'lift', 'lifting', 'dig up'];
const FERTILISE_TERMS = ['fertilise', 'fertilize', 'fertilising', 'fertilizing', 'fertiliser', 'fertilizer', 'top dress', 'npk', 'manure', 'compost', 'feed'];
const WATER_TERMS = ['water', 'watering', 'irrigate', 'irrigation'];
const WEED_TERMS = ['weed', 'weeding', 'clear', 'clearing', 'thin', 'thinning'];
const DECISION_TERMS = [
  'should i', 'should we', 'can i', 'could i', 'is it', 'is now', 'right now', 'or wait', 'wait for',
  'too late', 'too early', 'time to', 'ready to', 'good time', 'okay to', 'ok to', 'do i need',
  'when should i', 'when do i', 'when can i', 'is this the right time',
];
const ADVICE_TERMS = [
  'advice', 'advise', 'recommend', 'recommendation', 'what should i do', 'what do i do',
  'what can i do', 'help me with', 'guide me', 'plan for', 'this week', 'this month',
];
const HOWTO_TERMS = ['how do i grow', 'how to grow', 'how do i plant', 'how to plant', 'how do i farm', 'how to farm', 'teach me', 'show me how'];
const SYMPTOM_TERMS = PROBLEM_RULES.flatMap((rule) => rule.keys);

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasTerm(text, terms) {
  return terms.some((term) => {
    const clean = normalize(term);
    if (!clean) return false;
    if (clean.includes(' ')) return text.includes(clean);
    return new RegExp(`(^|\\s)${clean}($|\\s)`).test(text);
  });
}

function profileFor(crop) {
  return CROP_PROFILES[crop] || DEFAULT_PROFILE;
}

function windowFor(crop, activity) {
  return getCropCalendar(crop).find((entry) => entry.activity === activity) || null;
}

function monthRange(entry) {
  if (!entry) return '';
  const start = MONTH_LABELS[entry.startMonth - 1] || entry.startMonth;
  const end = MONTH_LABELS[entry.endMonth - 1] || entry.endMonth;
  return start === end ? String(start) : `${start} to ${end}`;
}

function monthsUntil(currentMonth, targetMonth) {
  return (targetMonth - currentMonth + 12) % 12;
}

export function gambiaSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  if (month >= 6 && month <= 10) {
    return {
      season: 'rainy',
      phase: month === 6 ? 'onset' : month === 10 ? 'late' : 'peak',
      label: month === 6 ? 'rainy season onset' : month === 10 ? 'late rains and harvest' : 'peak rainy season',
    };
  }
  if (month === 11 || month === 12) {
    return { season: 'dry', phase: 'harvest', label: 'post-rain harvest and storage' };
  }
  if (month <= 3) {
    return { season: 'dry', phase: 'harmattan', label: 'cool dry harmattan' };
  }
  return { season: 'dry', phase: 'hot', label: 'hot dry season' };
}

function seasonOf(weather, date) {
  if (weather?.season?.phase) {
    return {
      season: weather.season.season || gambiaSeason(date).season,
      phase: weather.season.phase,
      label: weather.season.label || gambiaSeason(date).label,
    };
  }
  return gambiaSeason(date);
}

function rainOutlook(weather) {
  const currentRain = Number(weather?.current?.rainMm || 0);
  const forecast = Array.isArray(weather?.forecast) ? weather.forecast : [];
  const next3 = forecast.slice(0, 3).reduce((sum, day) => sum + Number(day.rainMm || 0), 0);
  const next5 = forecast.slice(0, 5).reduce((sum, day) => sum + Number(day.rainMm || 0), 0);
  const wetDays = forecast.slice(0, 5).filter((day) => Number(day.rainMm || 0) >= 2).length;
  const heavyDays = forecast.slice(0, 5).filter((day) => Number(day.rainMm || 0) >= 20).length;
  const dryDays = forecast.slice(0, 5).filter((day) => Number(day.rainMm || 0) < 1).length;
  return { currentRain, next3, next5, wetDays, heavyDays, dryDays, hasForecast: forecast.length > 0 };
}

function listSteps(steps) {
  return steps.filter(Boolean).map((step, index) => `${index + 1}) ${step}`).join(' ');
}

function capitalise(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function rainSentence(outlook) {
  if (!outlook.hasForecast) return '';
  const parts = [];
  if (outlook.currentRain > 0) parts.push(`${outlook.currentRain.toFixed(0)} mm is falling now`);
  if (outlook.next3 >= 1) parts.push(`about ${outlook.next3.toFixed(0)} mm is expected in the next three days`);
  else parts.push('very little rain is expected in the next three days');
  if (outlook.heavyDays) parts.push('one of those days could bring heavy rain');
  return `${capitalise(parts.join(', '))}.`;
}

function plantingAdvice(crop, weather, now) {
  const profile = profileFor(crop);
  const cropLabel = formatCrop(crop);
  const entry = windowFor(crop, 'plant');
  const month = now.getMonth() + 1;
  const outlook = rainOutlook(weather);
  const season = seasonOf(weather, now);

  if (!entry) {
    return {
      verdict: `I would treat ${cropLabel} as a flexible crop.`,
      reason: 'There is no fixed planting window in the calendar for it, so the decision depends on moisture and your market.',
      steps: [profile.plant, 'Check that the soil is moist 10 cm down before sowing.', 'Start with a small plot, then expand if it establishes well.'],
    };
  }

  const inWindow = monthInWindow(month, entry.startMonth, entry.endMonth);
  const before = monthsUntil(month, entry.startMonth);
  const windowLabel = monthRange(entry);
  const rainfed = profile.rainfed;

  if (inWindow) {
    if (!rainfed) {
      return {
        verdict: `Yes — you can plant ${cropLabel} now.`,
        reason: `${cropLabel} is grown under irrigation here, and ${monthName(month)} is inside its planting window (${windowLabel}). ${rainSentence(outlook)}`.trim(),
        steps: [profile.plant, 'Make sure you have enough water for the first month.', 'Plant on raised beds or well-drained soil so heavy rain does not drown the seedlings.'],
      };
    }

    if (outlook.currentRain >= 5 || outlook.next3 >= 8) {
      return {
        verdict: `Yes — plant ${cropLabel} now.`,
        reason: `You are inside the ${windowLabel} window and there is enough moisture to start. ${rainSentence(outlook)}`.trim(),
        steps: ['Prepare the seedbed and sow certified seed at the right depth.', profile.plant, 'Do not sow more than you can weed in the first three weeks.'],
      };
    }

    if (outlook.next3 >= 2 || outlook.wetDays >= 1) {
      return {
        verdict: 'Wait a few days before you sow.',
        reason: `You are in the planting window, but the soil is still on the dry side. ${rainSentence(outlook)} ${cropLabel} needs a real soaking rain, not a light shower, for even germination.`.trim(),
        steps: ['Finish land preparation and keep the seed dry.', 'Wait for one or two good rains, then sow immediately.', 'On sandy soil, do not dry-plant — the seed can rot or be eaten.'],
      };
    }

    return {
      verdict: 'Wait for a proper soaking rain.',
      reason: `The calendar says ${cropLabel} can be planted in ${windowLabel}, but the ground is dry. ${rainSentence(outlook)} Sowing into dry soil wastes seed.`.trim(),
      steps: ['Prepare the field and keep your seed in a dry, shaded place.', 'After a good rain of about 15–20 mm, check that the soil is wet 10 cm down.', 'Then sow and keep the field weed-free from the first week.'],
    };
  }

  if (before <= 3 && before > 0) {
    return {
      verdict: `Wait — it is too early to plant ${cropLabel}.`,
      reason: `The main planting window is ${windowLabel}, about ${before} month${before === 1 ? '' : 's'} from now. ${rainSentence(outlook)}`.trim(),
      steps: ['Use the waiting time to prepare land, repair bunds and source certified seed.', 'Keep a small vegetable nursery going if you need income before the main season.', `Start sowing when the window opens and the rains are reliable.`],
    };
  }

  if (before > 3 && before <= 9) {
    return {
      verdict: `Not yet — ${cropLabel} is out of season.`,
      reason: `The main planting window is ${windowLabel}. We are in the ${season.label}, so sowing now would not match the rains.`,
      steps: ['Plan the field for the next planting window.', 'Choose a short-cycle crop you can sell before then, such as okra or leafy vegetables, if you have water.', 'Prepare compost and seed in advance.'],
    };
  }

  // After the window.
  if (!rainfed && (season.phase === 'hot' || season.phase === 'harmattan' || season.phase === 'harvest')) {
    return {
      verdict: `The main window has passed, but ${cropLabel} can still work under irrigation.`,
      reason: `The main planting window is ${windowLabel}. With reliable water and a suitable variety you can plant a smaller plot, but expect more heat and pest pressure.`,
      steps: [profile.plant, 'Start small and only plant what you can water through the dry season.', 'Choose a short-season variety and harvest before the next rains.'],
    };
  }

  return {
    verdict: `It is too late for rain-fed ${cropLabel} now.`,
    reason: `The planting window is ${windowLabel}, and we are now in the ${season.label}. Rain-fed ${cropLabel} needs about ${profile.days} days to mature, so sowing now would run into the dry season.`,
    steps: ['Do not waste seed on a rain-fed plot now.', 'If you have irrigation, try a short-season variety on a small plot and be ready to water.', 'Otherwise prepare the land and plant an irrigated dry-season crop such as onion, tomato or okra.'],
  };
}

function harvestAdvice(crop, weather, now) {
  const profile = profileFor(crop);
  const cropLabel = formatCrop(crop);
  const entry = windowFor(crop, 'harvest');
  const month = now.getMonth() + 1;
  const outlook = rainOutlook(weather);

  if (!entry) {
    return {
      verdict: `Check the crop before you harvest ${cropLabel}.`,
      reason: 'There is no fixed harvest window for this crop in the calendar, so use the maturity signs.',
      steps: [profile.harvestSigns, profile.storage, 'Harvest in the cool of the morning and keep the produce shaded.'],
    };
  }

  const windowLabel = monthRange(entry);
  if (monthInWindow(month, entry.startMonth, entry.endMonth)) {
    const rainWarning = outlook.heavyDays
      ? 'Heavy rain is in the forecast, so harvest and dry under cover before it arrives.'
      : '';
    return {
      verdict: `Yes — start harvesting ${cropLabel} now.`,
      reason: `You are inside the ${windowLabel} harvest window. ${rainWarning}`.trim(),
      steps: [profile.harvestSigns, profile.storage, 'Sort out damaged produce before storage or sale.'],
    };
  }

  const until = monthsUntil(month, entry.startMonth);
  if (until <= 3) {
    return {
      verdict: `Not yet — wait about ${until} month${until === 1 ? '' : 's'} before harvesting ${cropLabel}.`,
      reason: `The main harvest window is ${windowLabel}. Harvesting early gives small, poor-quality produce.`,
      steps: [profile.harvestSigns, 'Stop heavy watering or nitrogen as the crop matures.', 'Prepare clean bags, tarpaulins and a dry storage place now.'],
    };
  }

  return {
    verdict: `Harvest ${cropLabel} as soon as it is ready.`,
    reason: `The main harvest window was ${windowLabel}. Leaving a mature crop in the field risks loss to rain, birds, rodents or rot.`,
    steps: [profile.harvestSigns, profile.storage, 'Sell or process quickly if the quality is already declining.'],
  };
}

function fertiliseAdvice(crop, weather, now) {
  const cropLabel = formatCrop(crop);
  const entry = windowFor(crop, 'fertilise');
  const month = now.getMonth() + 1;
  const outlook = rainOutlook(weather);

  if (!entry) {
    return {
      verdict: `Feed ${cropLabel} only when the crop is actively growing.`,
      reason: 'There is no fixed fertiliser window for this crop in the calendar.',
      steps: ['Apply well-rotted manure or compost around the root zone, not against the stem.', 'Water it in well.', 'Do not over-apply nitrogen — it gives leaf and weakens the plant.'],
    };
  }

  if (monthInWindow(month, entry.startMonth, entry.endMonth)) {
    if (outlook.heavyDays) {
      return {
        verdict: 'Wait for the heavy rain to pass before fertilising.',
        reason: 'Heavy rain can wash nitrogen away or burn young plants. Split the application instead of applying it all at once.',
        steps: ['Apply after the field drains but while the soil is still moist.', 'Place fertiliser beside the plants, not on the leaves.', 'Water lightly if there is no rain after application.'],
      };
    }
    return {
      verdict: `Yes — this is a good time to fertilise ${cropLabel}.`,
      reason: `You are inside the ${monthRange(entry)} fertilising window.`,
      steps: ['Apply well-rotted manure or compost first, then a balanced fertiliser if you have it.', 'Split nitrogen into two applications rather than one heavy dose.', 'Water it in and keep the field weed-free so the crop gets the benefit.'],
    };
  }

  const until = monthsUntil(month, entry.startMonth);
  return {
    verdict: `Wait — it is not the main fertilising time for ${cropLabel}.`,
    reason: `The recommended window is ${monthRange(entry)}, about ${until} month${until === 1 ? '' : 's'} away. Feeding at the wrong time wastes money and can encourage weeds.`,
    steps: ['Use compost or manure to improve the soil now.', 'Keep the crop weed-free and water it steadily.', 'Apply the main fertiliser when the window opens and the crop is growing strongly.'],
  };
}

function waterAdvice(crop, weather, now) {
  const profile = profileFor(crop);
  const cropLabel = formatCrop(crop);
  const outlook = rainOutlook(weather);
  const season = seasonOf(weather, now);

  if (season.season === 'rainy' && outlook.next3 >= 10) {
    return {
      verdict: `Ease off watering ${cropLabel}.`,
      reason: `${rainSentence(outlook)} The soil should stay moist, and too much water can drown roots or wash away nutrients.`,
      steps: ['Check drainage and open channels if water stands for more than a few hours.', 'Water only if the top 10 cm of soil feels dry.', 'Watch for mildew and rot after wet spells.'],
    };
  }

  return {
    verdict: `Water ${cropLabel} deeply but less often.`,
    reason: `We are in the ${season.label}. ${rainSentence(outlook)} Deep watering encourages roots to go down, while light daily sprinkling keeps them shallow.`,
    steps: [profile.care, 'Water early in the morning so leaves dry before evening.', 'Mulch around the plants to hold moisture and keep the soil cool.'],
  };
}

function weedAdvice(crop) {
  const profile = profileFor(crop);
  const cropLabel = formatCrop(crop);
  return {
    verdict: `Weed ${cropLabel} early and keep the field clean.`,
    reason: 'Weeds steal water, light and nutrients, especially in the first three weeks after planting.',
    steps: ['Remove weeds before they flower and set seed.', 'Thin the crop to the recommended spacing at the same time.', profile.care],
  };
}

function problemAdvice(question, crop) {
  const text = question.text;
  const rule = PROBLEM_RULES.find((item) => hasTerm(text, item.keys)) || null;
  const cropLabel = crop ? formatCrop(crop) : 'the crop';
  const profile = crop ? profileFor(crop) : DEFAULT_PROFILE;
  const cause = rule?.cause || 'a pest, disease or stress problem';
  const actions = rule?.actions || [
    'Inspect the plants early in the morning and compare healthy and sick plants.',
    'Remove badly affected leaves or plants and keep them out of the field.',
    'Check water, drainage and recent fertiliser use before spraying anything.',
  ];

  return {
    verdict: `That sounds like ${cause} on your ${cropLabel}.`,
    reason: crop
      ? `Common problems in ${cropLabel} include ${profile.problems}. It is best to confirm before spending money on a spray.`
      : 'Confirm the cause before spending money on a spray.',
    steps: actions,
    category: hasTerm(text, ['pest', 'insect', 'worm', 'aphid', 'whitefly', 'termite', 'weevil', 'bug']) ? 'pest' : 'disease',
  };
}

function howToAdvice(crop) {
  const profile = profileFor(crop);
  const cropLabel = formatCrop(crop);
  const entry = windowFor(crop, 'plant');
  return {
    verdict: `Here is how to grow ${cropLabel}.`,
    reason: entry ? `Plant in ${monthRange(entry)} for the main season.` : 'Match planting to reliable moisture.',
    steps: [profile.plant, profile.care, profile.harvestSigns, profile.storage],
    category: 'general',
  };
}

function generalAdvice(crop, weather, now, user) {
  const season = seasonOf(weather, now);
  const outlook = rainOutlook(weather);
  const crops = crop
    ? [crop]
    : Array.isArray(user?.crops) && user.crops.length
      ? user.crops
      : ['groundnut', 'millet', 'rice'];

  const actions = [];
  crops.slice(0, 3).forEach((item) => {
    const entry = getCropCalendar(item).find((activity) => monthInWindow(now.getMonth() + 1, activity.startMonth, activity.endMonth));
    if (entry) actions.push(`${formatCrop(item)}: ${entry.notes}`);
  });

  if (season.season === 'rainy' && outlook.heavyDays) {
    actions.push('Open drainage channels before the heavy rain and delay spraying.');
  } else if (season.phase === 'harvest') {
    actions.push('Dry and bag the harvest on pallets, and sort out mouldy grain before storage.');
  } else if (season.phase === 'harmattan') {
    actions.push('Mulch vegetables and protect young trees from dry harmattan wind.');
  } else if (season.phase === 'hot') {
    actions.push('Water early in the morning and mulch to reduce evaporation.');
  }

  if (!actions.length) {
    actions.push('Walk the field and check for pests, weeds and moisture stress.');
    actions.push('Plan the next planting window and source clean seed.');
  }

  const cropLabel = crop ? formatCrop(crop) : 'your farm';
  return {
    verdict: `This is what I would focus on for ${cropLabel} now.`,
    reason: `We are in the ${season.label}. ${rainSentence(outlook)}`.trim(),
    steps: actions,
    category: 'general',
  };
}

function monthName(month) {
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return names[month - 1] || '';
}

/**
 * Decide whether a sentence is a farm-advice conversation and what it is about.
 * Returns null when the sentence belongs to another intent (prices, listings...).
 */
export function classifyFarmQuestion(input, { crop = null, context = null } = {}) {
  const text = normalize(input);
  if (!text) return null;

  const words = text.split(' ');
  const short = words.length <= 6;
  const hasCrop = Boolean(crop || context?.crop);
  const hasSymptom = hasTerm(text, SYMPTOM_TERMS) || hasTerm(text, ['pest', 'disease', 'sick']);
  const asksDecision = hasTerm(text, DECISION_TERMS);
  const asksHow = hasTerm(text, HOWTO_TERMS);
  const asksAdvice = hasTerm(text, ADVICE_TERMS);
  const asksWhy = hasTerm(text, REASON_TERMS);
  const isFollowUp = Boolean(context?.topic) && (short || hasTerm(text, FOLLOW_UP_TERMS));
  const isQuestion =
    text.includes('?') ||
    /^(should|can|is|do|does|when|what|how|why|which|will|would|am|my|the)\b/.test(text) ||
    asksDecision ||
    asksHow ||
    asksAdvice ||
    hasSymptom;

  let topic = null;
  if (hasSymptom) topic = 'problem';
  else if (hasTerm(text, PLANT_TERMS) && (asksDecision || asksHow || asksAdvice || isQuestion)) topic = 'plant';
  else if (hasTerm(text, HARVEST_TERMS) && (asksDecision || asksHow || asksAdvice || isQuestion)) topic = 'harvest';
  else if (hasTerm(text, FERTILISE_TERMS) && (asksDecision || asksAdvice || isQuestion)) topic = 'fertilise';
  else if (hasTerm(text, WATER_TERMS) && (asksDecision || asksAdvice || isQuestion)) topic = 'water';
  else if (hasTerm(text, WEED_TERMS) && (asksDecision || asksAdvice || isQuestion)) topic = 'weed';
  else if (asksHow && hasCrop) topic = 'howto';
  else if (asksAdvice) topic = 'general';
  else if (asksWhy && isFollowUp) topic = 'followup';
  else if (isFollowUp && hasCrop) topic = 'followup';

  if (!topic) return null;

  // Do not steal clear shopping or price questions.
  if (hasTerm(text, ['price', 'prices', 'cost', 'how much', 'sell for', 'buy request', 'who wants', 'who is buying'])) {
    return null;
  }
  // "Find groundnut", "I want to buy..." are marketplace requests, not advice.
  if (hasTerm(text, ['find', 'looking for', 'i want to buy', 'show me listings']) && !hasSymptom) {
    return null;
  }

  let effectiveCrop = crop || context?.crop || null;
  // If the farmer did not name a crop, answer for the season / their farm
  // rather than guessing a crop.
  if (!effectiveCrop && !['problem', 'general'].includes(topic)) {
    topic = 'general';
  }

  return {
    topic,
    crop: effectiveCrop,
    wantsReason: asksWhy,
    followUp: isFollowUp && !hasTerm(text, PLANT_TERMS) && !hasTerm(text, HARVEST_TERMS) && !hasSymptom,
    text,
  };
}

function relatedResults(crop, category) {
  if (!crop && !category) return [];
  let items = [];
  // Crop-specific guidance matters more than the category. Only fall back to
  // another crop's advisory when there is nothing relevant for this crop.
  if (crop) {
    items = searchAdvisories({ crop, category: category || undefined });
    if (!items.length) items = searchAdvisories({ crop });
  }
  if (!items.length && category) {
    items = searchAdvisories({ category }).filter((item) => !item.crop);
  }
  if (!items.length && crop) items = searchAdvisories({ crop });
  return items.slice(0, 2).map((item) => ({
    id: `farm-advice-${item.id}`,
    title: item.title,
    detail: item.summary,
    to: `/advisory/${item.id}`,
  }));
}

function followUpAnswer(question, context, crop, weather, now, user) {
  const text = question.text;
  const base = context || {};
  const cropLabel = crop ? formatCrop(crop) : 'your crop';

  if (hasTerm(text, REASON_TERMS) && base.reason) {
    return {
      speech: `Here is why: ${base.reason} ${base.steps?.length ? `The next step is: ${base.steps[0]}` : ''}`.trim(),
      verdict: base.verdict || '',
      reason: base.reason,
      steps: base.steps || [],
      category: base.category || 'general',
    };
  }

  if (hasTerm(text, MORE_TERMS) && base.steps?.length) {
    const remaining = base.steps.slice(1);
    const next = remaining.length ? remaining : base.steps;
    return {
      speech: `More on ${cropLabel}: ${listSteps(next)}`,
      verdict: base.verdict || '',
      reason: base.reason || '',
      steps: next,
      category: base.category || 'general',
    };
  }

  if (hasTerm(text, AFFIRM_TERMS) && base.steps?.length) {
    return {
      speech: `Good. Your next step: ${base.steps[0]} ${base.steps[1] ? `After that: ${base.steps[1]}` : ''}`.trim(),
      verdict: base.verdict || '',
      reason: base.reason || '',
      steps: base.steps,
      category: base.category || 'general',
    };
  }

  // Unknown follow-up: repeat the topic with a fresh short answer.
  const topic = base.topic || 'general';
  if (topic === 'plant') return plantingAdvice(crop || 'groundnut', weather, now);
  if (topic === 'harvest') return harvestAdvice(crop || 'groundnut', weather, now);
  if (topic === 'fertilise') return fertiliseAdvice(crop || 'groundnut', weather, now);
  if (topic === 'water') return waterAdvice(crop || 'groundnut', weather, now);
  if (topic === 'weed') return weedAdvice(crop || 'groundnut');
  if (topic === 'problem') return problemAdvice(question, crop);
  if (topic === 'howto') return howToAdvice(crop || 'groundnut');
  return generalAdvice(crop, weather, now, user);
}

/**
 * Build a conversational answer. Returns the spoken text, optional links,
 * and the context the next turn should carry.
 */
export function buildFarmAdvice({ question, crop = null, weather = null, user = null, now = new Date(), context = null }) {
  const effectiveCrop = crop || question?.crop || context?.crop || null;
  let answer;

  if (question?.topic === 'followup') {
    answer = followUpAnswer(question, context, effectiveCrop, weather, now, user);
  } else if (question?.topic === 'problem') {
    answer = problemAdvice(question, effectiveCrop);
  } else if (question?.topic === 'plant') {
    answer = plantingAdvice(effectiveCrop || 'groundnut', weather, now);
  } else if (question?.topic === 'harvest') {
    answer = harvestAdvice(effectiveCrop || 'groundnut', weather, now);
  } else if (question?.topic === 'fertilise') {
    answer = fertiliseAdvice(effectiveCrop || 'groundnut', weather, now);
  } else if (question?.topic === 'water') {
    answer = waterAdvice(effectiveCrop || 'groundnut', weather, now);
  } else if (question?.topic === 'weed') {
    answer = weedAdvice(effectiveCrop || 'groundnut');
  } else if (question?.topic === 'howto') {
    answer = howToAdvice(effectiveCrop || 'groundnut');
  } else {
    answer = generalAdvice(effectiveCrop, weather, now, user);
  }

  const cropLabel = effectiveCrop ? formatCrop(effectiveCrop) : '';
  const speech =
    answer.speech ||
    [answer.verdict, answer.reason, answer.steps?.length ? `What to do: ${listSteps(answer.steps.slice(0, 3))}` : '']
      .filter(Boolean)
      .join(' ');

  const category = answer.category || (question?.topic === 'problem' ? 'disease' : 'general');
  const results = relatedResults(effectiveCrop, category);

  return {
    speech,
    results,
    path: null,
    context: {
      crop: effectiveCrop,
      topic: question?.topic === 'followup' ? context?.topic || 'general' : question?.topic || 'general',
      verdict: answer.verdict,
      reason: answer.reason,
      steps: answer.steps || [],
      category,
      cropLabel,
      turns: [...(context?.turns || []), { question: question?.text || '', topic: question?.topic || 'general' }].slice(-8),
    },
  };
}

export function farmAdviceSuggestions(language = 'en', user = null) {
  const crop = Array.isArray(user?.crops) && user.crops.length ? user.crops[0] : 'groundnut';
  const cropLabel = formatCrop(crop);
  const entries = [
    {
      query: `should I plant ${crop} now or wait for rain`,
      labels: {
        en: `Plant ${cropLabel} now?`,
        mnk: `${cropLabel} plant saayiŋ?`,
        wo: `Naka la plant ${cropLabel} leegi?`,
      },
    },
    {
      query: `what should I do on my farm this week`,
      labels: {
        en: 'What should I do this week?',
        mnk: 'Bii biriki, m muŋ ke?',
        wo: 'Lan la def ayib bii?',
      },
    },
    {
      query: 'my tomato leaves are turning yellow',
      labels: {
        en: 'Tomato leaves yellow?',
        mnk: 'Tomato ñaamee yelo?',
        wo: 'Xob tamaate yelloo?',
      },
    },
    {
      query: `when should I harvest ${crop}`,
      labels: {
        en: `Harvest ${cropLabel}?`,
        mnk: `${cropLabel} kati waati?`,
        wo: `Kañ la ñor ${cropLabel}?`,
      },
    },
  ];
  return entries.map((entry) => ({
    query: entry.query,
    label: entry.labels[language] || entry.labels.en,
  }));
}
