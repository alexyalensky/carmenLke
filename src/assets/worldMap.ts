/** World map flight UI — equirectangular projection (Wikimedia location map convention). */

export const worldMapBg = '/images/ui/world-map.jpg'

/** Map image is 2:1 equirectangular — longitude/latitude map to pin position (percent). */
export const worldMapAspect = 2

export interface MapCoord {
  lon: number
  lat: number
}

/** WGS84 centroids for game cities */
export const cityGeoCoords: Record<string, MapCoord> = {
  'tel-aviv': { lon: 34.78, lat: 32.08 },
  paris: { lon: 2.35, lat: 48.86 },
  cairo: { lon: 31.24, lat: 30.04 },
  tokyo: { lon: 139.69, lat: 35.68 },
  'new-york': { lon: -74.01, lat: 40.71 },
  berlin: { lon: 13.4, lat: 52.52 },
  'buenos-aires': { lon: -58.38, lat: -34.6 },
  sydney: { lon: 151.21, lat: -33.87 },
  mumbai: { lon: 72.88, lat: 19.08 },
  london: { lon: -0.13, lat: 51.51 },
  rio: { lon: -43.17, lat: -22.91 },
  istanbul: { lon: 28.98, lat: 41.01 },
  rome: { lon: 12.5, lat: 41.9 },
  madrid: { lon: -3.7, lat: 40.42 },
  moscow: { lon: 37.62, lat: 55.76 },
  beijing: { lon: 116.41, lat: 39.9 },
  bangkok: { lon: 100.5, lat: 13.75 },
  athens: { lon: 23.73, lat: 37.98 },
  'mexico-city': { lon: -99.13, lat: 19.43 },
  montreal: { lon: -73.57, lat: 45.5 },
  amsterdam: { lon: 4.9, lat: 52.37 },
  johannesburg: { lon: 28.05, lat: -26.2 },
  warsaw: { lon: 21.01, lat: 52.23 },
  lisbon: { lon: -9.14, lat: 38.72 },
  stockholm: { lon: 18.07, lat: 59.33 },
  'ho-chi-minh': { lon: 106.63, lat: 10.82 },
  nairobi: { lon: 36.82, lat: -1.29 },
  seoul: { lon: 126.98, lat: 37.57 },
}

export function projectCityToMap({ lon, lat }: MapCoord): { x: number; y: number } {
  return {
    x: ((lon + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  }
}

export function getCityMapPosition(cityId: string): { x: number; y: number } | null {
  const geo = cityGeoCoords[cityId]
  if (!geo) return null
  return projectCityToMap(geo)
}

/** Convert map pin % position to SVG coords for a 100×50 viewBox (2:1 map). */
export function mapPosToSvg(pos: { x: number; y: number }): { x: number; y: number } {
  return { x: pos.x, y: pos.y / 2 }
}

/** Hebrew continent labels for map overlay */
export const continentLabels: { name: string; x: number; y: number }[] = [
  { name: 'אמריקה הצפונית', x: 18, y: 32 },
  { name: 'אמריקה הדרומית', x: 28, y: 68 },
  { name: 'אירופה', x: 50, y: 28 },
  { name: 'אפריקה', x: 52, y: 52 },
  { name: 'אסיה', x: 72, y: 36 },
  { name: 'אוסטרליה', x: 82, y: 72 },
]
