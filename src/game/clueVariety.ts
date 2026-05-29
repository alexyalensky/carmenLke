import type { AlmanacEntry, City, Clue, ClueSegment } from './types'
import {
  extractEnglishWords,
  pickSafeFact,
  sanitizeDestinationClue,
  siteMentionsCity,
} from './clueSanitize'
import { segmentsToPlainText } from '../utils/clueSegments'

export interface RichClueTemplate {
  id: string
  countryId: string
  segments: ClueSegment[]
}

export type ClueCategory =
  | 'flag'
  | 'currency'
  | 'language'
  | 'landmark'
  | 'neighbor'
  | 'capital'
  | 'cultural'

const LANGUAGE_EN_WORDS = new Set([
  'hebrew', 'french', 'arabic', 'japanese', 'english', 'german', 'spanish',
  'portuguese', 'hindi', 'turkish', 'italian', 'russian', 'mandarin', 'chinese',
  'thai', 'greek', 'dutch',
])

const CURRENCY_EN_WORDS = new Set([
  'shekel', 'yen', 'euro', 'dollar', 'pound', 'peso', 'real', 'lira',
  'rupee', 'ruble', 'yuan', 'baht', 'rand',
])

const GREETING_EN_WORDS = new Set([
  'shalom', 'bonjour', 'salaam', 'konnichiwa', 'hello', 'hi', 'guten tag',
  'hola', 'gday', 'namaste', 'hallo', 'ciao', 'privet', 'ni hao', 'sawadee',
  'yassas', 'howzit',
])

const ONCE_PER_CASE: Set<ClueCategory> = new Set([
  'flag', 'currency', 'language', 'capital', 'neighbor',
])

/** Flag clues must stand alone — only Hebrew + flag image, no English/currency mixed in */
export function templateMixesFlagWithOtherClues(segments: ClueSegment[]): boolean {
  const hasFlag = segments.some((s) => s.type === 'flag')
  if (!hasFlag) return false
  return segments.some((s) => s.type === 'en' || s.type === 'currency')
}

const he = (text: string): ClueSegment => ({ type: 'he', text })
const en = (word: string, speak?: string): ClueSegment => ({ type: 'en', word, speak })
const flag = (countryId: string): ClueSegment => ({ type: 'flag', countryId })
const cur = (countryId: string): ClueSegment => ({ type: 'currency', countryId })

function pickRandom<T>(items: T[]): T | undefined {
  if (!items.length) return undefined
  return items[Math.floor(Math.random() * items.length)]
}

function pickCapitalRouteHint(entry: AlmanacEntry, city: City): string | null {
  if (entry.capital !== city.name) {
    return `שאל על הדרך ל${entry.capital}.`
  }

  const alternatives = entry.majorCities.filter(
    (mc) =>
      mc.name !== city.name &&
      mc.nameEn.toLowerCase() !== city.nameEn.toLowerCase() &&
      !mc.name.includes(city.name) &&
      !(city.nameEn.length > 3 && mc.nameEn.toLowerCase().includes(city.nameEn.toLowerCase())),
  )
  const hint = pickRandom(alternatives)
  if (!hint) return null
  return `שאל על הדרך ל${hint.name}.`
}

export function isVagueDestinationClue(segments: ClueSegment[]): boolean {
  const text = segmentsToPlainText(segments).trim()
  return /^שאל על הדרך לבירה\.?$/.test(text)
}

export function getClueCategories(segments: ClueSegment[]): Set<ClueCategory> {
  const cats = new Set<ClueCategory>()
  for (const s of segments) {
    if (s.type === 'flag') cats.add('flag')
    if (s.type === 'currency') cats.add('currency')
    if (s.type === 'en') {
      const w = s.word.toLowerCase()
      if (LANGUAGE_EN_WORDS.has(w) || w.includes('english') || w.includes('dutch')) {
        cats.add('language')
      }
      if (CURRENCY_EN_WORDS.has(w)) cats.add('currency')
      if (GREETING_EN_WORDS.has(w)) cats.add('language')
    }
    if (s.type === 'he') {
      if (/מטבע:/.test(s.text)) cats.add('currency')
      if (/שכנות:/.test(s.text)) cats.add('neighbor')
      if (/בירה|דרך ל/.test(s.text)) cats.add('capital')
      if (/אתר מפורסם:|תיאר את/.test(s.text)) cats.add('landmark')
      if (/— בירתה |השפה /.test(s.text)) cats.add('language')
    }
  }
  if (segments.some((s) => s.type === 'en')) cats.add('cultural')
  if (segments.some((s) => s.type === 'he' && /גבול|שכנ/.test(s.text))) cats.add('neighbor')
  if (segments.some((s) => s.type === 'he' && /בירה|דרך ל/.test(s.text))) cats.add('capital')
  if (segments.some((s) => s.type === 'he' && /תיאר את|אתר|מקדש|פירמיד|חומת|מגדל|ארמון/.test(s.text))) {
    cats.add('landmark')
  }
  return cats
}

