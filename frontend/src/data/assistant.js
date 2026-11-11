import {
  ACTIVITY_LABELS,
  CROP_CALENDAR,
  MONTH_LABELS,
  getCropCalendar,
  monthInWindow,
} from './calendar.js';
import { MARKETS } from './markets.js';
import { advisoryApi, buyRequestApi, listingApi, marketApi, weatherApi } from '../api/services.js';
import { formatCrop, formatGmd, formatRegion } from '../utils/format.js';

/**
 * Small, offline-friendly language understanding for the voice helper.
 * The assistant is intentionally rule based: it works without an API key,
 * understands the main crops, regions, markets and tasks in the app, and
 * hands the user a filtered screen when it can.
 */

const CROP_TERMS = {
  groundnut: ['groundnut', 'groundnuts', 'ground nut', 'peanut', 'peanuts', 'tia', 'tiya', 'gerte', 'bademba'],
  rice: ['rice', 'paddy', 'malo', 'maloo', 'maalo', 'cees'],
  millet: ['millet', 'duro', 'duroo', 'dugub', 'petit mil'],
  maize: ['maize', 'corn', 'nyo', 'mbay', 'mais'],
  sorghum: ['sorghum', 'sorgo', 'kinto', 'mouskwari'],
  cassava: ['cassava', 'manioc', 'maniok', 'bankoo', 'nyamakala'],
  onion: ['onion', 'onions', 'jaba', 'jabaa', 'soble', 'soblee'],
  tomato: ['tomato', 'tomatoes', 'tomatosi', 'tamaate', 'tamaat'],
  cabbage: ['cabbage', 'cabbages', 'shu', 'chou'],
  mango: ['mango', 'mangoes', 'mangoro'],
  cashew: ['cashew', 'cashews', 'kaju'],
};

const ANIMAL_TERMS = {
  layer_chicken: ['layer', 'layers', 'egg', 'eggs', 'egg layers'],
  broiler_chicken: ['broiler', 'broilers', 'chicken', 'chickens', 'poultry', 'kuyoo', 'ginaar'],
  sheep: ['sheep', 'ram', 'rams', 'saa'],
  goat: ['goat', 'goats', 'bebe'],
  cattle: ['cattle', 'cow', 'cows', 'bull', 'nag', 'naa'],
  duck: ['duck', 'ducks', 'kanara'],
};

const ANIMAL_LABELS = {
  broiler_chicken: 'broiler chickens',
  layer_chicken: 'layer chickens',
  sheep: 'sheep',
  goat: 'goats',
  cattle: 'cattle',
  duck: 'ducks',
};

const REGION_TERMS = {
  banjul: ['banjul'],
  kanifing: ['kanifing', 'kanifing municipality', 'serrekunda', 'serekunda', 'kmc'],
  west_coast: ['west coast', 'west coast region', 'brikama', 'kombo', 'gunjur', 'brufut'],
  north_bank: ['north bank', 'north bank region', 'kerewan', 'farafenni', 'essau'],
  lower_river: ['lower river', 'lower river region', 'mansakonko', 'soma'],
  central_river_north: ['central river north', 'central river region north', 'kuntaur'],
  central_river_south: ['central river south', 'central river region south', 'janjanbureh', 'georgetown'],
  upper_river: ['upper river', 'upper river region', 'basse', 'fatoto'],
};

const MARKET_TERMS = {
  serrekunda: ['serrekunda', 'serekunda'],
  brikama: ['brikama'],
  farafenni: ['farafenni'],
  basse: ['basse', 'basse santa su'],
  soma: ['soma'],
};

const CATEGORY_TERMS = {
  pest: ['pest', 'pests', 'insect', 'insects', 'aphid', 'aphids', 'worm', 'worms', 'bug', 'bugs', 'caterpillar', 'caterpillars', 'termite', 'termites', 'locust', 'locusts', 'armyworm', 'whitefly', 'thrips', 'mites', 'grasshopper', 'grasshoppers', 'birds', 'rodent', 'rodents', 'rats'],
  disease: ['disease', 'diseases', 'sick', 'sickness', 'spot', 'spots', 'blast', 'blight', 'rot', 'rotting', 'fungus', 'fungal', 'virus', 'mildew', 'yellow', 'yellowing', 'wilt', 'wilting', 'curled', 'curling', 'holes', 'rust', 'smut', 'streak', 'mould', 'mold'],
  storage: ['storage', 'store', 'storing', 'stored', 'dry', 'drying', 'aflatoxin', 'bag', 'bags', 'keep', 'keeping', 'moisture', 'sacks', 'mouldy', 'moldy'],
  soil: ['soil', 'soils', 'compost', 'manure', 'fertiliser', 'fertilizer', 'fertilisers', 'fertilizers', 'nutrient', 'nutrients', 'erosion', 'sandy', 'clay', 'acidic', 'salty', 'ph'],
  general: ['general', 'best practice', 'planting', 'plant', 'season'],
};

const ACTIVITY_TERMS = {
  plant: ['plant', 'planting', 'sow', 'sowing', 'transplant', 'transplanting', 'nursery'],
  weed: ['weed', 'weeding', 'clear', 'clearing', 'thin', 'thinning'],
  fertilise: ['fertilise', 'fertilize', 'fertilising', 'fertilizing', 'fertiliser', 'fertilizer', 'top dress', 'npk'],
  harvest: ['harvest', 'harvesting', 'reap', 'reaping', 'pick', 'picking'],
};

