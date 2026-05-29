import type { SiteScene, Suspect } from '../game/types'

const img = (category: string, id: string) => `/images/${category}/${id}.jpg`

/** Studio-Ghibli-inspired prompts — used for remote fallback when local file missing */
export const SCENE_PROMPTS: Record<SiteScene, string> = {
  'delivery-boy':
    'Studio Ghibli inspired anime watercolor, delivery boy with package on sunny city street, warm golden light, detailed background, cinematic, no text',
  market:
    'Studio Ghibli inspired anime watercolor, vibrant outdoor market with colorful stalls and shoppers, bustling atmosphere, detailed, no text',
  sewers:
    'Studio Ghibli inspired anime watercolor, mysterious underground sewer tunnel with glowing lanterns and water reflections, moody atmosphere, no text',
  'taxi-driver':
    'Studio Ghibli inspired anime watercolor, yellow taxi on rainy city street, driver visible, neon reflections, detailed, no text',
  'street-vendor':
    'Studio Ghibli inspired anime watercolor, friendly street food vendor cart at dusk, steam rising, cozy lights, no text',
  'hotel-clerk':
    'Studio Ghibli inspired anime watercolor, elegant hotel lobby with clerk at reception desk, warm interior lighting, no text',
  'dock-worker':
    'Studio Ghibli inspired anime watercolor, busy harbor dock with crates and ships, seagulls, blue ocean, no text',
  subway:
    'Studio Ghibli inspired anime watercolor, underground subway station platform, train arriving, fluorescent and warm mix, no text',
  alley:
    'Studio Ghibli inspired anime watercolor, narrow cobblestone alley between old buildings, afternoon shadows, mysterious, no text',
  rooftop:
    'Studio Ghibli inspired anime watercolor, city rooftop view at sunset, clotheslines and chimneys, vast sky, no text',
  newsstand:
    'Studio Ghibli inspired anime watercolor, corner newsstand with magazines and newspapers, urban morning light, no text',
  'bus-driver':
    'Studio Ghibli inspired anime watercolor, city bus at stop, driver in window, passengers waiting, soft daylight, no text',
  'fish-market':
    'Studio Ghibli inspired anime watercolor, fresh fish market with ice and stalls, seaside town, morning mist, no text',
  monk:
    'Studio Ghibli inspired anime watercolor, peaceful temple garden with red torii gate, monk walking, cherry blossoms, no text',
  'tour-guide':
    'Studio Ghibli inspired anime watercolor, tour guide with flag near ancient ruins, tourists, bright sunny day, no text',
  'cafe-waiter':
    'Studio Ghibli inspired anime watercolor, cozy Parisian cafe interior, waiter serving coffee, warm ambiance, no text',
  'museum-guard':
    'Studio Ghibli inspired anime watercolor, grand museum hall with paintings and guard standing, soft museum lighting, no text',
  'train-conductor':
    'Studio Ghibli inspired anime watercolor, vintage train conductor on platform, steam train, nostalgic atmosphere, no text',
  'park-jogger':
    'Studio Ghibli inspired anime watercolor, lush green park with jogger on path, trees and pond, morning light, no text',
  construction:
    'Studio Ghibli inspired anime watercolor, urban construction site with crane and workers, blue sky, detailed, no text',
  airport:
    'Studio Ghibli inspired anime watercolor, airport terminal with planes visible through windows, travelers, bright, no text',
  bazaar:
    'Studio Ghibli inspired anime watercolor, covered middle eastern bazaar with fabric canopies and lanterns, rich colors, no text',
  'bridge-toll':
    'Studio Ghibli inspired anime watercolor, stone bridge over river with toll booth, misty morning, no text',
  'beach-lifeguard':
    'Studio Ghibli inspired anime watercolor, tropical beach with lifeguard tower and turquoise sea, summer day, no text',
  'police-informant':
    'Studio Ghibli inspired anime watercolor, noir alley meeting shadowy informant under streetlamp, rain, cinematic, no text',
  'underground-garage':
    'Studio Ghibli inspired anime watercolor, dim underground parking garage with cars, concrete pillars, moody lighting, no text',
}

