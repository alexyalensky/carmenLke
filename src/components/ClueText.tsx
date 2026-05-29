import { useState } from 'react'
import { FlagImage } from './FlagImage'
import { SiteWikiModal } from './SiteWikiModal'
import { getCurrencyShort } from '../data/currencyEn'
import { getCurrencyHebrew, getHebrewForEnglish } from '../data/englishHebrewLookup'
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
              <button
                key={i}
                type="button"
                className="clue-en-word clue-currency"
                title="לחצו לשמוע באנגלית ואז בעברית"
                onClick={(e) => {
                  e.stopPropagation()
                  void speakEnglishThenHebrew(enWord, heWord, enWord.toLowerCase())
                }}
              >
                {enWord}
              </button>
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
                    <button
                      type="button"
                      className="clue-en-word clue-site-name"
                      title="לחצו לשמוע באנגלית ואז בעברית"
                      onClick={(e) => {
                        e.stopPropagation()
                        void speakEnglishThenHebrew(segment.word, heWord, segment.speak)
                      }}
                    >
                      {displayWord}
                    </button>
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
              <button
                key={i}
                type="button"
                className="clue-en-word"
                title="לחצו לשמוע באנגלית ואז בעברית"
                onClick={(e) => {
                  e.stopPropagation()
                  void speakEnglishThenHebrew(segment.word, heWord, segment.speak)
                }}
              >
                {segment.word}
              </button>
            )
          }

          return null
        })}
      </span>

      {wikiSite && <SiteWikiModal site={wikiSite} onClose={() => setWikiSite(null)} />}
    </>
  )
}