const MONTH_TERMS = [
  { month: 1, terms: ['january', 'jan'] },
  { month: 2, terms: ['february', 'feb'] },
  { month: 3, terms: ['march', 'mar'] },
  { month: 4, terms: ['april', 'apr'] },
  { month: 5, terms: ['may'] },
  { month: 6, terms: ['june', 'jun'] },
  { month: 7, terms: ['july', 'jul'] },
  { month: 8, terms: ['august', 'aug'] },
  { month: 9, terms: ['september', 'sep', 'sept'] },
  { month: 10, terms: ['october', 'oct'] },
  { month: 11, terms: ['november', 'nov'] },
  { month: 12, terms: ['december', 'dec'] },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const HELP_TERMS = ['help', 'help me', 'what can you do', 'how do i use', 'how does this work', 'commands', 'guide me', 'assist me', 'dema', 'dimbal', 'ndimbal'];
const GREETING_TERMS = ['hello', 'hi', 'hey', 'salaam', 'salam', 'salaam aleekum', 'salaam aleikum', 'good morning', 'good afternoon', 'good evening', 'how are you', 'kori tanante', 'naka nga def'];
const WEATHER_TERMS = ['weather', 'forecast', 'rain', 'rains', 'raining', 'temperature', 'hot', 'cold', 'sun', 'sunny', 'climate', 'waati', 'taw'];
const PRICE_TERMS = ['price', 'prices', 'cost', 'costs', 'how much', 'sell for', 'selling price', 'market price', 'song', 'songolu', 'prix'];
const CALENDAR_TERMS = ['calendar', 'when to plant', 'when do i plant', 'when should i plant', 'when to sow', 'when to weed', 'when to fertilise', 'when to fertilize', 'when to harvest', 'planting time', 'weeding time', 'fertilising time', 'harvest time', 'planting season', 'growing season', 'farming calendar', 'this month', 'kalanda', 'calendrier'];
const ADVICE_TERMS = ['advice', 'advise', 'tip', 'tips', 'problem', 'problems', 'how to grow', 'how do i grow', 'how to farm', 'how to treat', 'treat', 'soil', 'compost', 'manure', 'fertiliser', 'fertilizer', 'storage', 'aflatoxin', 'yaamaroo', 'xelal', 'njangalem'];
const BUY_REQUEST_TERMS = ['buy request', 'buy requests', 'buyer', 'buyers', 'who wants', 'who is buying', 'wanted', 'demand', 'traders need', 'traders want', 'naan', 'jendkat'];
const SELL_TERMS = ['sell', 'selling', 'sale', 'post', 'upload', 'jaay'];
const BUY_TERMS = ['buy', 'buying', 'purchase', 'want to buy', 'looking for', 'need', 'jend', 'seet', 'nini'];
const PRODUCE_TERMS = ['find', 'look for', 'where can i get', 'where can i find', 'i want', 'i need', 'seet', 'nini', 'produce', 'crop', 'crops', 'vegetables', 'mbey'];
const MARKET_TERMS_INTENT = ['market', 'markets', 'market day', 'market days', 'open', 'opening', 'where is', 'where can i sell', 'luwo', 'luwolu', 'marche'];
const LIVESTOCK_TERMS = ['livestock', 'animal', 'animals', 'farm animals', 'poultry', 'soo', 'maggak', 'màggal'];

const NAV_PAGES = [
  { key: 'marketplace', path: '/marketplace', terms: ['marketplace', 'shop', 'produce page', 'waafi', 'jaayukaay'] },
  { key: 'markets', path: '/markets', terms: ['markets', 'market', 'market prices', 'luwolu', 'marche'] },
  { key: 'livestock', path: '/livestock', terms: ['livestock', 'poultry', 'animals', 'soo'] },
  { key: 'advisory', path: '/advisory', terms: ['advisory', 'advice', 'tips', 'yaamaroo', 'xelal'] },
  { key: 'calendar', path: '/calendar', terms: ['calendar', 'planting calendar', 'kalanda', 'calendrier'] },
  { key: 'dashboard', path: '/dashboard', terms: ['dashboard', 'home', 'my farm', 'suu'] },
  { key: 'profile', path: '/profile', terms: ['profile', 'account', 'my account', 'settings', 'konto'] },
  { key: 'myListings', path: '/my-listings', terms: ['my listings', 'my listing', 'sell page'] },
  { key: 'buyRequests', path: '/buy-requests', terms: ['buy requests', 'buy request'] },
  { key: 'login', path: '/login', terms: ['login', 'sign in', 'log in', 'doni', 'dugg'] },
  { key: 'register', path: '/register', terms: ['register', 'sign up', 'create account', 'konto dadaa', 'sos konto'] },
  { key: 'admin', path: '/admin', terms: ['admin'] },
];

const PAGE_LABEL_KEYS = {
  marketplace: 'marketplace',
  markets: 'markets',
  livestock: 'navLivestock',
  advisory: 'advisory',
  calendar: 'calendar',
  dashboard: 'dashboard',
  profile: 'profile',
  myListings: 'myListings',
  buyRequests: 'buyRequests',
  login: 'login',
  register: 'register',
  admin: 'admin',
};

const PROTECTED_PATHS = new Set(['/dashboard', '/calendar', '/my-listings', '/buy-requests', '/profile', '/admin']);

const SPEECH = {
  greeting: {
    en: () => 'Hello. Tap the microphone and tell me what you need. For example: find groundnut, price of rice, or advice for tomato.',
    mnk: () => 'I be njaading. Mikrofon nii sila, i la lafoo fo n ye. Njaame: groundnut nini, rice songo, waraŋ tomato yaamaroo.',
    wo: () => 'Salaam. Besal mikro bi, wax li nga begg. Misaal: seet gerte, prix maalo, walla xelal tamaate.',
  },
  help: {
    en: () => 'I can find produce, livestock, market prices, advice, weather and planting times. Try: find groundnut, price of rice, advice for tomato, or weather today.',
    mnk: () => 'N si waafoolu, soo, songolu, yaamaroo, waati aniŋ seneyaa waati nini. A njaame: groundnut nini, rice songo, tomato yaamaroo, waraŋ bii waati.',
    wo: () => 'Man na seet jaay, màggal, prix, xelal, taw ak waxtu bey. Misaal: seet gerte, prix maalo, xelal tamaate, walla taw tey.',
  },
  opening: {
    en: (page) => `Opening ${page}.`,
    mnk: (page) => `${page} be yele la.`,
    wo: (page) => `${page} mi ngi ubbeeku.`,
  },
  signIn: {
    en: (page) => `Please sign in first to use ${page}.`,
    mnk: (page) => `Doni ntambaake, ka ${page} baŋ.`,
    wo: (page) => `Duggal ba tey, ngir man a jefandikoo ${page}.`,
  },
  notAllowed: {
    en: (page) => `This account cannot open ${page}. Ask a farmer or admin account for help.`,
    mnk: (page) => `Konto nii maŋ soŋ ka ${page} yele. Senefenna waraŋ maralilaa ñini.`,
    wo: (page) => `Konto bii manul ubbi ${page}. Laaj beykat walla admin.`,
  },
  listingsFound: {
    en: (n, crop) => `I found ${n} ${crop} listings.`,
    mnk: (n, crop) => `N ye ${crop} waafoolu ${n} je.`,
    wo: (n, crop) => `Damay ${n} jaay ${crop}.`,
  },
  listingsFoundAny: {
    en: (n) => `I found ${n} produce listings.`,
    mnk: (n) => `N ye waafoolu ${n} je.`,
    wo: (n) => `Damay ${n} jaay mbey.`,
  },
  listingsCheapest: {
    en: (price, name, place) => `The lowest price is ${price} from ${name} in ${place}.`,
    mnk: (price, name, place) => `A tiinaa le mu ${price} la, a bora ${name} bulu, ${place}.`,
    wo: (price, name, place) => `Li gen a yomb mooy ${price}, ci ${name}, ${place}.`,
  },
  listingsNone: {
    en: (crop) => `I did not find ${crop} listings yet. Try another crop, region or price.`,
    mnk: (crop) => `N ma ${crop} waafoolu je. Senefen waraŋ dugu doo ñini.`,
    wo: (crop) => `Amuma jaay ${crop}. Seet mbey walla dëkk weneen.`,
  },
  pricesBest: {
    en: (crop, price, market) => `The best price for ${crop} is ${price} at ${market}.`,
    mnk: (crop, price, market) => `${crop} songo betoo be ${market}, a mu ${price} la.`,
    wo: (crop, price, market) => `Prix bu gen bu ${crop} ci ${market} mooy ${price}.`,
  },
  pricesTop: {
    en: (crop, price, market) => `Today the best price is ${crop} at ${market}: ${price}.`,
    mnk: (crop, price, market) => `Bii songo betoo: ${crop} be ${market}, ${price}.`,
    wo: (crop, price, market) => `Tey prix bu gen: ${crop} ci ${market}, ${price}.`,
  },
  pricesNone: {
    en: (crop) => `I do not have a price for ${crop} yet.`,
    mnk: (crop) => `N ma ${crop} songo je.`,
    wo: (crop) => `Amuma prix ${crop}.`,
  },
  pricesAtMarket: {
    en: (crop, market, price) => `At ${market}, ${crop} is ${price}.`,
    mnk: (crop, market, price) => `${market}, ${crop} songo mu ${price} le ti.`,
    wo: (crop, market, price) => `Ci ${market}, prix ${crop} mooy ${price}.`,
  },
  pricesInRegion: {
    en: (crop, region, market, price) => `In ${region}, the best price for ${crop} is ${price} at ${market}.`,
    mnk: (crop, region, market, price) => `${region}, ${crop} songo betoo be ${market}, a mu ${price} la.`,
    wo: (crop, region, market, price) => `Ci ${region}, prix bu gen bu ${crop} ci ${market} mooy ${price}.`,
  },
  pricesMarketNone: {
    en: (crop, market) => `I do not have a ${crop} price for ${market} yet.`,
    mnk: (crop, market) => `N ma ${crop} songo je ${market}.`,
    wo: (crop, market) => `Amuma prix ${crop} ci ${market}.`,
  },
  pricesRegionNone: {
    en: (crop, region) => `I do not have a ${crop} price in ${region} yet. Here are the markets I know.`,
    mnk: (crop, region) => `N ma ${crop} songo je ${region}. Luwolu le n be a loŋ.`,
    wo: (crop, region) => `Amuma prix ${crop} ci ${region}. Marche yi ma xam le ngi fi.`,
  },
  adviceFound: {
    en: (title, summary) => `Here is advice: ${title}. ${summary}`,
    mnk: (title, summary) => `Yaamaroo: ${title}. ${summary}`,
    wo: (title, summary) => `Xelal: ${title}. ${summary}`,
  },
  adviceNone: {
    en: (crop) => `I did not find advice for ${crop}. Try another crop or say "pests", "soil" or "storage".`,
    mnk: (crop) => `N ma yaamaroo je ${crop} la. Senefen doo fo, waraŋ "pests", "soil" waraŋ "storage".`,
    wo: (crop) => `Amuma xelal ci ${crop}. Wax "pests", "soil" walla "storage".`,
  },
  weatherNow: {
    en: (place, temp, condition, rain) => `${place}: ${temp} degrees, ${condition}, rain ${rain} millimetres.`,
    mnk: (place, temp, condition, rain) => `${place} bii: ${temp} degree, ${condition}, san ${rain} mm.`,
    wo: (place, temp, condition, rain) => `${place} tey: ${temp} degree, ${condition}, taw ${rain} mm.`,
  },
  weatherNone: {
    en: () => 'I could not load the weather now.',
    mnk: () => 'N ma waati kibaaroo je.',
    wo: () => 'Manuma gis xibaar taw.',
  },
  marketOpen: {
    en: (name, region, days, crops) => `${name} is in ${region}. It is open ${days} and trades ${crops}.`,
    mnk: (name, region, days, crops) => `${name} be ${region}. A be open ${days}. A be ${crops} waafi la.`,
    wo: (name, region, days, crops) => `${name} mi ngi ci ${region}. Ubbeeku ${days}. Mi ngi jaay ${crops}.`,
  },
  marketNone: {
    en: () => 'I did not find that market. Try Serrekunda, Brikama, Farafenni, Soma or Basse.',
    mnk: () => 'N ma luwo je. Serrekunda, Brikama, Farafenni, Soma waraŋ Basse nini.',
    wo: () => 'Amuma marche bi. Seet Serrekunda, Brikama, Farafenni, Soma walla Basse.',
  },
  marketsFound: {
    en: (n) => `I found ${n} markets. Pick one to see prices and market days.`,
    mnk: (n) => `N ye luwolu ${n} je. Doo taa ka songo ni luwolu je.`,
    wo: (n) => `Damay ${n} marche. Tann ben ngir gis prix ak bés marche.`,
  },
  calendarNow: {
    en: (crop, activity, notes) => `For ${crop} this month: ${activity}. ${notes}`,
    mnk: (crop, activity, notes) => `${crop} kono, ${activity} le be ke la. ${notes}`,
    wo: (crop, activity, notes) => `Ci ${crop}, ${activity} lanu def. ${notes}`,
  },
  calendarNone: {
    en: (crop) => `There is no main ${crop} activity this month. Open the crop calendar to see the full plan.`,
    mnk: (crop) => `Feŋ maŋ ke ${crop} la ñaŋ. Kalanda juubee.`,
    wo: (crop) => `Amul jef ci ${crop} ci weer wi. Ubbi calendrier bi.`,
  },
  calendarWindow: {
    en: (crop, activity, months, notes) => `For ${crop}, ${activity} is not now. It runs from ${months}. ${notes}`,
    mnk: (crop, activity, months, notes) => `${crop} ${activity} maŋ ke ñaŋ. A be ke la ${months}. ${notes}`,
    wo: (crop, activity, months, notes) => `${crop} ${activity} du fi leegi. Mi ngi ${months}. ${notes}`,
  },
  calendarActivityNow: {
    en: (crop, activity, notes) => `It is ${activity} time for ${crop} this month. ${notes}`,
    mnk: (crop, activity, notes) => `Ñaŋ, ${crop} ${activity} waati le mu. ${notes}`,
    wo: (crop, activity, notes) => `Weer wii, waxtu ${activity} ${crop} la. ${notes}`,
  },
  calendarMonthActivity: {
    en: (crop, activity, month, notes) => `In ${month}, ${activity} is the main work for ${crop}. ${notes}`,
    mnk: (crop, activity, month, notes) => `${month}, ${crop} ${activity} le be ke la. ${notes}`,
    wo: (crop, activity, month, notes) => `Ci ${month}, ${activity} la ëpp ci ${crop}. ${notes}`,
  },
  calendarActivity: {
    en: (crop, activity, months, notes) => `${crop} ${activity} happens from ${months}. ${notes}`,
    mnk: (crop, activity, months, notes) => `${crop} ${activity} be ke la ${months}. ${notes}`,
    wo: (crop, activity, months, notes) => `${crop} ${activity} mi ngi ${months}. ${notes}`,
  },
  calendarActivityNone: {
    en: (crop, activity) => `I do not have a ${activity} window for ${crop} yet.`,
    mnk: (crop, activity) => `N ma ${activity} waati je ${crop} la.`,
    wo: (crop, activity) => `Amuma waxtu ${activity} ci ${crop}.`,
  },
  buyRequestsFound: {
    en: (n, crop) => `I found ${n} buy requests for ${crop}.`,
    mnk: (n, crop) => `N ye ${crop} sanari nininnaalu ${n} je.`,
    wo: (n, crop) => `Damay ${n} njaan jend ${crop}.`,
  },
  buyRequestsBest: {
    en: (price, name, region) => `${name} offers ${price} in ${region}.`,
    mnk: (price, name, region) => `${name} ye ${price} la, ${region}.`,
    wo: (price, name, region) => `${name} dafay jox ${price}, ci ${region}.`,
  },
  buyRequestsNone: {
    en: (crop) => `I did not find open buy requests for ${crop}.`,
    mnk: (crop) => `N ma ${crop} sanari nini je.`,
    wo: (crop) => `Amuma njaan jend ${crop}.`,
  },
  livestockFound: {
    en: (n, animal) => `I found ${n} offers for ${animal}.`,
    mnk: (n, animal) => `N ye ${animal} waafoolu ${n} je.`,
    wo: (n, animal) => `Damay ${n} jaay ${animal}.`,
  },
  livestockCheapest: {
    en: (price, region) => `The lowest is ${price} each in ${region}.`,
    mnk: (price, region) => `A tiinaa le mu ${price} la, ${region}.`,
    wo: (price, region) => `Li gen a yomb mooy ${price}, ci ${region}.`,
  },
  livestockNone: {
    en: (animal) => `I did not find ${animal} for sale yet.`,
    mnk: (animal) => `N ma ${animal} waafoolu je.`,
    wo: (animal) => `Amuma jaay ${animal}.`,
  },
  searchFound: {
    en: (n, text) => `I found ${n} results for ${text}.`,
    mnk: (n, text) => `N ye feŋolu ${n} je ${text} la.`,
    wo: (n, text) => `Damay ${n} xibaar ci ${text}.`,
  },
  searchNone: {
    en: (text) => `I could not find ${text}. Try saying "find groundnut" or "price of rice".`,
    mnk: (text) => `N ma ${text} je. A fo: "groundnut nini" waraŋ "rice songo".`,
    wo: (text) => `Amuma ${text}. Wax "seet gerte" walla "prix maalo".`,
  },
  postSell: {
    en: (crop) => `Open My listings to post your ${crop}.`,
    mnk: (crop) => `I la waafoolu safee ${crop} la.`,
    wo: (crop) => `Ubbi samay jaay ngir post ${crop}.`,
  },
  sellerPrices: {
    en: (crop, market, price) => `For ${crop}, the best market to sell is ${market} at ${price}.`,
    mnk: (crop, market, price) => `${crop} la, luwo betoo mu ${market} le ti, ${price}.`,
    wo: (crop, market, price) => `Ci ${crop}, marche bu gen mooy ${market}, ${price}.`,
  },
  error: {
    en: () => 'I could not finish that. Please try again.',
    mnk: () => 'N ma a ban. A nii jaan.',
    wo: () => 'Manuma def. Jemaat.',
  },
};

const SUGGESTIONS = [
  { query: 'find groundnut', labels: { en: 'Find groundnut', mnk: 'Groundnut nini', wo: 'Seet gerte' } },
  { query: 'price of rice', labels: { en: 'Price of rice', mnk: 'Rice songo', wo: 'Prix maalo' } },
  { query: 'advice for tomato', labels: { en: 'Advice for tomato', mnk: 'Tomato yaamaroo', wo: 'Xelal tamaate' } },
  { query: 'weather today', labels: { en: 'Weather today', mnk: 'Bii waati', wo: 'Taw tey' } },
  { query: 'livestock for sale', labels: { en: 'Livestock for sale', mnk: 'Soo waafoolu', wo: 'Jaay maggal' } },
  { query: 'where can I sell groundnut', labels: { en: 'Where to sell groundnut', mnk: 'Groundnut jaay dulaa', wo: 'Fan la jaay gerte' } },
];

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SEARCH_FILLERS = [
  'can you',
  'could you',
  'please',
  'i want to',
  'i would like to',
  'i need to',
  'find me',
  'show me',
  'search for',
  'look for',
  'looking for',
  'i want',
  'i need',
  'where can i get',
  'where can i find',
  'tell me about',
];

function cleanSearchQuery(value) {
  let clean = normalize(value);
  for (const filler of SEARCH_FILLERS) {
    const term = normalize(filler);
    clean = clean.replace(new RegExp(`(^|\\s)${escapeRegExp(term)}(?=\\s|$)`, 'g'), ' ');
  }
  return clean.replace(/\s+/g, ' ').trim();
}

function hasTerm(text, terms) {
  return terms.some((term) => {
    const clean = normalize(term);
    if (!clean) return false;
    if (clean.includes(' ')) return text.includes(clean);
    return new RegExp(`(^|\\s)${escapeRegExp(clean)}($|\\s)`).test(text);
  });
}

function findKey(dictionary, text) {
  return Object.keys(dictionary).find((key) => hasTerm(text, dictionary[key])) || null;
}

function findMonth(text) {
  const match = MONTH_TERMS.find((entry) => hasTerm(text, entry.terms));
  return match?.month || null;
}

function extractMaxPrice(text) {
  const patterns = [
    /(?:under|below|less than|at most|max(?:imum)?|not more than|cheaper than|for)\s+(?:d|dalasi|gmd)?\s*(\d{1,5})/,
    /(\d{1,5})\s*(?:dalasi|gmd)\b/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = Number(match[1]);
      if (value > 0 && value <= 100000) return value;
    }
  }
  return null;
}

