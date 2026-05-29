/**
 * Download NASA Blue Marble–style equirectangular world map for flight UI.
 */
import { mkdir } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, '..', 'public', 'images', 'ui', 'world-map.jpg')

const NASA_WORLD_MAP =
  'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg'

await mkdir(dirname(out), { recursive: true })
console.log('Downloading world map...')
const res = await fetch(NASA_WORLD_MAP, { headers: { 'User-Agent': 'CarmenGame/1.0' } })
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const buf = Buffer.from(await res.arrayBuffer())
await sharp(buf).resize(1920, 960, { fit: 'fill' }).jpeg({ quality: 88 }).toFile(out)
console.log('Saved', out)
