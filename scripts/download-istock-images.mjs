/**
 * Download city + witness/scene images from iStock search (first film-still result).
 * Preview comp size (~612px) is upscaled with sharp — for production, license via iStock.
 *
 * Usage:
 *   node scripts/download-istock-images.mjs           # all
 *   node scripts/download-istock-images.mjs cities    # cities only
 *   node scripts/download-istock-images.mjs witnesses # witness + scene only
 *   node scripts/download-istock-images.mjs --links   # print search URLs only
 */
import { mkdir, writeFile, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { CITY_PHRASES, SCENE_PHRASES, istockSearchUrl } from './istock-phrases.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const citiesDir = join(root, 'public', 'images', 'cities')
const witnessDir = join(root, 'public', 'images', 'witnesses')
const sceneDir = join(root, 'public', 'images', 'scenes')
const cacheDir = join(root, 'scripts', '.istock-cache')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

const DELAY_MS = 1200

const args = process.argv.slice(2)
const linksOnly = args.includes('--links')
const mode = args.find((a) => a === 'cities' || a === 'witnesses') ?? 'all'

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function decodeIstockUrl(raw) {
  return raw.replace(/\\u0026/g, '&').replace(/\\\//g, '/')
}

function extractFirstImageUrl(html) {
  const patterns = [
    /https:\/\/media\.istockphoto\.com\/id\/\d+\/photo\/[^"'\s]+\.jpg\?[^"'\s]+/,
    /https:\\\/\\\/media\.istockphoto\.com\\\/id\\\/\d+\\\/photo\\\/[^"\\]+\.jpg\?[^"\\]+/,
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return decodeIstockUrl(match[0])
  }
  return null
}

async function searchFirstImageUrl(phrase) {
  const cachePath = join(cacheDir, `${phrase.replace(/[^a-z0-9]+/gi, '_').slice(0, 80)}.json`)
  if (existsSync(cachePath)) {
    const cached = JSON.parse(await readFile(cachePath, 'utf8'))
    if (cached.url) return { url: cached.url, searchUrl: istockSearchUrl(phrase), cached: true }
  }

  const searchUrl = istockSearchUrl(phrase)
  const res = await fetch(searchUrl, {
    headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`Search HTTP ${res.status} for "${phrase}"`)

  const html = await res.text()
  const url = extractFirstImageUrl(html)
  if (!url) throw new Error(`No image found for "${phrase}" — ${searchUrl}`)
  await mkdir(cacheDir, { recursive: true })
  await writeFile(cachePath, JSON.stringify({ phrase, url, searchUrl }, null, 2))
  return { url, searchUrl, cached: false }
}

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Referer: 'https://www.istockphoto.com/' },
  })
  if (!res.ok) throw new Error(`Image HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 1000) throw new Error(`Image too small (${buf.length}b)`)
  return buf
}

async function saveCity(id, phrase) {
  const { url, searchUrl } = await searchFirstImageUrl(phrase)
  const buf = await downloadImage(url)
  const out = join(citiesDir, `${id}.jpg`)
  await sharp(buf).resize(1280, 720, { fit: 'cover', position: 'centre' }).jpeg({ quality: 90 }).toFile(out)
  return { id, phrase, searchUrl, sourceUrl: url, path: `/images/cities/${id}.jpg` }
}

async function saveWitnessScene(scene, phrases) {
  const witnessMeta = await searchFirstImageUrl(phrases.witness)
  await sleep(DELAY_MS)
  const sceneMeta = await searchFirstImageUrl(phrases.scene)

  const witnessBuf = await downloadImage(witnessMeta.url)
  const sceneBuf = await downloadImage(sceneMeta.url)

  const witnessOut = join(witnessDir, `${scene}.jpg`)
  const sceneOut = join(sceneDir, `${scene}.jpg`)

  await sharp(witnessBuf)
    .resize(256, 256, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 90 })
    .toFile(witnessOut)

  await sharp(sceneBuf)
    .resize(640, 360, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 90 })
    .toFile(sceneOut)

  return {
    scene,
    witness: {
      phrase: phrases.witness,
      searchUrl: witnessMeta.searchUrl,
      path: `/images/witnesses/${scene}.jpg`,
    },
    sceneImg: {
      phrase: phrases.scene,
      searchUrl: sceneMeta.searchUrl,
      path: `/images/scenes/${scene}.jpg`,
    },
  }
}

if (linksOnly) {
  console.log('# City search links\n')
  for (const [id, phrase] of Object.entries(CITY_PHRASES)) {
    console.log(`${id}: ${istockSearchUrl(phrase)}`)
  }
  console.log('\n# Witness / scene search links\n')
  for (const [scene, phrases] of Object.entries(SCENE_PHRASES)) {
    console.log(`${scene} witness: ${istockSearchUrl(phrases.witness)}`)
    console.log(`${scene} scene:   ${istockSearchUrl(phrases.scene)}`)
  }
  process.exit(0)
}

await mkdir(citiesDir, { recursive: true })
await mkdir(witnessDir, { recursive: true })
await mkdir(sceneDir, { recursive: true })
await mkdir(cacheDir, { recursive: true })

const manifestPath = join(root, 'src', 'data', 'istockImageManifest.json')

let manifest = {
  attribution: 'Images sourced from iStock search previews — license required for production use',
  downloadedAt: new Date().toISOString(),
  cities: [],
  scenes: [],
  failed: [],
}

try {
  if (existsSync(manifestPath)) {
    const prev = JSON.parse(await readFile(manifestPath, 'utf8'))
    if (mode !== 'cities') manifest.cities = prev.cities ?? []
    if (mode !== 'witnesses') manifest.scenes = prev.scenes ?? []
  }
} catch {
  /* fresh manifest */
}

manifest.downloadedAt = new Date().toISOString()
manifest.failed = []

if (mode === 'all' || mode === 'cities') {
  console.log('=== Cities ===')
  for (const [id, phrase] of Object.entries(CITY_PHRASES)) {
    try {
      console.log('City', id, '→', phrase)
      const entry = await saveCity(id, phrase)
      manifest.cities.push(entry)
      console.log('  OK', entry.path)
    } catch (err) {
      console.error('  FAIL', id, err.message)
      manifest.failed.push({ type: 'city', id, phrase, error: err.message })
    }
    await sleep(DELAY_MS)
  }
}

if (mode === 'all' || mode === 'witnesses') {
  console.log('\n=== Witness / scene pairs ===')
  for (const [scene, phrases] of Object.entries(SCENE_PHRASES)) {
    try {
      console.log('Scene', scene, '→', phrases.witness, '|', phrases.scene)
      const entry = await saveWitnessScene(scene, phrases)
      manifest.scenes.push(entry)
      console.log('  OK', entry.witness.path, entry.sceneImg.path)
    } catch (err) {
      console.error('  FAIL', scene, err.message)
      manifest.failed.push({ type: 'scene', scene, phrases, error: err.message })
    }
    await sleep(DELAY_MS)
  }
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2))

console.log(`\nDone: ${manifest.cities.length} cities, ${manifest.scenes.length} scene pairs`)
if (manifest.failed.length) console.log('Failed:', manifest.failed.length)
console.log('Manifest:', manifestPath)
