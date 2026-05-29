import { FlagImage } from './FlagImage'
import { getCurrencyShort } from '../data/currencyEn'
import { getCurrencyHebrew, getHebrewForEnglish } from '../data/englishHebrewLookup'
import { useSettings } from '../context/SettingsContext'
import type { Clue } from '../game/types'
import { speakEnglishThenHebrew } from '../utils/speakEnglish'

interface ClueTextProps {
  clue: Pick<Clue, 'text' | 'segments' | 'targetCountryId'>
  className?: string
}

export function ClueText({ clue, className = '' }: ClueTextProps) {
  const { useEnglishWords } = useSettings()

  if (!clue.segments?.length) {
    return <span className={className}>{clue.text}</span>
  }

  return (
    <span className={`clue-rich-text ${className}`.trim()}>
      {clue.segments.map((segment, i) => {
        if (segment.type === 'he') {
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
  )
}
