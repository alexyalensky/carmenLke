import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'carmen-settings'

const DEFAULT_PLAYER_NAME = 'בלש'
const MAX_PLAYER_NAME_LENGTH = 24

export interface GameSettings {
  /** Show clickable English words in clues and speak them on tap */
  useEnglishWords: boolean
  /** Require a math problem before each investigation clue */
  useMath: boolean
  /** Detective name shown in the game */
  playerName: string
}

const DEFAULT_SETTINGS: GameSettings = {
  useEnglishWords: true,
  useMath: false,
  playerName: '',
}

export function sanitizePlayerName(raw: string): string {
  return raw.trim().slice(0, MAX_PLAYER_NAME_LENGTH)
}

export function getDisplayPlayerName(playerName: string): string {
  const trimmed = sanitizePlayerName(playerName)
  return trimmed || DEFAULT_PLAYER_NAME
}

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<GameSettings>
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      playerName: sanitizePlayerName(parsed.playerName ?? ''),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: GameSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    /* ignore */
  }
}

interface SettingsContextValue extends GameSettings {
  setUseEnglishWords: (value: boolean) => void
  setUseMath: (value: boolean) => void
  setPlayerName: (value: string) => void
  displayPlayerName: string
  settingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(loadSettings)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const setUseEnglishWords = useCallback((useEnglishWords: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, useEnglishWords }
      saveSettings(next)
      return next
    })
  }, [])

  const setUseMath = useCallback((useMath: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, useMath }
      saveSettings(next)
      return next
    })
  }, [])

  const setPlayerName = useCallback((playerName: string) => {
    setSettings((prev) => {
      const next = { ...prev, playerName: sanitizePlayerName(playerName) }
      saveSettings(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      ...settings,
      setUseEnglishWords,
      setUseMath,
      setPlayerName,
      displayPlayerName: getDisplayPlayerName(settings.playerName),
      settingsOpen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    }),
    [settings, setUseEnglishWords, setUseMath, setPlayerName, settingsOpen],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
