import { useGame } from '../context/GameContext'
import { gameData } from '../data/gameData'
import { getSuspect } from '../game/engine'
import { SuspectPhoto, TreasurePhoto } from './Photo'

export function GameOver() {
  const { caseState, goToMenu, startGame } = useGame()
  if (!caseState) return null

  const suspect = getSuspect(gameData, caseState.suspectId)

  let title = ''
  let message = ''

  switch (caseState.status) {
    case 'won':
      title = '🏆 התיק נסגר!'
      message = `עצרתם את ${suspect?.name ?? 'החשוד'} (${suspect?.nickname}) והחזרתם את ${caseState.stolenTreasure}!`
      break
    case 'escaped':
      title = '⏱ החשוד נמלט!'
      message =
        caseState.escapeReason === 'realTime'
          ? `שעון החקירה הגיע לאפס — ${suspect?.nickname ?? 'החשוד'} (${suspect?.name ?? 'לא ידוע'}) הצליח/ה להימלט. נסו שוב!`
          : `נגמרו יחידות הזמן — ${suspect?.nickname ?? 'החשוד'} (${suspect?.name ?? 'לא ידוע'}) הצליח/ה להימלט. נסו שוב!`
      break
    case 'lost':
      title = '❌ המעצר נכשל'
      if (caseState.arrestAttempted && caseState.selectedSuspectId !== caseState.suspectId) {
        const accused = caseState.selectedSuspectId
          ? getSuspect(gameData, caseState.selectedSuspectId)
          : undefined
        message = `טעיתם בחשוד! ${accused?.nickname ?? 'החשוד'} לא היה/הייתה הגנב/ת — ${suspect?.name ?? 'האמת'} נמלט/ת.`
      } else if (caseState.arrestAttempted) {
        message = `מעצר במקום הלא נכון — ${suspect?.nickname ?? 'החשוד'} (${suspect?.name ?? 'לא ידוע'}) נמלט/ת.`
      } else {
        message = 'החקירה נכשלה.'
      }
      break
    default:
      return null
  }

  return (
    <div className={`game-over-deluxe ${caseState.status}`}>
      <div className="game-over-card">
        <div className="game-over-visuals">
          {suspect && <SuspectPhoto suspect={suspect} name={suspect.name} />}
          <TreasurePhoto treasureId={caseState.stolenTreasureId} name={caseState.stolenTreasure} />
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
        <p className="final-score">ניקוד סופי: <strong>{caseState.score}</strong></p>
        <div className="game-over-actions">
          <button type="button" className="btn-primary btn-large" onClick={startGame}>
            משחק חדש
          </button>
          <button type="button" className="btn-secondary btn-large" onClick={goToMenu}>
            תפריט ראשי
          </button>
        </div>
      </div>
    </div>
  )
}
