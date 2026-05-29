import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { gameData } from '../data/gameData'
import {
  applySuspectFilter,
  attemptArrest,
  beginRealTimeInvestigation,
  clearSuspectFilters,
  investigate,
  selectSuspect,
  spendTime,
  startNewCase,
  travel,
  triggerRealTimeEscape,
} from '../game/engine'
import type { CaseState, Difficulty, SuspectTrait } from '../game/types'
import { DIFFICULTY_CONFIG, getRealTimeRemainingSeconds, TIME_COST } from '../game/types'
import { useAudio } from './AudioProvider'
import { useSettings } from './SettingsContext'

type Screen = 'menu' | 'alert' | 'game' | 'about' | 'arrest' | 'over'

interface GameContextValue {
  screen: Screen
  caseState: CaseState | null
  difficulty: Difficulty
  setDifficulty: (d: Difficulty) => void
  realTimeRemainingSeconds: number | null
  startGame: () => void
  dismissAlert: () => void
  goToMenu: () => void
  showAbout: () => void
  doInvestigate: (siteId: string) => void
  doInvestigateWithMathSkip: (siteId: string) => void
  doTravel: (cityId: string) => void
  doFilter: (trait: SuspectTrait, value: string) => void
  doClearFilters: () => void
  doSelectSuspect: (suspectId: string) => void
  doArrest: (siteId: string) => void
  finishArrest: () => void
  activePanel: 'none' | 'investigate' | 'travel' | 'interpol' | 'almanac'
  setActivePanel: (panel: GameContextValue['activePanel']) => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const { unlock, playSfx } = useAudio()
  const { timedInvestigation } = useSettings()
  const [screen, setScreen] = useState<Screen>('menu')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [caseState, setCaseState] = useState<CaseState | null>(null)
  const [activePanel, setActivePanel] = useState<GameContextValue['activePanel']>('none')
  const [realTimeRemainingSeconds, setRealTimeRemainingSeconds] = useState<number | null>(null)

  const startGame = useCallback(async () => {
    await unlock()
    playSfx('click')
    setCaseState(startNewCase(gameData, difficulty, timedInvestigation))
    setRealTimeRemainingSeconds(null)
    setScreen('alert')
    setActivePanel('none')
  }, [unlock, playSfx, difficulty, timedInvestigation])

  const dismissAlert = useCallback(() => {
    playSfx('click')
    setCaseState((prev) => (prev ? beginRealTimeInvestigation(prev) : prev))
    setScreen('game')
  }, [playSfx])

  const goToMenu = useCallback(() => {
    playSfx('click')
    setScreen('menu')
    setCaseState(null)
    setRealTimeRemainingSeconds(null)
    setActivePanel('none')
  }, [playSfx])

  const showAbout = useCallback(() => {
    playSfx('click')
    setScreen('about')
  }, [playSfx])

  const updateCase = useCallback((updater: (state: CaseState) => CaseState) => {
    setCaseState((prev) => {
      if (!prev) return prev
      const next = updater(prev)
      if (next.status === 'escaped') {
        setScreen('arrest')
        setActivePanel('none')
      }
      return next
    })
  }, [])

  useEffect(() => {
    const deadline = caseState?.realTimeDeadlineMs
    if (screen !== 'game' || !caseState || caseState.status !== 'active' || !deadline) {
      setRealTimeRemainingSeconds(null)
      return
    }

    let expired = false
    const tick = () => {
      const left = getRealTimeRemainingSeconds(deadline)
      setRealTimeRemainingSeconds(left)
      if (left <= 0 && !expired) {
        expired = true
        setCaseState((prev) => {
          if (!prev || prev.status !== 'active') return prev
          return triggerRealTimeEscape(prev)
        })
        setScreen('arrest')
        setActivePanel('none')
      }
    }

    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [screen, caseState?.realTimeDeadlineMs, caseState?.status])

  const doInvestigate = useCallback(
    (siteId: string) => {
      playSfx('investigate')
      updateCase((s) => investigate(s, siteId, gameData))
    },
    [updateCase, playSfx],
  )

  const doInvestigateWithMathSkip = useCallback(
    (siteId: string) => {
      playSfx('investigate')
      updateCase((s) => {
        let next = spendTime(s, TIME_COST.mathSkip)
        if (next.status !== 'active') return next
        return investigate(next, siteId, gameData)
      })
    },
    [updateCase, playSfx],
  )

  const doTravel = useCallback(
    (cityId: string) => {
      playSfx('click')
      updateCase((s) => travel(s, cityId, gameData))
      setActivePanel('none')
    },
    [updateCase, playSfx],
  )

  const doFilter = useCallback(
    (trait: SuspectTrait, value: string) => {
      playSfx('click')
      updateCase((s) => applySuspectFilter(s, trait, value))
    },
    [updateCase, playSfx],
  )

  const doClearFilters = useCallback(() => {
    playSfx('click')
    updateCase((s) => clearSuspectFilters(s))
  }, [updateCase, playSfx])

  const doSelectSuspect = useCallback(
    (suspectId: string) => {
      playSfx('click')
      updateCase((s) => selectSuspect(s, suspectId, gameData))
    },
    [updateCase, playSfx],
  )

  const doArrest = useCallback(
    (siteId: string) => {
      playSfx('investigate')
      setCaseState((prev) => {
        if (!prev || !prev.selectedSuspectId) return prev
        return attemptArrest(prev, siteId)
      })
      setScreen('arrest')
      setActivePanel('none')
    },
    [playSfx],
  )

  const finishArrest = useCallback(() => {
    playSfx('click')
    setScreen('over')
  }, [playSfx])

  const value = useMemo(
    () => ({
      screen,
      caseState,
      difficulty,
      setDifficulty,
      realTimeRemainingSeconds,
      startGame,
      dismissAlert,
      goToMenu,
      showAbout,
      doInvestigate,
      doInvestigateWithMathSkip,
      doTravel,
      doFilter,
      doClearFilters,
      doSelectSuspect,
      doArrest,
      finishArrest,
      activePanel,
      setActivePanel,
    }),
    [
      screen,
      caseState,
      difficulty,
      realTimeRemainingSeconds,
      startGame,
      dismissAlert,
      goToMenu,
      showAbout,
      doInvestigate,
      doInvestigateWithMathSkip,
      doTravel,
      doFilter,
      doClearFilters,
      doSelectSuspect,
      doArrest,
      finishArrest,
      activePanel,
    ],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}

export { DIFFICULTY_CONFIG }
