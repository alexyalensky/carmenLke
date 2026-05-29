import { useAudio } from '../context/AudioProvider'

interface MuteButtonProps {
  className?: string
}

export function MuteButton({ className = '' }: MuteButtonProps) {
  const { muted, toggleMute, unlock } = useAudio()

  return (
    <button
      type="button"
      className={`mute-btn ${className}`.trim()}
      onClick={async () => {
        await unlock()
        toggleMute()
      }}
      aria-label={muted ? 'הפעל צליל' : 'השתק צליל'}
      title={muted ? 'הפעל צליל' : 'השתק צליל'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
