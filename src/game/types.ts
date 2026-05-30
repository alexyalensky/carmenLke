export type SuspectTrait = 'hair' | 'hobby' | 'vehicle' | 'gender' | 'build' | 'accent' | 'accessory' | 'ageGroup'

export type ClueType =
  | 'language'
  | 'currency'
  | 'landmark'
  | 'neighbor'
  | 'capital'
  | 'flag'
  | 'suspect'

export type SiteScene =
  | 'delivery-boy'
  | 'market'
  | 'sewers'
  | 'taxi-driver'
  | 'street-vendor'
  | 'hotel-clerk'
  | 'dock-worker'
  | 'subway'
  | 'alley'
  | 'rooftop'
  | 'newsstand'
  | 'bus-driver'
  | 'fish-market'
  | 'monk'
  | 'tour-guide'
  | 'cafe-waiter'
  | 'museum-guard'
  | 'train-conductor'
  | 'park-jogger'
  | 'construction'
  | 'airport'
  | 'bazaar'
  | 'bridge-toll'
  | 'beach-lifeguard'
  | 'police-informant'
  | 'underground-garage'

export interface InvestigationSite {
  id: string
  name: string
  scene: SiteScene
}

export interface City {
  id: string
  name: string
  nameEn: string
  countryId: string
  connections: string[]
  sites: InvestigationSite[]
  imageKey: string
}

export interface AlmanacCultureItem {
  name: string
  nameEn: string
}

export interface Suspect {
  id: string
  name: string
  nickname: string
  hair: string
  hobby: string
  vehicle: string
  gender: string
  build: string
  accent: string
  accessory: string
  ageGroup: string
  imageKey: string
}

export interface AlmanacSite {
  name: string
  nameEn: string
}

export interface AlmanacCity {
  name: string
  nameEn: string
  /** City appears in the game travel map */
  inGame?: boolean
}

export interface AlmanacEntry {
  id: string
  name: string
  capital: string
  currency: string
  /** English currency name — spoken when tapped in clues */
  currencyEn: string
  language: string
  languageEn: string
  continent: string
  neighbors: string[]
  landmark: string
  flagDescription: string
  imageKey: string
  majorCities: AlmanacCity[]
  mainSites: AlmanacSite[]
  foods: AlmanacCultureItem[]
  events: AlmanacCultureItem[]
  famousPeople: AlmanacCultureItem[]
  facts: string[]
}

export interface Treasure {
  id: string
  name: string
  imageKey: string
}

export type ClueSegment =
  | { type: 'he'; text: string }
  | { type: 'en'; word: string; speak?: string }
  | { type: 'flag'; countryId: string }
  | { type: 'currency'; countryId: string }

export interface Clue {
  id: string
  type: ClueType
  text: string
  /** Rich clue body — flags + clickable English words */
  segments?: ClueSegment[]
  /** Stable key for deduplicating clue templates within a city */
  dedupeKey?: string
  targetCountryId: string
  targetCityId?: string
  siteId: string
  cityId: string
  /** Present on suspect-trait clues — used for CrimeNet filtering */
  suspectTrait?: SuspectTrait
  suspectTraitValue?: string
}

export interface SuspectFilter {
  trait: SuspectTrait
  value: string
}

export type CaseStatus = 'active' | 'won' | 'lost' | 'escaped'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface DifficultyConfig {
  label: string
  initialTime: number
  /** Real-time investigation limit in seconds (when timed mode is on) */
  realTimeLimitSeconds: number
  routeMin: number
  routeMax: number
  suspectPoolSize: number
  suspectClueChance: number
  wrongTravelCost: number
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'קל',
    initialTime: 50,
    realTimeLimitSeconds: 18 * 60,
    routeMin: 4,
    routeMax: 5,
    suspectPoolSize: 16,
    suspectClueChance: 0.42,
    wrongTravelCost: 3,
  },
  medium: {
    label: 'בינוני',
    initialTime: 42,
    realTimeLimitSeconds: 12 * 60,
    routeMin: 5,
    routeMax: 6,
    suspectPoolSize: 24,
    suspectClueChance: 0.33,
    wrongTravelCost: 4,
  },
  hard: {
    label: 'קשה',
    initialTime: 34,
    realTimeLimitSeconds: 8 * 60,
    routeMin: 6,
    routeMax: 8,
    suspectPoolSize: 28,
    suspectClueChance: 0.28,
    wrongTravelCost: 5,
  },
}

