import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { audioEngine, type MusicTrack, type SfxName } from '../audio/AudioEngine'

interface AudioContextValue {
  muted: boolean
  toggleMute: () => void
  unlock: () => Promise<void>
  playMusic: (track: MusicTrack) => void
  playSfx: (name: SfxName) => void
}

const AudioContext = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(audioEngine.muted)

  const unlock = useCallback(async () => {
    await audioEngine.unlock()
  }, [])

  const toggleMute = useCallback(() => {
    const next = audioEngine.toggleMute()
    setMuted(next)
  }, [])

  const playMusic = useCallback((track: MusicTrack) => {
    audioEngine.playMusic(track)
  }, [])

  const playSfx = useCallback((name: SfxName) => {
    audioEngine.playSfx(name)
  }, [])

  const value = useMemo(
    () => ({ muted, toggleMute, unlock, playMusic, playSfx }),
    [muted, toggleMute, unlock, playMusic, playSfx],
  )

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
