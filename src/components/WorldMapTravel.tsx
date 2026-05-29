import { useMemo, useState } from 'react'
import { getCityPhoto, worldMapBg } from '../assets/images'
import { getCityMapPosition, mapPosToSvg, worldMapAspect } from '../assets/worldMap'
import { useGame } from '../context/GameContext'
import { gameData } from '../data/gameData'
import { getConnectedCities, getCity, wasCityVisitedByThief } from '../game/engine'

interface WorldMapTravelProps {
  currentCityId: string
}

export function WorldMapTravel({ currentCityId }: WorldMapTravelProps) {
  const { doTravel, caseState, setActivePanel } = useGame()
  const connected = getConnectedCities(gameData, currentCityId)
  const current = getCity(gameData, currentCityId)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const currentPos = getCityMapPosition(currentCityId)

  const destinations = useMemo(
    () =>
      connected.map((city, index) => ({
        city,
        index: index + 1,
        pos: getCityMapPosition(city.id),
        visited: caseState ? wasCityVisitedByThief(caseState, city.id) : false,
      })),
    [connected, caseState],
  )

  return (
    <div className="deluxe-modal-overlay" onClick={() => setActivePanel('none')}>
      <div className="deluxe-modal map-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>✈ טיסה מ{current?.name}</h2>
          <p className="travel-instruction">
            בחרו יעד מהרשימה — המספרים תואמים לסימון על המפה. טיסה נכונה: −1 · שגויה: −3
          </p>
        </header>

        <div className="travel-layout">
          <div className="travel-map-panel">
            <div className="world-map-container" style={{ aspectRatio: `${worldMapAspect} / 1` }}>
              <img src={worldMapBg} alt="" className="world-map-bg" aria-hidden="true" />

              {currentPos && (
                <svg className="world-map-routes" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
                  {destinations.map(({ city, index, pos }) => {
                    if (!pos) return null
                    const from = mapPosToSvg(currentPos)
                    const to = mapPosToSvg(pos)
                    const active = hoveredId === null || hoveredId === city.id
                    return (
                      <g key={city.id} className={active ? 'route-active' : 'route-dim'}>
                        <line
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          className="flight-route"
                        />
                        <text
                          x={(from.x + to.x) / 2}
                          y={(from.y + to.y) / 2}
                          className="flight-route-number"
                        >
                          {index}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              )}

              <div className="world-map-markers world-map-markers-readonly" aria-hidden="true">
                {currentPos && (
                  <div
                    className="map-marker map-marker-current"
                    style={{ left: `${currentPos.x}%`, top: `${currentPos.y}%` }}
                  >
                    <span className="map-marker-dot" />
                    <span className="map-marker-tag">כאן</span>
                  </div>
                )}

                {destinations.map(({ city, index, pos, visited }) => {
                  if (!pos) return null
                  const highlighted = hoveredId === city.id
                  const dimmed = hoveredId !== null && hoveredId !== city.id
                  return (
                    <div
                      key={city.id}
                      className={`map-marker map-marker-dest ${highlighted ? 'highlighted' : ''} ${dimmed ? 'dimmed' : ''} ${visited ? 'visited' : ''}`}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    >
                      <span className="map-marker-number">{index}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="travel-dest-panel">
            <h3 className="travel-dest-heading">
              יעדים זמינים <span className="travel-dest-count">{connected.length}</span>
            </h3>
            <ul className="travel-dest-list">
              {destinations.map(({ city, index, visited }) => (
                <li key={city.id}>
                  <button
                    type="button"
                    className={`travel-dest-item ${hoveredId === city.id ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredId(city.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(city.id)}
                    onBlur={() => setHoveredId(null)}
                    onClick={() => doTravel(city.id)}
                  >
                    <span className="travel-dest-number">{index}</span>
                    <img src={getCityPhoto(city.id)} alt="" className="travel-dest-thumb" />
                    <span className="travel-dest-text">
                      <strong>{city.name}</strong>
                      <span className="travel-dest-en">{city.nameEn}</span>
                      {visited && <span className="dest-trail">החשוד עבר כאן</span>}
                    </span>
                    <span className="travel-dest-fly" aria-hidden="true">
                      ✈
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button type="button" className="btn-secondary modal-close" onClick={() => setActivePanel('none')}>
          סגור
        </button>
      </div>
    </div>
  )
}
