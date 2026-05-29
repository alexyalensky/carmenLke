import { useGame } from '../context/GameContext'
import { gameData } from '../data/gameData'
import {
  getActiveSuspects,
  getMatchingSuspects,
  getSuspectClueReveals,
  isAtFinalCity,
  isSuspectTraitRevealed,
} from '../game/engine'
import type { SuspectTrait } from '../game/types'
import { SuspectPhoto } from './Photo'

const TRAIT_LABELS: Record<SuspectTrait, string> = {
  hair: 'שיער',
  hobby: 'תחביב',
  vehicle: 'רכב',
  gender: 'מגדר',
  build: 'מבנה גוף',
}

const ALL_TRAITS = Object.keys(TRAIT_LABELS) as SuspectTrait[]

export function InterpolPanel() {
  const { caseState, doFilter, doClearFilters, doSelectSuspect, setActivePanel } = useGame()
  if (!caseState) return null

  const pool = getActiveSuspects(gameData, caseState)
  const highlighted = getMatchingSuspects(pool, caseState.suspectFilters)
  const reveals = getSuspectClueReveals(caseState.knownClues)
  const revealedTraits = ALL_TRAITS.filter((t) => (reveals.get(t)?.size ?? 0) > 0)
  const atFinal = isAtFinalCity(caseState)

  return (
    <div className="deluxe-modal-overlay" onClick={() => setActivePanel('none')}>
      <div className="deluxe-modal crimenet-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>🗂 CrimeNet — מאגר החשודים</h2>
          <p>
            סמנו תכונות לפי הרמזים שאספתם — חשודים תואמים יודגשו במסגרת.
            {atFinal && ' בחרו את החשוד שאתם מאשימים ולכו לחקירה לביצוע המעצר.'}
            {' '}
            ({pool.length} חשודים בחקירה)
          </p>
        </header>

        <div className="dossier-grid">
          {pool.map((s) => {
            const isHighlighted =
              caseState.suspectFilters.length === 0 ||
              highlighted.some((m) => m.id === s.id)
            const isSelected = caseState.selectedSuspectId === s.id
            return (
              <button
                key={s.id}
                type="button"
                className={`dossier-card dossier-card-btn ${isHighlighted ? 'highlighted' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => doSelectSuspect(s.id)}
              >
                <SuspectPhoto suspect={s} name={s.name} />
                <div className="dossier-info">
                  <h4>{s.nickname}</h4>
                  <p>{s.name}</p>
                  <dl className="dossier-traits">
                    {ALL_TRAITS.map((trait) => (
                      <span key={trait} className="dossier-trait-row">
                        <dt>{TRAIT_LABELS[trait]}</dt>
                        <dd>
                          {isSuspectTraitRevealed(caseState.knownClues, trait, s[trait])
                            ? s[trait]
                            : '???'}
                        </dd>
                      </span>
                    ))}
                  </dl>
                  {isSelected && <span className="pill pill-green">חשוד נבחר</span>}
                </div>
              </button>
            )
          })}
        </div>

        {caseState.selectedSuspectId && (
          <div className="selection-banner">
            ✓ בחרתם חשוד — {atFinal ? 'לכו לחקירה ובחרו את מקום המחבוא.' : 'המשיכו לעקוב אחרי הגנב.'}
          </div>
        )}

        {atFinal && !caseState.selectedSuspectId && (
          <div className="alert-banner">
            הגעתם לעיר המחבוא! בחרו חשוד מהרשימה למעלה, ואז חקור מקום לביצוע המעצר.
          </div>
        )}

        {revealedTraits.length === 0 ? (
          <p className="alert-banner">
            אין עדיין רמזי חשוד. חקרו מקומות בעיר כדי לגלות תכונות לסימון.
          </p>
        ) : (
          <div className="filter-section">
            <p className="filter-section-hint">לחצו על תכונה לסימון — חשודים תואמים יודגשו:</p>
            {revealedTraits.map((trait) => (
              <div key={trait} className="filter-group">
                <label>{TRAIT_LABELS[trait]}</label>
                <div className="chip-group">
                  {[...(reveals.get(trait) ?? [])].map((value) => {
                    const selected = caseState.suspectFilters.some(
                      (f) => f.trait === trait && f.value === value,
                    )
                    return (
                      <button
                        key={value}
                        type="button"
                        className={`chip ${selected ? 'selected' : ''}`}
                        onClick={() => doFilter(trait, value)}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="match-count">
          חשודים מודגשים: <strong>{caseState.suspectFilters.length ? highlighted.length : pool.length}</strong>
          {' · '}
          סימונים: <strong>{caseState.suspectFilters.length}</strong>
          {' · '}
          רמזי חשוד: <strong>{revealedTraits.length}</strong>
        </p>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={doClearFilters}>
            נקה סימונים
          </button>
          <button type="button" className="btn-secondary" onClick={() => setActivePanel('none')}>
            סגור
          </button>
        </div>
      </div>
    </div>
  )
}
