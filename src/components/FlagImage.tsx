import { useState } from 'react'
import { getCountryFlag, getFlagImageUrl } from '../data/countryFlags'

interface FlagImageProps {
  countryId: string
  /** Display width in px (height follows 3:2 ratio) */
  width?: number
  className?: string
  title?: string
}

export function FlagImage({ countryId, width = 28, className = '', title }: FlagImageProps) {
  const [failed, setFailed] = useState(false)
  const srcWidth = Math.max(width, 40)
  const src = getFlagImageUrl(countryId, srcWidth)
  const src2x = getFlagImageUrl(countryId, width * 2)
  const height = Math.round(width * 0.72)

  if (!src || failed) {
    return (
      <span className={`flag-fallback ${className}`.trim()} title={title}>
        {getCountryFlag(countryId)}
      </span>
    )
  }

  return (
    <img
      src={src}
      srcSet={src2x !== src ? `${src2x} 2x` : undefined}
      alt=""
      title={title}
      className={`flag-image ${className}`.trim()}
      width={width}
      height={height}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