const SCENE_SEEDS: Record<SiteScene, number> = {
  'delivery-boy': 4101,
  market: 4102,
  sewers: 4103,
  'taxi-driver': 4104,
  'street-vendor': 4105,
  'hotel-clerk': 4106,
  'dock-worker': 4107,
  subway: 4108,
  alley: 4109,
  rooftop: 4110,
  newsstand: 4111,
  'bus-driver': 4112,
  'fish-market': 4113,
  monk: 4114,
  'tour-guide': 4115,
  'cafe-waiter': 4116,
  'museum-guard': 4117,
  'train-conductor': 4118,
  'park-jogger': 4119,
  construction: 4120,
  airport: 4121,
  bazaar: 4122,
  'bridge-toll': 4123,
  'beach-lifeguard': 4124,
  'police-informant': 4125,
  'underground-garage': 4126,
}

const HAIR_EN: Record<string, string> = {
  אדום: 'red',
  שחור: 'black',
  חום: 'brown',
  בלונד: 'blonde',
  אפור: 'gray',
}

const GENDER_EN: Record<string, string> = {
  גבר: 'man',
  אישה: 'woman',
}

const BUILD_EN: Record<string, string> = {
  גבוה: 'tall',
  גבוהה: 'tall',
  בינוני: 'medium',
  בינונית: 'medium',
  נמוך: 'short',
  נמוכה: 'short',
}

function pollinationsUrl(prompt: string, width: number, height: number, seed: number): string {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`
}

function suspectSeed(id: string): number {
  return id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + 5000
}

function suspectPrompt(suspect: Pick<Suspect, 'id' | 'hair' | 'gender' | 'build'>): string {
  const hair = HAIR_EN[suspect.hair] ?? 'brown'
  const gender = GENDER_EN[suspect.gender] ?? 'person'
  const build = BUILD_EN[suspect.build] ?? 'medium'
  return `Studio Ghibli inspired anime watercolor character portrait, ${gender}, ${hair} hair, ${build} build, detective suspect mugshot, expressive face, soft painterly shading, plain dark background, shoulders up, no text, unique character`
}

/** Bundled high-res scene art (1280×720) — run npm run images:ghibli to generate */
export function getScenePhotoLocal(scene: SiteScene): string {
  return img('scenes', scene)
}

/** Remote Ghibli-style fallback while local assets download */
export function getScenePhotoRemote(scene: SiteScene): string {
  const prompt = SCENE_PROMPTS[scene]
  const seed = SCENE_SEEDS[scene]
  return pollinationsUrl(prompt, 1280, 720, seed)
}

export function getScenePhoto(scene: SiteScene): string {
  return getScenePhotoLocal(scene)
}

export function getSceneThumbRemote(scene: SiteScene): string {
  const prompt = SCENE_PROMPTS[scene]
  const seed = SCENE_SEEDS[scene]
  return pollinationsUrl(prompt, 512, 512, seed)
}

export function getSuspectPhotoLocal(suspectId: string): string {
  return img('suspects', suspectId)
}

export function getSuspectPhotoRemote(suspect: Pick<Suspect, 'id' | 'hair' | 'gender' | 'build'>): string {
  return pollinationsUrl(suspectPrompt(suspect), 768, 768, suspectSeed(suspect.id))
}

export function getSuspectPhoto(suspect: Pick<Suspect, 'id' | 'hair' | 'gender' | 'build'>): string {
  return getSuspectPhotoLocal(suspect.id)
}

export function getWitnessPhotoRemote(scene: SiteScene): string {
  const prompt = `${SCENE_PROMPTS[scene]}, close-up portrait of friendly witness character, face only`
  return pollinationsUrl(prompt, 256, 256, SCENE_SEEDS[scene] + 100)
}
