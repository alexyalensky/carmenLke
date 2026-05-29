import type { City, ClueSegment } from './types'

/** Remove destination city names and clean up broken phrasing. */
export function sanitizeDestinationClue(segments: ClueSegment[], city: City): ClueSegment[] {
  const blocked = buildBlockedNames(city)
  let out = segments.filter((s) => !segmentLeaksDestination(s, blocked, city))
  out = cleanupConnectors(out)

  if (out.length === 0) {
    return [{ type: 'he', text: 'העד נתן רמז מעורפל על יעד רחוק.' }]
  }
  return out
}

function buildBlockedNames(city: City): string[] {
  const parts = new Set<string>()
  const add = (value: string) => {
    const v = value.trim().toLowerCase()
    if (v.length > 2) parts.add(v)
  }

  add(city.nameEn)
  add(city.name)
  for (const token of city.nameEn.split(/[\s,-]+/)) add(token)

  return [...parts]
}

function segmentLeaksDestination(
  segment: ClueSegment,
  blocked: string[],
  city: City,
): boolean {
  if (segment.type === 'en') {
    const w = segment.word.toLowerCase()
    for (const b of blocked) {
      if (w === b || (b.length > 3 && w.includes(b))) return true
    }
    return false
  }

  if (segment.type === 'he') {
    if (segment.text.includes(city.name)) return true
    const enLower = city.nameEn.toLowerCase()
    if (enLower.length > 3 && segment.text.toLowerCase().includes(enLower)) return true
  }

  return false
}

function cleanupConnectors(segments: ClueSegment[]): ClueSegment[] {
  const out: ClueSegment[] = []

  for (const s of segments) {
    if (s.type !== 'he') {
      out.push(s)
      continue
    }

    const text = s.text.replace(/\s+/g, ' ').trim()
    if (!text) continue
    if (/^(ו|—|–|-)\s*$/.test(text) && out.length === 0) continue

    out.push({ type: 'he', text: s.text })
  }

  while (out[0]?.type === 'he' && /^[\s—–\-]+$/.test(out[0].text.trim())) out.shift()
  while (true) {
    const last = out.at(-1)
    if (last?.type === 'he' && /^[\s—–\-.\u0591-\u05C7]*$/.test(last.text.trim())) out.pop()
    else break
  }

  return out
}

export function extractEnglishWords(segments: ClueSegment[]): string[] {
  return segments
    .filter((s): s is Extract<ClueSegment, { type: 'en' }> => s.type === 'en')
    .map((s) => s.word.toLowerCase())
}

export function siteMentionsCity(siteNameEn: string, city: City): boolean {
  const site = siteNameEn.toLowerCase()
  const blocked = buildBlockedNames(city)
  return blocked.some((b) => b.length > 3 && site.includes(b))
}
