import { useEffect, useRef, useState } from 'react'
import { useGame } from '../context/GameContext'
import { useSettings } from '../context/SettingsContext'
import { gameData } from '../data/gameData'
import { getCity, getSuspect, isAtFinalCity } from '../game/engine'
import { generateMathProblem, rollMathChallenge } from '../game/mathProblems'
import type { Clue, InvestigationSite } from '../game/types'
import { TIME_COST } from '../game/types'
import { ClueText } from './ClueText'
import { MathChallenge } from './MathChallenge'
import { ScenePhoto, SitePhoto, SuspectPhoto, WitnessPhoto } from './Photo'

interface InvestigateModalProps {
  cityId: string
  investigatedSites: string[]
}

export function InvestigateModal({ cityId, investigatedSites }: InvestigateModalProps) {
  const { doInvestigate, doInvestigateWithMathSkip, doArrest, caseState, setActivePanel } = useGame()
  const { useMath } = useSettings()
  const [lastClues, setLastClues] = useState<Clue[]>([])
  const [lastWitnessSiteId, setLastWitnessSiteId] = useState<string | null>(null)
  const [previewSiteId, setPreviewSiteId] = useState<string | null>(null)
  const [pendingSite, setPendingSite] = useState<InvestigationSite | null>(null)
  const [mathProblem, setMathProblem] = useState<ReturnType<typeof generateMathProblem> | null>(
    null,
  )
  const prevClueCount = useRef(caseState?.knownClues.length ?? 0)
  const city = getCity(gameData, cityId)
  const atFinal = caseState ? isAtFinalCity(caseState) : false
  const selectedSuspect = caseState?.selectedSuspectId
    ? getSuspect(gameData, caseState.selectedSuspectId)
    : undefined

  const findSite = (siteId: string | null): InvestigationSite | undefined =>
    siteId ? city?.sites.find((s) => s.id === siteId) : undefined

  const heroSite =
    findSite(previewSiteId) ?? findSite(lastWitnessSiteId) ?? city?.sites[0]

  useEffect(() => {
    if (!caseState) return
    if (caseState.knownClues.length > prevClueCount.current) {
      const newClues = caseState.knownClues.slice(prevClueCount.current)
      setLastClues(newClues)
      prevClueCount.current = caseState.knownClues.length
    }
  }, [caseState, caseState?.knownClues.length])

  if (!city || !caseState) return null

  const lastWitnessSite = findSite(lastWitnessSiteId)

  const finishInvestigation = (site: InvestigationSite) => {
    setLastWitnessSiteId(site.id)
    doInvestigate(site.id)
  }

  const beginInvestigation = (site: InvestigationSite) => {
    if (useMath && rollMathChallenge()) {
      setPendingSite(site)
      setMathProblem(generateMathProblem(caseState.difficulty))
      return
    }
    finishInvestigation(site)
  }

  const completeMathChallenge = () => {
    if (!pendingSite) return
    finishInvestigation(pendingSite)
    setPendingSite(null)
    setMathProblem(null)
  }

  const skipMathChallenge = () => {
    if (!pendingSite) return
    setLastWitnessSiteId(pendingSite.id)
    doInvestigateWithMathSkip(pendingSite.id)
    setPendingSite(null)
    setMathProblem(null)
  }

  const cancelMathChallenge = () => {
    setPendingSite(null)
    setMathProblem(null)
  }

  return (
    <div className="deluxe-modal-overlay" onClick={() => setActivePanel('none')}>
      <div className="deluxe-modal investigate-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>🔍 חקירה — {city.name}</h2>
          <p>
            בחרו מקום לבקר. כל חקירה עולה {TIME_COST.investigate} יחידות זמן.
            {atFinal && ' בחרו את מקום המחבוא לביצוע המעצר.'}
            {useMath
              ? ' לפעמים יופיע תרגיל חשבון — אפשר גם לדלג בתשלום בזמן.'
              : ' לחצו על מילים באנגלית כדי לשמוע אותן.'}
          </p>
        </header>

        <div className="investigate-layout">
          {heroSite && (
            <ScenePhoto
              key={heroSite.id}
              scene={heroSite.scene}
              siteId={heroSite.id}
              name={heroSite.name}
              className="investigate-scene"
            />
          )}

          <div className="site-picker">
            {city.sites.map((site) => {
              const key = `${cityId}:${site.id}`
              const visited = investigatedSites.includes(key)
              const isActive = heroSite?.id === site.id
              const canArrest = atFinal && !!caseState.selectedSuspectId

              return (
                <button
                  key={site.id}
                  type="button"
                  className={`site-card-deluxe ${visited && !atFinal ? 'visited' : ''} ${isActive ? 'active' : ''} ${canArrest ? 'arrest-ready' : ''}`}
                  disabled={visited && !atFinal}
                  onMouseEnter={() => setPreviewSiteId(site.id)}
                  onMouseLeave={() => setPreviewSiteId(null)}
                  onFocus={() => setPreviewSiteId(site.id)}
                  onBlur={() => setPreviewSiteId(null)}
                  onClick={() => {
                    if (canArrest) {
                      doArrest(site.id)
                    } else if (!visited) {
                      beginInvestigation(site)
                    }
                  }}
                >
                  <SitePhoto scene={site.scene} siteId={site.id} name={site.name} />
                  <div className="site-card-info">
                    <strong>{site.name}</strong>
                    {visited && !atFinal && <span className="pill pill-green">נחקר</span>}
                    {canArrest && <span className="pill pill-red">מעצר ({TIME_COST.arrest} זמן)</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {lastClues.length > 0 && lastWitnessSite && (
          <div className="witness-statement">
            <WitnessPhoto
              scene={lastWitnessSite.scene}
              siteId={lastWitnessSite.id}
              className="witness-avatar"
            />
            <div className="speech-bubble">
              <strong>עד אומר:</strong>
              {lastClues.map((clue) => (
                <p key={clue.id}>
                  <ClueText clue={clue} />
                </p>
              ))}
            </div>
          </div>
        )}

        {atFinal && selectedSuspect && (
          <div className="suspect-spotted">
            <SuspectPhoto suspect={selectedSuspect} name={selectedSuspect.name} size={64} />
            <p>
              חשוד נבחר: {selectedSuspect.nickname} ({selectedSuspect.name}) — בחרו מקום לביצוע המעצר!
            </p>
          </div>
        )}

        {atFinal && !caseState.selectedSuspectId && (
          <p className="alert-banner">
            מישהו מארגון הצל מסתתר כאן! פתחו CrimeNet, סמנו רמזים ובחרו את החשוד שאתם מאשימים.
          </p>
        )}

        <button type="button" className="btn-secondary modal-close" onClick={() => setActivePanel('none')}>
          סגור
        </button>
      </div>

      {pendingSite && mathProblem && (
        <MathChallenge
          problem={mathProblem}
          difficulty={caseState.difficulty}
          siteName={pendingSite.name}
          skipCost={TIME_COST.mathSkip}
          investigateCost={TIME_COST.investigate}
          onCorrect={completeMathChallenge}
          onSkip={skipMathChallenge}
          onCancel={cancelMathChallenge}
        />
      )}
    </div>
  )
}