function matchOpenCommand(text) {
  const command = text.match(
    /^(?:open|open up|go to|goto|show|show me|show me the|show the|take me|take me to|bring me|bring me to|navigate to|launch|view|i want to see|let me see)\s+(.+)$/,
  );
  if (!command) return null;
  const target = command[1];
  let best = null;
  let bestScore = 0;
  NAV_PAGES.forEach((entry) => {
    entry.terms.forEach((term) => {
      const clean = normalize(term);
      if (!clean || !hasTerm(target, [clean])) return;
      if (clean.length > bestScore) {
        bestScore = clean.length;
        best = entry;
      }
    });
  });
  return best?.key || null;
}

function say(language, key, ...args) {
  const entry = SPEECH[key];
  if (!entry) return '';
  const template = entry[language] || entry.en;
  return typeof template === 'function' ? template(...args) : '';
}

function pageLabel(t, key) {
  return t ? t(PAGE_LABEL_KEYS[key] || key) : (PAGE_LABEL_KEYS[key] || key);
}

function buildPath(path, params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

function marketName(id) {
  return MARKETS.find((market) => market.id === id)?.name || id || 'that market';
}

function monthRange(entry) {
  const start = MONTH_LABELS[entry.startMonth - 1] || entry.startMonth;
  const end = MONTH_LABELS[entry.endMonth - 1] || entry.endMonth;
  return start === end ? String(start) : `${start} - ${end}`;
}

function lowerLabel(label) {
  return String(label || '').toLowerCase();
}

function byPriceDesc(a, b) {
  return Number(b.pricePerKg ?? b.askingPrice ?? b.offerPrice) - Number(a.pricePerKg ?? a.askingPrice ?? a.offerPrice);
}

export function interpret(input, { user = null } = {}) {
  const text = normalize(input);
  const crop = findKey(CROP_TERMS, text);
  const animal = findKey(ANIMAL_TERMS, text);
  const region = findKey(REGION_TERMS, text);
  const marketId = findKey(MARKET_TERMS, text);
  const category = findKey(CATEGORY_TERMS, text);
  const activity = findKey(ACTIVITY_TERMS, text);
  const month = findMonth(text);
  const maxPrice = extractMaxPrice(text);
  const wantsSell = hasTerm(text, SELL_TERMS);
  const wantsBuy = hasTerm(text, BUY_TERMS);
  const wantsLivestock = hasTerm(text, LIVESTOCK_TERMS);
  const wantsCalendar =
    hasTerm(text, CALENDAR_TERMS) ||
    Boolean(activity && (month || hasTerm(text, ['when', 'time', 'month', 'season', 'now'])));
  const openPage = matchOpenCommand(text);
  const isHelp = !crop && !animal && hasTerm(text, HELP_TERMS);
  const isGreeting = !crop && !animal && hasTerm(text, GREETING_TERMS);

  const base = {
    text: input,
    normalized: text,
    crop,
    animal,
    region,
    marketId,
    category,
    activity,
    month,
    maxPrice,
    wantsSell,
    wantsBuy,
    wantsLivestock,
    user,
  };

  if (isHelp) return { ...base, kind: 'help' };
  if (isGreeting) return { ...base, kind: 'greeting' };
  if (openPage) {
    if (openPage === 'markets' && (marketId || region)) return { ...base, kind: 'markets' };
    return { ...base, kind: 'navigate', page: openPage };
  }

  if (hasTerm(text, WEATHER_TERMS)) return { ...base, kind: 'weather' };
  if (animal || (wantsLivestock && !crop)) return { ...base, kind: 'livestock' };
  if (hasTerm(text, PRICE_TERMS)) return { ...base, kind: 'prices' };
  if (wantsCalendar) return { ...base, kind: 'calendar' };

  if (hasTerm(text, BUY_REQUEST_TERMS)) return { ...base, kind: 'buyRequests' };
  if (wantsSell) return { ...base, kind: 'sell' };
  if (hasTerm(text, ADVICE_TERMS) || category) return { ...base, kind: 'advice' };
  if (hasTerm(text, MARKET_TERMS_INTENT)) return { ...base, kind: 'markets' };

  if (hasTerm(text, PRODUCE_TERMS) || wantsBuy || crop || region || maxPrice) {
    return { ...base, kind: 'produce' };
  }

  return { ...base, kind: 'search' };
}

function result(id, title, detail, to) {
  return { id, title, detail, to };
}

function asArray(response) {
  return Array.isArray(response?.data) ? response.data : [];
}

async function resolvePrices(intent, language) {
  if (intent.crop) {
    const { data } = await marketApi.compare(intent.crop);
    const allRows = data?.rows || [];
    let rows = allRows;
    if (intent.marketId) {
      rows = rows.filter((row) => row.marketId === intent.marketId);
    } else if (intent.region) {
      rows = rows.filter((row) => row.market?.region === intent.region);
    }
    const best = [...rows].sort(byPriceDesc)[0];

    let speech;
    if (!best) {
      if (intent.marketId) {
        speech = say(language, 'pricesMarketNone', formatCrop(intent.crop), marketName(intent.marketId));
      } else if (intent.region && allRows.length) {
        speech = say(language, 'pricesRegionNone', formatCrop(intent.crop), formatRegion(intent.region));
      } else {
        speech = say(language, 'pricesNone', formatCrop(intent.crop));
      }
    } else if (intent.marketId) {
      speech = say(
        language,
        'pricesAtMarket',
        formatCrop(intent.crop),
        best.market?.name || marketName(intent.marketId),
        formatGmd(best.pricePerKg),
      );
    } else if (intent.region) {
      speech = say(
        language,
        'pricesInRegion',
        formatCrop(intent.crop),
        formatRegion(intent.region),
        best.market?.name || marketName(best.marketId),
        formatGmd(best.pricePerKg),
      );
    } else {
      speech = say(language, 'pricesBest', formatCrop(intent.crop), formatGmd(best.pricePerKg), best.market?.name);
    }

    const visibleRows = [...(rows.length ? rows : allRows)].sort(byPriceDesc);
    return {
      speech,
      results: visibleRows.slice(0, 5).map((row) =>
        result(
          `price-${row.crop}-${row.marketId}`,
          `${formatCrop(row.crop)} - ${formatGmd(row.pricePerKg)}`,
          row.market?.name || formatRegion(row.market?.region),
          buildPath('/markets', { crop: row.crop, market: row.marketId }),
        ),
      ),
      path: buildPath('/markets', {
        crop: intent.crop,
        market: best?.marketId || intent.marketId,
      }),
    };
  }

  const { data } = await marketApi.prices();
  let rows = Array.isArray(data) ? data : [];
  if (intent.marketId) {
    rows = rows.filter((row) => row.marketId === intent.marketId);
  } else if (intent.region) {
    rows = rows.filter((row) => row.market?.region === intent.region);
  }
  rows = [...rows].sort(byPriceDesc);
  const top = rows[0];
  return {
    speech: top
      ? say(language, 'pricesTop', formatCrop(top.crop), formatGmd(top.pricePerKg), top.market?.name)
      : say(language, 'pricesNone', ''),
    results: rows.slice(0, 6).map((row) =>
      result(
        `price-${row.crop}-${row.marketId}`,
        `${formatCrop(row.crop)} - ${formatGmd(row.pricePerKg)}`,
        row.market?.name || formatRegion(row.market?.region),
        buildPath('/markets', { crop: row.crop, market: row.marketId }),
      ),
    ),
    path: buildPath('/markets', { crop: top?.crop, market: intent.marketId || top?.marketId }),
  };
}

async function resolveProduce(intent, language) {
  const { data } = await listingApi.list({
    category: 'crop',
    crop: intent.crop || undefined,
    region: intent.region || undefined,
    maxPrice: intent.maxPrice || undefined,
  });
  const items = [...(Array.isArray(data) ? data : [])].sort(
    (a, b) => Number(a.askingPrice) - Number(b.askingPrice),
  );
  const cropLabel = intent.crop ? formatCrop(intent.crop) : '';

  let speech = items.length
    ? intent.crop
      ? say(language, 'listingsFound', items.length, cropLabel)
      : say(language, 'listingsFoundAny', items.length)
    : say(language, 'listingsNone', cropLabel || 'produce');

  if (items.length) {
    const cheapest = items[0];
    speech += ` ${say(
      language,
      'listingsCheapest',
      formatGmd(cheapest.askingPrice, cheapest.unit || 'kg'),
      cheapest.farmerName || 'a farmer',
      cheapest.village || formatRegion(cheapest.region),
    )}`;
  }

  return {
    speech,
    results: items.slice(0, 5).map((item) =>
      result(
        `listing-${item.id}`,
        `${formatCrop(item.crop)} - ${formatGmd(item.askingPrice, item.unit || 'kg')}`,
        `${item.quantity} ${item.unit || 'kg'} - ${item.village || formatRegion(item.region)} - ${item.farmerName || 'Farmer'}`,
        `/marketplace/${item.id}`,
      ),
    ),
    path: buildPath('/marketplace', {
      crop: intent.crop,
      region: intent.region,
      maxPrice: intent.maxPrice,
    }),
  };
}

async function resolveLivestock(intent, language, user) {
  const { data } = await listingApi.list({
    category: 'livestock',
    crop: intent.animal || undefined,
    region: intent.region || undefined,
  });
  const items = [...(Array.isArray(data) ? data : [])].sort(
    (a, b) => Number(a.askingPrice) - Number(b.askingPrice),
  );
  const animalLabel = intent.animal ? ANIMAL_LABELS[intent.animal] : 'livestock';
  let speech = items.length
    ? say(language, 'livestockFound', items.length, animalLabel)
    : say(language, 'livestockNone', animalLabel);

  if (items.length) {
    const cheapest = items[0];
    speech += ` ${say(
      language,
      'livestockCheapest',
      formatGmd(cheapest.askingPrice, 'head'),
      cheapest.village || formatRegion(cheapest.region),
    )}`;
  }

  const canSell = ['farmer', 'admin'].includes(user?.role);
  return {
    speech,
    results: items.slice(0, 5).map((item) =>
      result(
        `livestock-${item.id}`,
        `${ANIMAL_LABELS[item.crop] || item.crop} - ${formatGmd(item.askingPrice, 'head')}`,
        `${item.quantity} head - ${item.village || formatRegion(item.region)}`,
        buildPath('/livestock', { view: 'buy', animal: item.crop, region: item.region }),
      ),
    ),
    path: buildPath('/livestock', {
      view: intent.wantsSell && canSell ? 'sell' : 'buy',
      animal: intent.animal,
      region: intent.region,
    }),
  };
}

async function resolveAdvice(intent, language) {
  let pathCrop = intent.crop;
  let pathCategory = intent.category;
  let { data } = await advisoryApi.list({
    crop: intent.crop || undefined,
    category: intent.category || undefined,
  });
  let items = Array.isArray(data) ? data : [];

  if (!items.length && intent.crop && intent.category) {
    ({ data } = await advisoryApi.list({ category: intent.category }));
    items = Array.isArray(data) ? data : [];
    if (items.length) pathCrop = null;
  }
  if (!items.length && intent.crop) {
    ({ data } = await advisoryApi.list({ crop: intent.crop }));
    items = Array.isArray(data) ? data : [];
    pathCategory = null;
  }

  const cropLabel = intent.crop ? formatCrop(intent.crop) : '';
  const speech = items.length
    ? say(language, 'adviceFound', items[0].title, items[0].summary)
    : say(language, 'adviceNone', cropLabel || 'your crops');

  return {
    speech,
    results: items.slice(0, 5).map((item) =>
      result(
        `advice-${item.id}`,
        item.title,
        item.summary,
        `/advisory/${item.id}`,
      ),
    ),
    path: buildPath('/advisory', { crop: pathCrop, category: pathCategory }),
  };
}

function calendarEntries(crops, activity, month) {
  const entries = [];
  crops.forEach((crop) => {
    getCropCalendar(crop).forEach((entry) => {
      if (activity && entry.activity !== activity) return;
      entries.push({
        crop,
        ...entry,
        current: monthInWindow(month, entry.startMonth, entry.endMonth),
      });
    });
  });
  return entries;
}

async function resolveCalendar(intent, language, user, t) {
  const month = intent.month || new Date().getMonth() + 1;
  const monthLabel = intent.month ? MONTH_NAMES[month - 1] : null;
  const crops = intent.crop
    ? [intent.crop]
    : user?.crops?.length
      ? user.crops
      : Object.keys(CROP_CALENDAR);
  const all = calendarEntries(crops, null, month);
  const requested = intent.activity ? calendarEntries(crops, intent.activity, month) : [];
  const current = all.filter((entry) => entry.current);
  const entries = intent.activity ? requested : all;
  const focus = entries.find((entry) => entry.current) || entries[0] || current[0] || all[0];
  const cropLabel = intent.crop ? formatCrop(intent.crop) : '';
  let speech;

  if (intent.activity) {
    const match = requested[0];
    const activityLabel = lowerLabel(ACTIVITY_LABELS[intent.activity] || intent.activity);
    if (!match) {
      speech = say(language, 'calendarActivityNone', cropLabel || 'your crops', activityLabel);
    } else if (match.current) {
      speech = monthLabel
        ? say(
            language,
            'calendarMonthActivity',
            formatCrop(match.crop),
            activityLabel,
            monthLabel,
            match.notes,
          )
        : say(language, 'calendarActivityNow', formatCrop(match.crop), activityLabel, match.notes);
    } else {
      speech = say(
        language,
        'calendarWindow',
        formatCrop(match.crop),
        activityLabel,
        monthRange(match),
        match.notes,
      );
    }
  } else if (focus?.current) {
    const focusActivity = lowerLabel(ACTIVITY_LABELS[focus.activity] || focus.activity);
    speech = monthLabel
      ? say(
          language,
          'calendarMonthActivity',
          formatCrop(focus.crop),
          focusActivity,
          monthLabel,
          focus.notes,
        )
      : say(
          language,
          'calendarNow',
          formatCrop(focus.crop),
          ACTIVITY_LABELS[focus.activity] || focus.activity,
          focus.notes,
        );
  } else if (focus) {
    speech = say(
      language,
      'calendarWindow',
      formatCrop(focus.crop),
      lowerLabel(ACTIVITY_LABELS[focus.activity] || focus.activity),
      monthRange(focus),
      focus.notes,
    );
  } else {
    speech = say(language, 'calendarNone', cropLabel || 'crop');
  }

  const resultEntries = entries.length ? entries : current;
  const results = resultEntries.slice(0, 6).map((item) =>
    result(
      `calendar-${item.crop}-${item.activity}`,
      `${formatCrop(item.crop)} - ${ACTIVITY_LABELS[item.activity] || item.activity}`,
      `${monthRange(item)} · ${item.notes}`,
      buildPath('/calendar', { crop: item.crop }),
    ),
  );

  if (!user) {
    speech += ` ${say(language, 'signIn', pageLabel(t, 'calendar'))}`;
    results.push(result('signin', pageLabel(t, 'login'), pageLabel(t, 'calendar'), '/login'));
    return { speech: speech.trim(), results, path: null };
  }

  return {
    speech,
    results,
    path: buildPath('/calendar', { crop: intent.crop || focus?.crop }),
  };
}

async function resolveMarkets(intent, language) {
  if (intent.marketId) {
    const { data } = await marketApi.get(intent.marketId);
    const market = data || MARKETS.find((item) => item.id === intent.marketId);
    if (!market) {
      return { speech: say(language, 'marketNone'), results: [], path: '/markets' };
    }
    return {
      speech: say(
        language,
        'marketOpen',
        market.name,
        formatRegion(market.region),
        (market.marketDays || []).join(', '),
        (market.cropsTraded || []).map(formatCrop).join(', '),
      ),
      results: [
        result(
          `market-${market.id}`,
          market.name,
          `${formatRegion(market.region)} - ${(market.marketDays || []).join(', ')}`,
          buildPath('/markets', { market: market.id, crop: intent.crop }),
        ),
      ],
      path: buildPath('/markets', { market: market.id, crop: intent.crop }),
    };
  }

  const { data } = await marketApi.list({ region: intent.region || undefined });
  const markets = Array.isArray(data) ? data : [];
  return {
    speech: markets.length ? say(language, 'marketsFound', markets.length) : say(language, 'marketNone'),
    results: markets.map((market) =>
      result(
        `market-${market.id}`,
        market.name,
        `${market.location || ''} - ${(market.marketDays || []).join(', ')}`,
        buildPath('/markets', { market: market.id, crop: intent.crop }),
      ),
    ),
    path: buildPath('/markets', {
      crop: intent.crop,
      market: intent.region ? markets[0]?.id : intent.marketId,
    }),
  };
}

async function resolveBuyRequests(intent, language, user, t) {
  const { data } = await buyRequestApi.list({
    crop: intent.crop || undefined,
    region: intent.region || undefined,
  });
  const items = [...(Array.isArray(data) ? data : [])].sort(
    (a, b) => Number(b.offerPrice) - Number(a.offerPrice),
  );
  const cropLabel = intent.crop ? formatCrop(intent.crop) : 'produce';
  let speech = items.length
    ? say(language, 'buyRequestsFound', items.length, cropLabel)
    : say(language, 'buyRequestsNone', cropLabel);

  if (items.length) {
    const best = items[0];
    speech += ` ${say(
      language,
      'buyRequestsBest',
      formatGmd(best.offerPrice, best.unit || 'kg'),
      best.buyerName || 'A buyer',
      formatRegion(best.region),
    )}`;
  }

  const results = items.slice(0, 5).map((item) =>
    result(
      `request-${item.id}`,
      `${formatCrop(item.crop)} - ${formatGmd(item.offerPrice, item.unit || 'kg')}`,
      `${item.buyerName || 'Buyer'} - ${item.quantity} ${item.unit || 'kg'} - ${formatRegion(item.region)}`,
      buildPath('/buy-requests', { crop: item.crop, region: item.region }),
    ),
  );

  if (!user) {
    speech += ` ${say(language, 'signIn', pageLabel(t, 'buyRequests'))}`;
    results.push(result('signin', pageLabel(t, 'login'), pageLabel(t, 'buyRequests'), '/login'));
    return { speech: speech.trim(), results, path: null };
  }

  return {
    speech,
    results,
    path: buildPath('/buy-requests', { crop: intent.crop, region: intent.region }),
  };
}

async function resolveWeather(intent, language, user) {
  const region = intent.region || user?.region || undefined;
  const { data } = await weatherApi.get(region ? { region } : {});
  const current = data?.current || {};
  const place = formatRegion(region || data?.location?.region) || 'The Gambia';
  const temp = Math.round(Number(current.tempC ?? current.temp ?? 0));
  const condition = current.condition || current.description || 'clear';
  const rain = current.rainMm ?? current.rainChance ?? 0;
  return {
    speech: say(language, 'weatherNow', place, temp, condition, rain),
    results: user
      ? [result('weather-now', `${place} - ${temp} C`, `${condition} - rain ${rain}`, '/dashboard')]
      : [],
    path: user ? '/dashboard' : null,
  };
}

async function resolveSearch(intent, language) {
  const rawQuery = String(intent.text || '').trim();
  const query = cleanSearchQuery(rawQuery) || rawQuery;
  const [listingResponse, advisoryResponse] = await Promise.allSettled([
    listingApi.list({ q: query, category: 'crop' }),
    advisoryApi.list({ q: query }),
  ]);
  const listings = listingResponse.status === 'fulfilled' ? asArray(listingResponse.value) : [];
  const advisories = advisoryResponse.status === 'fulfilled' ? asArray(advisoryResponse.value) : [];
  const needle = normalize(query);
  const marketMatches = MARKETS.filter(
    (market) =>
      normalize(market.name).includes(needle) ||
      normalize(market.location).includes(needle) ||
      market.cropsTraded.some((crop) => normalize(crop).includes(needle)),
  );

  const results = [
    ...listings.slice(0, 3).map((item) =>
      result(
        `search-listing-${item.id}`,
        `${formatCrop(item.crop)} - ${formatGmd(item.askingPrice, item.unit || 'kg')}`,
        `${item.village || formatRegion(item.region)} - ${item.farmerName || 'Farmer'}`,
        `/marketplace/${item.id}`,
      ),
    ),
    ...advisories.slice(0, 3).map((item) =>
      result(`search-advice-${item.id}`, item.title, item.summary, `/advisory/${item.id}`),
    ),
    ...marketMatches.slice(0, 3).map((market) =>
      result(
        `search-market-${market.id}`,
        market.name,
        `${formatRegion(market.region)} - ${market.marketDays.join(', ')}`,
        buildPath('/markets', { market: market.id }),
      ),
    ),
  ];

  let path = null;
  if (results.length && !advisories.length && !marketMatches.length) {
    path = buildPath('/marketplace', { q: query });
  } else if (results.length && !listings.length && !marketMatches.length) {
    path = buildPath('/advisory', { q: query });
  }

  return {
    speech: results.length
      ? say(language, 'searchFound', results.length, query)
      : say(language, 'searchNone', query),
    results,
    path,
  };
}

function signInResponse(language, t, pageKey) {
  const label = pageLabel(t, pageKey);
  return {
    speech: say(language, 'signIn', label),
    results: [result('signin', pageLabel(t, 'login'), label, '/login')],
    path: null,
  };
}

function resolveNavigate(intent, language, user, t) {
  const page = NAV_PAGES.find((entry) => entry.key === intent.page);
  if (!page) return { speech: say(language, 'help'), results: [], path: null };
  const label = pageLabel(t, page.key);

  if (!user && PROTECTED_PATHS.has(page.path)) {
    return signInResponse(language, t, page.key);
  }

  if (page.path === '/my-listings' && user && !['farmer', 'admin'].includes(user.role)) {
    return {
      speech: say(language, 'notAllowed', label),
      results: [],
      path: '/marketplace',
    };
  }

  if (page.path === '/admin' && user && !['admin', 'extension_officer'].includes(user.role)) {
    return {
      speech: say(language, 'notAllowed', label),
      results: [],
      path: '/dashboard',
    };
  }

  const params = {};
  if (['/marketplace', '/markets', '/advisory', '/calendar', '/buy-requests', '/my-listings'].includes(page.path)) {
    if (intent.crop) params.crop = intent.crop;
  }
  if (['/marketplace', '/buy-requests', '/my-listings', '/livestock'].includes(page.path) && intent.region) {
    params.region = intent.region;
  }
  if (page.path === '/markets' && intent.marketId) params.market = intent.marketId;
  if (page.path === '/livestock') {
    if (intent.animal) params.animal = intent.animal;
    if (intent.wantsSell && ['farmer', 'admin'].includes(user?.role)) params.view = 'sell';
  }

  return { speech: say(language, 'opening', label), results: [], path: buildPath(page.path, params) };
}

async function resolveSell(intent, language, user, t) {
  if (intent.animal) return resolveLivestock(intent, language, user);

  const canSell = Boolean(user) && ['farmer', 'admin'].includes(user.role);

  if (intent.crop) {
    const { data } = await marketApi.compare(intent.crop);
    let rows = data?.rows || [];
    if (intent.marketId) rows = rows.filter((row) => row.marketId === intent.marketId);
    else if (intent.region) rows = rows.filter((row) => row.market?.region === intent.region);
    const best = [...rows].sort(byPriceDesc)[0];
    if (best) {
      const bestMarketName = best.market?.name || marketName(best.marketId);
      const marketResult = result(
        `sell-${intent.crop}`,
        `${formatCrop(intent.crop)} - ${formatGmd(best.pricePerKg)}`,
        bestMarketName,
        buildPath('/markets', { crop: intent.crop, market: best.marketId }),
      );
      const priceSpeech = say(
        language,
        'sellerPrices',
        formatCrop(intent.crop),
        bestMarketName,
        formatGmd(best.pricePerKg),
      );
      if (canSell) {
        return {
          speech: `${priceSpeech} ${say(language, 'postSell', formatCrop(intent.crop))}`,
          results: [marketResult],
          path: buildPath('/my-listings', {
            crop: intent.crop,
            region: intent.region || user?.region,
            price: best.pricePerKg,
          }),
        };
      }
      return {
        speech: `${priceSpeech} ${canSell ? '' : say(language, user ? 'notAllowed' : 'signIn', pageLabel(t, 'myListings'))}`.trim(),
        results: [marketResult],
        path: buildPath('/markets', { crop: intent.crop, market: best.marketId }),
      };
    }
  }

  if (!user) {
    return signInResponse(language, t, 'myListings');
  }

  if (!canSell) {
    return {
      speech: say(language, 'notAllowed', pageLabel(t, 'myListings')),
      results: [],
      path: '/marketplace',
    };
  }

  return {
    speech: say(language, 'postSell', intent.crop ? formatCrop(intent.crop) : 'produce'),
    results: [],
    path: buildPath('/my-listings', { crop: intent.crop, region: intent.region || user?.region }),
  };
}

export async function resolveIntent(intent, { language = 'en', user = null, t = null } = {}) {
  try {
    switch (intent.kind) {
      case 'greeting':
      case 'help':
        return { speech: say(language, intent.kind), results: [], path: null };
      case 'navigate':
        return resolveNavigate(intent, language, user, t);
      case 'weather':
        return await resolveWeather(intent, language, user);
      case 'prices':
        return await resolvePrices(intent, language);
      case 'produce':
        return await resolveProduce(intent, language);
      case 'livestock':
        return await resolveLivestock(intent, language, user);
      case 'advice':
        return await resolveAdvice(intent, language);
      case 'calendar':
        return await resolveCalendar(intent, language, user, t);
      case 'markets':
        return await resolveMarkets(intent, language);
      case 'buyRequests':
        return await resolveBuyRequests(intent, language, user, t);
      case 'sell':
        return await resolveSell(intent, language, user, t);
      case 'search':
        return await resolveSearch(intent, language);
      default:
        return { speech: say(language, 'help'), results: [], path: null };
    }
  } catch {
    return { speech: say(language, 'error'), results: [], path: null };
  }
}

export function assistantSuggestions(language = 'en', user = null) {
  const entries = [];
  const crops = Array.isArray(user?.crops) ? user.crops.filter(Boolean) : [];
  const crop = crops[0];
  const role = user?.role;

  if (crop) {
    const cropLabel = formatCrop(crop);
    entries.push({
      query: `find ${crop}`,
      labels: { en: `Find ${cropLabel}`, mnk: `${cropLabel} nini`, wo: `Seet ${cropLabel}` },
    });
    if (role === 'farmer' || role === 'admin') {
      entries.push({
        query: `where can I sell ${crop}`,
        labels: {
          en: `Where to sell ${cropLabel}`,
          mnk: `${cropLabel} jaay dulaa`,
          wo: `Fan la jaay ${cropLabel}`,
        },
      });
      entries.push({
        query: `when to harvest ${crop}`,
        labels: {
          en: `When to harvest ${cropLabel}`,
          mnk: `${cropLabel} kati waati`,
          wo: `Kañ la ñor ${cropLabel}`,
        },
      });
    }
  }

  if (role === 'vendor' || role === 'admin') {
    entries.push({
      query: 'buy requests',
      labels: { en: 'Buy requests', mnk: 'Sanari nininnaalu', wo: 'Njaan jend' },
    });
  }

  entries.push(...SUGGESTIONS);

  const canSell = !user || role === 'farmer' || role === 'admin';
  const filtered = canSell
    ? entries
    : entries.filter((suggestion) => !suggestion.query.startsWith('where can I sell'));

  const seen = new Set();
  return filtered
    .filter((suggestion) => {
      if (seen.has(suggestion.query)) return false;
      seen.add(suggestion.query);
      return true;
    })
    .slice(0, 8)
    .map((suggestion) => ({
      query: suggestion.query,
      label: suggestion.labels[language] || suggestion.labels.en,
    }));
}
