import type { ReactNode } from 'react'
import { formatRealTimeClock } from '../game/types'

const ACTIONS = [
  { id: 'investigate', label: 'חקור', icon: '🔍', desc: 'שאל עדים' },
  { id: 'travel', label: 'טוס', icon: '✈', desc: 'מפת העולם' },
  { id: 'interpol', label: 'CrimeNet', icon: '🗂', desc: 'מאגר חשודים' },
  { id: 'almanac', label: 'ספר עולם', icon: '📖', desc: 'מידע גאוגרפי' },
] as const

export type ActionId = (typeof ACTIONS)[number]['id']

interface ActionToolbarProps {
  onAction: (id: ActionId) => void
  disabled?: Partial<Record<ActionId, boolean>>
}

export function ActionToolbar({ onAction, disabled = {} }: ActionToolbarProps) {
  return (
    <nav className="action-toolbar" aria-label="פעולות חקירה">
      {ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          className="toolbar-btn"
          disabled={disabled[action.id]}
          onClick={() => onAction(action.id)}
        >
          <span className="toolbar-icon">{action.icon}</span>
          <span className="toolbar-label">{action.label}</span>
          <span className="toolbar-desc">{action.desc}</span>
        </button>
      ))}
    </nav>
  )
}

export function StatusBar({
  cityName,
  countryName,
  timeRemaining,
  realTimeRemainingSeconds,
  score,
  rank = 'טירון',
  rankLabel = 'דרגה',
  agentName,
}: {
  cityName: string
  countryName: string
  timeRemaining: number
  realTimeRemainingSeconds?: number | null
  score: number
  rank?: string
  rankLabel?: string
  agentName?: string
}) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <header className="status-bar">
      {agentName && (
        <div className="status-block">
          <span className="status-label">בלש/ית</span>
          <span className="status-value">{agentName}</span>
        </div>
      )}
      <div className="status-block">
        <span className="status-label">תאריך</span>
        <span className="status-value">{dateStr}</span>
      </div>
      <div className="status-block">
        <span className="status-label">מיקום</span>
        <span className="status-value">{cityName}, {countryName}</span>
      </div>
      <div className="status-block">
        <span className="status-label">זמן נותר</span>
        <span className={`status-value ${timeRemaining <= 10 ? 'urgent' : ''}`}>
          {timeRemaining} יחידות
        </span>
      </div>
      {realTimeRemainingSeconds != null && (
        <div className="status-block status-block-timer">
          <span className="status-label">שעון חקירה</span>
          <span
            className={`status-value status-timer ${realTimeRemainingSeconds <= 60 ? 'urgent' : ''} ${realTimeRemainingSeconds <= 30 ? 'critical' : ''}`}
          >
            {formatRealTimeClock(realTimeRemainingSeconds)}
          </span>
        </div>
      )}
      <div className="status-block">
        <span className="status-label">{rankLabel}</span>
        <span className="status-value">{rank}</span>
      </div>
      <div className="status-block">
        <span className="status-label">ניקוד</span>
        <span className="status-value">{score}</span>
      </div>
    </header>
  )
}

export function InfoPanel({
  title,
  children,
  className = '',
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <aside className={`info-panel ${className}`.trim()}>
      <h3 className="info-panel-title">{title}</h3>
      <div className="info-panel-body">{children}</div>
    </aside>
  )
}
