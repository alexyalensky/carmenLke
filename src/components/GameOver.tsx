import { useGame } from '../context/GameContext'
import { gameData } from '../data/gameData'
import { wrongSuspectArrestMessage, wrongCityArrestMessage, wonArrestMessage } from '../game/arrestMessages'
import { getSuspect } from '../game/engine'
import { SuspectPhoto, TreasurePhoto } from './Photo'

export function GameOver() {
  const { caseState, goToMenu, startGame } = useGame()
  if (!caseState) return null

  const suspect = getSuspect(gameData, caseState.suspectId)
  const accused = caseState.selectedSuspectId
    ? getSuspect(gameData, caseState.selectedSuspectId)
    : undefined

  let title = ''
  let message = ''

  switch (caseState.status) {
    case 'won':
      title = '🏆 התיק נסגר!'
      message =
        suspect != null
          ? wonArrestMessage(
              suspect,
              caseState.stolenTreasure,
              caseState.lastArrestSiteId === caseState.hideoutSiteId,
            )
          : `החזרתם את ${caseState.stolenTreasure}!`
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
      if (caseState.arrestLossReason === 'wrongSuspect' && accused) {
        message = wrongSuspectArrestMessage(accused)
      } else if (caseState.arrestAttempted) {
        message = wrongCityArrestMessage()
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
          {(caseState.status === 'lost' && accused ? accused : suspect) && (
            <SuspectPhoto
              suspect={(caseState.status === 'lost' && accused ? accused : suspect)!}
              name={(caseState.status === 'lost' && accused ? accused : suspect)!.name}
            />
          )}
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
