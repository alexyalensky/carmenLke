/**
 * Download high-res witness + scene images per investigation type.
 * Crops matching cartoon job characters from Freepik avatar sheets.
 */
import { mkdir, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const witnessDir = join(root, 'public', 'images', 'witnesses')
const sceneDir = join(root, 'public', 'images', 'scenes')
const sheetsDir = join(witnessDir, '_sheets')

/** scene -> { sheet, col, row } — character matching the witness role */
const SCENE_CELLS = {
  'delivery-boy': { sheet: 'modern', col: 2, row: 0 },
  market: { sheet: 'happy', col: 2, row: 0 },
  sewers: { sheet: 'happy', col: 0, row: 1 },
  'taxi-driver': { sheet: 'modern', col: 2, row: 1 },
  'street-vendor': { sheet: 'modern', col: 2, row: 0 },
  'hotel-clerk': { sheet: 'happy', col: 1, row: 0 },
  'dock-worker': { sheet: 'modern', col: 0, row: 1 },
  subway: { sheet: 'happy', col: 2, row: 1 },
  alley: { sheet: 'happy', col: 0, row: 1 },
  rooftop: { sheet: 'happy', col: 2, row: 2 },
  newsstand: { sheet: 'jobs', col: 1, row: 1 },
  'bus-driver': { sheet: 'professions', col: 1, row: 0 },
  'fish-market': { sheet: 'modern', col: 2, row: 2 },
  monk: { sheet: 'jobs', col: 0, row: 1 },
  'tour-guide': { sheet: 'modern', col: 1, row: 0 },
  'cafe-waiter': { sheet: 'jobs', col: 2, row: 0 },
  'museum-guard': { sheet: 'happy', col: 0, row: 2 },
  'train-conductor': { sheet: 'modern', col: 1, row: 2 },
  'park-jogger': { sheet: 'happy', col: 2, row: 2 },
  construction: { sheet: 'jobs', col: 0, row: 0 },
  airport: { sheet: 'modern', col: 1, row: 2 },
  bazaar: { sheet: 'happy', col: 1, row: 1 },
  'bridge-toll': { sheet: 'professions', col: 0, row: 0 },
  'beach-lifeguard': { sheet: 'jobs', col: 1, row: 0 },
  'police-informant': { sheet: 'jobs', col: 2, row: 1 },
  'underground-garage': { sheet: 'modern', col: 2, row: 1 },
}

const SHEET_META = {
  modern: {
    url: 'https://img.freepik.com/free-vector/modern-cartoon-avatars-collection_23-2147671090.jpg',
    cols: 3,
    rows: 3,
  },
  jobs: {
    url: 'https://img.freepik.com/free-vector/cartoon-collection-job-avatars_23-2147669133.jpg',
    cols: 3,
    rows: 2,
  },
  happy: {
    url: 'https://img.freepik.com/free-vector/flat-colection-happy-avatars_23-2147673710.jpg',
    cols: 3,
    rows: 3,
  },
  professions: {
    url: 'https://static.vecteezy.com/system/resources/previews/001/416/948/non_2x/set-cartoon-people-with-various-profession-free-vector.jpg',
    cols: 4,
    rows: 2,
  },
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'CarmenGame/1.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
}

async function cropFromSheet(sheetPath, cols, rows, col, row, outPath, width, height) {
  const meta = await sharp(sheetPath).metadata()
  const w = meta.width ?? 626
  const h = meta.height ?? 626
  const cellW = Math.floor(w / cols)
  const cellH = Math.floor(h / rows)
  const pad = Math.floor(Math.min(cellW, cellH) * 0.02)

  await sharp(sheetPath)
    .extract({
      left: col * cellW + pad,
      top: row * cellH + pad,
      width: cellW - pad * 2,
      height: cellH - pad * 2,
    })
    .resize(width, height, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255 },
    })
    .jpeg({ quality: 92 })
    .toFile(outPath)
}

await mkdir(witnessDir, { recursive: true })
await mkdir(sceneDir, { recursive: true })
await mkdir(sheetsDir, { recursive: true })

const downloadedSheets = new Map()

for (const [name, meta] of Object.entries(SHEET_META)) {
  const path = join(sheetsDir, `${name}.jpg`)
  console.log('Sheet', name)
  await download(meta.url, path)
  downloadedSheets.set(name, { path, ...meta })
}

const manifest = []

for (const [scene, cell] of Object.entries(SCENE_CELLS)) {
  const sheet = downloadedSheets.get(cell.sheet)
  if (!sheet) continue

  const witnessPath = join(witnessDir, `${scene}.jpg`)
  const scenePath = join(sceneDir, `${scene}.jpg`)

  await cropFromSheet(sheet.path, sheet.cols, sheet.rows, cell.col, cell.row, witnessPath, 256, 256)
  await cropFromSheet(sheet.path, sheet.cols, sheet.rows, cell.col, cell.row, scenePath, 640, 360)

  manifest.push({ scene, ...cell, witness: `/images/witnesses/${scene}.jpg`, sceneImg: `/images/scenes/${scene}.jpg` })
  console.log('OK', scene)
}

await writeFile(
  join(root, 'src', 'data', 'witnessSceneManifest.json'),
  JSON.stringify({ attribution: 'Cartoon avatars by Freepik & Vecteezy', scenes: manifest }, null, 2),
)
console.log(`\nDone: ${manifest.length} witness/scene pairs`)
