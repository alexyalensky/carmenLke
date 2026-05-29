import { INITIAL_TIME } from '../game/types'

interface TimerBarProps {
  timeRemaining: number
}

export function TimerBar({ timeRemaining }: TimerBarProps) {
  const pct = Math.max(0, (timeRemaining / INITIAL_TIME) * 100)
  const low = timeRemaining <= 10

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
        <span>זמן נותר</span>
        <span>{timeRemaining} יחידות</span>
      </div>
      <div className="timer-bar">
        <div className={`timer-fill ${low ? 'low' : ''}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
