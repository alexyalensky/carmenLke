import { useGame } from '../context/GameContext'
import { gameData } from '../data/gameData'
import {
  getActiveSuspects,
  getMatchingSuspects,
  getSuspectClueReveals,
  isSuspectTraitRevealed,
} from '../game/engine'
import { DIFFICULTY_CONFIG } from '../game/types'
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
  const { caseState, doFilter, doClearFilters, setActivePanel } = useGame()
  if (!caseState) return null

  const pool = getActiveSuspects(gameData, caseState)
  const matches = getMatchingSuspects(pool, caseState.suspectFilters)
  const reveals = getSuspectClueReveals(caseState.knownClues)
  const revealedTraits = ALL_TRAITS.filter((t) => (reveals.get(t)?.size ?? 0) > 0)
  const minFilters = DIFFICULTY_CONFIG[caseState.difficulty].minFiltersForWarrant
  const filtersNeeded = Math.max(0, minFilters - caseState.suspectFilters.length)

  return (
    <div className="deluxe-modal-overlay" onClick={() => setActivePanel('none')}>
      <div className="deluxe-modal crimenet-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>🗂 CrimeNet — מאגר החשודים</h2>
          <p>
            סננו לפי תכונות שגיליתם ברמזי חקירה. נדרשות לפחות {minFilters} תכונות כדי להנפיק צו
            מעצר, וחשוד יחיד בלבד.
            {' '}
            ({pool.length} חשודים בחקירה זו)
          </p>
        </header>

        <div className="dossier-grid">
          {pool.map((s) => {
            const isMatch = matches.some((m) => m.id === s.id)
            const isWarrant = caseState.warrantSuspectId === s.id
            return (
              <div
                key={s.id}
                className={`dossier-card ${isMatch ? 'match' : 'filtered-out'} ${isWarrant ? 'warrant' : ''}`}
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
                  {isWarrant && <span className="pill pill-green">צו מעצר</span>}
                </div>
              </div>
            )
          })}
        </div>

        {caseState.warrantSuspectId && (
          <div className="warrant-banner">✓ צו מעצר הונפק — אתם מוכנים למעצר!</div>
        )}

        {!caseState.warrantSuspectId && filtersNeeded > 0 && matches.length > 1 && (
          <div className="alert-banner">
            נותרו {matches.length} חשודים תואמים — הוסיפו עוד {filtersNeeded} סינון/ים.
          </div>
        )}

        {revealedTraits.length === 0 ? (
          <p className="alert-banner">
            אין עדיין רמזי חשוד. חקרו מקומות בעיר כדי לגלות תכונות לסינון.
          </p>
        ) : (
          <div className="filter-section">
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
          חשודים תואמים: <strong>{matches.length}</strong>
          {' · '}
          סינונים: <strong>{caseState.suspectFilters.length}/{minFilters}</strong>
          {' · '}
          רמזי חשוד: <strong>{revealedTraits.length}</strong>
        </p>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={doClearFilters}>
            נקה סינון
          </button>
          <button type="button" className="btn-secondary" onClick={() => setActivePanel('none')}>
            סגור
          </button>
        </div>
      </div>
    </div>
  )
}
