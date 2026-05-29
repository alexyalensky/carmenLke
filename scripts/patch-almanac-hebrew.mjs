import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const path = join(dirname(fileURLToPath(import.meta.url)), '..', 'src/data/almanacExtras.ts')

/** English nameEn → Hebrew display name */
const NAME_HE = {
  // Japan — fix mixed-script entries
  Kyoto: 'קיוטo',
  Sapporo: 'סאפורo',
  'Kiyomizu Temple': 'מקדש קiyomizu',
  'Tokyo Tower': 'מגdל טokyo',
  'Imperial Palace': 'ארמון הקisar',
  'Tsukiji Fish Market': 'שוק הדגים tsukiji',
  // USA
  'Los Angeles': "לוס אנג'לס",
  Chicago: 'שיקago',
  Miami: 'מiami',
  'San Francisco': 'san francisco',
  'Grand Canyon': 'הgrand canyon',
  'Golden Gate Bridge': 'גשר golden gate',
  'Times Square': 'כיכr times square',
  'White House': 'הבית הלבן',
  Yellowstone: 'פארק yellowstone',
  // Germany
  Munich: 'מינכן',
  Hamburg: 'המבורג',
  Frankfurt: 'פרנקפורט',
  Cologne: 'קלn',
  'Neuschwanstein Castle': 'טירת neuschwanstein',
  'Black Forest': 'היער השחור',
  'Cologne Cathedral': 'קatedralat koln',
  'Berlin Wall Memorial': 'אנדרטת חomת berlin',
  // Argentina
  Córdoba: 'קordoba',
  Mendoza: 'מendoza',
  Rosario: 'רosario',
  Ushuaia: 'אושuaia',
  'Iguazu Falls': 'מפלי iguazu',
  'Perito Moreno Glacier': 'קרחon perito moreno',
  'La Boca': 'לה boca',
  Patagonia: 'פatagonia',
  // Australia
  Melbourne: 'מelbourne',
  Brisbane: 'brisbane',
  Perth: 'perth',
  'Sydney Harbour Bridge': 'גשר sydney harbour',
  Uluru: 'אuluru',
  'Great Barrier Reef': 'שit המchsan הגdol',
  'Great Ocean Road': 'כביש האוקיינos הגדול',
  // India
  Bangalore: 'bangalore',
  Kolkata: 'kolkata',
  Jaipur: 'jaipur',
  'Red Fort': 'המבצר האדום',
  'Gateway of India': 'שער הודu',
  'Varanasi Ghats': 'מדרגות varanasi',
  Himalayas: 'הimalaya',
  // UK
  Edinburgh: 'edinburgh',
  Manchester: 'manchester',
  Liverpool: 'liverpool',
  Birmingham: 'birmingham',
  'Big Ben': 'בig ben',
  'Tower Bridge': 'גשר המגdלים',
  Stonehenge: 'סtonhenge',
  'British Museum': 'המוזיאon הבריטי',
  'Edinburgh Castle': 'טירת edinburgh',
  // Brazil
  'São Paulo': 'sao paulo',
  Salvador: 'salvador',
  Manaus: 'manaus',
  'Amazon Rainforest': 'יער האmazonas',
  'Copacabana Beach': 'חוף copacabana',
  'Sugarloaf Mountain': 'הר הסוכר',
  // Turkey
  Izmir: 'izmir',
  Antalya: 'antalya',
  Bursa: 'bursa',
  'Blue Mosque': 'המסגd הכחול',
  'Grand Bazaar': 'השוק הגדול',
  Cappadocia: 'קappadocia',
  Ephesus: 'אephesus',
  Pamukkale: 'פamukkale',
  // Italy
  Milan: 'milan',
  Venice: 'venice',
  Florence: 'florence',
  Naples: 'naples',
  'Vatican City': 'קריית הוותיקן',
  'Leaning Tower of Pisa': 'מגdל pisa',
  'Venice Canals': 'תעלות venice',
  Pompeii: 'פompeii',
  'Amalfi Coast': 'חof amalfi',
  // Spain
  Barcelona: 'barcelona',
  Seville: 'seville',
  Valencia: 'valencia',
  Bilbao: 'bilbao',
  'Sagrada Familia': 'sagrada familia',
  Alhambra: 'alhambra',
  'Park Güell': 'park guell',
  'Prado Museum': 'מוזיאon prado',
  'La Rambla': 'la rambla',
  // Russia
  'Saint Petersburg': 'saint petersburg',
  Kazan: 'kazan',
  Novosibirsk: 'novosibirsk',
  Vladivostok: 'vladivostok',
  Kremlin: 'הkremlin',
  "Saint Basil's Cathedral": 'קatedralat st basil',
  'Hermitage Museum': 'מוזיאon hermitage',
  'Lake Baikal': 'אgם baikal',
  'Trans-Siberian Railway': 'מסילat transsiberian',
  // China
  Shanghai: 'shanghai',
  Guangzhou: 'guangzhou',
  'Hong Kong': 'hong kong',
  "Xi'an": 'xian',
  'Forbidden City': 'העיר האסורה',
  'Terracotta Army': 'צבא הterracotta',
  'Temple of Heaven': 'מקדש השמיים',
  'Giant Panda reserves': 'שמורות pandah',
  // Thailand
  'Chiang Mai': 'chiang mai',
  Phuket: 'phuket',
  Pattaya: 'pattaya',
  Krabi: 'krabi',
  'Wat Pho': 'wat pho',
  'Chatuchak Market': 'שוק chatuchak',
  'Phi Phi Islands': 'איי phi phi',
  'Floating markets': 'שווקים צפים',
  'Ayutthaya ruins': 'חurvot ayutthaya',
  // Greece
  Thessaloniki: 'thessaloniki',
  Patras: 'patras',
  Heraklion: 'heraklion',
  Rhodes: 'rhodes',
  Parthenon: 'הparthenon',
  Santorini: 'santorini',
  Delphi: 'delphi',
  'Meteora monasteries': 'monasteries meteora',
  'Ancient Olympia': 'olympia העatika',
  // Mexico
  Guadalajara: 'guadalajara',
  Monterrey: 'monterrey',
  Cancún: 'cancun',
  Puebla: 'puebla',
  'Chichen Itza': 'chichen itza',
  'Frida Kahlo Museum': 'מוזיאon frida kahlo',
  'Tulum ruins': 'חurvot tulum',
  'Copper Canyon': 'canyon hanechoshet',
  // Canada
  Toronto: 'toronto',
  Vancouver: 'vancouver',
  'Quebec City': 'quebec city',
  'Banff National Park': 'פארק banff',
  'CN Tower': 'מגdל cn',
  'Old Quebec': 'quebec העatika',
  'Canadian Rockies': 'hahorei hakaanadim',
  // Netherlands
  Rotterdam: 'rotterdam',
  'The Hague': 'the hague',
  Utrecht: 'utrecht',
  Eindhoven: 'eindhoven',
  'Keukenhof gardens': 'ganey keukenhof',
  Rijksmuseum: 'rijksmuseum',
  'Kinderdijk windmills': 'tihonot kinderdijk',
  'Van Gogh Museum': 'מוזיאon van gogh',
  // South Africa
  'Cape Town': 'cape town',
  Durban: 'durban',
  'Port Elizabeth': 'port elizabeth',
  'Kruger National Park': 'פארק kruger',
  'Robben Island': 'אי robben',
  'Cape of Good Hope': 'cape of good hope',
  'Garden Route': 'garden route',
  'Apartheid Museum': 'מוזיאon apartheid',
}

let src = readFileSync(path, 'utf8')
let count = 0

for (const [en, heName] of Object.entries(NAME_HE)) {
  const escEn = en.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  const escHe = heName.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  const re = new RegExp(`\\{ name: '${escEn}', nameEn: '${escEn}'`, 'g')
  const matches = src.match(re)
  if (matches) {
    count += matches.length
    src = src.replace(re, `{ name: '${escHe}', nameEn: '${escEn}'`)
  }
}

src = src.replace(
  "{ name: 'ארמון וrsailles', nameEn: 'Palace of Versailles' }",
  "{ name: 'ארמון Versailles', nameEn: 'Palace of Versailles' }",
)

writeFileSync(path, src, 'utf8')
console.log(`Patched ${count} almanac entries`)
