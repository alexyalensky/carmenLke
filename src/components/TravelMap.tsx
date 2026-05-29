import { CityScene } from '../assets/cityScenes'
import { PlaneIcon, ThiefSilhouette } from '../assets/PixelArt'
import { useGame } from '../context/GameContext'
import { gameData } from '../data/gameData'
import { getConnectedCities, getCity, wasCityVisitedByThief } from '../game/engine'

interface TravelMapProps {
  currentCityId: string
}

export function TravelMap({ currentCityId }: TravelMapProps) {
  const { doTravel, caseState, setActivePanel } = useGame()
  const connected = getConnectedCities(gameData, currentCityId)
  const current = getCity(gameData, currentCityId)

  return (
    <div className="modal-overlay" onClick={() => setActivePanel('none')}>
      <div className="modal retro-panel travel-modal" onClick={(e) => e.stopPropagation()}>
        <div className="travel-header">
          <PlaneIcon size={56} />
          <div>
            <h3 className="panel-title">טיסה מ{current?.name}</h3>
            <p className="subtitle">
              טיסה נכונה: −1 זמן · טיסה שגויה: −3 זמן
            </p>
          </div>
        </div>

        <div className="city-grid travel-grid">
          {connected.map((city) => {
            const visited = caseState && wasCityVisitedByThief(caseState, city.id)
            return (
              <button
                key={city.id}
                type="button"
                className="city-card travel-card"
                onClick={() => doTravel(city.id)}
              >
                <CityScene cityId={city.id} size={72} />
                <div>{city.name}</div>
                <div className="en">{city.nameEn}</div>
                {visited && (
                  <div className="trail-row">
                    <ThiefSilhouette size={32} />
                    <span className="trail-indicator">היה כאן</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="btn-secondary btn-retro"
          style={{ marginBlockStart: '1rem', width: '100%' }}
          onClick={() => setActivePanel('none')}
        >
          ביטול
        </button>
      </div>
    </div>
  )
}

export function getCurrentCityName(cityId: string): string {
  return getCity(gameData, cityId)?.name ?? cityId
}
