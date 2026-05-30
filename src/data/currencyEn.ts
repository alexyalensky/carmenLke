/** Short English currency labels for clues (tap to hear). */
export const currencyShort: Record<string, string> = {
  israel: 'Shekel',
  france: 'Euro',
  egypt: 'Pound',
  japan: 'Yen',
  usa: 'Dollar',
  germany: 'Euro',
  argentina: 'Peso',
  australia: 'Dollar',
  india: 'Rupee',
  uk: 'Pound',
  brazil: 'Real',
  turkey: 'Lira',
  italy: 'Euro',
  spain: 'Euro',
  russia: 'Ruble',
  china: 'Yuan',
  thailand: 'Baht',
  greece: 'Euro',
  mexico: 'Peso',
  canada: 'Dollar',
  netherlands: 'Euro',
  'south-africa': 'Rand',
  poland: 'Zloty',
  portugal: 'Euro',
  sweden: 'Krona',
  vietnam: 'Dong',
  kenya: 'Shilling',
  'south-korea': 'Won',
}

/** Full names for almanac display */
export const currencyEnglish: Record<string, string> = {
  israel: 'Israeli shekel',
  france: 'Euro',
  egypt: 'Egyptian pound',
  japan: 'Japanese yen',
  usa: 'US dollar',
  germany: 'Euro',
  argentina: 'Argentine peso',
  australia: 'Australian dollar',
  india: 'Indian rupee',
  uk: 'British pound',
  brazil: 'Brazilian real',
  turkey: 'Turkish lira',
  italy: 'Euro',
  spain: 'Euro',
  russia: 'Russian ruble',
  china: 'Chinese yuan',
  thailand: 'Thai baht',
  greece: 'Euro',
  mexico: 'Mexican peso',
  canada: 'Canadian dollar',
  netherlands: 'Euro',
  'south-africa': 'South African rand',
  poland: 'Polish zloty',
  portugal: 'Euro',
  sweden: 'Swedish krona',
  vietnam: 'Vietnamese dong',
  kenya: 'Kenyan shilling',
  'south-korea': 'South Korean won',
}

export function getCurrencyShort(countryId: string): string {
  return currencyShort[countryId] ?? 'currency'
}

export function getCurrencyEnglish(countryId: string): string {
  return currencyEnglish[countryId] ?? getCurrencyShort(countryId)
}
