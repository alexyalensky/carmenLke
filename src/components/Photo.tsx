import { useEffect, useState } from 'react'
import { getSuspectPortraitUrl } from '../assets/suspectPortraits'
import { getSceneImageUrl, getWitnessPortraitUrl } from '../assets/witnessPortraits'
import { DEFAULT_PLACEHOLDER, getCityPhoto, getTreasurePhoto } from '../assets/images'
import type { SiteScene, Suspect } from '../game/types'

function suspectFrameVariant(id: string): 0 | 1 {
  return id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 2 === 0 ? 0 : 1
}

interface PhotoProps {
  src: string
  alt: string
  className?: string
  overlay?: boolean
}

export function Photo({ src, alt, className = '', overlay = false }: PhotoProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setCurrentSrc(src)
    setFailed(false)
  }, [src])

  const handleError = () => {
    if (currentSrc !== DEFAULT_PLACEHOLDER) {
      setCurrentSrc(DEFAULT_PLACEHOLDER)
    } else {
      setFailed(true)
    }
  }

  return (
    <div className={`photo-frame ${className}`.trim()}>
      {!failed ? (
        <img
          src={currentSrc}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleError}
        />
      ) : (
        <div className="photo-placeholder" aria-label={alt}>
          <span>🌍</span>
          <span>{alt}</span>
        </div>
      )}
      {overlay && !failed && <div className="photo-overlay" />}
    </div>
  )
}

export function CityPhoto({
  cityId,
  cityName,
  className = '',
  overlay = true,
}: {
  cityId: string
  cityName: string
  className?: string
  overlay?: boolean
}) {
  return (
    <Photo
      src={getCityPhoto(cityId)}
      alt={cityName}
      className={`city-photo ${className}`.trim()}
      overlay={overlay}
    />
  )
}

/** Investigation hero — scene/witness illustration */
export function ScenePhoto({
  scene,
  siteId: _siteId,
  name,
  className = '',
}: {
  scene: SiteScene
  siteId: string
  name: string
  className?: string
}) {
  return (
    <Photo
      src={getSceneImageUrl(scene)}
      alt={name}
      className={`scene-photo investigate-scene ${className}`.trim()}
    />
  )
}

/** Site card — witness character thumbnail */
export function SitePhoto({
  scene,
  siteId: _siteId,
  name,
  className = '',
}: {
  scene: SiteScene
  siteId: string
  name: string
  className?: string
}) {
  return (
    <Photo
      src={getWitnessPortraitUrl(scene)}
      alt={name}
      className={`site-photo witness-photo ${className}`.trim()}
    />
  )
}

export function WitnessPhoto({
  scene,
  siteId: _siteId,
  name = 'עד',
  className = '',
}: {
  scene: SiteScene
  siteId: string
  name?: string
  className?: string
}) {
  return (
    <Photo
      src={getWitnessPortraitUrl(scene)}
      alt={name}
      className={`witness-photo witness-avatar ${className}`.trim()}
    />
  )
}

export function SuspectPhoto({
  suspect,
  name,
  className = '',
  size = 80,
}: {
  suspect: Pick<Suspect, 'id' | 'hair' | 'gender' | 'build' | 'hobby' | 'name'>
  name?: string
  className?: string
  size?: number
}) {
  const label = name ?? suspect.name
  const src = getSuspectPortraitUrl(suspect.id)
  const variant = suspectFrameVariant(suspect.id)
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  return (
    <figure
      className={`suspect-portrait-frame variant-${variant} suspect-photo ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-label={label}
    >
      <img
        src={currentSrc}
        alt={label}
        loading="lazy"
        onError={() => {
          if (currentSrc !== DEFAULT_PLACEHOLDER) setCurrentSrc(DEFAULT_PLACEHOLDER)
        }}
      />
    </figure>
  )
}

export function TreasurePhoto({
  treasureId,
  name,
  className = '',
}: {
  treasureId: string
  name: string
  className?: string
}) {
  return (
    <Photo
      src={getTreasurePhoto(treasureId)}
      alt={name}
      className={`treasure-photo ${className}`.trim()}
    />
  )
}

export function RemoteImg({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (currentSrc !== DEFAULT_PLACEHOLDER) setCurrentSrc(DEFAULT_PLACEHOLDER)
      }}
    />
  )
}
