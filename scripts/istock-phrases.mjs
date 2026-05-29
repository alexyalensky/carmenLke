/** iStock search phrases — https://www.istockphoto.com/search/2/image-film?phrase=... */

export const ISTOCK_SEARCH = 'https://www.istockphoto.com/search/2/image-film'

export const CITY_PHRASES = {
  'tel-aviv': 'tel aviv',
  paris: 'paris',
  cairo: 'cairo',
  tokyo: 'tokyo',
  'new-york': 'new york',
  berlin: 'berlin',
  'buenos-aires': 'buenos aires',
  sydney: 'sydney',
  mumbai: 'mumbai',
  london: 'london',
  rio: 'rio de janeiro',
  istanbul: 'istanbul',
  rome: 'rome',
  madrid: 'madrid',
  moscow: 'moscow',
  beijing: 'beijing',
  bangkok: 'bangkok',
  athens: 'athens',
  'mexico-city': 'mexico city',
  montreal: 'montreal',
  amsterdam: 'amsterdam',
  johannesburg: 'johannesburg',
}

/** witness = character/portrait search; scene = location/establishing shot */
export const SCENE_PHRASES = {
  'delivery-boy': { witness: 'delivery courier', scene: 'package delivery street' },
  market: { witness: 'market vendor', scene: 'outdoor food market' },
  sewers: { witness: 'sewer worker', scene: 'urban sewer tunnel' },
  'taxi-driver': { witness: 'taxi driver', scene: 'yellow taxi city' },
  'street-vendor': { witness: 'street food vendor', scene: 'street food stall' },
  'hotel-clerk': { witness: 'hotel receptionist', scene: 'hotel lobby' },
  'dock-worker': { witness: 'dock worker port', scene: 'shipping port harbour' },
  subway: { witness: 'subway commuter', scene: 'subway station platform' },
  alley: { witness: 'detective alley', scene: 'dark city alley' },
  rooftop: { witness: 'rooftop worker', scene: 'city rooftop skyline' },
  newsstand: { witness: 'newsstand vendor', scene: 'newspaper kiosk street' },
  'bus-driver': { witness: 'bus driver', scene: 'city bus stop' },
  'fish-market': { witness: 'fish market vendor', scene: 'fish market' },
  monk: { witness: 'buddhist monk', scene: 'temple shrine' },
  'tour-guide': { witness: 'tour guide', scene: 'tourist group city' },
  'cafe-waiter': { witness: 'cafe waiter', scene: 'paris cafe bistro' },
  'museum-guard': { witness: 'museum security guard', scene: 'art museum gallery' },
  'train-conductor': { witness: 'train conductor', scene: 'train station platform' },
  'park-jogger': { witness: 'jogger park', scene: 'city park running' },
  construction: { witness: 'construction worker', scene: 'construction site city' },
  airport: { witness: 'airport worker', scene: 'airport terminal' },
  bazaar: { witness: 'bazaar merchant', scene: 'grand bazaar market' },
  'bridge-toll': { witness: 'toll booth worker', scene: 'city bridge traffic' },
  'beach-lifeguard': { witness: 'beach lifeguard', scene: 'beach lifeguard tower' },
  'police-informant': { witness: 'police officer', scene: 'police station' },
  'underground-garage': { witness: 'parking attendant', scene: 'underground parking garage' },
}

export function istockSearchUrl(phrase) {
  return `${ISTOCK_SEARCH}?phrase=${encodeURIComponent(phrase)}`
}
