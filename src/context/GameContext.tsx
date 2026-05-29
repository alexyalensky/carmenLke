import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { gameData } from '../data/gameData'
import {
  applySuspectFilter,
  attemptArrest,
  clearSuspectFilters,
  investigate,
  spendTime,
  startNewCase,
  travel,
} from '../game/engine'
import type { CaseState, Difficulty, SuspectTrait } from '../game/types'
import { DIFFICULTY_CONFIG, TIME_COST } from '../game/types'
import { useAudio } from './AudioProvider'

type Screen = 'menu' | 'alert' | 'game' | 'about' | 'arrest' | 'over'

interface GameContextValue {
  screen: Screen
  caseState: CaseState | null
  difficulty: Difficulty
  setDifficulty: (d: Difficulty) => void
  startGame: () => void
  dismissAlert: () => void
  goToMenu: () => void
  showAbout: () => void
  doInvestigate: (siteId: string) => void
  doInvestigateWithMathSkip: (siteId: string) => void
  doTravel: (cityId: string) => void
  doFilter: (trait: SuspectTrait, value: string) => void
  doClearFilters: () => void
  doArrest: (siteId: string) => void
  finishArrest: () => void
  activePanel: 'none' | 'investigate' | 'travel' | 'interpol' | 'almanac'
  setActivePanel: (panel: GameContextValue['activePanel']) => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const { unlock, playSfx } = useAudio()
  const [screen, setScreen] = useState<Screen>('menu')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [caseState, setCaseState] = useState<CaseState | null>(null)
  const [activePanel, setActivePanel] = useState<GameContextValue['activePanel']>('none')

  const startGame = useCallback(async () => {
    await unlock()
    playSfx('click')
    setCaseState(startNewCase(gameData, difficulty))
    setScreen('alert')
    setActivePanel('none')
  }, [unlock, playSfx, difficulty])

  const dismissAlert = useCallback(() => {
    playSfx('click')
    setScreen('game')
  }, [playSfx])

  const goToMenu = useCallback(() => {
    playSfx('click')
    setScreen('menu')
    setCaseState(null)
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
        setScreen('over')
        setActivePanel('none')
      }
      return next
    })
  }, [])

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
      updateCase((s) => applySuspectFilter(s, trait, value, gameData))
    },
    [updateCase, playSfx],
  )

  const doClearFilters = useCallback(() => {
    playSfx('click')
    updateCase((s) => clearSuspectFilters(s))
  }, [updateCase, playSfx])

  const doArrest = useCallback(
    (siteId: string) => {
      playSfx('investigate')
      setCaseState((prev) => {
        if (!prev) return prev
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
      startGame,
      dismissAlert,
      goToMenu,
      showAbout,
      doInvestigate,
      doInvestigateWithMathSkip,
      doTravel,
      doFilter,
      doClearFilters,
      doArrest,
      finishArrest,
      activePanel,
      setActivePanel,
    }),
    [
      screen,
      caseState,
      difficulty,
      startGame,
      dismissAlert,
      goToMenu,
      showAbout,
      doInvestigate,
      doInvestigateWithMathSkip,
      doTravel,
      doFilter,
      doClearFilters,
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
