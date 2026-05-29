/** Bundled local images — served from /public/images (no remote CDN dependency) */

import {
  getScenePhoto,
  getScenePhotoRemote,
  getSceneThumbRemote,
  getSuspectPhoto,
  getSuspectPhotoRemote,
  getWitnessPhotoRemote,
} from './ghibliAssets'

export {
  getScenePhoto,
  getScenePhotoRemote,
  getSceneThumbRemote,
  getSuspectPhoto,
  getSuspectPhotoRemote,
  getWitnessPhotoRemote,
}

const img = (category: string, id: string) => `/images/${category}/${id}.jpg`

export const DEFAULT_PLACEHOLDER = img('ui', 'placeholder')

export const cityPhotos: Record<string, string> = {
  'tel-aviv': img('cities', 'tel-aviv'),
  paris: img('cities', 'paris'),
  cairo: img('cities', 'cairo'),
  tokyo: img('cities', 'tokyo'),
  'new-york': img('cities', 'new-york'),
  berlin: img('cities', 'berlin'),
  'buenos-aires': img('cities', 'buenos-aires'),
  sydney: img('cities', 'sydney'),
  mumbai: img('cities', 'mumbai'),
  london: img('cities', 'london'),
  rio: img('cities', 'rio'),
  istanbul: img('cities', 'istanbul'),
  rome: img('cities', 'rome'),
  madrid: img('cities', 'madrid'),
  moscow: img('cities', 'moscow'),
  beijing: img('cities', 'beijing'),
  bangkok: img('cities', 'bangkok'),
  athens: img('cities', 'athens'),
  'mexico-city': img('cities', 'mexico-city'),
  montreal: img('cities', 'montreal'),
  amsterdam: img('cities', 'amsterdam'),
  johannesburg: img('cities', 'johannesburg'),
}

export const sitePhotos: Record<string, string> = {
  port: img('sites', 'port'),
  market: img('sites', 'market'),
  museum: img('sites', 'museum'),
  shrine: img('sites', 'shrine'),
  park: img('sites', 'park'),
  station: img('sites', 'station'),
  cafe: img('sites', 'cafe'),
  hotel: img('sites', 'hotel'),
  bazaar: img('sites', 'bazaar'),
  beach: img('sites', 'beach'),
  gate: img('sites', 'gate'),
  palace: img('sites', 'palace'),
  bridge: img('sites', 'bridge'),
  opera: img('sites', 'opera'),
  mosque: img('sites', 'mosque'),
  plaza: img('sites', 'plaza'),
  statue: img('sites', 'statue'),
  harbour: img('sites', 'harbour'),
  library: img('sites', 'library'),
  tower: img('sites', 'tower'),
}

export const suspectPhotos: Record<string, string> = {
  dana: img('suspects', 'dana'),
  yossi: img('suspects', 'yossi'),
  maya: img('suspects', 'maya'),
  ron: img('suspects', 'ron'),
  lila: img('suspects', 'lila'),
  omar: img('suspects', 'omar'),
  nina: img('suspects', 'nina'),
}

export const treasurePhotos: Record<string, string> = {
  'gold-statue': img('treasures', 'gold-statue'),
  'blue-diamond': img('treasures', 'blue-diamond'),
  papyrus: img('treasures', 'papyrus'),
  crown: img('treasures', 'crown'),
  painting: img('treasures', 'painting'),
  mask: img('treasures', 'mask'),
  'gold-coin': img('treasures', 'gold-coin'),
  katana: img('treasures', 'katana'),
  jade: img('treasures', 'jade'),
  ruby: img('treasures', 'ruby'),
}

export const chiefPhoto = img('ui', 'chief')
export { worldMapBg } from './worldMap'
export const menuBg = img('ui', 'menu')

export const witnessPhotos = [img('ui', 'witness1'), img('ui', 'witness2'), img('ui', 'witness3')]

export function getCityPhoto(cityId: string): string {
  return cityPhotos[cityId] ?? DEFAULT_PLACEHOLDER
}

export function getSitePhoto(icon: string): string {
  return sitePhotos[icon] ?? sitePhotos.market ?? DEFAULT_PLACEHOLDER
}

/** @deprecated Use getSuspectPhoto(suspect) from ghibliAssets */
export function getSuspectPhotoLegacy(suspectId: string): string {
  return suspectPhotos[suspectId] ?? suspectPhotos.dana
}

export function getTreasurePhoto(treasureId: string): string {
  return treasurePhotos[treasureId] ?? treasurePhotos['gold-coin'] ?? DEFAULT_PLACEHOLDER
}
