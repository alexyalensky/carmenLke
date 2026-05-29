import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useAudio } from '../context/AudioProvider'
import { useGame } from '../context/GameContext'
import { gameData } from '../data/gameData'
import { getCity, getSuspect } from '../game/engine'
import { SuspectPhoto, TreasurePhoto } from './Photo'
import { ClueText } from './ClueText'

export function ArrestScene() {
  const { caseState, finishArrest } = useGame()
  const { playSfx } = useAudio()
  const [phase, setPhase] = useState(0)

  const won = caseState?.status === 'won'
  const lost = caseState?.status === 'lost'
  const escaped = caseState?.status === 'escaped'

  const realThief = caseState ? getSuspect(gameData, caseState.suspectId) : undefined
  const accusedSuspect = caseState?.selectedSuspectId
    ? getSuspect(gameData, caseState.selectedSuspectId)
    : undefined

  const displaySuspect = useMemo(() => {
    if (!caseState) return undefined
    if (won || escaped) return realThief
    return accusedSuspect ?? realThief
  }, [caseState, won, escaped, realThief, accusedSuspect])

  const loseReason = useMemo(() => {
    if (!caseState || !lost) return ''
    const wrongPerson = caseState.selectedSuspectId !== caseState.suspectId
    const wrongSite = caseState.lastArrestSiteId !== caseState.hideoutSiteId
    if (wrongPerson && realThief && accusedSuspect) {
      return `טעיתם בחשוד! ${accusedSuspect.nickname} נמלט/ת — הגנב האמיתי היה ${realThief.name}.`
    }
    if (wrongSite) {
      const hideoutSite = getCity(gameData, caseState.currentCityId)?.sites.find(
        (s) => s.id === caseState.hideoutSiteId,
      )
      return `הגנב לא היה כאן! המחבוא האמיתי היה ב${hideoutSite?.name ?? 'מקום אחר'}.`
    }
    return `${displaySuspect?.nickname ?? 'החשוד'} הצליח/ה להימלט מהמעצר.`
  }, [caseState, lost, realThief, accusedSuspect, displaySuspect])

  const outcomeClass = won ? 'arrest-won' : escaped ? 'arrest-escaped' : 'arrest-lost'

  useEffect(() => {
    playSfx('arrest')
    const t1 = window.setTimeout(() => setPhase(1), 500)
    const t2 = window.setTimeout(() => {
      setPhase(2)
      playSfx(won ? 'win' : 'lose')
    }, 1800)
    const t3 = window.setTimeout(() => setPhase(3), 3200)
    const t4 = window.setTimeout(() => setPhase(4), 4200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [playSfx, won])

  if (!caseState || !displaySuspect) return null

  const titleByPhase = () => {
    if (phase < 2) return won ? 'מעצרים!' : escaped ? 'הזמן אזל!' : 'מנסים לעצור!'
    if (won) return 'נתפס!'
    if (escaped) return 'נמלט!'
    return 'ברח!'
  }

  const subtitleByPhase = () => {
    if (phase < 2) {
      return `${displaySuspect.nickname} (${displaySuspect.name})`
    }
    if (won) {
      return `עצרתם את ${realThief?.name ?? displaySuspect.name} והחזרתם את ${caseState.stolenTreasure}!`
    }
    if (escaped) {
      return caseState.escapeReason === 'realTime'
        ? `שעון החקירה הגיע לאפס — ${realThief?.nickname ?? displaySuspect.nickname} (${realThief?.name ?? displaySuspect.name}) הצליח/ה להימלט.`
        : `נגמרו יחידות הזמן — ${realThief?.nickname ?? displaySuspect.nickname} (${realThief?.name ?? displaySuspect.name}) הצליח/ה להימלט.`
    }
    return loseReason
  }

  return (
    <div className={`arrest-scene ${outcomeClass} phase-${phase}`}>
      <div className="arrest-sirens" aria-hidden="true">
        <span className="arrest-siren arrest-siren-left" />
        <span className="arrest-siren arrest-siren-right" />
      </div>

      <div className="arrest-lights" aria-hidden="true">
        <span className="arrest-light arrest-light-red" />
        <span className="arrest-light arrest-light-blue" />
      </div>

      {won && <div className="arrest-spotlight" aria-hidden="true" />}

      <div className="arrest-flash" aria-hidden="true" />

      {(lost || escaped) && phase >= 1 && (
        <div className="arrest-smoke" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="arrest-smoke-puff" style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
      )}

      <div className="arrest-stage">
        <p className="arrest-badge">{won ? '🚔 מעצר מוצלח' : escaped ? '⏱ הזמן אזל' : '🚨 המעצר נכשל'}</p>

        <div className={`arrest-suspect-wrap ${won ? 'cuffed' : 'fleeing'}`}>
          {won && (
            <>
              <span className="arrest-cuff arrest-cuff-left" aria-hidden="true">
                ⛓
              </span>
              <span className="arrest-badge-caught" aria-hidden="true">
                נתפס!
              </span>
            </>
          )}
          <div className="arrest-mugshot">
            <SuspectPhoto suspect={displaySuspect} name={displaySuspect.name} />
            {(lost || escaped) && phase >= 2 && (
              <span className="arrest-speed-lines" aria-hidden="true">
                💨
              </span>
            )}
          </div>
          {won && (
            <span className="arrest-cuff arrest-cuff-right" aria-hidden="true">
              ⛓
            </span>
          )}
        </div>

        <h2 className="arrest-title">{titleByPhase()}</h2>
        <p className="arrest-subtitle">{subtitleByPhase()}</p>

        {won && phase >= 2 && (
          <div className="arrest-treasure">
            <TreasurePhoto treasureId={caseState.stolenTreasureId} name={caseState.stolenTreasure} />
            <p className="arrest-treasure-caption">האוצר הוחזר!</p>
          </div>
        )}

        {phase >= 2 && caseState.knownClues.length > 0 && (
          <div className="arrest-clues-panel">
            <h3 className="arrest-clues-heading">רמזים שנאספו</h3>
            <ul className="arrest-clues-list">
              {caseState.knownClues.map((clue) => (
                <li
                  key={clue.id}
                  className={clue.type === 'suspect' ? 'arrest-clue-suspect' : 'arrest-clue-travel'}
                >
                  {clue.type === 'suspect' && <span className="clue-tag">חשוד</span>}
                  <ClueText clue={clue} showSiteInfo />
                </li>
              ))}
            </ul>
          </div>
        )}

        {phase >= 4 && (
          <button type="button" className="btn-primary btn-large arrest-continue" onClick={finishArrest}>
            המשך
          </button>
        )}
      </div>

      {won && (
        <div className="arrest-confetti" aria-hidden="true">
          {Array.from({ length: 36 }, (_, i) => (
            <span key={i} className="arrest-confetti-piece" style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
      )}
    </div>
  )
}
