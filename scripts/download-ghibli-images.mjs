import { readFileSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'images')

/** Studio-Ghibli-inspired watercolor anime prompts (original illustrations) */
export const SCENE_PROMPTS = {
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

/** Stable seeds for reproducible images */
export const SCENE_SEEDS = {
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

export const SUSPECT_IDS = []

function parseSuspects() {
  const raw = readFileSync(join(root, 'src/data/suspects.ts'), 'utf8')
  const suspects = []
  const re = /"id": "([^"]+)"[\s\S]*?"hair": "([^"]+)"[\s\S]*?"gender": "([^"]+)"[\s\S]*?"build": "([^"]+)"/g
  for (const m of raw.matchAll(re)) {
    suspects.push({ id: m[1], hair: m[2], gender: m[3], build: m[4] })
  }
  return suspects
}

const HAIR_EN = { אדום: 'red', שחור: 'black', חום: 'brown', בלונד: 'blonde', אפור: 'gray' }
const GENDER_EN = { גבר: 'man', אישה: 'woman' }
const BUILD_EN = {
  גבוה: 'tall', גבוהה: 'tall', בינוני: 'medium', בינונית: 'medium', נמוך: 'short', נמוכה: 'short',
}

function suspectPrompt(suspect, index) {
  const hair = HAIR_EN[suspect.hair] ?? 'brown'
  const gender = GENDER_EN[suspect.gender] ?? 'person'
  const build = BUILD_EN[suspect.build] ?? 'medium'
  return `Studio Ghibli inspired anime watercolor character portrait, ${gender}, ${hair} hair, ${build} build, detective suspect mugshot style, expressive face, soft painterly shading, plain dark background, shoulders up, no text, unique character ${index + 1}`
}

function pollinationsUrl(prompt, { width, height, seed }) {
  const q = encodeURIComponent(prompt)
  return `https://image.pollinations.ai/prompt/${q}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`
}

async function download(url, filePath) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'CarmenGame/1.0 (ghibli asset download)' },
    signal: AbortSignal.timeout(120_000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 2000) throw new Error(`Too small (${buf.length}b)`)
  await writeFile(filePath, buf)
  return buf.length
}

async function downloadWithRetry(url, filePath, attempts = 3) {
  let lastErr
  for (let i = 0; i < attempts; i++) {
    try {
      if (i > 0) await new Promise((r) => setTimeout(r, 3000 * i))
      const size = await download(url, filePath)
      return size
    } catch (err) {
      lastErr = err
      console.warn(`  retry ${i + 1}/${attempts}:`, err.message)
    }
  }
  throw lastErr
}

const args = process.argv.slice(2)
const scenesOnly = args.includes('--scenes-only')
const suspectsOnly = args.includes('--suspects-only')

const scenesDir = join(outDir, 'scenes')
const suspectsDir = join(outDir, 'suspects')
await mkdir(scenesDir, { recursive: true })
await mkdir(suspectsDir, { recursive: true })

const failed = []
const ok = []

if (!suspectsOnly) {
  console.log('\n=== Scenes (1280x720) ===')
  for (const [id, prompt] of Object.entries(SCENE_PROMPTS)) {
    const file = join(scenesDir, `${id}.jpg`)
    const url = pollinationsUrl(prompt, { width: 1280, height: 720, seed: SCENE_SEEDS[id] })
    try {
      await new Promise((r) => setTimeout(r, 2500))
      const size = await downloadWithRetry(url, file)
      ok.push({ type: 'scene', id, size })
      console.log('OK scene', id, `${Math.round(size / 1024)}KB`)
    } catch (err) {
      failed.push({ type: 'scene', id, error: err.message })
      console.error('FAIL scene', id, err.message)
    }
  }
}

if (!scenesOnly) {
  console.log('\n=== Suspects (768x768) ===')
  const suspects = parseSuspects()
  for (let i = 0; i < suspects.length; i++) {
    const suspect = suspects[i]
    const id = suspect.id
    const file = join(suspectsDir, `${id}.jpg`)
    const prompt = suspectPrompt(suspect, i)
    const url = pollinationsUrl(prompt, { width: 768, height: 768, seed: 5000 + i })
    try {
      await new Promise((r) => setTimeout(r, 2500))
      const size = await downloadWithRetry(url, file)
      ok.push({ type: 'suspect', id, size })
      console.log('OK suspect', id, `${Math.round(size / 1024)}KB`)
    } catch (err) {
      failed.push({ type: 'suspect', id, error: err.message })
      console.error('FAIL suspect', id, err.message)
    }
  }
}

await writeFile(
  join(root, 'scripts', 'ghibli-manifest.json'),
  JSON.stringify({ ok: ok.length, failed, timestamp: new Date().toISOString() }, null, 2),
)
console.log(`\nDone: ${ok.length} OK, ${failed.length} failed`)
