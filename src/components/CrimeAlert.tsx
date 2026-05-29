import { getCityPhoto, menuBg } from '../assets/images'
import { useGame } from '../context/GameContext'
import { gameData } from '../data/gameData'
import { getCity } from '../game/engine'
import { ChiefMonitor } from './ChiefMonitor'
import { CityPhoto, TreasurePhoto } from './Photo'

export function CrimeAlert() {
  const { caseState, dismissAlert } = useGame()
  if (!caseState) return null

  const city = getCity(gameData, caseState.currentCityId)

  return (
    <div className="crime-alert-deluxe">
      <img src={city ? getCityPhoto(city.id) : menuBg} alt="" className="crime-alert-bg" aria-hidden="true" />
      <div className="crime-alert-content">
        <span className="alert-flash">🚨 התראת פשע — ארגון הצל</span>

        <div className="crime-alert-grid">
          <div className="crime-scene">
            {city && <CityPhoto cityId={city.id} cityName={city.name} overlay={false} />}
          </div>

          <div className="crime-details">
            <ChiefMonitor
              variant="alert"
              title="המפקדת — שידור חירום"
              message={`גניבה דווחה${city ? ` ב${city.name}` : ''}! ${caseState.stolenTreasure} נגנב על ידי חבר מארגון הצל. זהותו לא ידועה — עקבו אחר הרמזים, סננו את CrimeNet, ותפסו אותו לפני שיגמר הזמן!`}
            />

            <div className="crime-evidence-row">
              <TreasurePhoto
                treasureId={caseState.stolenTreasureId}
                name={caseState.stolenTreasure}
              />
              <div className="unknown-suspect">
                <div className="unknown-suspect-icon" aria-hidden="true">
                  ?
                </div>
                <div>
                  <p className="case-label">זהות החשוד</p>
                  <p className="case-value">לא ידועה</p>
                  <span className="pill pill-red">אספו רמזים בחקירה</span>
                </div>
              </div>
            </div>

            <button type="button" className="btn-primary btn-large" onClick={dismissAlert}>
              התחל חקירה ←
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
