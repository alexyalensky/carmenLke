import { useEffect, useState } from 'react'
import { useGame } from '../context/GameContext'
import { useSettings } from '../context/SettingsContext'

export function SettingsPanel() {
  const { startGame, caseState } = useGame()
  const {
    useEnglishWords,
    setUseEnglishWords,
    useMath,
    setUseMath,
    playerName,
    setPlayerName,
    settingsOpen,
    closeSettings,
  } = useSettings()
  const [confirmNewGame, setConfirmNewGame] = useState(false)

  useEffect(() => {
    if (!settingsOpen) setConfirmNewGame(false)
  }, [settingsOpen])

  if (!settingsOpen) return null

  const beginNewGame = () => {
    setConfirmNewGame(false)
    closeSettings()
    void startGame()
  }

  const handleNewGame = () => {
    if (caseState?.status === 'active') {
      setConfirmNewGame(true)
      return
    }
    beginNewGame()
  }

  return (
    <div className="deluxe-modal-overlay" onClick={closeSettings}>
      <div className="deluxe-modal settings-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>⚙ הגדרות</h2>
          <p>התאימו את חוויית המשחק והלמידה.</p>
        </header>

        <details className="settings-instructions">
          <summary>📖 איך משחקים?</summary>
          <div className="settings-instructions-body">
            <p>
              אתם בלשים בסוכנות דלתא. ארגון הצל גנב אוצר — עקבו אחר החשוד ברחבי העולם,
              אספו רמזים, והנפיקו צו מעצר לפני שיגמר הזמן.
            </p>
            <ol>
              <li>
                <strong>חקור</strong> — בחרו מקום בעיר ושאלו עדים. כל חקירה עולה יחידת זמן
                ומעניקה רמז על היעד הבא (שפה, מטבע, דגל ועוד) או על תכונות החשוד.
              </li>
              <li>
                <strong>טוס</strong> — השתמשו במפת העולם כדי לטוס לעיר הבאה במסלול החשוד.
                טיסה ליעד שגוי מבזבזת יותר זמן.
              </li>
              <li>
                <strong>CrimeNet</strong> — סננו חשודים לפי תכונות שגיליתם ברמזים. נדרשות מספיק
                תכונות (לפי הקושי) כדי להנפיק צו מעצר על חשוד יחיד.
              </li>
              <li>
                <strong>ספר עולם</strong> — חפשו מידע גאוגרפי (מדינות, שפות, מטבעות) כדי לפענח
                את הרמזים.
              </li>
              <li>
                <strong>מעצר</strong> — כשמגיעים לעיר המחבוא עם צו מעצר בתוקף, חקרו ובצעו מעצר
                על החשוד הנכון.
              </li>
            </ol>
            <p className="settings-instructions-tip">
              טיפ: בחרו רמת קושי בתפריט הראשי. אפשר להפעיל מילים באנגלית ברמזים ותרגילי חשבון
              לפני רמז — כאן בהגדרות.
            </p>
          </div>
        </details>

        <div className="settings-options">
          <div className="settings-field">
            <label htmlFor="player-name">שם הבלש/ית</label>
            <input
              id="player-name"
              type="text"
              className="settings-text-input"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="בלש"
              maxLength={24}
              autoComplete="nickname"
            />
            <span className="settings-field-hint">השם יופיע במסך המשחק ובתפריט.</span>
          </div>

          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={useEnglishWords}
              onChange={(e) => setUseEnglishWords(e.target.checked)}
            />
            <span className="settings-toggle-body">
              <strong>מילים באנגלית ברמזים</strong>
              <span className="settings-toggle-hint">
                {useEnglishWords
                  ? 'מילים באנגלית מודגשות — לחצו לשמוע באנגלית ואז תרגום לעברית.'
                  : 'רמזים בעברית בלבד — ללא מילים באנגלית.'}
              </span>
            </span>
          </label>

          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={useMath}
              onChange={(e) => setUseMath(e.target.checked)}
            />
            <span className="settings-toggle-body">
              <strong>תרגילי חשבון לפני רמז</strong>
              <span className="settings-toggle-hint">
                {useMath
                  ? 'לפעמים לפני חקירה — תרגיל לפי הקושי. אפשר לדלג בתשלום בזמן.'
                  : 'חקירות מעניקות רמז מיד, ללא תרגיל חשבון.'}
              </span>
            </span>
          </label>
        </div>

        <div className="settings-actions">
          <button type="button" className="btn-primary" onClick={handleNewGame}>
            ▶ משחק חדש
          </button>
          <button type="button" className="btn-secondary modal-close" onClick={closeSettings}>
            סגור
          </button>
        </div>
      </div>

      {confirmNewGame && (
        <div
          className="confirm-dialog-overlay"
          onClick={() => setConfirmNewGame(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-game-confirm-title"
        >
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 id="new-game-confirm-title">משחק חדש?</h3>
            <p>להתחיל משחק חדש? ההתקדמות הנוכחית תאבד.</p>
            <div className="confirm-dialog-actions">
              <button type="button" className="btn-primary" onClick={beginNewGame}>
                כן, התחל מחדש
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirmNewGame(false)}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function SettingsButton() {
  const { openSettings } = useSettings()

  return (
    <button
      type="button"
      className="settings-fab"
      onClick={openSettings}
      title="הגדרות"
      aria-label="הגדרות"
    >
      ⚙
    </button>
  )
}
