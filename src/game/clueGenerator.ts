import {
  pickRichClueForCity,
  pickRichClueForWrongCity,
  richClueToDisplay,
} from '../data/richDestinationClues'
import {
  collectUsedClueCategories,
  collectUsedEnglishWords,
  type ClueCategory,
} from './clueVariety'
import type { Clue, GameData, Suspect, SuspectTrait } from './types'

const SUSPECT_TRAITS: SuspectTrait[] = ['hair', 'hobby', 'vehicle', 'gender', 'build']

const TRAIT_CLUE_TEMPLATES: Record<SuspectTrait, ((value: string) => string)[]> = {
  hair: [
    (v) => `העד זוכר שיער ${v}.`,
    (v) => `ראיתי אדם עם שיער ${v}.`,
    (v) => `החשוד תואר עם שיער ${v}.`,
  ],
  hobby: [
    (v) => `החשוד דיבר על ${v}.`,
    (v) => `נראה שהחשוד מתעניין ב${v}.`,
    (v) => `העד שמע את החשוד מזכיר ${v}.`,
  ],
  vehicle: [
    (v) => `ראיתי ${v} בורח מהזירה.`,
    (v) => `החשוד נראה עם ${v}.`,
    (v) => `העד זיהה ${v} ליד מקום הבריחה.`,
  ],
  gender: [
    (v) => `העד תיאר ${v}.`,
    (v) => `נראה שהחשוד הוא ${v}.`,
  ],
  build: [
    (v) => `העד תיאר מבנה גוף ${v}.`,
    (v) => `החשוד נראה ${v}.`,
    (v) => `מישהו ${v} נראה רץ מהמקום.`,
  ],
}

function pickSuspectTrait(
  suspect: Suspect,
  activePool: Suspect[],
  usedTraits: Set<SuspectTrait>,
): SuspectTrait {
  const available = SUSPECT_TRAITS.filter((t) => !usedTraits.has(t))
  const candidates = available.length > 0 ? available : SUSPECT_TRAITS
  const revealedTraits = [...usedTraits]

  const weights = candidates.map((trait) => {
    const traitsToCheck = [...revealedTraits, trait]
    const matchCount = activePool.filter((s) =>
      traitsToCheck.every((t) => s[t] === suspect[t]),
    ).length
    return { trait, weight: matchCount * matchCount }
  })
  const total = weights.reduce((sum, w) => sum + w.weight, 0)
  let roll = Math.random() * total
  for (const { trait, weight } of weights) {
    roll -= weight
    if (roll <= 0) return trait
  }
  return weights[weights.length - 1]!.trait
}

function pickSuspectText(trait: SuspectTrait, value: string, usedTexts: Set<string>): string {
  const templates = TRAIT_CLUE_TEMPLATES[trait]
  const available = templates
    .map((fn) => fn(value))
    .filter((t) => !usedTexts.has(t))
  const pickFrom = available.length > 0 ? available : templates.map((fn) => fn(value))
  return pickFrom[Math.floor(Math.random() * pickFrom.length)]!
}

export function generateClueForDestination(
  data: GameData,
  fromCityId: string,
  destinationCityId: string,
  siteId: string,
  usedTexts: Set<string>,
  usedCategories: Set<ClueCategory>,
  usedEnglish: Set<string>,
  slotIndex: number,
): Clue {
  const destinationCity = data.cities.find((c) => c.id === destinationCityId)
  const entry = data.almanac.find((a) => a.id === destinationCity?.countryId)
  if (!destinationCity || !entry) {
    throw new Error('Invalid destination for clue generation')
  }

  const template = pickRichClueForCity(
    destinationCityId,
    usedTexts,
    usedCategories,
    usedEnglish,
    destinationCity,
    entry,
  )
  const rich = template
    ? richClueToDisplay(template, destinationCity, entry)
    : {
        dedupeKey: `${destinationCityId}-fallback-${slotIndex}`,
        text: 'החשוד השאיל שאלות על יעד מסתורי.',
        segments: [{ type: 'he' as const, text: 'החשוד השאיל שאלות על יעד מסתורי.' }],
        targetCountryId: entry.id,
      }

  return {
    id: `${fromCityId}-${siteId}-${destinationCityId}-${slotIndex}`,
    type: 'landmark',
    text: rich.text,
    segments: rich.segments,
    dedupeKey: rich.dedupeKey,
    targetCountryId: rich.targetCountryId || entry.id,
    targetCityId: destinationCity.id,
    siteId,
    cityId: fromCityId,
  }
}

export function generateWrongCityClue(
  data: GameData,
  cityId: string,
  siteId: string,
  usedTexts: Set<string>,
  usedCategories: Set<ClueCategory>,
  usedEnglish: Set<string>,
  slotIndex: number,
): Clue {
  const city = data.cities.find((c) => c.id === cityId)
  const wrongCountries = data.almanac.filter((a) => a.id !== city?.countryId)
  const wrongCountry = wrongCountries[Math.floor(Math.random() * wrongCountries.length)]!
  const wrongCity = data.cities.find((c) => c.countryId === wrongCountry.id)

  const template = pickRichClueForWrongCity(cityId, usedTexts, usedCategories, usedEnglish)
  const targetCity =
    data.cities.find((c) => c.countryId === template.countryId) ?? wrongCity
  const targetEntry = data.almanac.find((a) => a.id === template.countryId)

  const rich = targetCity && targetEntry
    ? richClueToDisplay(template, targetCity, targetEntry)
    : {
        dedupeKey: template.id,
        text: template.segments.map((s) => (s.type === 'he' ? s.text : s.type === 'en' ? s.word : '')).join(''),
        segments: template.segments,
        targetCountryId: template.countryId || wrongCountry.id,
      }

  return {
    id: `${cityId}-${siteId}-wrong-${template.countryId}-${slotIndex}`,
    type: 'landmark',
    text: rich.text,
    segments: rich.segments,
    dedupeKey: rich.dedupeKey,
    targetCountryId: template.countryId || wrongCountry.id,
    targetCityId: wrongCity?.id,
    siteId,
    cityId,
  }
}

export function generateSuspectClue(
  suspect: Suspect,
  siteId: string,
  cityId: string,
  usedTexts: Set<string>,
  usedTraits: Set<SuspectTrait>,
  activePool: Suspect[] = [suspect],
): Clue {
  const trait = pickSuspectTrait(suspect, activePool, usedTraits)
  const value = suspect[trait]
  const text = pickSuspectText(trait, value, usedTexts)

  return {
    id: `${cityId}-${siteId}-suspect-${trait}`,
    type: 'suspect',
    text,
    targetCountryId: '',
    siteId,
    cityId,
    suspectTrait: trait,
    suspectTraitValue: value,
  }
}

export { collectUsedClueCategories, collectUsedEnglishWords }
