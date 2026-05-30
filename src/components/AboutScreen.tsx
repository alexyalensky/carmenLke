import { useGame } from '../context/GameContext'

export function AboutScreen() {
  const { goToMenu } = useGame()

  return (
    <div className="game-over-deluxe">
      <div className="game-over-card" style={{ maxWidth: 560, textAlign: 'start' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--accent-gold)' }}>אודות המשחק</h2>
        <div className="about-text">
          <p>
            משחק זה בהשראת <em>Where in the World is Carmen Sandiego? Deluxe Edition</em> —
            ממשק מפוצל עם תמונות מיקום, שיחת וידאו עם המפקדת, מפת עולם לטיסות,
            ומאגר CrimeNet לחשודים.
          </p>
          <p>
            אתם בלשים בסוכנות דלתא. ארגון הצל גנב אוצרות ברחבי העולם, ועליכם לעקוב
            אחר החשוד, לאסוף רמזים, ולתפוס אותו לפני שיגמר הזמן.
          </p>
          <p>
            28 ערים · 28 חשודים · 3 רמות קושי · CrimeNet · ספר העולם
          </p>
        </div>
        <button type="button" className="btn-secondary btn-large" onClick={goToMenu} style={{ width: '100%', marginBlockStart: '1.5rem' }}>
          חזרה לתפריט
        </button>
      </div>
    </div>
  )
}
