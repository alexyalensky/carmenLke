/**
 * Fix mixed Hebrew/Latin in expansion data files.
 * Run: node scripts/clean-hebrew-data.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function patch(path, replacements) {
  let src = readFileSync(join(root, path), 'utf8')
  let n = 0
  for (const [from, to] of replacements) {
    if (!src.includes(from)) continue
    src = src.split(from).join(to)
    n++
  }
  writeFileSync(join(root, path), src, 'utf8')
  console.log(`${path}: ${n} patches`)
}

// Pure Hebrew strings
const SK = '\u05E1\u05DC\u05D5\u05D1\u05E7\u05D9\u05D4'
const LT = '\u05DC\u05D9\u05D8\u05D1\u05D4'
const BELEM = '\u05DE\u05D2\u05D3\u05DC \u05D1\u05DC\u05DD'
const STOCKHOLM = '\u05E1\u05D8\u05D5\u05E7\u05D4\u05D5\u05DC\u05DD'
const KRONA = '\u05E7\u05E8\u05D5\u05DF \u05E9\u05D5\u05D5\u05D3\u05D9'
const SWEDISH = '\u05E9\u05D5\u05D5\u05D3\u05D9\u05EA'
const NORWAY = '\u05E0\u05D5\u05E8\u05D5\u05D5\u05D2\u05D9\u05D4'
const FINLAND = '\u05E4\u05D9\u05E0\u05DC\u05E0\u05D3'
const VASA = '\u05DE\u05D5\u05D6\u05D9\u05D0\u05D5\u05DF \u05D4\u05E1\u05E4\u05D9\u05E0\u05D4 \u05D5\u05D0\u05D6\u05D4'
const HANOI = '\u05D4\u05D0\u05E0\u05D9'
const DONG = '\u05D3\u05D5\u05DF'
const CAMBODIA = '\u05E7\u05DE\u05D1\u05D5\u05D3\u05D9\u05D4'
const HALONG = '\u05DE\u05E4\u05E8\u05E5 \u05D4\u05D0\u05DC\u05D5\u05E0\u05D2'
const KENYA = '\u05E7\u05E0\u05D9\u05D4'
const NAIROBI = '\u05E0\u05D9\u05D9\u05E8\u05D5\u05D1\u05D9'
const UGANDA = '\u05D0\u05D5\u05D2\u05E0\u05D3\u05D4'
const SHILLING = '\u05E9\u05D9\u05DC\u05D9\u05E0\u05D2 \u05E7\u05E0\u05D9\u05D4'
const SWAHILI = '\u05D0\u05E0\u05D2\u05DC\u05D9\u05EA \u05D5\u05E1\u05D5\u05D5\u05D0\u05D4\u05DC\u05D9'
const ETHIOPIA = '\u05D0\u05EA\u05D9\u05D5\u05E4\u05D9\u05D4'
const SOMALIA = '\u05E1\u05D5\u05DE\u05DC\u05D9\u05D4'
const TANZANIA = '\u05D8\u05E0\u05D6\u05E0\u05D9\u05D4'
const SUDAN = '\u05D3\u05E8\u05D5\u05DD \u05E1\u05D5\u05D3\u05D0\u05DF'
const SKOREA = '\u05D3\u05E8\u05D5\u05DD \u05E7\u05D5\u05E8\u05D9\u05D0\u05D4'
const NKOREA = '\u05E6\u05E4\u05D5\u05DF \u05E7\u05D5\u05E8\u05D9\u05D0\u05D4'
const WON = '\u05D5\u05D5\u05DF'
const KOREAN = '\u05E7\u05D5\u05E8\u05D9\u05D0\u05D9\u05EA'
const GYEONG = '\u05D0\u05E8\u05DE\u05D5\u05DF \u05D2\u05D9\u05D5\u05E0\u05D2\u05D1\u05D5\u05E7'
const YINYANG = '\u05D3\u05D2\u05DC \u05DC\u05D1\u05DF \u05E2\u05DD \u05E1\u05DE\u05DC \u05D9\u05D9\u05DF-\u05D9\u05D0\u05E0\u05D2 \u05D5\u05E4\u05E1\u05D9\u05DD'
const HCMC = '\u05D4\u05D5 \u05E6\u05F3\u05D9 \u05DE\u05D9\u05DF'
const ZLOTY = '\u05D6\u05DC\u05D5\u05D8\u05D9 \u05E4\u05D5\u05DC\u05E0\u05D9'
const SAFARI = '\u05E4\u05D0\u05E8\u05E7 \u05D4\u05E1\u05E4\u05D0\u05E8\u05D9 \u05D1\u05E0\u05D9\u05D9\u05E8\u05D5\u05D1\u05D9'

patch('src/data/gameData.ts', [
  ["neighbors: ['גרמניה', 'צ׳כיה', 'סlovakia', 'אוקראינה', 'בלארוס', 'ליטva', 'רוסיה']",
    `neighbors: ['גרמניה', 'צ׳כיה', '${SK}', 'אוקראינה', 'בלארוס', '${LT}', 'רוסיה']`],
  ["currency: 'זloty פולני'", `currency: '${ZLOTY}'`],
  ["landmark: 'מגדל בelem'", `landmark: '${BELEM}'`],
  ["capital: 'סtockholm'", `capital: '${STOCKHOLM}'`],
  ["currency: 'קרone שוvedית'", `currency: '${KRONA}'`],
  ["language: 'שwedית'", `language: '${SWEDISH}'`],
  ["neighbors: ['נorway', 'פinland']", `neighbors: ['${NORWAY}', '${FINLAND}']`],
  ["landmark: 'מוזיאon הספina וasa'", `landmark: '${VASA}'`],
  ["capital: 'הanoi'", `capital: '${HANOI}'`],
  ["currency: 'dong'", `currency: '${DONG}'`],
  ["neighbors: ['סין', 'לאוס', 'קambodia', 'תאילנד']", `neighbors: ['סין', 'לאוס', '${CAMBODIA}', 'תאילנד']`],
  ["landmark: 'מפרץ הalong'", `landmark: '${HALONG}'`],
  ["name: 'קenيا'", `name: '${KENYA}'`],
  ["capital: 'נairobi'", `capital: '${NAIROBI}'`],
  ["currency: 'שקel קenyan'", `currency: '${SHILLING}'`],
  ["language: 'אנגלית וswahili'", `language: '${SWAHILI}'`],
  ["neighbors: ['אתיופיה', 'סומליה', 'טנזניה', 'אוגanda', 'דרום סודאן']",
    `neighbors: ['${ETHIOPIA}', '${SOMALIA}', '${TANZANIA}', '${UGANDA}', '${SUDAN}']`],
  ["currency: 'שקל קניה'", `currency: '${SHILLING}'`],
  ["landmark: 'פארק הסafari בנairobi'", `landmark: '${SAFARI}'`],
  ["name: 'דרום קorea'", `name: '${SKOREA}'`],
  ["currency: 'won'", `currency: '${WON}'`],
  ["language: 'קoreית'", `language: '${KOREAN}'`],
  ["neighbors: ['צפון קorea']", `neighbors: ['${NKOREA}']`],
  ["landmark: 'ארמון Gyeongbok'", `landmark: '${GYEONG}'`],
  ["flagDescription: 'דגל לבן עם סמל יin-yang ופסים'", `flagDescription: '${YINYANG}'`],
  ["name: 'סtockholm'", `name: '${STOCKHOLM}'`],
  ["name: 'הו צ\\'י מinh'", `name: '${HCMC}'`],
  ["name: 'נairobi'", `name: '${NAIROBI}'`],
])

patch('src/data/almanacExtras.ts', [
  ["{ name: 'קרaków', nameEn: 'Krakow' }", "{ name: '\u05E7\u05E8\u05DB\u05D5\u05D1', nameEn: 'Krakow' }"],
  ["{ name: 'Gdansk', nameEn: 'Gdansk' }", "{ name: '\u05D2\u05D3\u05E0\u05E1\u05E7', nameEn: 'Gdansk' }"],
  ["{ name: 'טירת וawel', nameEn: 'Wawel Castle' }", "{ name: '\u05D8\u05D9\u05E8\u05EA \u05D5\u05D5\u05D0\u05D9\u05DC', nameEn: 'Wawel Castle' }"],
  ["{ name: 'מחנה אושvitz', nameEn: 'Auschwitz Memorial' }", "{ name: '\u05DE\u05D7\u05E0\u05D4 \u05D0\u05D5\u05E9\u05D1\u05D9\u05E5', nameEn: 'Auschwitz Memorial' }"],
  ["'Marie Curie נולדה בוarsaw.'", "'\u05DE\u05E8\u05D9 \u05E7\u05D5\u05E8\u05D9 \u05E0\u05D5\u05DC\u05D3\u05D4 \u05D1\u05D5\u05E8\u05E9\u05D4.'"],
  ["'תנועת Solidarity הייתה חלק מסיפור העצמאות.'", "'\u05EA\u05E0\u05D5\u05E2\u05EA \u05E1\u05D5\u05DC\u05D9\u05D3\u05E8\u05D9\u05D5\u05EA \u05D4\u05D9\u05EA\u05D4 \u05D7\u05DC\u05E7 \u05DE\u05E1\u05D9\u05E4\u05D5\u05E8 \u05D4\u05E2\u05E6\u05DE\u05D0\u05D5\u05EA.'"],
  ["{ name: 'מגדל בelem', nameEn: 'Belem Tower' }", `{ name: '${BELEM}', nameEn: 'Belem Tower' }`],
  ["{ name: 'Porto', nameEn: 'Porto' }", "{ name: '\u05E4\u05D5\u05E8\u05D8\u05D5', nameEn: 'Porto' }"],
  ["{ name: 'Faro', nameEn: 'Faro' }", "{ name: '\u05E4\u05D0\u05E8\u05D5', nameEn: 'Faro' }"],
  ["'Vasco da Gama יצא מכאן לדרך הים להודו.'", "'\u05D5\u05D0\u05E1\u05D5 \u05D3\u05D4 \u05D2\u05D0\u05DE\u05D4 \u05D9\u05E6\u05D0 \u05DE\u05DB\u05D0\u05DF \u05DC\u05D3\u05E8\u05DA \u05D4\u05D9\u05DD \u05DC\u05D4\u05D5\u05D3\u05D5.'"],
  ["'מאכל מפורסם: pastel de nata.'", "'\u05DE\u05D0\u05DB\u05DC \u05DE\u05E4\u05D5\u05E8\u05E1\u05DD: \u05E4\u05E1\u05D8\u05DC \u05D3\u05D9 \u05E0\u05D8\u05D4.'"],
  ["{ name: 'סtockholm', nameEn: 'Stockholm', inGame: true }", `{ name: '${STOCKHOLM}', nameEn: 'Stockholm', inGame: true }`],
  ["{ name: 'Gothenburg', nameEn: 'Gothenburg' }", "{ name: '\u05D2\u05D5\u05EA\u05E0\u05D1\u05D5\u05E8\u05D2', nameEn: 'Gothenburg' }"],
  ["{ name: 'Malmö', nameEn: 'Malmo' }", "{ name: '\u05DE\u05D0\u05DC\u05DE\u05D5', nameEn: 'Malmo' }"],
  ["{ name: 'מוזיאon הספina וasa', nameEn: 'Vasa Museum' }", `{ name: '${VASA}', nameEn: 'Vasa Museum' }`],
  ["'שוודיה — בירתה סtockholm, והשפה שwedית.'", `'שוודיה — בירתה ${STOCKHOLM}, והשפה ${SWEDISH}.'`],
  ["'כדורי בשר שwedיים הם מאכל לאומי.'", "'\u05DB\u05D3\u05D5\u05E8\u05D9 \u05D1\u05E9\u05E8 \u05E9\u05D5\u05D5\u05D3\u05D9\u05D9\u05DD \u05D4\u05DD \u05DE\u05D0\u05DB\u05DC \u05DC\u05D0\u05D5\u05DE\u05D9.'"],
  ["{ name: 'הו צ\\'י מinh', nameEn: 'Ho Chi Minh City', inGame: true }", `{ name: '${HCMC}', nameEn: 'Ho Chi Minh City', inGame: true }`],
  ["{ name: 'הanoi', nameEn: 'Hanoi' }", `{ name: '${HANOI}', nameEn: 'Hanoi' }`],
  ["{ name: 'Da Nang', nameEn: 'Da Nang' }", "{ name: '\u05D3\u05E0\u05D0\u05E0\u05D2', nameEn: 'Da Nang' }"],
  ["{ name: 'מפרץ הalong', nameEn: 'Ha Long Bay' }", `{ name: '${HALONG}', nameEn: 'Ha Long Bay' }`],
  ["'וייטנאם — בירתה הanoi, והשפה וייטנאמית.'", `'וייטנאם — בירתה ${HANOI}, והשפה וייטנאמית.'`],
  ["'pho הוא מרק מפורסם במדינה.'", "'\u05E4\u05D5 \u05D4\u05D5\u05D0 \u05DE\u05E8\u05E7 \u05DE\u05E4\u05D5\u05E8\u05E1\u05DD \u05D1\u05DE\u05D3\u05D9\u05E0\u05D4.'"],
  ["'מפרץ הalong הוא אתר מורשת עולמית.'", `'${HALONG} הוא אתר מורשת עולמית.'`],
  ["{ name: 'נairobi', nameEn: 'Nairobi', inGame: true }", `{ name: '${NAIROBI}', nameEn: 'Nairobi', inGame: true }`],
  ["{ name: 'Mombasa', nameEn: 'Mombasa' }", "{ name: '\u05DE\u05D5\u05DE\u05D1\u05E1\u05D4', nameEn: 'Mombasa' }"],
  ["{ name: 'Kisumu', nameEn: 'Kisumu' }", "{ name: '\u05E7\u05D9\u05E1\u05D5\u05DE\u05D5', nameEn: 'Kisumu' }"],
  ["{ name: 'פארק הסafari בנairobi', nameEn: 'Nairobi National Park' }", `{ name: '${SAFARI}', nameEn: 'Nairobi National Park' }`],
  ["'קenya — בירתה נairobi, והשפות אנגלית וswahili.'", `'${KENYA} — בירתה ${NAIROBI}, והשפות ${SWAHILI}.'`],
  ["'Wangari Maathai זכתה בפרס Nobel לשלום.'", "'\u05D5\u05D0\u05E0\u05D2\u05E8\u05D9 \u05DE\u05D0\u05EA\u05D0\u05D9 \u05D6\u05DB\u05EA\u05D4 \u05D1\u05E4\u05E8\u05E1 \u05E0\u05D5\u05D1\u05DC \u05DC\u05E9\u05DC\u05D5\u05DD.'"],
  ["'סafari בקenya מפורסם ברחבי העולם.'", `'ספארי ב${KENYA} מפורסם ברחבי העולם.'`],
  ["{ name: 'Busan', nameEn: 'Busan' }", "{ name: '\u05D1\u05D5\u05E1\u05D0\u05DF', nameEn: 'Busan' }"],
  ["{ name: 'Incheon', nameEn: 'Incheon' }", "{ name: '\u05D0\u05D9\u05E0\u05E6\u05F3\u05D5\u05DF', nameEn: 'Incheon' }"],
  ["{ name: 'ארמון Gyeongbok', nameEn: 'Gyeongbokgung Palace' }", `{ name: '${GYEONG}', nameEn: 'Gyeongbokgung Palace' }`],
  ["'דרום קorea — בירתה סיאול, והשפה קoreית.'", `'${SKOREA} — בירתה סיאול, והשפה ${KOREAN}.'`],
  ["'kimchi הוא מאכל מסורתי מפורסם.'", "'\u05E7\u05D9\u05DE\u05E6\u05F3\u05D9 \u05D4\u05D5\u05D0 \u05DE\u05D0\u05DB\u05DC \u05DE\u05E1\u05D5\u05E8\u05EA\u05D9 \u05DE\u05E4\u05D5\u05E8\u05E1\u05DD.'"],
  ["'King Sejong המציא את האלפבית הקoreani.'", "'\u05D4\u05DE\u05DC\u05DA \u05E1\u05D2\u05D5\u05E0\u05D2 \u05D4\u05DE\u05E6\u05D9\u05D0 \u05D0\u05EA \u05D4\u05D0\u05DC\u05E4\u05D1\u05D9\u05EA \u05D4\u05E7\u05D5\u05E8\u05D9\u05D0\u05D9.'"],
  ["{ name: 'Mosteiro dos Jerónimos', nameEn: 'Jerónimos Monastery' }", "{ name: '\u05DE\u05E0\u05D6\u05E8 \u05D2\u05F3\u05E8\u05D5\u05E0\u05D9\u05DE\u05D5\u05E1', nameEn: 'Jer\u00f3nimos Monastery' }"],
  ["{ name: 'Palácio da Pena', nameEn: 'Pena Palace' }", "{ name: '\u05D0\u05E8\u05DE\u05D5\u05DF \u05E4\u05E0\u05D4', nameEn: 'Pena Palace' }"],
  ["{ name: 'Gamla Stan', nameEn: 'Old Town Stockholm' }", "{ name: '\u05D4\u05E2\u05D9\u05E8 \u05D4\u05E2\u05EA\u05D9\u05E7\u05D4 \u05D1\u05E1\u05D8\u05D5\u05E7\u05D4\u05D5\u05DC\u05DD', nameEn: 'Old Town Stockholm' }"],
  ["{ name: 'ABBA Museum', nameEn: 'ABBA Museum' }", "{ name: '\u05DE\u05D5\u05D6\u05D9\u05D0\u05D5\u05DF \u05D0\u05D1\u05D1\u05D0', nameEn: 'ABBA Museum' }"],
  ["'פרס Nobel נוסד כאן.'", "'\u05E4\u05E8\u05E1 \u05E0\u05D5\u05D1\u05DC \u05E0\u05D5\u05E1\u05D3 \u05DB\u05D0\u05DF.'"],
  ["{ name: 'Cu Chi Tunnels', nameEn: 'Cu Chi Tunnels' }", "{ name: '\u05DE\u05E0\u05D4\u05E8\u05D5\u05EA \u05E7\u05D5\u05F3\u05D9 \u05E6\u05F3\u05D9', nameEn: 'Cu Chi Tunnels' }"],
  ["{ name: 'Imperial City Hue', nameEn: 'Imperial City of Hue' }", "{ name: '\u05E2\u05D9\u05E8 \u05D4\u05E7\u05D9\u05E1\u05E8 \u05D1\u05D4\u05D5\u05D0\u05D4', nameEn: 'Imperial City of Hue' }"],
  ["{ name: 'Maasai Mara', nameEn: 'Maasai Mara' }", "{ name: '\u05DE\u05E1\u05E2\u05D9 \u05DE\u05E8\u05D4', nameEn: 'Maasai Mara' }"],
  ["{ name: 'Mount Kenya', nameEn: 'Mount Kenya' }", "{ name: '\u05D4\u05E8 \u05E7\u05E0\u05D9\u05D4', nameEn: 'Mount Kenya' }"],
  ["{ name: 'N Seoul Tower', nameEn: 'N Seoul Tower' }", "{ name: '\u05DE\u05D2\u05D3\u05DC \u05E1\u05D9\u05D0\u05D5\u05DC', nameEn: 'N Seoul Tower' }"],
  ["{ name: 'DMZ', nameEn: 'Korean Demilitarized Zone' }", "{ name: '\u05D4\u05D0\u05D6\u05D5\u05E8 \u05D4\u05DE\u05E4\u05D5\u05E8\u05D6', nameEn: 'Korean Demilitarized Zone' }"],
])

patch('src/data/almanacCulture.ts', [
  ["f('קleopatra', 'Cleopatra')", "f('\u05E7\u05DC\u05D0\u05D5\u05E4\u05D8\u05E8\u05D4', 'Cleopatra')"],
  ["f('תutankhamun', 'Tutankhamun')", "f('\u05EA\u05D5\u05EA\u05E2\u05E0\u05D7\u05E2\u05DE\u05D5\u05DF', 'Tutankhamun')"],
  ["f('סushi', 'sushi'), f('ראmen', 'ramen'), f('טempura', 'tempura')", "f('\u05E1\u05D5\u05E9\u05D9', 'sushi'), f('\u05E8\u05D0\u05DE\u05DF', 'ramen'), f('\u05D8\u05DE\u05E4\u05D5\u05E8\u05D4', 'tempura')"],
  ["f('תקופת מיiji', 'Meiji Restoration'), f('אולימpiada בטokyo', 'Tokyo Olympics')", "f('\u05EA\u05E7\u05D5\u05E4\u05EA \u05DE\u05D9\u05D9\u05D2\u05F3\u05D9', 'Meiji Restoration'), f('\u05D0\u05D5\u05DC\u05D9\u05DE\u05E4\u05D9\u05D0\u05D3\u05D4 \u05D1\u05D8\u05D5\u05E7\u05D9\u05D5', 'Tokyo Olympics')"],
  ["f('Akira Kurosawa', 'Akira Kurosawa'), f('הקaiser Meiji', 'Emperor Meiji')", "f('\u05D0\u05E7\u05D9\u05E8\u05D4 \u05E7\u05D5\u05E8\u05D5\u05E1\u05D0\u05D5\u05D5\u05D4', 'Akira Kurosawa'), f('\u05D4\u05E7\u05D9\u05D9\u05E1\u05E8 \u05DE\u05D9\u05D9\u05D2\u05F3\u05D9', 'Emperor Meiji')"],
  ["f('המבורger', 'hamburger')", "f('\u05D4\u05DE\u05D1\u05D5\u05E8\u05D2\u05E8', 'hamburger')"],
  ["f('ברbecue', 'barbecue')", "f('\u05D1\u05E8\u05D1\u05E7\u05D9\u05D5', 'barbecue')"],
  ["f('Abraham Lincoln', 'Abraham Lincoln'), f('Martin Luther King', 'Martin Luther King')", "f('\u05D0\u05D1\u05E8\u05D4\u05DD \u05DC\u05D9\u05E0\u05E7\u05D5\u05DC\u05DF', 'Abraham Lincoln'), f('\u05DE\u05E8\u05D8\u05D9\u05DF \u05DC\u05D5\u05EA\u05E8 \u05E7\u05D9\u05E0\u05D2', 'Martin Luther King')"],
  ["f('נקnack וurst', 'bratwurst'), f('ביigel', 'pretzel'), f('כרוב כbosh', 'sauerkraut')", "f('\u05E0\u05E7\u05E0\u05D9\u05E7', 'bratwurst'), f('\u05D1\u05D9\u05D9\u05D2\u05DC', 'pretzel'), f('\u05DB\u05E8\u05D5\u05D1 \u05DB\u05D1\u05D5\u05E9', 'sauerkraut')"],
  ["f('נפילת חomת Berlin', 'Fall of Berlin Wall')", "f('\u05E0\u05E4\u05D9\u05DC\u05EA \u05D7\u05D5\u05DE\u05EA \u05D1\u05E8\u05DC\u05D9\u05DF', 'Fall of Berlin Wall')"],
  ["f('Albert Einstein', 'Albert Einstein'), f('Johann Bach', 'Johann Sebastian Bach')", "f('\u05D0\u05DC\u05D1\u05E8\u05D8 \u05D0\u05D9\u05D9\u05E0\u05E9\u05D8\u05D9\u05D9\u05DF', 'Albert Einstein'), f('\u05D9\u05D5\u05D4\u05DF \u05E1\u05D1\u05E1\u05D8\u05D9\u05D0\u05DF \u05D1\u05D0\u05DA', 'Johann Sebastian Bach')"],
  ["f('אsado', 'asado'), f('אmpanada', 'empanada'), f('dulce de leche', 'dulce de leche')", "f('\u05D0\u05E1\u05D0\u05D3\u05D5', 'asado'), f('\u05E2\u05DE\u05E4\u05E0\u05D3\u05D4', 'empanada'), f('\u05D3\u05D5\u05DC\u05E1\u05D4 \u05D3\u05DC\u05D7\u05D4', 'dulce de leche')"],
  ["f('מהפכת מאyo', 'May Revolution'), f('ניצחון במונdial', 'World Cup victory')", "f('\u05DE\u05D4\u05E4\u05DB\u05EA \u05DE\u05D0\u05D9\u05D5', 'May Revolution'), f('\u05E0\u05D9\u05E6\u05D7\u05D5\u05DF \u05D1\u05DE\u05D5\u05E0\u05D3\u05D9\u05D0\u05DC', 'World Cup victory')"],
  ["f('Eva Perón', 'Eva Perón'), f('Diego Maradona', 'Diego Maradona')", "f('\u05D0\u05D1\u05D4 \u05E4\u05E8\u05D5\u05DF', 'Eva Per\u00f3n'), f('\u05D3\u05D9\u05D2\u05D5 \u05DE\u05E8\u05D3\u05D5\u05E0\u05D4', 'Diego Maradona')"],
  ["f('פai של בשר', 'meat pie'), f('lamington', 'lamington'), f('Vegemite', 'Vegemite')", "f('\u05E4\u05E2 \u05E9\u05DC \u05D1\u05E9\u05E8', 'meat pie'), f('\u05DC\u05DE\u05D9\u05E0\u05D2\u05D8\u05D5\u05DF', 'lamington'), f('\u05D5\u05D2\u05D9\u05DE\u05D9\u05D9\u05D8', 'Vegemite')"],
  ["f('הגעת Fleet הראשון', 'First Fleet arrival'), f('הפderation', 'Federation')", "f('\u05D4\u05D2\u05E2\u05EA \u05D4\u05E9\u05D9\u05D8 \u05D4\u05E8\u05D0\u05E9\u05D5\u05DF', 'First Fleet arrival'), f('\u05D4\u05E4\u05D3\u05E8\u05E6\u05D9\u05D4', 'Federation')"],
  ["f('Cathy Freeman', 'Cathy Freeman'), f('Steve Irwin', 'Steve Irwin')", "f('\u05E7\u05D0\u05EA\u05D9 \u05E4\u05E8\u05D9\u05DE\u05DF', 'Cathy Freeman'), f('\u05E1\u05D8\u05D9\u05D5 \u05D0\u05D9\u05E8\u05D5\u05D5\u05DF', 'Steve Irwin')"],
  ["f('קari', 'curry'), f('biryani', 'biryani'), f('samosa', 'samosa')", "f('\u05E7\u05E8\u05D9', 'curry'), f('\u05D1\u05D9\u05E8\u05D9\u05D0\u05E0\u05D9', 'biryani'), f('\u05E1\u05DE\u05D5\u05E1\u05D4', 'samosa')"],
  ["f('תנועת גandhi', 'Gandhi movement')", "f('\u05EA\u05E0\u05D5\u05E2\u05EA \u05D2\u05E0\u05D3\u05D9', 'Gandhi movement')"],
  ["f('Mahatma Gandhi', 'Mahatma Gandhi'), f('Rabindranath Tagore', 'Rabindranath Tagore')", "f('\u05DE\u05D4\u05D0\u05EA\u05DE\u05D4 \u05D2\u05E0\u05D3\u05D9', 'Mahatma Gandhi'), f('\u05E8\u05D1\u05D9\u05E0\u05D3\u05E8\u05E0\u05D0\u05EA \u05D8\u05D2\u05D5\u05E8', 'Rabindranath Tagore')"],
  ["f('דגים וצ\\'ips', 'fish and chips'), f('ארוחת בוקר אנglית', 'full English breakfast'), f('סcone', 'scone')", "f('\u05D3\u05D2\u05D9\u05DD \u05D5\u05E6\u05F3\u05D9\u05E4\u05E1', 'fish and chips'), f('\u05D0\u05E8\u05D5\u05D7\u05EA \u05D1\u05D5\u05E7\u05E8 \u05D0\u05E0\u05D2\u05DC\u05D9\u05EA', 'full English breakfast'), f('\u05E1\u05E7\u05D5\u05DF', 'scone')"],
  ["f('Magna Carta', 'Magna Carta')", "f('\u05DE\u05D2\u05E0\u05D4 \u05DB\u05E8\u05D8\u05D4', 'Magna Carta')"],
  ["f('William Shakespeare', 'William Shakespeare'), f('Winston Churchill', 'Winston Churchill')", "f('\u05D5\u05D9\u05DC\u05D9\u05D0\u05DD \u05E9\u05E7\u05E1\u05E4\u05D9\u05D9\u05E8', 'William Shakespeare'), f('\u05D5\u05D9\u05E0\u05E1\u05D8\u05D5\u05DF \u05E6\u05F3\u05E8\u05D7\u05D9\u05DC', 'Winston Churchill')"],
  ["f('feijoada', 'feijoada'), f('pão de queijo', 'pão de queijo'), f('açaí', 'açaí')", "f('\u05E4\u05D9\u05D6\u05D5\u05D0\u05D3\u05D4', 'feijoada'), f('\u05E4\u05D0\u05D5 \u05D3\u05D9 \u05E7\u05D9\u05D6\u05F3\u05D5', 'p\u00e3o de queijo'), f('\u05D0\u05E1\u05D0\u05D9', 'a\u00e7a\u00ed')"],
  ["f('קרnaval', 'Carnival')", "f('\u05E7\u05E8\u05E0\u05D1\u05DC', 'Carnival')"],
  ["f('Pelé', 'Pelé'), f('Oscar Niemeyer', 'Oscar Niemeyer')", "f('\u05E4\u05DC\u05D4', 'Pel\u00e9'), f('\u05D0\u05D5\u05E1\u05E7\u05E8 \u05E0\u05D9\u05D9\u05DE\u05D9\u05D9\u05E8', 'Oscar Niemeyer')"],
  ["f('קבab', 'kebab'), f('בaklava', 'baklava'), f('קhawa טurki', 'Turkish coffee')", "f('\u05E7\u05D1\u05D1', 'kebab'), f('\u05D1\u05E7\u05DC\u05D5\u05D5\u05D4', 'baklava'), f('\u05E7\u05D4\u05D5\u05D4 \u05D8\u05D5\u05E8\u05E7\u05D9', 'Turkish coffee')"],
  ["f('הקמת הרpublicה', 'Republic founding')", "f('\u05D4\u05E7\u05DE\u05EA \u05D4\u05E8\u05E4\u05D5\u05D1\u05DC\u05D9\u05E7\u05D4', 'Republic founding')"],
  ["f('Mustafa Kemal Atatürk', 'Atatürk'), f('Rumi', 'Rumi')", "f('\u05DE\u05D5\u05E1\u05D8\u05E4\u05D4 \u05DB\u05DE\u05DC \u05D0\u05EA\u05D0\u05D8\u05D5\u05E8\u05DA', 'Atat\u00fcrk'), f('\u05E8\u05D5\u05DE\u05D9', 'Rumi')"],
  ["f('פizza', 'pizza'), f('pasta', 'pasta'), f('gelato', 'gelato')", "f('\u05E4\u05D9\u05E6\u05D4', 'pizza'), f('\u05E4\u05E1\u05D8\u05D4', 'pasta'), f('\u05D2\u05F3\u05DC\u05D8\u05D5', 'gelato')"],
  ["f('הרenaissance', 'Renaissance'), f('איחוד איטalia', 'Italian unification')", "f('\u05D4\u05E8\u05E0\u05E1\u05E0\u05E1', 'Renaissance'), f('\u05D0\u05D9\u05D7\u05D5\u05D3 \u05D0\u05D9\u05D8\u05DC\u05D9\u05D4', 'Italian unification')"],
  ["f('Leonardo da Vinci', 'Leonardo da Vinci'), f('Julius Caesar', 'Julius Caesar')", "f('\u05DC\u05D0\u05D5\u05E0\u05E8\u05D3\u05D5 \u05D3\u05D4 \u05D5\u05D5\u05D9\u05E0\u05E6\u05D9', 'Leonardo da Vinci'), f('\u05D9\u05D5\u05DC\u05D9\u05D5\u05E1 \u05E7\u05D9\u05D9\u05D6\u05E8', 'Julius Caesar')"],
  ["f('paella', 'paella'), f('tapas', 'tapas'), f('churros', 'churros')", "f('\u05E4\u05D0\u05D9\u05D4', 'paella'), f('\u05D8\u05D0\u05E4\u05D0\u05E1', 'tapas'), f('\u05E6\u05F3\u05D5\u05E8\u05D5\u05E1', 'churros')"],
  ["f('מלchamת האזrach', 'Spanish Civil War'), f('עידan הגילויים', 'Age of Discovery')", "f('\u05DE\u05DC\u05D7\u05DE\u05EA \u05D4\u05D0\u05D6\u05E8\u05D7', 'Spanish Civil War'), f('\u05E2\u05D9\u05D3\u05DF \u05D4\u05D2\u05D9\u05DC\u05D5\u05D9\u05D9\u05DD', 'Age of Discovery')"],
  ["f('Miguel de Cervantes', 'Miguel de Cervantes'), f('Pablo Picasso', 'Pablo Picasso')", "f('\u05DE\u05D9\u05D2\u05DC \u05D3\u05E9\u05D0\u05D5\u05DF \u05E1\u05E8\u05D5\u05D5\u05E0\u05D8\u05D4', 'Miguel de Cervantes'), f('\u05E4\u05D1\u05DC\u05D5 \u05E4\u05D9\u05E7\u05D0\u05E1\u05D5', 'Pablo Picasso')"],
  ["f('borscht', 'borscht'), f('pelmeni', 'pelmeni'), f('blini', 'blini')", "f('\u05D1\u05D5\u05E8\u05E9\u05D8', 'borscht'), f('\u05E4\u05E2\u05DC\u05DE\u05E0\u05D9', 'pelmeni'), f('\u05D1\u05DC\u05D9\u05E0\u05D9', 'blini')"],
  ["f('השקת Sputnik', 'Sputnik launch')", "f('\u05D4\u05E9\u05E7\u05EA \u05E1\u05E4\u05D5\u05D8\u05E0\u05D9\u05E7', 'Sputnik launch')"],
  ["f('Leo Tolstoy', 'Leo Tolstoy'), f('Yuri Gagarin', 'Yuri Gagarin')", "f('\u05DC\u05D9\u05D5 \u05D8\u05D5\u05DC\u05E1\u05D8\u05D5\u05D9', 'Leo Tolstoy'), f('\u05D9\u05D5\u05E8\u05D9 \u05D2\u05D2\u05E8\u05D9\u05DF', 'Yuri Gagarin')"],
  ["f('אמpלings', 'dumplings'), f('ברוoz ברווז Пекin', 'Peking duck'), f('אורz מטוגan', 'fried rice')", "f('\u05DB\u05E8\u05D5\u05D1\u05D9\u05D5\u05EA', 'dumplings'), f('\u05D1\u05E8\u05D5\u05D5\u05D6 \u05E4\u05E7\u05D9\u05E0\u05D9', 'Peking duck'), f('\u05D0\u05D5\u05E8\u05D6 \u05DE\u05D8\u05D5\u05D2\u05DF', 'fried rice')"],
  ["f('הקמת הרpublicה', 'People\\'s Republic founding')", "f('\u05D4\u05E7\u05DE\u05EA \u05D4\u05E8\u05E4\u05D5\u05D1\u05DC\u05D9\u05E7\u05D4', 'People\\'s Republic founding')"],
  ["f('תקופת חomת סin', 'Great Wall era')", "f('\u05EA\u05E7\u05D5\u05E4\u05EA \u05D7\u05D5\u05DE\u05EA \u05E1\u05D9\u05DF', 'Great Wall era')"],
  ["f('Confucius', 'Confucius'), f('Mao Zedong', 'Mao Zedong')", "f('\u05E7\u05D5\u05E0\u05E4\u05D5\u05E6\u05D9\u05D5\u05E1', 'Confucius'), f('\u05DE\u05D0\u05D5 \u05E6\u05D3\u05D5\u05E0\u05D2', 'Mao Zedong')"],
  ["f('pad thai', 'pad thai'), f('tom yum', 'tom yum'), f('mango sticky rice', 'mango sticky rice')", "f('\u05E4\u05D3 \u05EA\u05D0\u05D9', 'pad thai'), f('\u05D8\u05D5\u05DD \u05D9\u05D0\u05DD', 'tom yum'), f('\u05D0\u05D5\u05E8\u05D6 \u05DE\u05D0\u05E0\u05D2\u05D5 \u05D3\u05D1\u05E9', 'mango sticky rice')"],
  ["f('פestival Songkran', 'Songkran festival'), f('ממלכת Sukhothai', 'Sukhothai kingdom')", "f('\u05E4\u05E1\u05D8\u05D9\u05D5\u05D0\u05DC \u05E1\u05D5\u05E0\u05D2\u05E7\u05E8\u05DF', 'Songkran festival'), f('\u05DE\u05DE\u05DC\u05DB\u05EA \u05E1\u05D5\u05DB\u05D5\u05EA\u05D0\u05D9', 'Sukhothai kingdom')"],
  ["f('King Bhumibol', 'King Bhumibol'), f('Tony Jaa', 'Tony Jaa')", "f('\u05D4\u05DE\u05DC\u05DA \u05D1\u05D5\u05DE\u05D9\u05D1\u05D5\u05DC', 'King Bhumibol'), f('\u05D8\u05D5\u05E0\u05D9 \u05D2\u05F3\u05D0', 'Tony Jaa')"],
  ["f('moussaka', 'moussaka'), f('souvlaki', 'souvlaki'), f('גbina feta', 'feta cheese')", "f('\u05DE\u05D5\u05E1\u05D0\u05E7\u05D4', 'moussaka'), f('\u05E1\u05D5\u05D1\u05DC\u05D0\u05E7\u05D9', 'souvlaki'), f('\u05D2\u05D1\u05D9\u05E0\u05EA \u05E4\u05E8\u05D4', 'feta cheese')"],
  ["f('אולימpiada העתiqa', 'Ancient Olympics'), f('מלchamת העצmaאות', 'War of Independence')", "f('\u05D0\u05D5\u05DC\u05D9\u05DE\u05E4\u05D9\u05D0\u05D3\u05D4 \u05D4\u05E2\u05EA\u05D9\u05E7\u05D4', 'Ancient Olympics'), f('\u05DE\u05DC\u05D7\u05DE\u05EA \u05D4\u05E2\u05E6\u05DE\u05D0\u05D5\u05EA', 'War of Independence')"],
  ["f('Alexander the Great', 'Alexander the Great'), f('Socrates', 'Socrates')", "f('\u05D0\u05DC\u05DB\u05E1\u05E0\u05D3\u05E8 \u05DE\u05D0\u05E7\u05D3\u05D5\u05DF', 'Alexander the Great'), f('\u05E1\u05D5\u05E7\u05E8\u05D8\u05E1', 'Socrates')"],
  ["f('tacos', 'tacos'), f('guacamole', 'guacamole'), f('שokolad מexicani', 'Mexican chocolate')", "f('\u05D8\u05D0\u05E7\u05D5\u05E1', 'tacos'), f('\u05D2\u05D5\u05D0\u05E7\u05DE\u05D5\u05DC\u05D4', 'guacamole'), f('\u05E9\u05D5\u05E7\u05D5\u05DC\u05D3 \u05DE\u05E7\u05E1\u05D9\u05E7\u05D0\u05D9', 'Mexican chocolate')"],
  ["f('Frida Kahlo', 'Frida Kahlo'), f('Emiliano Zapata', 'Emiliano Zapata')", "f('\u05E4\u05E8\u05D9\u05D3\u05D4 \u05E7\u05D0\u05D5\u05DC\u05D5', 'Frida Kahlo'), f('\u05D0\u05DE\u05D9\u05DC\u05D9\u05D0\u05E0\u05D5 \u05E6\u05D0\u05E4\u05D0\u05D8\u05D4', 'Emiliano Zapata')"],
  ["f('poutine', 'poutine'), f('סiroop מple', 'maple syrup'), f('butter tarts', 'butter tarts')", "f('\u05E4\u05D5\u05D8\u05D9\u05DF', 'poutine'), f('\u05E1\u05D9\u05E8\u05D5\u05E4 \u05DE\u05D9\u05E4\u05DC', 'maple syrup'), f('\u05E4\u05D0\u05D9\u05D9\u05D6 \u05D7\u05DE\u05D0\u05D4', 'butter tarts')"],
  ["f('Confederation 1867', 'Confederation'), f('Charter of Rights', 'Charter of Rights')", "f('\u05D4\u05E7\u05D5\u05E0\u05E4\u05D3\u05E8\u05E6\u05D9\u05D4 1867', 'Confederation'), f('\u05D0\u05DE\u05E0\u05EA \u05D6\u05DB\u05D5\u05D9\u05D5\u05EA', 'Charter of Rights')"],
  ["f('Terry Fox', 'Terry Fox'), f('Wayne Gretzky', 'Wayne Gretzky')", "f('\u05D8\u05E8\u05D9 \u05E4\u05D5\u05E7\u05E1', 'Terry Fox'), f('\u05D5\u05D5\u05D9\u05D9\u05DF \u05D2\u05E8\u05E6\u05E7\u05D9', 'Wayne Gretzky')"],
  ["f('stroopwafel', 'stroopwafel'), f('דg מleine', 'herring'), f('גbina Gouda', 'Gouda cheese')", "f('\u05E1\u05D8\u05E8\u05D5\u05D5\u05E4\u05D5\u05D5\u05E4\u05DC', 'stroopwafel'), f('\u05D3\u05D2 \u05DE\u05DC\u05D5\u05D7', 'herring'), f('\u05D2\u05D1\u05D9\u05E0\u05EA \u05D2\u05D0\u05D5\u05D3\u05D4', 'Gouda cheese')"],
  ["f('העידan הזהb', 'Dutch Golden Age')", "f('\u05D4\u05E2\u05D9\u05D3\u05DF \u05D4\u05D6\u05D4\u05D1 \u05D4\u05D4\u05D5\u05DC\u05E0\u05D3\u05D9', 'Dutch Golden Age')"],
  ["f('Vincent van Gogh', 'Vincent van Gogh'), f('Anne Frank', 'Anne Frank')", "f('\u05D5\u05E0\u05E1\u05E0\u05D8 \u05D5\u05DF \u05D2\u05D5\u05D2', 'Vincent van Gogh'), f('\u05D0\u05E0\u05D4 \u05E4\u05E8\u05E0\u05E7', 'Anne Frank')"],
  ["f('bobotie', 'bobotie'), f('biltong', 'biltong'), f('boerewors', 'boerewors')", "f('\u05D1\u05D5\u05D1\u05D5\u05D8\u05D9', 'bobotie'), f('\u05D1\u05D9\u05DC\u05D8\u05D5\u05E0\u05D2', 'biltong'), f('\u05D1\u05D5\u05D0\u05E8\u05D5\u05D5\u05E8\u05E1', 'boerewors')"],
  ["f('סיום האpartheid', 'End of apartheid')", "f('\u05E1\u05D9\u05D5\u05DD \u05D4\u05D0\u05E4\u05E8\u05D8\u05D9\u05D9\u05D3', 'End of apartheid')"],
  ["f('Nelson Mandela', 'Nelson Mandela'), f('Desmond Tutu', 'Desmond Tutu')", "f('\u05E0\u05DC\u05E1\u05D5\u05DF \u05DE\u05E0\u05D3\u05DC\u05D4', 'Nelson Mandela'), f('\u05D3\u05E1\u05DE\u05D5\u05E0\u05D3 \u05D8\u05D5\u05D8\u05D5', 'Desmond Tutu')"],
  ["f('pierogi', 'pierogi'), f('bigos', 'bigos'), f('kielbasa', 'kielbasa')", "f('\u05E4\u05D9\u05D0\u05D5\u05E8\u05D5\u05D2\u05D9', 'pierogi'), f('\u05D1\u05D9\u05D2\u05D5\u05E1', 'bigos'), f('\u05E7\u05D9\u05D9\u05DC\u05D1\u05E1\u05D4', 'kielbasa')"],
  ["f('תנועת Solidarity', 'Solidarity movement'), f('חוקה 3 במayo', 'May 3 Constitution')", "f('\u05EA\u05E0\u05D5\u05E2\u05EA \u05E1\u05D5\u05DC\u05D9\u05D3\u05E8\u05D9\u05D5\u05EA', 'Solidarity movement'), f('\u05D7\u05D5\u05E7\u05D4 \u05DE-3 \u05D1\u05DE\u05D0\u05D9', 'May 3 Constitution')"],
  ["f('Marie Curie', 'Marie Curie'), f('Frédéric Chopin', 'Frédéric Chopin')", "f('\u05DE\u05E8\u05D9 \u05E7\u05D5\u05E8\u05D9', 'Marie Curie'), f('\u05E4\u05E8\u05D3\u05E8\u05D9\u05E7 \u05E9\u05D5\u05E4\u05DF', 'Fr\u00e9d\u00e9ric Chopin')"],
  ["f('pastel de nata', 'pastel de nata'), f('bacalhau', 'bacalhau'), f('caldo verde', 'caldo verde')", "f('\u05E4\u05E1\u05D8\u05DC \u05D3\u05D9 \u05E0\u05D8\u05D4', 'pastel de nata'), f('\u05D1\u05D0\u05D2\u05DC\u05D4\u05D5', 'bacalhau'), f('\u05E7\u05D0\u05DC\u05D3\u05D5 \u05D5\u05E8\u05D3\u05D4', 'caldo verde')"],
  ["f('עידan הגילויים', 'Age of Discovery')", "f('\u05E2\u05D9\u05D3\u05DF \u05D4\u05D2\u05D9\u05DC\u05D5\u05D9\u05D9\u05DD', 'Age of Discovery')"],
  ["f('Vasco da Gama', 'Vasco da Gama'), f('Fernando Pessoa', 'Fernando Pessoa')", "f('\u05D5\u05D0\u05E1\u05D5 \u05D3\u05D4 \u05D2\u05D0\u05DE\u05D4', 'Vasco da Gama'), f('\u05E4\u05E8\u05E0\u05D0\u05E0\u05D3\u05D5 \u05E4\u05E1\u05D5\u05D0\u05D4', 'Fernando Pessoa')"],
  ["f('כדורי בשר שvedיים', 'Swedish meatballs'), f('gravlax', 'gravlax'), f('לחman קינamon', 'cinnamon bun')", "f('\u05DB\u05D3\u05D5\u05E8\u05D9 \u05D1\u05E9\u05E8 \u05E9\u05D5\u05D5\u05D3\u05D9\u05D9\u05DD', 'Swedish meatballs'), f('\u05D2\u05E8\u05D0\u05D1\u05DC\u05D0\u05E7\u05E1', 'gravlax'), f('\u05DC\u05D7\u05DE\u05DF \u05E7\u05D9\u05E0\u05D0\u05DE\u05D5\u05DF', 'cinnamon bun')"],
  ["f('פרס Nobel', 'Nobel Prize'), f('איחוד עם נorway', 'Union with Norway era')", "f('\u05E4\u05E8\u05E1 \u05E0\u05D5\u05D1\u05DC', 'Nobel Prize'), f('\u05D0\u05D9\u05D7\u05D5\u05D3 \u05E2\u05DD \u05E0\u05D5\u05E8\u05D5\u05D5\u05D2\u05D9\u05D4', 'Union with Norway era')"],
  ["f('Alfred Nobel', 'Alfred Nobel'), f('ABBA', 'ABBA')", "f('\u05D0\u05DC\u05E4\u05E8\u05D3 \u05E0\u05D5\u05D1\u05DC', 'Alfred Nobel'), f('\u05D0\u05D1\u05D1\u05D0', 'ABBA')"],
  ["f('pho', 'pho'), f('banh mi', 'banh mi')", "f('\u05E4\u05D5', 'pho'), f('\u05D1\u05D0\u05DF \u05DE\u05D9', 'banh mi')"],
  ["f('מלchamת וietnam', 'Vietnam War')", "f('\u05DE\u05DC\u05D7\u05DE\u05EA \u05D5\u05D9\u05D0\u05D8\u05E0\u05D0\u05DD', 'Vietnam War')"],
  ["f('Ho Chi Minh', 'Ho Chi Minh'), f('האחיות Trung', 'Trung Sisters')", "f('\u05D4\u05D5 \u05E6\u05F3\u05D9 \u05DE\u05D9\u05DF', 'Ho Chi Minh'), f('\u05D4\u05D0\u05D7\u05D9\u05D5\u05EA \u05D8\u05E8\u05D5\u05E0\u05D2', 'Trung Sisters')"],
  ["f('ugali', 'ugali'), f('nyama choma', 'nyama choma'), f('sukuma wiki', 'sukuma wiki')", "f('\u05D0\u05D5\u05D2\u05D0\u05DC\u05D9', 'ugali'), f('\u05E0\u05D9\u05D0\u05DE\u05D4 \u05E6\u05F3\u05D5\u05DE\u05D4', 'nyama choma'), f('\u05E1\u05D5\u05E7\u05D5\u05DE\u05D4 \u05D5\u05D9\u05E7\u05D9', 'sukuma wiki')"],
  ["f('מאבק העצmaאות', 'Independence struggle')", "f('\u05DE\u05D0\u05D1\u05E7 \u05D4\u05E2\u05E6\u05DE\u05D0\u05D5\u05EA', 'Independence struggle')"],
  ["f('Wangari Maathai', 'Wangari Maathai'), f('Jomo Kenyatta', 'Jomo Kenyatta')", "f('\u05D5\u05D0\u05E0\u05D2\u05E8\u05D9 \u05DE\u05D0\u05EA\u05D0\u05D9', 'Wangari Maathai'), f('\u05D2\u05F3\u05D5\u05DE\u05D5 \u05E7\u05E0\u05D9\u05D0\u05D8\u05D4', 'Jomo Kenyatta')"],
  ["f('kimchi', 'kimchi'), f('bibimbap', 'bibimbap'), f('ברbecue קoreani', 'Korean barbecue')", "f('\u05E7\u05D9\u05DE\u05E6\u05F3\u05D9', 'kimchi'), f('\u05D1\u05D9\u05D1\u05D9\u05DE\u05D1\u05D0\u05E4', 'bibimbap'), f('\u05D1\u05E8\u05D1\u05E7\u05D9\u05D5 \u05E7\u05D5\u05E8\u05D0\u05D9', 'Korean barbecue')"],
  ["f('אולימpiada בסoul', 'Seoul Olympics'), f('גל ה-K', 'Korean Wave')", "f('\u05D0\u05D5\u05DC\u05D9\u05DE\u05E4\u05D9\u05D0\u05D3\u05D4 \u05D1\u05E1\u05D0\u05D5\u05DC', 'Seoul Olympics'), f('\u05D2\u05DC \u05D4\u05E7\u05F3\u05D9', 'Korean Wave')"],
  ["f('King Sejong', 'King Sejong'), f('Ban Ki-moon', 'Ban Ki-moon')", "f('\u05D4\u05DE\u05DC\u05DA \u05E1\u05D2\u05D5\u05E0\u05D2', 'King Sejong'), f('\u05D1\u05DF \u05E7\u05D9 \u05DE\u05D5\u05DF', 'Ban Ki-moon')"],
])
