/**
 * Crop Freepik free cartoon avatar sheets — full character (not head-only).
 * Attribution: Cartoon avatars by Freepik — https://www.freepik.com
 */
import { mkdir, writeFile } from 'fs/promises'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'images', 'suspects')
const sheetsDir = join(outDir, '_sheets')

const SUSPECT_IDS = []
for (const m of readFileSync(join(root, 'src/data/suspects.ts'), 'utf8').matchAll(/"id": "([^"]+)"/g)) {
  SUSPECT_IDS.push(m[1])
}

const SHEETS = [
  {
    name: 'modern',
    url: 'https://img.freepik.com/free-vector/modern-cartoon-avatars-collection_23-2147671090.jpg',
    cols: 3,
    rows: 3,
    cells: [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ],
  },
  {
    name: 'jobs',
    url: 'https://img.freepik.com/free-vector/cartoon-collection-job-avatars_23-2147669133.jpg',
    cols: 3,
    rows: 2,
    cells: [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
    ],
  },
  {
    name: 'happy',
    url: 'https://img.freepik.com/free-vector/flat-colection-happy-avatars_23-2147673710.jpg',
    cols: 3,
    rows: 3,
    cells: [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ],
  },
  {
    name: 'professions',
    url: 'https://static.vecteezy.com/system/resources/previews/001/416/948/non_2x/set-cartoon-people-with-various-profession-free-vector.jpg',
    cols: 4,
    rows: 2,
    cells: [
      [0, 0], [1, 0], [2, 0], [3, 0],
      [0, 1], [1, 1], [2, 1], [3, 1],
    ],
  },
]

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'CarmenGame/1.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
}

async function cropCell(sheetPath, cols, rows, col, row, outPath, size) {
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
    .resize(size, size, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255 },
    })
    .jpeg({ quality: 92 })
    .toFile(outPath)
}

await mkdir(outDir, { recursive: true })
await mkdir(sheetsDir, { recursive: true })

const manifest = []
let suspectIdx = 0

for (const sheet of SHEETS) {
  const sheetPath = join(sheetsDir, `${sheet.name}.jpg`)
  console.log('Downloading', sheet.name)
  await download(sheet.url, sheetPath)

  for (const [col, row] of sheet.cells) {
    if (suspectIdx >= SUSPECT_IDS.length) break
    const id = SUSPECT_IDS[suspectIdx]
    const outPath = join(outDir, `${id}.jpg`)
    await cropCell(sheetPath, sheet.cols, sheet.rows, col, row, outPath, 320)
    manifest.push({ id, sheet: sheet.name, col, row, path: `/images/suspects/${id}.jpg` })
    console.log('OK', id)
    suspectIdx++
  }
  if (suspectIdx >= SUSPECT_IDS.length) break
}

await writeFile(
  join(root, 'src', 'data', 'suspectPortraitManifest.json'),
  JSON.stringify({ attribution: 'Cartoon avatars by Freepik', count: manifest.length, portraits: manifest }, null, 2),
)
console.log(`\nDone: ${manifest.length} suspect portraits (full character)`)
