import { readFileSync, writeFileSync } from 'fs'

const path = 'src/data/gameData.ts'
let s = readFileSync(path, 'utf8')

if (!s.includes("import { citySites }")) {
  s = s.replace(
    "import { suspects } from './suspects'",
    "import { suspects } from './suspects'\nimport { citySites } from './citySites'",
  )
}

const cityIds = [
  'tel-aviv', 'paris', 'cairo', 'tokyo', 'new-york', 'berlin', 'buenos-aires', 'sydney',
  'mumbai', 'london', 'rio', 'istanbul', 'rome', 'madrid', 'moscow', 'beijing', 'bangkok',
  'athens', 'mexico-city', 'montreal', 'amsterdam', 'johannesburg',
]

for (const id of cityIds) {
  const re = new RegExp(
    `(id: '${id.replace(/-/g, '\\-')}',[\\s\\S]*?sites: )\\[[\\s\\S]*?\\],`,
    'm',
  )
  s = s.replace(re, `$1citySites['${id}'],`)
}

writeFileSync(path, s)
console.log('Patched gameData.ts with citySites')
