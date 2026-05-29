import { getCountryFlag } from '../data/countryFlags'
import { getCurrencyShort } from '../data/currencyEn'
import type { ClueSegment } from '../game/types'

export function segmentsToPlainText(segments: ClueSegment[]): string {
  return segments
    .map((s) => {
      if (s.type === 'he') return s.text
      if (s.type === 'en') return s.word
      if (s.type === 'flag') return getCountryFlag(s.countryId)
      if (s.type === 'currency') return getCurrencyShort(s.countryId)
      return ''
    })
    .join('')
}
