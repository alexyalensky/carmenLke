/** Flag emoji per almanac country id (plain-text fallback) */
export const countryFlagEmoji: Record<string, string> = {
  israel: '🇮🇱',
  france: '🇫🇷',
  egypt: '🇪🇬',
  japan: '🇯🇵',
  usa: '🇺🇸',
  germany: '🇩🇪',
  argentina: '🇦🇷',
  australia: '🇦🇺',
  india: '🇮🇳',
  uk: '🇬🇧',
  brazil: '🇧🇷',
  turkey: '🇹🇷',
  italy: '🇮🇹',
  spain: '🇪🇸',
  russia: '🇷🇺',
  china: '🇨🇳',
  thailand: '🇹🇭',
  greece: '🇬🇷',
  mexico: '🇲🇽',
  canada: '🇨🇦',
  netherlands: '🇳🇱',
  'south-africa': '🇿🇦',
  poland: '🇵🇱',
  portugal: '🇵🇹',
  sweden: '🇸🇪',
  vietnam: '🇻🇳',
  kenya: '🇰🇪',
  'south-korea': '🇰🇷',
}

/** ISO 3166-1 alpha-2 for flag images */
export const countryFlagIso: Record<string, string> = {
  israel: 'il',
  france: 'fr',
  egypt: 'eg',
  japan: 'jp',
  usa: 'us',
  germany: 'de',
  argentina: 'ar',
  australia: 'au',
  india: 'in',
  uk: 'gb',
  brazil: 'br',
  turkey: 'tr',
  italy: 'it',
  spain: 'es',
  russia: 'ru',
  china: 'cn',
  thailand: 'th',
  greece: 'gr',
  mexico: 'mx',
  canada: 'ca',
  netherlands: 'nl',
  'south-africa': 'za',
  poland: 'pl',
  portugal: 'pt',
  sweden: 'se',
  vietnam: 'vn',
  kenya: 'ke',
  'south-korea': 'kr',
}

export function getCountryFlag(countryId: string): string {
  return countryFlagEmoji[countryId] ?? '🏳️'
}

/** PNG flag image URL (flagcdn.com) — only discrete widths are supported */
const FLAGCDN_WIDTHS = [20, 40, 80, 160, 320, 640, 1280, 2560] as const

function snapFlagCdnWidth(requested: number): number {
  const w = Math.max(20, Math.min(2560, Math.round(requested)))
  return FLAGCDN_WIDTHS.find((size) => size >= w) ?? 2560
}

export function getFlagImageUrl(countryId: string, width = 48): string {
  const iso = countryFlagIso[countryId]
  if (!iso) return ''
  return `https://flagcdn.com/w${snapFlagCdnWidth(width)}/${iso}.png`
}
