import { gameData } from './gameData'
import type { AlmanacEntry, AlmanacSite } from '../game/types'

export interface SiteWikiInfo {
  countryId: string
  countryName: string
  name: string
  nameEn: string
  summary: string
  image?: string
}

function wikiKey(countryId: string, nameEn: string): string {
  return `${countryId}:${nameEn.toLowerCase().trim()}`
}

const SITE_IMAGES: Record<string, string> = {
  'india:Taj Mahal':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Taj_Mahal%2C_Agra%2C_India.jpg/640px-Taj_Mahal%2C_Agra%2C_India.jpg',
  'india:Red Fort':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Red_Fort_in_Delhi_03-2016.jpg/640px-Red_Fort_in_Delhi_03-2016.jpg',
  'india:Gateway of India':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Gateway_of_India%2C_Mumbai.jpg/640px-Gateway_of_India%2C_Mumbai.jpg',
  'france:Eiffel Tower':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/640px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg',
  'egypt:Pyramids of Giza':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Giza_pyramid_complex_%28cropped%29.jpg/640px-Giza_pyramid_complex_%28cropped%29.jpg',
  'japan:Mount Fuji':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Fuji_%28cropped%29.jpg/640px-Fuji_%28cropped%29.jpg',
  'usa:Statue of Liberty':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/640px-Statue_of_Liberty_7.jpg',
  'uk:Big Ben':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg/640px-Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg',
  'italy:Colosseum':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/640px-Colosseo_2020.jpg',
  'china:Great Wall of China':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/640px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg',
  'brazil:Christ the Redeemer':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/640px-Christ_the_Redeemer_-_Cristo_Redentor.jpg',
  'australia:Sydney Opera House':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sydney_Opera_House_Sails.jpg/640px-Sydney_Opera_House_Sails.jpg',
  'greece:Acropolis':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Acropolis_of_Athenes.jpg/640px-Acropolis_of_Athenes.jpg',
  'turkey:Hagia Sophia':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Hagia_Sophia_Mars_2013.jpg/640px-Hagia_Sophia_Mars_2013.jpg',
  'russia:Red Square':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Moscow_Red_Square.jpg/640px-Moscow_Red_Square.jpg',
  'spain:Sagrada Familia':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Sagrada_Familia_01.jpg/640px-Sagrada_Familia_01.jpg',
  'mexico:Chichen Itza':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/640px-Chichen_Itza_3.jpg',
  'canada:Niagara Falls':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/3Falls_Niagara.jpg/640px-3Falls_Niagara.jpg',
}

const SITE_SUMMARIES: Record<string, string> = {
  'india:Red Fort':
    'המבצר האדום בדלהי הוא מצודה אדומה מהמאה ה-17 מתקופת המוגולים. שימש כבירת האימפריה והוא אתר מורשת עולמית.',
  'india:Taj Mahal':
    'טאג׳ מהאל באגרה הוא מבנה קבורה שישי-לבן מעשיר המאה, שנבנה על ידי שאה ג׳האן — אתר מורשת עולמית.',
  'india:Gateway of India':
    'שער הודו במומבאי הוא קשת אבן לזכר ביקור המלך ג׳ורג׳ החמישי — סמל מפורסם של העיר.',
  'japan:Mount Fuji':
    'הר פוג׳י הוא הר הגעש הגבוה ביפן — סמל לאומי ויעד טיול מקודש.',
  'usa:Statue of Liberty':
    'פסל החירות בניו יורק הוא מתנה מצרפת — סמל לחירות ולקליטת מהגרים.',
  'china:Great Wall of China':
    'חומת סין היא חומת הגנה ארוכה שנבנתה לאורך מאות שנים — סמל לסין.',
}

function defaultSummary(country: AlmanacEntry, site: AlmanacSite): string {
  return `${site.name} (${site.nameEn}) הוא אתר מפורסם ב${country.name}. הרמז מצביע על מדינה שבה נמצא האתר — חפשו אותה בספר העולם.`
}

function buildSiteWikiInfo(country: AlmanacEntry, site: AlmanacSite): SiteWikiInfo {
  const mapKey = wikiKey(country.id, site.nameEn)
  return {
    countryId: country.id,
    countryName: country.name,
    name: site.name,
    nameEn: site.nameEn,
    summary: SITE_SUMMARIES[mapKey] ?? defaultSummary(country, site),
    image: SITE_IMAGES[mapKey],
  }
}

export function findSiteWikiInfo(countryId: string, nameEn: string): SiteWikiInfo | null {
  if (!countryId) return null
  const country = gameData.almanac.find((a) => a.id === countryId)
  if (!country) return null

  const key = nameEn.toLowerCase().trim()
  const site = country.mainSites.find((s) => s.nameEn.toLowerCase().trim() === key)
  if (!site) return null

  return buildSiteWikiInfo(country, site)
}

export function findSiteWikiByHebrewName(countryId: string, hebrewName: string): SiteWikiInfo | null {
  if (!countryId) return null
  const country = gameData.almanac.find((a) => a.id === countryId)
  if (!country) return null

  const trimmed = hebrewName.trim()
  const site = country.mainSites.find((s) => s.name === trimmed)
  if (!site) return null

  return buildSiteWikiInfo(country, site)
}
