/**
 * Regenerate almanacCulture.ts with pure Hebrew display names.
 * Run: node scripts/clean-almanac-culture.mjs
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {Record<string, { foods: [string,string][], events: [string,string][], famousPeople: [string,string][] }>} */
const CULTURE = {
  israel: {
    foods: [['פלאפל', 'falafel'], ['חומוס', 'hummus'], ['שקשוקה', 'shakshuka']],
    events: [['הקמת המדינה', 'Independence Day'], ['חתימת הסכמי אוסלו', 'Oslo Accords']],
    famousPeople: [['דוד בן-גוריון', 'David Ben-Gurion'], ['גולדה מאיר', 'Golda Meir']],
  },
  france: {
    foods: [['קרואסון', 'croissant'], ['גבינת ברי', 'Brie cheese'], ['קרפ', 'crepe']],
    events: [['מהפכת 1789', 'French Revolution'], ['יום ה-14 ליולי', 'Bastille Day']],
    famousPeople: [['נפוליאון', 'Napoleon'], ['ז\'אן ד\'ארק', 'Joan of Arc']],
  },
  egypt: {
    foods: [['כושארי', 'koshari'], ['פול', 'ful medames'], ['בסבוסה', 'basbousa']],
    events: [['תקופת הפירמידות', 'Pyramid building era'], ['מהפכת 2011', 'Arab Spring']],
    famousPeople: [['קleopatra', 'Cleopatra'], ['תutankhamun', 'Tutankhamun']],
  },
}
