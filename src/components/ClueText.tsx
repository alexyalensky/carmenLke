import { useState, type MouseEvent } from 'react'
import { FlagImage } from './FlagImage'
import { SiteWikiModal } from './SiteWikiModal'
import { getCurrencyShort } from '../data/currencyEn'
import { getCurrencyHebrew, getHebrewForEnglish, hasHebrewTranslation } from '../data/englishHebrewLookup'
import { findSiteWikiInfo, findSiteWikiByHebrewName } from '../data/siteWiki'
import { useSettings } from '../context/SettingsContext'
import type { Clue } from '../game/types'
import { speakEnglishThenHebrew } from '../utils/speakEnglish'

interface ClueTextProps {
  clue: Pick<Clue, 'text' | 'segments' | 'targetCountryId'>
  className?: string
  /** Show ? mini-wiki on landmark sites — only after arrest review */
  showSiteInfo?: boolean
}

function VoicedEnglishClue({
  word,
  heWord,
  speak,
  countryId,
  className = '',
}: {
  word: string
  heWord: string
  speak?: string
  countryId?: string
  className?: string
}) {
  const showTranslation = hasHebrewTranslation(word, countryId)

  const play = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    void speakEnglishThenHebrew(word, heWord, speak)
  }

  return (
    <span className="clue-en-group">
      <button
        type="button"
        className={`clue-en-word ${className}`.trim()}
        title="לחצו לשמוע באנגלית ואז בעברית"
        onClick={play}
      >
        {word}
      </button>
      {showTranslation && (
        <span
          className="clue-translate-hint"
          role="img"
          aria-label={`תרגום: ${heWord}`}
          title={heWord}
          tabIndex={0}
        >
          ע
        </span>
      )}
    </span>
  )
}

export function ClueText({ clue, className = '', showSiteInfo = false }: ClueTextProps) {
  const { useEnglishWords } = useSettings()
  const [wikiSite, setWikiSite] = useState<ReturnType<typeof findSiteWikiInfo>>(null)

  if (!clue.segments?.length) {
    return <span className={className}>{clue.text}</span>
  }

  return (
    <>
      <span className={`clue-rich-text ${className}`.trim()}>
        {clue.segments.map((segment, i) => {
          if (segment.type === 'he') {
            if (showSiteInfo) {
              const landmarkMatch = segment.text.match(/תיאר את ([^.]+?)(?:\.|$)/)
              if (landmarkMatch) {
                const siteInfo = findSiteWikiByHebrewName(
                  clue.targetCountryId,
                  landmarkMatch[1]!,
                )
                if (siteInfo) {
                  return (
                    <span key={i} className="clue-site-group">
                      <span>{segment.text}</span>
                      <button
                        type="button"
                        className="clue-site-info"
                        aria-label={`מידע על ${siteInfo.name}`}
                        title={`מידע על ${siteInfo.name}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setWikiSite(siteInfo)
                        }}
                      >
                        ?
                      </button>
                    </span>
                  )
                }
              }
            }
            return <span key={i}>{segment.text}</span>
          }

          if (segment.type === 'flag') {
            return (
              <span key={i} className="clue-flag" aria-label="דגל">
                <FlagImage countryId={segment.countryId} width={28} />
              </span>
            )
          }

          if (segment.type === 'currency') {
            const enWord = getCurrencyShort(segment.countryId)
            const heWord = getCurrencyHebrew(segment.countryId)

            if (!useEnglishWords) {
              return <span key={i}>{heWord}</span>
            }

            return (
              <VoicedEnglishClue
                key={i}
                word={enWord}
                heWord={heWord}
                speak={enWord.toLowerCase()}
                countryId={segment.countryId}
                className="clue-currency"
              />
            )
          }

          if (segment.type === 'en') {
            const heWord = getHebrewForEnglish(segment.word, clue.targetCountryId)
            const siteInfo = showSiteInfo ? findSiteWikiInfo(clue.targetCountryId, segment.word) : null
            const displayWord = useEnglishWords ? segment.word : heWord

            if (siteInfo) {
              return (
                <span key={i} className="clue-site-group">
                  {useEnglishWords ? (
                    <VoicedEnglishClue
                      word={segment.word}
                      heWord={heWord}
                      speak={segment.speak}
                      countryId={clue.targetCountryId}
                      className="clue-site-name"
                    />
                  ) : (
                    <span className="clue-site-name">{displayWord}</span>
                  )}
                  <button
                    type="button"
                    className="clue-site-info"
                    aria-label={`מידע על ${siteInfo.name}`}
                    title={`מידע על ${siteInfo.name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setWikiSite(siteInfo)
                    }}
                  >
                    ?
                  </button>
                </span>
              )
            }

            if (!useEnglishWords) {
              return <span key={i}>{heWord}</span>
            }

            return (
              <VoicedEnglishClue
                key={i}
                word={segment.word}
                heWord={heWord}
                speak={segment.speak}
                countryId={clue.targetCountryId}
              />
            )
          }

          return null
        })}
      </span>

      {wikiSite && <SiteWikiModal site={wikiSite} onClose={() => setWikiSite(null)} />}
    </>
  )
}
