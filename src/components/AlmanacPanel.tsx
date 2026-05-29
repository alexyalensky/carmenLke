import { useMemo, useState } from 'react'
import { getCityPhoto } from '../assets/images'
import { getCurrencyShort } from '../data/currencyEn'
import { useGame } from '../context/GameContext'
import { gameData } from '../data/gameData'
import { FlagImage } from './FlagImage'

export function AlmanacPanel() {
  const { setActivePanel } = useGame()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(gameData.almanac[0]?.id ?? '')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return gameData.almanac
    return gameData.almanac.filter((entry) => {
      const haystack = [
        entry.name,
        entry.capital,
        entry.language,
        entry.languageEn,
        entry.currency,
        entry.currencyEn,
        entry.continent,
        entry.landmark,
        entry.flagDescription,
        ...entry.neighbors,
        ...entry.majorCities.flatMap((c) => [c.name, c.nameEn]),
        ...entry.mainSites.flatMap((s) => [s.name, s.nameEn]),
        ...entry.facts,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [query])

  const selected = gameData.almanac.find((a) => a.id === selectedId) ?? filtered[0]
  const cityForCountry = selected
    ? gameData.cities.find((c) => c.countryId === selected.id)
    : undefined

  return (
    <div className="deluxe-modal-overlay" onClick={() => setActivePanel('none')}>
      <div className="deluxe-modal almanac-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>📖 ספר העולם — Atlas</h2>
          <p>חפשו מידע על מדינות, ערים, אתרים ומטבעות כדי לפענח רמזים מהעדים.</p>
        </header>

        <input
          type="search"
          className="almanac-search"
          placeholder="חיפוש לפי מדינה, עיר, אתר, מטבע, שפה..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="almanac-split">
          <ul className="almanac-list">
            {filtered.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  className={selected?.id === entry.id ? 'active' : ''}
                  onClick={() => setSelectedId(entry.id)}
                >
                  <FlagImage countryId={entry.id} width={22} className="almanac-list-flag-img" />
                  {entry.name}
                </button>
              </li>
            ))}
          </ul>

          {selected && (
            <div className="almanac-detail">
              {cityForCountry && (
                <img
                  src={getCityPhoto(cityForCountry.id)}
                  alt={selected.landmark}
                  className="almanac-hero"
                />
              )}

              <div className="almanac-title-row">
                <FlagImage countryId={selected.id} width={48} className="almanac-title-flag-img" />
                <h3>{selected.name}</h3>
              </div>

              <dl className="almanac-facts">
                <dt>יבשת</dt>
                <dd>{selected.continent}</dd>
                <dt>בירה</dt>
                <dd>{selected.capital}</dd>
                <dt>שפה</dt>
                <dd>
                  {selected.language}
                  <span className="almanac-en-hint"> ({selected.languageEn})</span>
                </dd>
                <dt>מטבע</dt>
                <dd>
                  {selected.currency}
                  <span className="almanac-en-hint"> — {getCurrencyShort(selected.id)}</span>
                </dd>
                <dt>אתר מפורסם</dt>
                <dd>{selected.landmark}</dd>
                <dt>שכנות</dt>
                <dd>{selected.neighbors.length > 0 ? selected.neighbors.join(', ') : 'אין'}</dd>
                <dt>דגל</dt>
                <dd className="almanac-flag-dd">
                  <FlagImage countryId={selected.id} width={64} className="almanac-flag-large" />
                  <span>{selected.flagDescription}</span>
                </dd>
              </dl>

              <section className="almanac-section">
                <h4>ערים עיקריות</h4>
                <ul className="almanac-chip-list">
                  {selected.majorCities.map((city) => (
                    <li
                      key={`${city.nameEn}-${city.name}`}
                      className={city.inGame ? 'almanac-chip almanac-chip-game' : 'almanac-chip'}
                      title={city.inGame ? 'עיר במשחק' : undefined}
                    >
                      {city.name}
                      {city.name !== city.nameEn && (
                        <span className="almanac-en-hint"> ({city.nameEn})</span>
                      )}
                      {city.inGame && <span className="almanac-game-badge">★</span>}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="almanac-section">
                <h4>אתרים ומוקדים</h4>
                <ul className="almanac-site-list">
                  {selected.mainSites.map((site) => (
                    <li key={site.nameEn}>
                      <strong>{site.name}</strong>
                      {site.name !== site.nameEn && (
                        <span className="almanac-en-hint"> — {site.nameEn}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="almanac-section almanac-did-you-know">
                <h4>ידעתם?</h4>
                <ul>
                  {selected.facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>

        <button type="button" className="btn-secondary modal-close" onClick={() => setActivePanel('none')}>
          סגור
        </button>
      </div>
    </div>
  )
}
