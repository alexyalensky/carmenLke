import { menuBg } from '../assets/images'
import { useAudio } from '../context/AudioProvider'
import { useGame } from '../context/GameContext'
import { useSettings } from '../context/SettingsContext'
import { DIFFICULTY_CONFIG, type Difficulty } from '../game/types'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

export function MainMenu() {
  const { startGame, showAbout, difficulty, setDifficulty } = useGame()
  const { useEnglishWords, setUseEnglishWords, useMath, setUseMath, timedInvestigation, setTimedInvestigation, displayPlayerName, openSettings } =
    useSettings()
  const { unlock } = useAudio()

  const handleStart = async () => {
    await unlock()
    startGame()
  }

  const handleAbout = async () => {
    await unlock()
    showAbout()
  }

  return (
    <div className="main-menu-deluxe">
      <img src={menuBg} alt="" className="menu-bg" aria-hidden="true" />
      <div className="menu-overlay" />
      <div className="menu-content">
        <div className="menu-brand">
          <span className="menu-agency">סוכנות דלתא</span>
          <h1>איפה בעולם?</h1>
          <p className="menu-tagline">
            משחק גאוגרפיה וחקירה בהשראת קלאסיקת ה-VGA
            <br />
            עקבו אחר ארגון הצל ברחבי העולם
          </p>
          <p className="menu-agent-name">בלש/ית: {displayPlayerName}</p>
        </div>

        <div className="difficulty-picker">
          <span className="difficulty-label">רמת קושי</span>
          <div className="difficulty-options">
            {DIFFICULTIES.map((d) => {
              const cfg = DIFFICULTY_CONFIG[d]
              return (
                <button
                  key={d}
                  type="button"
                  className={`difficulty-btn ${difficulty === d ? 'selected' : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  <strong>{cfg.label}</strong>
                  <span>{cfg.suspectPoolSize} חשודים</span>
                  <span>
                    {timedInvestigation
                      ? `${cfg.realTimeLimitSeconds / 60} דק' שעון · ${cfg.initialTime} יחידות`
                      : `${cfg.initialTime} יחידות זמן`}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="menu-settings">
          <label className="settings-toggle menu-settings-toggle">
            <input
              type="checkbox"
              checked={useEnglishWords}
              onChange={(e) => setUseEnglishWords(e.target.checked)}
            />
            <span className="settings-toggle-body">
              <strong>מילים באנגלית ברמזים</strong>
              <span className="settings-toggle-hint">
                לחצו על מילה לשמיעה באנגלית ואז בעברית
              </span>
            </span>
          </label>
          <label className="settings-toggle menu-settings-toggle">
            <input
              type="checkbox"
              checked={useMath}
              onChange={(e) => setUseMath(e.target.checked)}
            />
            <span className="settings-toggle-body">
              <strong>תרגילי חשבון לפני רמז</strong>
              <span className="settings-toggle-hint">
                לפעמים תרגיל לפי הקושי — או דילוג בתשלום בזמן
              </span>
            </span>
          </label>
          <label className="settings-toggle menu-settings-toggle">
            <input
              type="checkbox"
              checked={timedInvestigation}
              onChange={(e) => setTimedInvestigation(e.target.checked)}
            />
            <span className="settings-toggle-body">
              <strong>חקירה בזמן אמת</strong>
              <span className="settings-toggle-hint">
                שעון יורד בזמן אמת — כשהוא מגיע לאפס הגנב/ת נמלט/ת
              </span>
            </span>
          </label>
          <button type="button" className="btn-secondary btn-small" onClick={openSettings}>
            ⚙ עוד הגדרות
          </button>
        </div>

        <div className="menu-actions">
          <button type="button" className="btn-primary btn-large" onClick={handleStart}>
            ▶ משחק חדש
          </button>
          <button type="button" className="btn-secondary btn-large" onClick={handleAbout}>
            אודות המשחק
          </button>
        </div>
        <footer className="menu-footer">
          22 ערים · 28 חשודים · CrimeNet · ספר העולם
        </footer>
      </div>
    </div>
  )
}
