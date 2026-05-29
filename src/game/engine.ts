import { gameData } from '../data/gameData'
import {
  generateClueForDestination,
  generateSuspectClue,
  generateWrongCityClue,
  collectUsedClueCategories,
  collectUsedEnglishWords,
} from './clueGenerator'
import type {
  CaseState,
  City,
  Clue,
  Difficulty,
  GameData,
  Suspect,
  SuspectFilter,
  SuspectTrait,
} from './types'
import { DIFFICULTY_CONFIG, TIME_COST } from './types'

const SUSPECT_TRAITS: SuspectTrait[] = ['hair', 'hobby', 'vehicle', 'gender', 'build']

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy
}

function cloneState(state: CaseState): CaseState {
  return {
    ...state,
    thiefPath: [...state.thiefPath],
    knownClues: [...state.knownClues],
    investigatedSites: [...state.investigatedSites],
    suspectFilters: [...state.suspectFilters],
    activeSuspectIds: [...state.activeSuspectIds],
  }
}

function buildThiefPath(data: GameData, length: number): string[] {
  const path: string[] = []
  let current = pickRandom(data.cities)

  for (let i = 0; i < length; i++) {
    path.push(current.id)
    const nextOptions = current.connections.filter((id) => {
      if (path.length < 2) return true
      return id !== path[path.length - 2]
    })
    const nextId = pickRandom(nextOptions.length > 0 ? nextOptions : current.connections)
    const next = data.cities.find((c) => c.id === nextId)
    if (!next) break
    current = next
  }

  return path
}

function countTraitOverlap(a: Suspect, b: Suspect): number {
  return SUSPECT_TRAITS.filter((t) => a[t] === b[t]).length
}

/** Prefer decoys that share many traits with the thief — harder to narrow with one filter */
function buildSuspectPool(data: GameData, perpetratorId: string, poolSize: number): string[] {
  const perpetrator = getSuspect(data, perpetratorId)
  if (!perpetrator) return [perpetratorId]

  const need = Math.max(0, poolSize - 1)
  const decoys = data.suspects.filter((s) => s.id !== perpetratorId)
  const ranked = [...decoys].sort(
    (a, b) => countTraitOverlap(b, perpetrator) - countTraitOverlap(a, perpetrator),
  )
  const highOverlap = ranked.slice(0, Math.max(need, Math.ceil(decoys.length * 0.6)))
  const picked: string[] = []
  const used = new Set<string>()

  for (const suspect of shuffle(highOverlap)) {
    if (picked.length >= need) break
    picked.push(suspect.id)
    used.add(suspect.id)
  }

  for (const suspect of shuffle(decoys)) {
    if (picked.length >= need) break
    if (used.has(suspect.id)) continue
    picked.push(suspect.id)
    used.add(suspect.id)
  }

  return shuffle([perpetratorId, ...picked])
}

export function getSuspectClueReveals(knownClues: Clue[]): Map<SuspectTrait, Set<string>> {
  const map = new Map<SuspectTrait, Set<string>>()
  for (const clue of knownClues) {
    if (clue.type !== 'suspect' || !clue.suspectTrait || !clue.suspectTraitValue) continue
    const values = map.get(clue.suspectTrait) ?? new Set<string>()
    values.add(clue.suspectTraitValue)
    map.set(clue.suspectTrait, values)
  }
  return map
}

export function isSuspectTraitRevealed(
  knownClues: Clue[],
  trait: SuspectTrait,
  value: string,
): boolean {
  return getSuspectClueReveals(knownClues).get(trait)?.has(value) ?? false
}

export function getCity(data: GameData, cityId: string): City | undefined {
  return data.cities.find((c) => c.id === cityId)
}

export function getSuspect(data: GameData, suspectId: string): Suspect | undefined {
  return data.suspects.find((s) => s.id === suspectId)
}

export function getActiveSuspects(data: GameData, state: CaseState): Suspect[] {
  return state.activeSuspectIds
    .map((id) => getSuspect(data, id))
    .filter((s): s is Suspect => s !== undefined)
}