export function collectUsedClueTexts(clues: Clue[]): Set<string> {
  const texts = new Set<string>()
  for (const clue of clues) {
    if (clue.dedupeKey) texts.add(clue.dedupeKey)
    texts.add(clue.text)
    if (clue.segments?.length) texts.add(segmentsToPlainText(clue.segments))
    const factMatch = clue.text.match(/העד סיפר: "([^"]+)"/)
    if (factMatch) texts.add(factMatch[1]!)
  }
  return texts
}

export function collectUsedFacts(clues: Clue[]): Set<string> {
  const facts = new Set<string>()
  for (const clue of clues) {
    const factMatch = clue.text.match(/העד סיפר: "([^"]+)"/)
    if (factMatch) facts.add(factMatch[1]!)
  }
  return facts
}

/** True when a clue meaningfully points toward a destination country/city */
export function isStrongDestinationClue(clue: Clue): boolean {
  if (!clue.segments?.length) return false
  const cats = getClueCategories(clue.segments)
  if (cats.has('landmark') || cats.has('flag')) return true
  return clue.segments.some((s) => {
    if (s.type !== 'en') return false
    const w = s.word.toLowerCase()
    return (
      !LANGUAGE_EN_WORDS.has(w) &&
      !CURRENCY_EN_WORDS.has(w) &&
      !GREETING_EN_WORDS.has(w) &&
      w.length > 3
    )
  })
}

export function collectUsedClueCategories(clues: Clue[]): Set<ClueCategory> {
  const used = new Set<ClueCategory>()
  for (const clue of clues) {
    if (clue.type !== 'landmark') continue
    if (clue.segments?.length) {
      for (const cat of getClueCategories(clue.segments)) used.add(cat)
    }
    if (/מטבע:/.test(clue.text)) used.add('currency')
    if (/שכנות:/.test(clue.text)) used.add('neighbor')
    if (/אתר מפורסם:/.test(clue.text)) used.add('landmark')
    if (/— בירתה |השפה /.test(clue.text)) used.add('language')
  }
  return used
}

export function collectUsedEnglishWords(clues: Clue[]): Set<string> {
  const words = new Set<string>()
  for (const clue of clues) {
    if (clue.type !== 'landmark' || !clue.segments?.length) continue
    for (const w of extractEnglishWords(clue.segments)) words.add(w)
  }
  return words
}

function normalizePlaceKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/[''`.׳\u05F3]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Equivalent EN/HE names for the same landmark or site (merged when keys overlap) */
export function buildPlaceGroups(entry: AlmanacEntry): string[][] {
  const raw: string[][] = [[entry.landmark]]
  for (const site of entry.mainSites) {
    raw.push([site.nameEn, site.name])
  }

  const parent = raw.map((_, i) => i)
  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]]!
      i = parent[i]!
    }
    return i
  }
  const union = (a: number, b: number) => {
    const ra = find(a)
    const rb = find(b)
    if (ra !== rb) parent[rb] = ra
  }

  const keyToIndex = new Map<string, number>()
  for (let i = 0; i < raw.length; i++) {
    for (const key of raw[i]!.map(normalizePlaceKey).filter((k) => k.length > 1)) {
      const prev = keyToIndex.get(key)
      if (prev !== undefined) union(i, prev)
      else keyToIndex.set(key, i)
    }
  }

  const merged = new Map<number, Set<string>>()
  for (let i = 0; i < raw.length; i++) {
    const root = find(i)
    if (!merged.has(root)) merged.set(root, new Set())
    for (const key of raw[i]!.map(normalizePlaceKey).filter((k) => k.length > 1)) {
      merged.get(root)!.add(key)
    }
  }

  return [...merged.values()].map((s) => [...s])
}

/** Place groups already mentioned by witnesses in this city */
export function collectUsedPlaceGroups(
  clues: Clue[],
  cityId: string,
  entry: AlmanacEntry,
): Set<number> {
  const groups = buildPlaceGroups(entry)
  const used = new Set<number>()
  const cityClues = clues.filter((c) => c.cityId === cityId && c.type === 'landmark')

  for (const clue of cityClues) {
    if (!clue.segments?.length) continue
    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi]!
      for (const seg of clue.segments) {
        if (seg.type === 'en' && group.includes(normalizePlaceKey(seg.word))) {
          used.add(gi)
        }
        if (seg.type === 'he') {
          const text = normalizePlaceKey(seg.text)
          for (const key of group) {
            if (key.length > 2 && text.includes(key)) used.add(gi)
          }
        }
      }
    }
  }

  return used
}

export function templateUsesPlaceGroup(
  segments: ClueSegment[],
  entry: AlmanacEntry,
  usedPlaceGroups: Set<number>,
): boolean {
  if (!usedPlaceGroups.size) return false
  const groups = buildPlaceGroups(entry)

  for (const gi of usedPlaceGroups) {
    const group = groups[gi]
    if (!group) continue
    for (const seg of segments) {
      if (seg.type === 'en' && group.includes(normalizePlaceKey(seg.word))) return true
      if (seg.type === 'he') {
        const text = normalizePlaceKey(seg.text)
        for (const key of group) {
          if (key.length > 2 && text.includes(key)) return true
        }
        if (/תיאר את/.test(seg.text) && group.includes(normalizePlaceKey(entry.landmark))) {
          return true
        }
      }
    }
  }
  return false
}

export function collectCityUsedCategories(clues: Clue[], cityId: string): Set<ClueCategory> {
  return collectUsedClueCategories(
    clues.filter((c) => c.cityId === cityId && c.type === 'landmark'),
  )
}

/** Categories that may appear at most once per city visit */
const CITY_ONCE_CATEGORIES: Set<ClueCategory> = new Set([
  'landmark',
  'neighbor',
  'capital',
  'flag',
  'currency',
  'language',
])

function categoryBlockedForPick(
  cats: Set<ClueCategory>,
  globalUsed: Set<ClueCategory>,
  cityUsed: Set<ClueCategory>,
): boolean {
  for (const cat of cats) {
    if (ONCE_PER_CASE.has(cat) && globalUsed.has(cat)) return true
    if (CITY_ONCE_CATEGORIES.has(cat) && cityUsed.has(cat)) return true
  }
  return false
}

function templateWeakness(template: RichClueTemplate): number {
  if (template.id.includes('-fact')) return 50
  const cats = getClueCategories(template.segments)
  if (template.id.includes('-site-') || template.id.includes('-landmark')) return 0
  if (template.id.includes('-flag')) return 2
  if (cats.has('landmark')) return 1
  if (cats.has('cultural')) return 4
  if (cats.has('capital') || cats.has('neighbor')) return 6
  if (cats.has('language')) return 8
  if (cats.has('currency')) return 10
  return 5
}

function scoreTemplate(
  template: RichClueTemplate,
  globalUsed: Set<ClueCategory>,
  cityUsed: Set<ClueCategory>,
  usedEnglish: Set<string>,
  usedTexts: Set<string>,
  entry?: AlmanacEntry,
  usedPlaceGroups?: Set<number>,
): number {
  const cats = getClueCategories(template.segments)
  if (categoryBlockedForPick(cats, globalUsed, cityUsed)) return Infinity
  if (templateMixesFlagWithOtherClues(template.segments)) return Infinity
  if (isVagueDestinationClue(template.segments)) return Infinity
  if (entry && usedPlaceGroups && templateUsesPlaceGroup(template.segments, entry, usedPlaceGroups)) {
    return Infinity
  }

  const preview = segmentsToPlainText(template.segments)
  if (usedTexts.has(preview) || usedTexts.has(template.id)) return Infinity

  let score = Math.random() * 10 + templateWeakness(template)
  if (cats.has('flag') && globalUsed.has('flag')) score += 30
  if (cats.has('currency') && globalUsed.has('currency')) score += 35
  if (cats.has('language') && globalUsed.has('language')) score += 28
  if (cats.has('cultural') && cityUsed.has('cultural')) score += 20

  for (const w of extractEnglishWords(template.segments)) {
    if (usedEnglish.has(w)) score += 12
  }

  const enCount = template.segments.filter((s) => s.type === 'en').length
  if (enCount > 2) score += 6

  return score
}

export function pickVariedTemplate(
  pool: RichClueTemplate[],
  usedKeys: Set<string>,
  globalUsed: Set<ClueCategory>,
  cityUsed: Set<ClueCategory>,
  usedEnglish: Set<string>,
  usedTexts: Set<string> = new Set(),
  entry?: AlmanacEntry,
  usedPlaceGroups?: Set<number>,
): RichClueTemplate | null {
  if (!pool.length) return null

  const available = pool.filter((t) => {
    if (usedKeys.has(t.id)) return false
    const preview = segmentsToPlainText(t.segments)
    return !usedTexts.has(preview)
  })
  const pickFrom =
    available.length > 0
      ? available
      : pool.filter((t) => !usedTexts.has(segmentsToPlainText(t.segments)))

  const ranked = pickFrom
    .map((t) => ({
      t,
      score: scoreTemplate(
        t,
        globalUsed,
        cityUsed,
        usedEnglish,
        usedTexts,
        entry,
        usedPlaceGroups,
      ),
    }))
    .filter((x) => x.score < Infinity)
    .sort((a, b) => a.score - b.score)

  if (!ranked.length) return null
  const top = ranked.slice(0, Math.min(3, ranked.length))
  return pickRandom(top)!.t
}

function buildDynamicStyles(
  city: City,
  entry: AlmanacEntry,
  globalUsed: Set<ClueCategory>,
  cityUsed: Set<ClueCategory>,
  usedFacts: Set<string>,
  usedPlaceGroups: Set<number>,
): RichClueTemplate[] {
  const styles: RichClueTemplate[] = []
  const safeSites = entry.mainSites.filter((s) => !siteMentionsCity(s.nameEn, city))
  const groups = buildPlaceGroups(entry)

  const siteGroupUsed = (site: { nameEn: string; name: string }) => {
    const gi = groups.findIndex((g) => g.includes(normalizePlaceKey(site.nameEn)))
    return gi >= 0 && usedPlaceGroups.has(gi)
  }

  const landmarkGroupUsed = usedPlaceGroups.has(
    groups.findIndex((g) => g.includes(normalizePlaceKey(entry.landmark))),
  )

  if (!landmarkGroupUsed) {
    styles.push({
      id: `dyn-${entry.id}-landmark-he`,
      countryId: entry.id,
      segments: [he(`העד תיאר את ${entry.landmark}.`)],
    })
  }

  for (const site of safeSites.slice(0, 4)) {
    if (siteGroupUsed(site)) continue
    styles.push({
      id: `dyn-${entry.id}-site-${site.nameEn.replace(/\s+/g, '-').toLowerCase()}`,
      countryId: entry.id,
      segments: [he('שמעתי אותו מזכיר '), en(site.nameEn), he('.')],
    })
  }

  if (!cityUsed.has('flag')) {
    styles.push({
      id: `dyn-${entry.id}-flag-postcard`,
      countryId: entry.id,
      segments: [he('גלויה עם דגל: '), flag(entry.id)],
    })
    styles.push({
      id: `dyn-${entry.id}-flag-luggage`,
      countryId: entry.id,
      segments: [he('מדבקת דגל על המזוודה — '), flag(entry.id)],
    })
    styles.push({
      id: `dyn-${entry.id}-flag-shirt`,
      countryId: entry.id,
      segments: [he('החשוד לבש חולצה עם דגל '), flag(entry.id), he('.')],
    })
    styles.push({
      id: `dyn-${entry.id}-flag-hat`,
      countryId: entry.id,
      segments: [he('ראו את החשוד עם כובע שעליו '), flag(entry.id), he('.')],
    })
    styles.push({
      id: `dyn-${entry.id}-flag-cap`,
      countryId: entry.id,
      segments: [he('על כובע הבייסבול היה רקום '), flag(entry.id), he('.')],
    })
  }

  if (!cityUsed.has('capital') && !globalUsed.has('capital')) {
    const capitalText = pickCapitalRouteHint(entry, city)
    if (capitalText) {
      styles.push({
        id: `dyn-${entry.id}-capital`,
        countryId: entry.id,
        segments: [he(capitalText)],
      })
    }
  }

  const neighbor = pickRandom(entry.neighbors)
  if (neighbor && !cityUsed.has('neighbor') && !globalUsed.has('neighbor')) {
    styles.push({
      id: `dyn-${entry.id}-neighbor`,
      countryId: entry.id,
      segments: [he(`דיבר על גבול עם ${neighbor}.`)],
    })
  }

  const fact = pickSafeFact(entry, city, usedFacts)
  if (fact) {
    const trimmed = fact.length > 72 ? `${fact.slice(0, 69)}…` : fact
    styles.push({
      id: `dyn-${entry.id}-fact-${trimmed.slice(0, 24)}`,
      countryId: entry.id,
      segments: [he(`העד סיפר: "${trimmed}"`)],
    })
  }

  if (!cityUsed.has('currency') && !globalUsed.has('currency')) {
    styles.push({
      id: `dyn-${entry.id}-currency`,
      countryId: entry.id,
      segments: [he('שילם ב'), cur(entry.id), he(' בחנות.')],
    })
  }

  if (!cityUsed.has('language') && !globalUsed.has('language')) {
    styles.push({
      id: `dyn-${entry.id}-language`,
      countryId: entry.id,
      segments: [he('דיבר '), en(entry.languageEn), he(' עם המוכר.')],
    })
  }

  return styles.filter((s) => !categoryBlockedForPick(getClueCategories(s.segments), globalUsed, cityUsed))
}

/** Informative clue when sanitization removes all segments (never the vague placeholder). */
function buildInformativeFallback(
  entry: AlmanacEntry,
  countryId: string,
  city: City,
  usedFacts: Set<string>,
  usedPlaceGroups: Set<number>,
): ClueSegment[] {
  const groups = buildPlaceGroups(entry)
  const site = pickRandom(
    entry.mainSites.filter(
      (s) =>
        !siteMentionsCity(s.nameEn, city) &&
        !usedPlaceGroups.has(groups.findIndex((g) => g.includes(normalizePlaceKey(s.nameEn)))),
    ),
  )
  const fact = pickSafeFact(entry, city, usedFacts)
  const landmarkGi = groups.findIndex((g) => g.includes(normalizePlaceKey(entry.landmark)))

  const options: ClueSegment[][] = [
    [he('גלויה עם דגל: '), flag(countryId)],
    [he('מדבקת דגל על המזוודה — '), flag(countryId)],
    [he('החשוד לבש חולצה עם דגל '), flag(countryId), he('.')],
    [he('ראו את החשוד עם כובע שעליו '), flag(countryId), he('.')],
  ]

  if (landmarkGi < 0 || !usedPlaceGroups.has(landmarkGi)) {
    options.push([he(`העד תיאר את ${entry.landmark}.`)])
  }
  if (site) {
    options.push([he('שמעתי אותו מזכיר '), en(site.nameEn), he('.')])
  }
  if (fact) {
    const trimmed = fact.length > 72 ? `${fact.slice(0, 69)}…` : fact
    options.push([he(`העד סיפר: "${trimmed}"`)])
  }

  return pickRandom(options) ?? [he('דיבר '), en(entry.languageEn), he(' עם המוכר.')]
}

export function buildDynamicDestinationClue(
  city: City,
  entry: AlmanacEntry,
  usedKeys: Set<string>,
  globalUsed: Set<ClueCategory>,
  cityUsed: Set<ClueCategory>,
  usedEnglish: Set<string>,
  usedTexts: Set<string> = new Set(),
  usedFacts: Set<string> = new Set(),
  usedPlaceGroups: Set<number> = new Set(),
): RichClueTemplate | null {
  const styles = buildDynamicStyles(city, entry, globalUsed, cityUsed, usedFacts, usedPlaceGroups)
  return pickVariedTemplate(
    styles,
    usedKeys,
    globalUsed,
    cityUsed,
    usedEnglish,
    usedTexts,
    entry,
    usedPlaceGroups,
  )
}

export function finalizeClueTemplate(
  template: RichClueTemplate,
  city: City,
  entry: AlmanacEntry,
  usedFacts: Set<string> = new Set(),
  usedPlaceGroups: Set<number> = new Set(),
): RichClueTemplate {
  let segments = sanitizeDestinationClue(template.segments, city)
  if (!segments.length || isVagueDestinationClue(segments)) {
    segments = buildInformativeFallback(entry, template.countryId, city, usedFacts, usedPlaceGroups)
  }
  return {
    ...template,
    segments,
  }
}
