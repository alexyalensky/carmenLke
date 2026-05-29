import { useEffect, useState, type CSSProperties } from 'react'
import { useAudio } from '../context/AudioProvider'
import { useGame } from '../context/GameContext'
import { gameData } from '../data/gameData'
import { getSuspect } from '../game/engine'
import { SuspectPhoto, TreasurePhoto } from './Photo'

export function ArrestScene() {
  const { caseState, finishArrest } = useGame()
  const { playSfx } = useAudio()
  const [phase, setPhase] = useState(0)

  const won = caseState?.status === 'won'
  const suspect = caseState ? getSuspect(gameData, caseState.suspectId) : undefined

  useEffect(() => {
    playSfx('arrest')
    const t1 = window.setTimeout(() => setPhase(1), 400)
    const t2 = window.setTimeout(() => {
      setPhase(2)
      playSfx(won ? 'win' : 'lose')
    }, 1400)
    const t3 = window.setTimeout(() => setPhase(3), 2600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [playSfx, won])

  if (!caseState || !suspect) return null

  return (
    <div className={`arrest-scene ${won ? 'arrest-won' : 'arrest-lost'} phase-${phase}`}>
      <div className="arrest-lights" aria-hidden="true">
        <span className="arrest-light arrest-light-red" />
        <span className="arrest-light arrest-light-blue" />
      </div>

      <div className="arrest-flash" aria-hidden="true" />

      <div className="arrest-stage">
        <p className="arrest-badge">🚔 מעצר</p>

        <div className="arrest-suspect-wrap">
          <span className="arrest-cuff arrest-cuff-left" aria-hidden="true">
            ⛓
          </span>
          <div className="arrest-mugshot">
            <SuspectPhoto suspect={suspect} name={suspect.name} />
          </div>
          <span className="arrest-cuff arrest-cuff-right" aria-hidden="true">
            ⛓
          </span>
        </div>

        <h2 className="arrest-title">
          {phase < 2 ? 'מעצרים!' : won ? 'נתפס!' : 'החמקה!'}
        </h2>

        <p className="arrest-subtitle">
          {phase < 2
            ? `${suspect.nickname} (${suspect.name})`
            : won
              ? `עצרתם את ${suspect.name} והחזרתם את ${caseState.stolenTreasure}!`
              : `${suspect.nickname} הצליח/ה להימלט מהמעצר.`}
        </p>

        {won && phase >= 2 && (
          <div className="arrest-treasure">
            <TreasurePhoto treasureId={caseState.stolenTreasureId} name={caseState.stolenTreasure} />
          </div>
        )}

        {phase >= 3 && (
          <button type="button" className="btn-primary btn-large arrest-continue" onClick={finishArrest}>
            המשך
          </button>
        )}
      </div>

      {won && (
        <div className="arrest-confetti" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} className="arrest-confetti-piece" style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
      )}
    </div>
  )
}
