import { clueVocabulary } from './clueVocabulary'
import { getCurrencyShort } from './currencyEn'
import { gameData } from './gameData'

const lookup = new Map<string, string>()

function add(en: string, he: string) {
  if (!en || !he) return
  lookup.set(en.toLowerCase().trim(), he)
}

for (const entry of gameData.almanac) {
  add(entry.languageEn, entry.language)
  add(entry.currencyEn, entry.currency)
  add(getCurrencyShort(entry.id), entry.currency)
  add(entry.landmark, entry.landmark)
  for (const site of entry.mainSites) add(site.nameEn, site.name)
  for (const city of entry.majorCities) add(city.nameEn, city.name)
}

const GREETINGS: Record<string, string> = {
  shalom: 'שלום',
  bonjour: 'שלום',
  salaam: 'שלום',
  konnichiwa: 'שלום',
  hello: 'שלום',
  hi: 'שלום',
  'guten tag': 'שלום',
  hola: 'שלום',
  gday: 'שלום',
  namaste: 'שלום',
  hallo: 'שלום',
  ciao: 'שלום',
  privet: 'שלום',
  'ni hao': 'שלום',
  sawadee: 'שלום',
  yassas: 'שלום',
  howzit: 'שלום',
}

for (const [en, he] of Object.entries(GREETINGS)) add(en, he)
for (const [en, he] of Object.entries(clueVocabulary)) add(en, he)

export function hasHebrewTranslation(word: string, countryId?: string): boolean {
  const he = getHebrewForEnglish(word, countryId)
  return he !== word && /[\u0590-\u05FF]/.test(he)
}

export function getHebrewForEnglish(word: string, countryId?: string): string {
  const key = word.toLowerCase().trim()

  const vocabHit = clueVocabulary[key]
  if (vocabHit) return vocabHit

  if (countryId) {
    const entry = gameData.almanac.find((a) => a.id === countryId)
    if (entry) {
      if (key === entry.languageEn.toLowerCase()) return entry.language
      if (key === getCurrencyShort(countryId).toLowerCase()) return entry.currency
      const site = entry.mainSites.find((s) => s.nameEn.toLowerCase() === key)
      if (site) return site.name
    }
  }
  return lookup.get(key) ?? word
}

export function getCurrencyHebrew(countryId: string): string {
  return gameData.almanac.find((a) => a.id === countryId)?.currency ?? getCurrencyShort(countryId)
}