export type EscapeReason = 'timeUnits' | 'realTime'

export type ArrestLossReason = 'wrongSuspect' | 'wrongCity'

export interface CaseState {
  difficulty: Difficulty
  activeSuspectIds: string[]
  suspectId: string
  stolenTreasureId: string
  stolenTreasure: string
  thiefPath: string[]
  currentStep: number
  currentCityId: string
  hideoutSiteId: string
  knownClues: Clue[]
  investigatedSites: string[]
  suspectFilters: SuspectFilter[]
  /** Player's chosen suspect for the final arrest */
  selectedSuspectId: string | null
  timeRemaining: number
  status: CaseStatus
  score: number
  lastTravelWasCorrect: boolean | null
  arrestAttempted: boolean
  /** Hideout site picked during the arrest attempt */
  lastArrestSiteId: string | null
  /** Why an arrest attempt failed */
  arrestLossReason: ArrestLossReason | null
  /** After a wrong flight, player must return here before continuing the trail */
  mustReturnToCityId: string | null
  /** Active real-time limit in seconds; null when timed mode is off */
  realTimeLimitSeconds: number | null
  /** Unix ms when the real-time clock expires; set when investigation begins */
  realTimeDeadlineMs: number | null
  /** Why the suspect escaped, if status is escaped */
  escapeReason: EscapeReason | null
  /** Math challenges already shown in the current city (resets on travel) */
  mathChallengesInCurrentCity: number
}

export interface GameData {
  cities: City[]
  suspects: Suspect[]
  almanac: AlmanacEntry[]
  treasures: Treasure[]
}

export const TIME_COST = {
  investigate: 2,
  correctTravel: 2,
  wrongTravel: 3,
  arrest: 2,
  /** Extra time to skip a math challenge and still investigate */
  mathSkip: 3,
} as const

/** Scale starting time to route length so perfect play can finish without running dry */
export function computeInitialTime(difficulty: Difficulty, routeLength: number): number {
  const investigateEstimate = routeLength * 2.5 * TIME_COST.investigate
  const travelEstimate = Math.max(0, routeLength - 1) * TIME_COST.correctTravel
  const slack = difficulty === 'easy' ? 16 : difficulty === 'medium' ? 12 : 8
  return Math.ceil(
    investigateEstimate + travelEstimate + TIME_COST.arrest + 6 + slack,
  )
}

export const INITIAL_TIME = 42

export function formatRealTimeClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function getRealTimeRemainingSeconds(deadlineMs: number): number {
  return Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000))
}

export const TREASURES: Treasure[] = [
  { id: 'gold-statue', name: 'פסל זהב עתיק', imageKey: 'treasure-statue' },
  { id: 'blue-diamond', name: 'יהלום כחול נדיר', imageKey: 'treasure-diamond' },
  { id: 'papyrus', name: 'מגילת קלף עתיקה', imageKey: 'treasure-scroll' },
  { id: 'crown', name: 'כתר מלכותי', imageKey: 'treasure-crown' },
  { id: 'painting', name: 'ציור רנסנס נדיר', imageKey: 'treasure-painting' },
  { id: 'mask', name: 'מסכת טקסית', imageKey: 'treasure-mask' },
  { id: 'gold-coin', name: 'מטבע זהב עתיק', imageKey: 'treasure-coin' },
  { id: 'katana', name: 'חרב יפנית עתיקה', imageKey: 'treasure-sword' },
  { id: 'jade', name: 'פסלון אבן ירוקה', imageKey: 'treasure-jade' },
  { id: 'ruby', name: 'אבן אודם נדירה', imageKey: 'treasure-ruby' },
]
