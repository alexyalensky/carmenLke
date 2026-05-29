import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const gd = readFileSync(join(root, 'src/data/gameData.ts'), 'utf8')

const citiesBlock =
  gd.match(/export const cities: City\[\] = \[([\s\S]*?)\]\n\nfunction buildAlmanac/)?.[1] ?? ''
const cityRe =
  /id: '([^']+)'[\s\S]*?name: '([^']+)'[\s\S]*?nameEn: '([^']+)'[\s\S]*?countryId: '([^']+)'/g
const gameCities = {}
let m
while ((m = cityRe.exec(citiesBlock))) {
  gameCities[m[4]] = { id: m[1], name: m[2], nameEn: m[3] }
}

const baseSection = gd.split('const baseAlmanac')[1]?.split(']\n\nconst defaultLanguageEn')[0] ?? ''
const baseRe =
  /id: '([^']+)'[\s\S]*?name: '([^']+)'[\s\S]*?capital: '([^']+)'[\s\S]*?currency: '([^']+)'[\s\S]*?language: '([^']+)'[\s\S]*?neighbors: (\[[^\]]*\])[\s\S]*?landmark: '([^']+)'/g
const bases = []
while ((m = baseRe.exec(baseSection))) {
  bases.push({
    id: m[1],
    name: m[2],
    capital: m[3],
    currency: m[4],
    language: m[5],
    neighbors: m[6],
    landmark: m[7],
  })
}

const LANDMARK_EN = {
  israel: 'Western Wall',
  france: 'Eiffel Tower',
  egypt: 'Pyramids of Giza',
  japan: 'Mount Fuji',
  usa: 'Statue of Liberty',
  germany: 'Brandenburg Gate',
  argentina: 'Obelisk of Buenos Aires',
  australia: 'Sydney Opera House',
  india: 'Taj Mahal',
  uk: 'Buckingham Palace',
  brazil: 'Christ the Redeemer',
  turkey: 'Hagia Sophia',
  italy: 'Colosseum',
  spain: 'Royal Palace of Madrid',
  russia: 'Red Square',
  china: 'Great Wall of China',
  thailand: 'Grand Palace',
  greece: 'Acropolis',
  mexico: 'Teotihuacan pyramids',
  canada: 'Niagara Falls',
  netherlands: 'Anne Frank House',
  'south-africa': 'Table Mountain',
}

const CAPITAL_EN = {
  israel: 'Jerusalem',
  france: 'Paris',
  egypt: 'Cairo',
  japan: 'Tokyo',
  usa: 'Washington D.C.',
  germany: 'Berlin',
  argentina: 'Buenos Aires',
  australia: 'Canberra',
  india: 'New Delhi',
  uk: 'London',
  brazil: 'Brasília',
  turkey: 'Ankara',
  italy: 'Rome',
  spain: 'Madrid',
  russia: 'Moscow',
  china: 'Beijing',
  thailand: 'Bangkok',
  greece: 'Athens',
  mexico: 'Mexico City',
  canada: 'Ottawa',
  netherlands: 'Amsterdam',
  'south-africa': 'Pretoria',
}

/** Extra cities — English names (shown in almanac with English label) */
const EXTRA_CITIES = {
  israel: ['Jerusalem', 'Haifa', 'Beersheba', 'Eilat'],
  france: ['Marseille', 'Lyon', 'Nice', 'Bordeaux'],
  egypt: ['Alexandria', 'Luxor', 'Aswan', 'Sharm el-Sheikh'],
  japan: ['Osaka', 'Kyoto', 'Hiroshima', 'Sapporo'],
  usa: ['Los Angeles', 'Chicago', 'Miami', 'San Francisco'],
  germany: ['Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
  argentina: ['Córdoba', 'Mendoza', 'Rosario', 'Ushuaia'],
  australia: ['Melbourne', 'Brisbane', 'Perth', 'Canberra'],
  india: ['New Delhi', 'Bangalore', 'Kolkata', 'Jaipur'],
  uk: ['Edinburgh', 'Manchester', 'Liverpool', 'Birmingham'],
  brazil: ['São Paulo', 'Brasília', 'Salvador', 'Manaus'],
  turkey: ['Ankara', 'Izmir', 'Antalya', 'Bursa'],
  italy: ['Milan', 'Venice', 'Florence', 'Naples'],
  spain: ['Barcelona', 'Seville', 'Valencia', 'Bilbao'],
  russia: ['Saint Petersburg', 'Kazan', 'Novosibirsk', 'Vladivostok'],
  china: ['Shanghai', 'Guangzhou', 'Hong Kong', "Xi'an"],
  thailand: ['Chiang Mai', 'Phuket', 'Pattaya', 'Krabi'],
  greece: ['Thessaloniki', 'Patras', 'Heraklion', 'Rhodes'],
  mexico: ['Guadalajara', 'Monterrey', 'Cancún', 'Puebla'],
  canada: ['Toronto', 'Vancouver', 'Ottawa', 'Quebec City'],
  netherlands: ['Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
  'south-africa': ['Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'],
}

const EXTRA_SITES = {
  israel: ['Dead Sea', 'Masada', 'Tel Aviv Beach', 'Israel Museum', 'Baháʼí Gardens'],
  france: ['Louvre Museum', 'Notre Dame', 'Palace of Versailles', 'Champs-Élysées', 'Mont Saint-Michel'],
  egypt: ['Great Sphinx', 'Valley of the Kings', 'Nile River', 'Egyptian Museum', 'Abu Simbel'],
  japan: ['Kiyomizu Temple', 'Tokyo Tower', 'Imperial Palace', 'Tsukiji Fish Market'],
  usa: ['Grand Canyon', 'Golden Gate Bridge', 'Times Square', 'White House', 'Yellowstone'],
  germany: ['Neuschwanstein Castle', 'Black Forest', 'Cologne Cathedral', 'Berlin Wall Memorial'],
  argentina: ['Iguazu Falls', 'Perito Moreno Glacier', 'La Boca', 'Patagonia'],
  australia: ['Sydney Harbour Bridge', 'Uluru', 'Great Barrier Reef', 'Great Ocean Road'],
  india: ['Red Fort', 'Gateway of India', 'Varanasi Ghats', 'Himalayas'],
  uk: ['Big Ben', 'Tower Bridge', 'Stonehenge', 'British Museum', 'Edinburgh Castle'],
  brazil: ['Amazon Rainforest', 'Copacabana Beach', 'Sugarloaf Mountain', 'Iguazu Falls'],
  turkey: ['Blue Mosque', 'Grand Bazaar', 'Cappadocia', 'Ephesus', 'Pamukkale'],
  italy: ['Vatican City', 'Leaning Tower of Pisa', 'Venice Canals', 'Pompeii', 'Amalfi Coast'],
  spain: ['Sagrada Familia', 'Alhambra', 'Park Güell', 'Prado Museum', 'La Rambla'],
  russia: ['Kremlin', "Saint Basil's Cathedral", 'Hermitage Museum', 'Lake Baikal', 'Trans-Siberian Railway'],
  china: ['Forbidden City', 'Terracotta Army', 'Temple of Heaven', 'Giant Panda reserves'],
  thailand: ['Wat Pho', 'Chatuchak Market', 'Phi Phi Islands', 'Floating markets', 'Ayutthaya ruins'],
  greece: ['Parthenon', 'Santorini', 'Delphi', 'Meteora monasteries', 'Ancient Olympia'],
  mexico: ['Chichen Itza', 'Frida Kahlo Museum', 'Tulum ruins', 'Copper Canyon'],
  canada: ['Banff National Park', 'CN Tower', 'Old Quebec', 'Canadian Rockies'],
  netherlands: ['Keukenhof gardens', 'Rijksmuseum', 'Kinderdijk windmills', 'Van Gogh Museum'],
  'south-africa': ['Kruger National Park', 'Robben Island', 'Cape of Good Hope', 'Garden Route', 'Apartheid Museum'],
}

const CUSTOM_FACTS = {
  israel: [
    'ישראל היא המדינה היחידה בעולם שחזרה לשפה עתיקה כשפת יום-יום.',
    'ים המלח הוא גוף המים הנמוך ביותר על פני כדור הארץ.',
    'תל אביב מכונה לעיתים "עיר ללא הפסקה" בזכות חיי הלילה.',
    'בישראל מעל 300 ימי שמש בשנה באזורים רבים.',
  ],
}

const langEn = {
  israel: 'Hebrew',
  france: 'French',
  egypt: 'Arabic',
  japan: 'Japanese',
  usa: 'English',
  germany: 'German',
  argentina: 'Spanish',
  australia: 'English',
  india: 'Hindi',
  uk: 'English',
  brazil: 'Portuguese',
  turkey: 'Turkish',
  italy: 'Italian',
  spain: 'Spanish',
  russia: 'Russian',
  china: 'Mandarin Chinese',
  thailand: 'Thai',
  greece: 'Greek',
  mexico: 'Spanish',
  canada: 'English and French',
  netherlands: 'Dutch',
  'south-africa': 'English',
}

const continent = {
  israel: 'אסיה',
  france: 'אירופה',
  egypt: 'אפריקה',
  japan: 'אסיה',
  usa: 'צפון אמריקה',
  germany: 'אירופה',
  argentina: 'דרום אמריקה',
  australia: 'אוקיאניה',
  india: 'אסיה',
  uk: 'אירופה',
  brazil: 'דרום אמריקה',
  turkey: 'אסיה ואירופה',
  italy: 'אירופה',
  spain: 'אירופה',
  russia: 'אירופה ואסיה',
  china: 'אסיה',
  thailand: 'אסיה',
  greece: 'אירופה',
  mexico: 'צפון אמריקה',
  canada: 'צפון אמריקה',
  netherlands: 'אירופה',
  'south-africa': 'אפריקה',
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function defaultFacts(b) {
  const neighborList = b.neighbors.replace(/[[\]'"]/g, '').trim()
  const facts = [
    `${b.name} — בירתה ${b.capital}, והשפה ${b.language}.`,
    `מטבע: ${b.currency}.`,
    `אתר מפורסם: ${b.landmark}.`,
  ]
  if (neighborList) facts.push(`שכנות: ${neighborList}.`)
  else facts.push(`${b.name} אינה גובלת ביבשה עם מדינות אחרות.`)
  return facts
}

const lines = [
  "import type { AlmanacCity, AlmanacSite } from '../game/types'",
  '',
  'export interface AlmanacExtra {',
  '  languageEn: string',
  '  continent: string',
  '  majorCities: AlmanacCity[]',
  '  mainSites: AlmanacSite[]',
  '  facts: string[]',
  '}',
  '',
  'export const almanacExtras: Record<string, AlmanacExtra> = {',
]

for (const b of bases) {
  const gc = gameCities[b.id]
  const capitalEn = CAPITAL_EN[b.id] ?? b.capital
  const cities = []
  if (gc) cities.push({ name: gc.name, nameEn: gc.nameEn, inGame: true })
  if (!cities.some((c) => c.name === b.capital || c.nameEn === capitalEn)) {
    cities.push({ name: b.capital, nameEn: capitalEn })
  }
  for (const nameEn of EXTRA_CITIES[b.id] ?? []) {
    if (nameEn === capitalEn) continue
    if (!cities.some((c) => c.nameEn === nameEn)) {
      cities.push({ name: nameEn, nameEn })
    }
  }

  const landmarkEn = LANDMARK_EN[b.id] ?? b.landmark
  const sites = [{ name: b.landmark, nameEn: landmarkEn }]
  for (const nameEn of EXTRA_SITES[b.id] ?? []) {
    if (!sites.some((s) => s.nameEn === nameEn)) {
      sites.push({ name: nameEn, nameEn })
    }
  }

  const facts = CUSTOM_FACTS[b.id] ?? defaultFacts(b)

  lines.push(`  '${b.id}': {`)
  lines.push(`    languageEn: '${langEn[b.id]}',`)
  lines.push(`    continent: '${esc(continent[b.id])}',`)
  lines.push('    majorCities: [')
  for (const c of cities) {
    lines.push(
      `      { name: '${esc(c.name)}', nameEn: '${esc(c.nameEn)}'${c.inGame ? ', inGame: true' : ''} },`,
    )
  }
  lines.push('    ],')
  lines.push('    mainSites: [')
  for (const s of sites) {
    lines.push(`      { name: '${esc(s.name)}', nameEn: '${esc(s.nameEn)}' },`)
  }
  lines.push('    ],')
  lines.push('    facts: [')
  for (const f of facts) {
    lines.push(`      '${esc(f)}',`)
  }
  lines.push('    ],')
  lines.push('  },')
}

lines.push('}')
lines.push('')

writeFileSync(join(root, 'src/data/almanacExtras.ts'), lines.join('\n'), 'utf8')
console.log(`Wrote almanacExtras.ts (${bases.length} countries)`)
