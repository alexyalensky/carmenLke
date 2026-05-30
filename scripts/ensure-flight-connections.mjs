/**
 * Ensure every city has at least 5 flight connections (bidirectional).
 * Only patches the `export const cities` block in gameData.ts.
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const gameDataPath = join(__dirname, '..', 'src', 'data', 'gameData.ts')
const MIN_CONNECTIONS = 5

const EXTRA_LINKS = {
  'tel-aviv': ['berlin', 'rome'],
  tokyo: ['bangkok', 'london'],
  'buenos-aires': ['montreal', 'madrid'],
  sydney: ['beijing', 'london'],
  rio: ['madrid', 'montreal'],
  madrid: ['berlin', 'amsterdam', 'new-york'],
  moscow: ['london', 'paris', 'athens'],
  beijing: ['sydney', 'london'],
  bangkok: ['tokyo', 'cairo', 'istanbul'],
  'mexico-city': ['madrid', 'london', 'amsterdam'],
  montreal: ['buenos-aires', 'berlin', 'amsterdam'],
  amsterdam: ['new-york', 'rome', 'moscow'],
  johannesburg: ['paris', 'mumbai', 'new-york'],
  warsaw: ['berlin', 'moscow', 'prague'],
  lisbon: ['madrid', 'paris'],
  stockholm: ['london', 'berlin', 'amsterdam'],
  'ho-chi-minh': ['bangkok', 'beijing', 'tokyo'],
  nairobi: ['cairo', 'johannesburg', 'istanbul'],
  seoul: ['tokyo', 'beijing', 'bangkok'],
}

let src = readFileSync(gameDataPath, 'utf8')
const citiesStart = src.indexOf('export const cities: City[] = [')
if (citiesStart < 0) throw new Error('cities block not found')

const citiesEndMatch = src.slice(citiesStart).match(/\n]\r?\n\r?\nfunction buildAlmanac/)
if (!citiesEndMatch || citiesEndMatch.index === undefined) throw new Error('cities block end not found')
const citiesEnd = citiesStart + citiesEndMatch.index + 1

const before = src.slice(0, citiesStart)
const citiesBlock = src.slice(citiesStart, citiesEnd + 2)
const after = src.slice(citiesEnd + 2)

const cityConnections = new Map()
for (const m of citiesBlock.matchAll(/id: '([^']+)'[\s\S]*?connections: \[([^\]]*)\]/g)) {
  const connections = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1])
  cityConnections.set(m[1], connections)
}

const cityIds = new Set(cityConnections.keys())

function addLink(a, b) {
  if (!cityIds.has(a) || !cityIds.has(b)) return
  const listA = cityConnections.get(a)
  const listB = cityConnections.get(b)
  if (!listA.includes(b)) listA.push(b)
  if (!listB.includes(a)) listB.push(a)
}

for (const [cityId, extras] of Object.entries(EXTRA_LINKS)) {
  for (const target of extras) addLink(cityId, target)
}

for (const [cityId, connections] of cityConnections) {
  while (connections.length < MIN_CONNECTIONS) {
    const candidate = [...cityIds].find((other) => other !== cityId && !connections.includes(other))
    if (!candidate) break
    addLink(cityId, candidate)
  }
}

let updatedBlock = citiesBlock
for (const [cityId, connections] of cityConnections) {
  const sorted = [...new Set(connections)].sort()
  updatedBlock = updatedBlock.replace(
    new RegExp(`(id: '${cityId}'[\\s\\S]*?)connections: \\[[^\\]]*\\]`),
    `$1connections: [${sorted.map((c) => `'${c}'`).join(', ')}]`,
  )
  console.log(`${cityId}: ${sorted.length} flights`)
}

writeFileSync(gameDataPath, before + updatedBlock + after, 'utf8')
console.log(`\nDone — minimum ${MIN_CONNECTIONS} flight options per city`)
