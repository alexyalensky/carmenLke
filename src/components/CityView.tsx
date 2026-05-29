import { useGame } from '../context/GameContext'
import { useSettings } from '../context/SettingsContext'
import { useAudio } from '../context/AudioProvider'
import { gameData } from '../data/gameData'
import { getCity, getDifficultyLabel, isAtFinalCity, wasCityVisitedByThief } from '../game/engine'
import { ChiefMonitor } from './ChiefMonitor'
import { ActionToolbar, InfoPanel, StatusBar, type ActionId } from './GameChrome'
import { CityPhoto, TreasurePhoto } from './Photo'
import { AlmanacPanel } from './AlmanacPanel'
import { InvestigateModal } from './InvestigateModal'
import { InterpolPanel } from './InterpolPanel'
import { ClueText } from './ClueText'
import { WorldMapTravel } from './WorldMapTravel'

export function CityView() {
  const { caseState, activePanel, setActivePanel, realTimeRemainingSeconds } = useGame()
  const { displayPlayerName } = useSettings()
  const { playSfx } = useAudio()
  if (!caseState) return null

  const city = getCity(gameData, caseState.currentCityId)
  const country = gameData.almanac.find((a) => a.id === city?.countryId)
  const onTrail = wasCityVisitedByThief(caseState, caseState.currentCityId)
  const atFinal = isAtFinalCity(caseState)

  const handleAction = (id: ActionId) => {
    playSfx('panel')
    setActivePanel(id === 'investigate' ? 'investigate' : id === 'travel' ? 'travel' : id === 'interpol' ? 'interpol' : 'almanac')
  }

  let chiefMessage = 'אתם על מסלול החקירה. חקור מקומות לאסוף רמזים על היעד הבא ועל תכונות החשוד.'
  if (atFinal) {
    chiefMessage = caseState.selectedSuspectId
      ? 'הגעתם לעיר המחבוא! בחרו מקום לביצוע המעצר נגד החשוד שבחרתם.'
      : 'הגעתם לעיר המחבוא! פתחו CrimeNet ובחרו את החשוד שאתם מאשימים.'
  } else if (onTrail) {
    chiefMessage = 'נראה שהחשוד היה כאן. חקור מקומות בעיר כדי לאסוף רמזים על היעד הבא.'
  } else if (caseState.mustReturnToCityId) {
    const home = getCity(gameData, caseState.mustReturnToCityId)
    chiefMessage = `טעיתם ביעד! חזרו ל${home?.name ?? 'עיר המוצא'} — שם תוכלו לחקור מחדש את העדים.`
  } else if (caseState.lastTravelWasCorrect === false) {
    chiefMessage = 'טעיתם ביעד! בזבזתם זמן יקר. חזרו למסלול הנכון.'
  } else if (caseState.lastTravelWasCorrect === true) {
    chiefMessage = 'מצוין! אתם על עקבותיו. המשיכו לחקור.'
  }

  return (
    <div className="deluxe-game">
      <StatusBar
        cityName={city?.name ?? '—'}
        countryName={country?.name ?? '—'}
        timeRemaining={caseState.timeRemaining}
        realTimeRemainingSeconds={realTimeRemainingSeconds}
        score={caseState.score}
        rank={getDifficultyLabel(caseState.difficulty)}
        rankLabel="קושי"
        agentName={displayPlayerName}
      />

      <div className="deluxe-main">
        <div className="deluxe-scene">
          {city && (
            <CityPhoto cityId={city.id} cityName={city.name} className="deluxe-scene-photo" />
          )}
          <div className="scene-caption">
            <h2>{city?.name}</h2>
            <p>{country?.landmark}</p>
          </div>
          {onTrail && (
            <div className="scene-badge trail">נראה שהחשוד היה כאן</div>
          )}
          {atFinal && (
            <div className="scene-badge danger">מקום מחבוא!</div>
          )}
        </div>

        <div className="deluxe-sidebar">
          <ChiefMonitor message={chiefMessage} />

          <InfoPanel title="תיק החקירה">
            <div className="case-brief">
              <TreasurePhoto
                treasureId={caseState.stolenTreasureId}
                name={caseState.stolenTreasure}
                className="case-brief-photo"
              />
              <div>
                <p className="case-label">אוצר שנגנב</p>
                <p className="case-value">{caseState.stolenTreasure}</p>
                {caseState.selectedSuspectId ? (
                  <span className="pill pill-green">✓ חשוד נבחר</span>
                ) : (
                  <span className="pill pill-red">לא נבחר חשוד</span>
                )}
              </div>
            </div>
          </InfoPanel>

          {caseState.knownClues.length > 0 && (
            <InfoPanel title="רמזים שנאספו">
              <ul className="clue-feed">
                {caseState.knownClues.map((clue) => (
                  <li key={clue.id} className={clue.type === 'suspect' ? 'clue-suspect' : 'clue-travel'}>
                    {clue.type === 'suspect' && <span className="clue-tag">חשוד</span>}
                    <ClueText clue={clue} />
                  </li>
                ))}
              </ul>
            </InfoPanel>
          )}
        </div>
      </div>

      <ActionToolbar onAction={handleAction} />

      {activePanel === 'investigate' && (
        <InvestigateModal
          cityId={caseState.currentCityId}
          investigatedSites={caseState.investigatedSites}
        />
      )}
      {activePanel === 'travel' && <WorldMapTravel currentCityId={caseState.currentCityId} />}
      {activePanel === 'interpol' && <InterpolPanel />}
      {activePanel === 'almanac' && <AlmanacPanel />}
    </div>
  )
}
