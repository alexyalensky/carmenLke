import { chiefPhoto } from '../assets/images'

interface ChiefMonitorProps {
  message: string
  title?: string
  variant?: 'briefing' | 'alert' | 'hint'
}

export function ChiefMonitor({ message, title = 'המפקדת', variant = 'briefing' }: ChiefMonitorProps) {
  return (
    <div className={`chief-monitor chief-${variant}`}>
      <div className="chief-screen">
        <div className="chief-video">
          <img src={chiefPhoto} alt="המפקדת" />
          <span className="chief-live">● LIVE</span>
        </div>
        <div className="chief-text">
          <strong className="chief-title">{title}</strong>
          <p>{message}</p>
        </div>
      </div>
    </div>
  )
}