export function startNewCase(
  data: GameData = gameData,
  difficulty: Difficulty = 'medium',
  seed?: number,
): CaseState {
  if (seed !== undefined) {
    let s = seed
    Math.random = () => {
      s = (s * 16807 + 0) % 2147483647
      return (s - 1) / 2147483646
    }
  }

  const config = DIFFICULTY_CONFIG[difficulty]
  const suspect = pickRandom(data.suspects)
  const routeLength =
    config.routeMin + Math.floor(Math.random() * (config.routeMax - config.routeMin + 1))
  const thiefPath = buildThiefPath(data, routeLength)
  const treasure = pickRandom(data.treasures)
  const finalCity = getCity(data, thiefPath[thiefPath.length - 1]!)
  const hideoutSiteId = finalCity ? pickRandom(finalCity.sites).id : ''

  return {
    difficulty,
    activeSuspectIds: buildSuspectPool(data, suspect.id, config.suspectPoolSize),
    suspectId: suspect.id,
    stolenTreasureId: treasure.id,
    stolenTreasure: treasure.name,
    thiefPath,
    currentStep: 0,
    currentCityId: thiefPath[0]!,
    hideoutSiteId,
    knownClues: [],
    investigatedSites: [],
    suspectFilters: [],
    warrantSuspectId: null,
    timeRemaining: config.initialTime,
    status: 'active',
    score: 0,
    lastTravelWasCorrect: null,
    arrestAttempted: false,
  }
}

export function isOnTrail(state: CaseState, cityId: string): boolean {
  const visitedIndex = state.thiefPath.indexOf(cityId)
  return visitedIndex >= 0 && visitedIndex <= state.currentStep
}

export function isAtFinalCity(state: CaseState): boolean {
  return state.currentStep >= state.thiefPath.length - 1
}

export function getNextDestinationCityId(state: CaseState): string | null {
  if (state.currentStep >= state.thiefPath.length - 1) return null
  return state.thiefPath[state.currentStep + 1] ?? null
}

export function getConnectedCities(data: GameData, cityId: string): City[] {
  const city = getCity(data, cityId)
  if (!city) return []
  return city.connections
    .map((id) => getCity(data, id))
    .filter((c): c is City => c !== undefined)
}

function applyTimeCost(state: CaseState, cost: number): CaseState {
  const next = cloneState(state)
  next.timeRemaining -= cost
  if (next.timeRemaining <= 0) {
    next.timeRemaining = 0
    next.status = 'escaped'
  }
  return next
}

/** Deduct time without investigating — e.g. skipping a math challenge */
export function spendTime(state: CaseState, cost: number): CaseState {
  if (state.status !== 'active' || cost <= 0) return state
  return applyTimeCost(state, cost)
}

function siteKey(cityId: string, siteId: string): string {
  return `${cityId}:${siteId}`
}

export function investigate(
  state: CaseState,
  siteId: string,
  data: GameData = gameData,
): CaseState {
  if (state.status !== 'active') return state

  const key = siteKey(state.currentCityId, siteId)
  if (state.investigatedSites.includes(key)) return state

  let next = applyTimeCost(state, TIME_COST.investigate)
  if (next.status !== 'active') return next

  next = cloneState(next)
  next.investigatedSites.push(key)

  const usedTexts = new Set(
    next.knownClues.map((c) => c.dedupeKey ?? c.text),
  )
  const usedCategories = collectUsedClueCategories(next.knownClues)
  const usedEnglish = collectUsedEnglishWords(next.knownClues)
  const usedTraits = new Set(
    next.knownClues
      .filter((c) => c.type === 'suspect' && c.suspectTrait)
      .map((c) => c.suspectTrait!),
  )
  const slotIndex = next.knownClues.filter((c) => c.cityId === next.currentCityId).length

  const onTrail = isOnTrail(next, next.currentCityId)
  const nextDestination = getNextDestinationCityId(next)
  const suspect = getSuspect(data, next.suspectId)
  const config = DIFFICULTY_CONFIG[next.difficulty]

  if (onTrail && nextDestination) {
    const clue = generateClueForDestination(
      data,
      next.currentCityId,
      nextDestination,
      siteId,
      usedTexts,
      usedCategories,
      usedEnglish,
      slotIndex,
    )
    next.knownClues.push(clue)
    usedTexts.add(clue.dedupeKey ?? clue.text)
    if (Math.random() < config.suspectClueChance && suspect) {
      const suspectClue = generateSuspectClue(
        suspect,
        siteId,
        next.currentCityId,
        usedTexts,
        usedTraits,
      )
      next.knownClues.push(suspectClue)
    }
  } else if (onTrail && isAtFinalCity(next) && suspect) {
    const suspectClue = generateSuspectClue(
      suspect,
      siteId,
      next.currentCityId,
      usedTexts,
      usedTraits,
    )
    next.knownClues.push(suspectClue)
    next.knownClues.push({
      id: `${next.currentCityId}-${siteId}-hideout`,
      type: 'landmark',
      text: 'העד מצביע על אחד מהמקומות הקרובים — החשוד מסתתר כאן!',
      targetCountryId: getCity(data, next.currentCityId)?.countryId ?? '',
      siteId,
      cityId: next.currentCityId,
    })
  } else {
    next.knownClues.push(
      generateWrongCityClue(data, next.currentCityId, siteId, usedTexts, usedCategories, usedEnglish, slotIndex),
    )
  }

  return next
}

