import { mkdir, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'images')

/** Verified remote URLs — full thumb links, not hash guesses */
const IMAGE_MANIFEST = {
  cities: {
    'tel-aviv': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1280&q=80',
    paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1280&q=80',
    cairo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/All_Gizah_Pyramids.jpg/1280px-All_Gizah_Pyramids.jpg',
    tokyo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/1280px-Skyscrapers_of_Shinjuku_2009_January.jpg',
    'new-york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1280&q=80',
    berlin: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/1280px-Brandenburger_Tor_abends.jpg',
    'buenos-aires':
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Obelisco_de_Buenos_Aires%2C_Argentina.jpg/1280px-Obelisco_de_Buenos_Aires%2C_Argentina.jpg',
    sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1280&q=80',
    mumbai: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1280&q=80',
    london:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28London_Eye%29_%28cropped%29.jpg/1280px-London_Skyline_%28London_Eye%29_%28cropped%29.jpg',
    rio: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Christ_the_Redeemer_-_Cristo_Redeemer.jpg/1280px-Christ_the_Redeemer_-_Cristo_Redeemer.jpg',
    istanbul: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Hagia_Sophia_Mars_2013.jpg/1280px-Hagia_Sophia_Mars_2013.jpg',
    rome: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1280px-Colosseo_2020.jpg',
    madrid:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Fuente_de_Cibeles_%28Madrid%29_01.jpg/1280px-Fuente_de_Cibeles_%28Madrid%29_01.jpg',
    moscow:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Saint_Basil%27s_Cathedral_in_Moscow.jpg/1280px-Saint_Basil%27s_Cathedral_in_Moscow.jpg',
    beijing: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1280&q=80',
    bangkok:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Grand_Palace_Bangkok.jpg/1280px-Grand_Palace_Bangkok.jpg',
    athens:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/The_Parthenon_in_Athens.jpg/1280px-The_Parthenon_in_Athens.jpg',
    'mexico-city':
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Mexico_City_Reforma_skyline.jpg/1280px-Mexico_City_Reforma_skyline.jpg',
    montreal:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Montreal_from_Mount_Royal%2C_August_2017.jpg/1280px-Montreal_from_Mount_Royal%2C_August_2017.jpg',
    amsterdam:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Canals_of_Amsterdam.jpg/1280px-Canals_of_Amsterdam.jpg',
    johannesburg:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Johannesburg_skyline_2017.jpg/1280px-Johannesburg_skyline_2017.jpg',
  },
  treasures: {
    'gold-statue':
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Buddha-Vandana-Reflection.jpg/640px-Buddha-Vandana-Reflection.jpg',
    'blue-diamond': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=640&q=80',
    papyrus: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=640&q=80',
    crown:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Imperial_State_Crown_of_Great_Britain_%281997%29_%28cropped%29.jpg/640px-Imperial_State_Crown_of_Great_Britain_%281997%29_%28cropped%29.jpg',
    painting: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=640&q=80',
    mask: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Egyptian_death_mask_%28cropped%29.jpg/640px-Egyptian_death_mask_%28cropped%29.jpg',
    'gold-coin':
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Gold_coin_of_Croesus_%28cropped%29.JPG/640px-Gold_coin_of_Croesus_%28cropped%29.JPG',
    katana: 'https://images.unsplash.com/photo-1689493720779-f762ab7bb5ae?auto=format&fit=crop&w=640&q=80',
    jade: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Jadeite_jade%2C_mutton-fat%2C_white%2C_45mm.jpg/640px-Jadeite_jade%2C_mutton-fat%2C_white%2C_45mm.jpg',
    ruby: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Ruby_gemstone.jpg/640px-Ruby_gemstone.jpg',
  },
  sites: {
    port: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Port_of_Singapore.jpg/800px-Port_of_Singapore.jpg',
    market:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Grand_Bazaar%2C_Istanbul%2C_Turkey.jpg/800px-Grand_Bazaar%2C_Istanbul%2C_Turkey.jpg',
    museum:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Louvre_Museum_Wikimedia_Commons.jpg/800px-Louvre_Museum_Wikimedia_Commons.jpg',
    shrine:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Torii_of_Itsukushima_Shrine.jpg/800px-Torii_of_Itsukushima_Shrine.jpg',
    park: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
    station: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
    cafe: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Cafe_Flore%2C_Paris%2C_France.jpg/800px-Cafe_Flore%2C_Paris%2C_France.jpg',
    hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    bazaar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    gate: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/800px-Brandenburger_Tor_abends.jpg',
    palace: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
    bridge: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Tower_Bridge_at_Dawn.jpg/800px-Tower_Bridge_at_Dawn.jpg',
    opera: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Sydney_Opera_House_Sails.jpg/800px-Sydney_Opera_House_Sails.jpg',
    mosque: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80',
    plaza:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Fuente_de_Cibeles_%28Madrid%29_01.jpg/800px-Fuente_de_Cibeles_%28Madrid%29_01.jpg',
    statue:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Christ_the_Redeemer_-_Cristo_Redeemer.jpg/800px-Christ_the_Redeemer_-_Cristo_Redeemer.jpg',
    harbour:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sydney_Harbour_Bridge_from_the_air.jpg/800px-Sydney_Harbour_Bridge_from_the_air.jpg',
    library: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    tower: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
  },
  ui: {
    chief: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    menu: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
    placeholder: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    witness1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    witness2: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    witness3: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  },
  suspects: {
    dana: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    yossi: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    maya: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    ron: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    lila: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    omar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    nina: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
}

async function download(category, id, url) {
  const dir = join(outDir, category)
  await mkdir(dir, { recursive: true })
  const ext = url.includes('unsplash') ? 'jpg' : url.match(/\.(\w+)(?:\?|$)/)?.[1]?.toLowerCase() ?? 'jpg'
  const file = join(dir, `${id}.${ext}`)
  const res = await fetch(url, {
    headers: { 'User-Agent': 'CarmenGame/1.0 (local asset download)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 500) throw new Error(`Too small (${buf.length}b) for ${url}`)
  await writeFile(file, buf)
  return `/images/${category}/${id}.${ext}`
}

const localPaths = { cities: {}, treasures: {}, sites: {}, ui: {}, suspects: {} }
const failed = []

for (const [category, items] of Object.entries(IMAGE_MANIFEST)) {
  for (const [id, url] of Object.entries(items)) {
    try {
      await new Promise((r) => setTimeout(r, 400))
      const path = await download(category, id, url)
      localPaths[category][id] = path
      console.log('OK', path)
    } catch (err) {
      failed.push({ category, id, url, error: err.message })
      console.error('FAIL', category, id, err.message)
    }
  }
}

await writeFile(join(root, 'scripts', 'image-manifest.json'), JSON.stringify({ localPaths, failed }, null, 2))
console.log('\nFailed:', failed.length)
if (failed.length) console.log(JSON.stringify(failed, null, 2))
