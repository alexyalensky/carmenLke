import type { AlmanacEntry, City, Clue, ClueSegment } from './types'
import { extractEnglishWords, sanitizeDestinationClue, siteMentionsCity } from './clueSanitize'

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

const he = (text: string): ClueSegment => ({ type: 'he', text })
const en = (word: string, speak?: string): ClueSegment => ({ type: 'en', word, speak })
const flag = (countryId: string): ClueSegment => ({ type: 'flag', countryId })
const cur = (countryId: string): ClueSegment => ({ type: 'currency', countryId })

function pickRandom<T>(items: T[]): T | undefined {
  if (!items.length) return undefined
  return items[Math.floor(Math.random() * items.length)]
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
  }
  if (segments.some((s) => s.type === 'en')) cats.add('cultural')
  if (segments.some((s) => s.type === 'he' && /גבול|שכנ/.test(s.text))) cats.add('neighbor')
  if (segments.some((s) => s.type === 'he' && /בירה|דרך ל/.test(s.text))) cats.add('capital')
  if (segments.some((s) => s.type === 'he' && /תיאר את|אתר|מקדש|פירמיד|חומת|מגדל|ארמון/.test(s.text))) {
    cats.add('landmark')
  }
  return cats
}

export function collectUsedClueCategories(clues: Clue[]): Set<ClueCategory> {
  const used = new Set<ClueCategory>()
  for (const clue of clues) {
    if (clue.type !== 'landmark' || !clue.segments?.length) continue
    for (const cat of getClueCategories(clue.segments)) used.add(cat)
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

function categoryBlocked(cats: Set<ClueCategory>, used: Set<ClueCategory>): boolean {
  for (const cat of cats) {
    if (ONCE_PER_CASE.has(cat) && used.has(cat)) return true
  }
  return false
}

function scoreTemplate(
  template: RichClueTemplate,
  usedCategories: Set<ClueCategory>,
  usedEnglish: Set<string>,
): number {
  const cats = getClueCategories(template.segments)
  if (categoryBlocked(cats, usedCategories)) return Infinity

  let score = Math.random() * 14
  if (cats.has('flag') && usedCategories.has('flag')) score += 30
  if (cats.has('currency') && usedCategories.has('currency')) score += 35
  if (cats.has('language') && usedCategories.has('language')) score += 28
  if (cats.has('cultural') && usedCategories.has('cultural')) score += 10

  for (const w of extractEnglishWords(template.segments)) {
    if (usedEnglish.has(w)) score += 8
  }

  const enCount = template.segments.filter((s) => s.type === 'en').length
  if (enCount > 2) score += 6

  return score
}

export function pickVariedTemplate(
  pool: RichClueTemplate[],
  usedKeys: Set<string>,
  usedCategories: Set<ClueCategory>,
  usedEnglish: Set<string>,
): RichClueTemplate | null {
  if (!pool.length) return null

  const available = pool.filter((t) => !usedKeys.has(t.id))
  const pickFrom = available.length > 0 ? available : pool

  const ranked = pickFrom
    .map((t) => ({ t, score: scoreTemplate(t, usedCategories, usedEnglish) }))
    .filter((x) => x.score < Infinity)
    .sort((a, b) => a.score - b.score)

  if (!ranked.length) return null
  const top = ranked.slice(0, Math.min(3, ranked.length))
  return pickRandom(top)!.t
}

function buildDynamicStyles(
  city: City,
  entry: AlmanacEntry,
  usedCategories: Set<ClueCategory>,
): RichClueTemplate[] {
  const styles: RichClueTemplate[] = []
  const safeSites = entry.mainSites.filter((s) => !siteMentionsCity(s.nameEn, city))

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
    segments: [flag(entry.id), he(' רקום על החולצה.')],
  })

  styles.push({
    id: `dyn-${entry.id}-landmark-he`,
    countryId: entry.id,
    segments: [he(`העד תיאר את ${entry.landmark}.`)],
  })

  for (const site of safeSites.slice(0, 4)) {
    styles.push({
      id: `dyn-${entry.id}-site-${site.nameEn.replace(/\s+/g, '-').toLowerCase()}`,
      countryId: entry.id,
      segments: [he('שמעתי אותו מזכיר '), en(site.nameEn), he('.')],
    })
  }

  if (!usedCategories.has('capital')) {
    styles.push({
      id: `dyn-${entry.id}-capital`,
      countryId: entry.id,
      segments: [he(`שאל על הדרך ל${entry.capital}.`)],
    })
  }

  const neighbor = pickRandom(entry.neighbors)
  if (neighbor && !usedCategories.has('neighbor')) {
    styles.push({
      id: `dyn-${entry.id}-neighbor`,
      countryId: entry.id,
      segments: [he(`דיבר על גבול עם ${neighbor}.`)],
    })
  }

  const fact = pickRandom(entry.facts)
  if (fact) {
    const trimmed = fact.length > 72 ? `${fact.slice(0, 69)}…` : fact
    styles.push({
      id: `dyn-${entry.id}-fact`,
      countryId: entry.id,
      segments: [he(`העד סיפר: "${trimmed}"`)],
    })
  }

  if (!usedCategories.has('currency')) {
    styles.push({
      id: `dyn-${entry.id}-currency`,
      countryId: entry.id,
      segments: [he('שילם ב'), cur(entry.id), he(' בחנות.')],
    })
  }

  if (!usedCategories.has('language')) {
    styles.push({
      id: `dyn-${entry.id}-language`,
      countryId: entry.id,
      segments: [he('דיבר '), en(entry.languageEn), he(' עם המוכר.')],
    })
  }

  return styles.filter((s) => !categoryBlocked(getClueCategories(s.segments), usedCategories))
}

export function buildDynamicDestinationClue(
  city: City,
  entry: AlmanacEntry,
  usedKeys: Set<string>,
  usedCategories: Set<ClueCategory>,
  usedEnglish: Set<string>,
): RichClueTemplate | null {
  const styles = buildDynamicStyles(city, entry, usedCategories)
  return pickVariedTemplate(styles, usedKeys, usedCategories, usedEnglish)
}

export function finalizeClueTemplate(template: RichClueTemplate, city: City): RichClueTemplate {
  return {
    ...template,
    segments: sanitizeDestinationClue(template.segments, city),
  }
}