export function travel(
  state: CaseState,
  destinationCityId: string,
  data: GameData = gameData,
): CaseState {
  if (state.status !== 'active') return state

  const currentCity = getCity(data, state.currentCityId)
  if (!currentCity?.connections.includes(destinationCityId)) return state

  const nextDestination = getNextDestinationCityId(state)
  const isCorrect = destinationCityId === nextDestination
  const wrongCost = DIFFICULTY_CONFIG[state.difficulty].wrongTravelCost

  let next = applyTimeCost(
    state,
    isCorrect ? TIME_COST.correctTravel : wrongCost,
  )
  if (next.status !== 'active') {
    next.lastTravelWasCorrect = isCorrect
    return next
  }

  next = cloneState(next)
  next.currentCityId = destinationCityId
  next.lastTravelWasCorrect = isCorrect

  if (isCorrect) {
    next.currentStep += 1
    next.score += 100
  }

  return next
}

export function getMatchingSuspects(
  suspects: Suspect[],
  filters: SuspectFilter[],
): Suspect[] {
  return suspects.filter((suspect) =>
    filters.every((filter) => suspect[filter.trait] === filter.value),
  )
}

export function applySuspectFilter(
  state: CaseState,
  trait: SuspectTrait,
  value: string,
  data: GameData = gameData,
): CaseState {
  if (state.status !== 'active') return state
  if (!isSuspectTraitRevealed(state.knownClues, trait, value)) return state

  const next = cloneState(state)
  next.suspectFilters = next.suspectFilters.filter((f) => f.trait !== trait)
  next.suspectFilters.push({ trait, value })

  const pool = getActiveSuspects(data, next)
  const matches = getMatchingSuspects(pool, next.suspectFilters)
  const minFilters = DIFFICULTY_CONFIG[next.difficulty].minFiltersForWarrant

  if (matches.length === 1 && next.suspectFilters.length >= minFilters) {
    next.warrantSuspectId = matches[0]!.id
  } else {
    next.warrantSuspectId = null
  }

  return next
}

export function clearSuspectFilters(state: CaseState): CaseState {
  const next = cloneState(state)
  next.suspectFilters = []
  next.warrantSuspectId = null
  return next
}

export function attemptArrest(
  state: CaseState,
  siteId: string,
): CaseState {
  if (state.status !== 'active') return state

  let next = applyTimeCost(state, TIME_COST.investigate)
  if (next.status !== 'active') return next

  next = cloneState(next)
  next.arrestAttempted = true

  const atFinalCity = isAtFinalCity(next)
  const correctWarrant = next.warrantSuspectId === next.suspectId
  const atHideout = siteId === next.hideoutSiteId

  if (atFinalCity && correctWarrant && atHideout) {
    next.status = 'won'
    next.score += next.timeRemaining * 10 + 500
  } else if (!correctWarrant) {
    next.status = 'lost'
  } else if (!atFinalCity) {
    next.status = 'lost'
  } else {
    next.status = 'lost'
  }

  return next
}

export function getTraitOptions(suspects: Suspect[], trait: SuspectTrait): string[] {
  return [...new Set(suspects.map((s) => s[trait]))]
}

export function wasCityVisitedByThief(state: CaseState, cityId: string): boolean {
  const index = state.thiefPath.indexOf(cityId)
  return index >= 0 && index <= state.currentStep
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTY_CONFIG[difficulty].label
}
