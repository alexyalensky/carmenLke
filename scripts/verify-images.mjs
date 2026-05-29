const manifest = {
  cities: {
    'tel-aviv': 'File:Tel Aviv Skyline 2020.jpg',
    paris: 'unsplash:photo-1502602898657-3e91760cbb34',
    cairo: 'File:All Gizah Pyramids.jpg',
    tokyo: 'File:Skyscrapers of Shinjuku 2009 January.jpg',
    'new-york': 'unsplash:photo-1496442226666-8d4d0e62e6e9',
    berlin: 'File:Brandenburger Tor abends.jpg',
    'buenos-aires': 'File:Obelisco de Buenos Aires, Argentina.jpg',
    sydney: 'unsplash:photo-1506973035872-a4ec16b8e8d9',
    mumbai: 'File:Mumbai Skyline at Dusk.jpg',
    london: 'File:London Skyline (London Eye) (cropped).jpg',
    rio: 'File:Christ the Redeemer - Cristo Redeemer.jpg',
    istanbul: 'File:Hagia Sophia Mars 2013.jpg',
    rome: 'File:Colosseo 2020.jpg',
    madrid: 'File:Fuente de Cibeles (Madrid) 01.jpg',
    moscow: "File:Saint Basil's Cathedral in Moscow.jpg",
    beijing: 'unsplash:photo-1508804185872-d7badad00f7d',
    bangkok: 'File:Grand Palace Bangkok.jpg',
    athens: 'File:The Parthenon in Athens.jpg',
    'mexico-city': 'File:Mexico City Reforma skyline.jpg',
    montreal: 'File:Montreal from Mount Royal, August 2017.jpg',
    amsterdam: 'File:Amsterdam Canal Ring.jpg',
    johannesburg: 'File:Johannesburg skyline 2017.jpg',
  },
  treasures: {
    'gold-statue': 'File:Buddha-Vandana-Reflection.jpg',
    'blue-diamond': 'unsplash:photo-1605100804763-247f67b3557e',
    papyrus: 'unsplash:photo-1582719478250-c89cae4dc85b',
    crown: 'File:Imperial State Crown of Great Britain (1997) (cropped).jpg',
    painting: 'unsplash:photo-1579783902614-a3fb3927b6a5',
    mask: 'File:Egyptian death mask (cropped).jpg',
    'gold-coin': 'File:Gold coin of Croesus (cropped).JPG',
    katana: 'File:Katana mia.jpg',
    jade: 'File:Jadeite jade, mutton-fat, white, 45mm.jpg',
    ruby: 'File:Ruby gemstone.jpg',
  },
  sites: {
    port: 'File:Port of Singapore.jpg',
    market: 'File:Grand Bazaar, Istanbul, Turkey.jpg',
    museum: 'File:Louvre Museum Wikimedia Commons.jpg',
    shrine: 'File:Torii of Itsukushima Shrine.jpg',
    park: 'unsplash:photo-1441974231531-c6227db76b6e',
    station: 'unsplash:photo-1474487548417-781cb71495f3',
    cafe: 'File:Cafe Flore, Paris, France.jpg',
    hotel: 'unsplash:photo-1566073771259-6a8506099945',
    bazaar: 'unsplash:photo-1578662996442-48f60103fc96',
    beach: 'unsplash:photo-1507525428034-b723cf961d3e',
    gate: 'File:Brandenburger Tor abends.jpg',
    palace: 'unsplash:photo-1564501049412-61c2a3083791',
    bridge: 'File:Tower Bridge at Dawn.jpg',
    opera: 'File:Sydney Opera House Sails.jpg',
    mosque: 'unsplash:photo-1546412414-e1885259563a',
    plaza: 'File:Fuente de Cibeles (Madrid) 01.jpg',
    statue: 'File:Christ the Redeemer - Cristo Redeemer.jpg',
    harbour: 'File:Sydney Harbour Bridge from the air.jpg',
    library: 'unsplash:photo-1521587760476-6c12a4b040da',
    tower: 'unsplash:photo-1511739001486-6bfe10ce785f',
  },
}

async function resolve(ref, w = 1280) {
  if (ref.startsWith('unsplash:')) {
    const id = ref.slice(9)
    return {
      url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`,
      type: 'unsplash',
    }
  }
  const title = ref.startsWith('File:') ? ref : `File:${ref}`
  const api =
    'https://en.wikipedia.org/w/api.php?action=query&titles=' +
    encodeURIComponent(title) +
    '&prop=imageinfo&iiprop=url&iiurlwidth=' +
    w +
    '&format=json&origin=*'
  const r = await fetch(api)
  const j = await r.json()
  const page = Object.values(j.query?.pages || {})[0]
  const url = page?.imageinfo?.[0]?.thumburl
  return { url, type: 'wiki', missing: !url, title }
}

async function check(url) {
  if (!url) return 0
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    return r.status
  } catch {
    return 0
  }
}

const results = {}
for (const [cat, items] of Object.entries(manifest)) {
  console.log(`\n=== ${cat} ===`)
  results[cat] = {}
  for (const [id, ref] of Object.entries(items)) {
    const res = await resolve(ref, cat === 'treasures' ? 640 : cat === 'sites' ? 800 : 1280)
    const status = await check(res.url)
    results[cat][id] = { ref, url: res.url, status }
    console.log(status, id, res.url?.slice(0, 100) || 'MISSING')
    await new Promise((r) => setTimeout(r, 250))
  }
}

const failed = []
for (const [cat, items] of Object.entries(results)) {
  for (const [id, { status, ref }] of Object.entries(items)) {
    if (status !== 200) failed.push({ cat, id, ref, status })
  }
}
console.log('\n=== FAILED ===')
console.log(JSON.stringify(failed, null, 2))
