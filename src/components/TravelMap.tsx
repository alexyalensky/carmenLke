import { CityScene } from '../assets/cityScenes'
import { PlaneIcon } from '../assets/PixelArt'
import { useGame } from '../context/GameContext'
import { gameData } from '../data/gameData'
import { getTravelDestinations, getCity } from '../game/engine'

interface TravelMapProps {
  currentCityId: string
}

export function TravelMap({ currentCityId }: TravelMapProps) {
  const { doTravel, caseState, setActivePanel } = useGame()
  const connected = caseState ? getTravelDestinations(gameData, caseState) : []
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
          {connected.map((city) => (
              <button
                key={city.id}
                type="button"
                className="city-card travel-card"
                onClick={() => doTravel(city.id)}
              >
                <CityScene cityId={city.id} size={72} />
                <div>{city.name}</div>
                <div className="en">{city.nameEn}</div>
              </button>
            ))}
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
