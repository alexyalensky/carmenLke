import type { ReactNode } from 'react'

/** CGA-style palette for retro pixel art */
export const CGA = {
  black: '#000000',
  blue: '#0000AA',
  green: '#00AA00',
  cyan: '#00AAAA',
  red: '#AA0000',
  magenta: '#AA00AA',
  brown: '#AA5500',
  lightGray: '#AAAAAA',
  darkGray: '#555555',
  brightBlue: '#5555FF',
  brightGreen: '#55FF55',
  brightCyan: '#55FFFF',
  brightRed: '#FF5555',
  brightMagenta: '#FF55FF',
  yellow: '#FFFF55',
  white: '#FFFFFF',
  skin: '#FFAA77',
  skinDark: '#CC7744',
  gold: '#FFCC00',
  sky: '#4488FF',
  sand: '#DDAA66',
} as const

interface PixelArtProps {
  children: ReactNode
  label?: string
  size?: number
  className?: string
}

export function PixelArt({ children, label, size = 96, className = '' }: PixelArtProps) {
  return (
    <figure className={`pixel-art-wrap ${className}`.trim()}>
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        className="pixel-art"
        shapeRendering="crispEdges"
        aria-hidden={label ? undefined : true}
        role={label ? 'img' : undefined}
        aria-label={label}
      >
        {children}
      </svg>
      {label && <figcaption className="pixel-label">{label}</figcaption>}
    </figure>
  )
}

export function P({
  x,
  y,
  w = 1,
  h = 1,
  c,
}: {
  x: number
  y: number
  w?: number
  h?: number
  c: string
}) {
  return <rect x={x} y={y} width={w} height={h} fill={c} />
}

/** Generic witness silhouette for investigation scenes */
export function WitnessPortrait({ size = 64 }: { size?: number }) {
  return (
    <PixelArt size={size} label="עד">
      <P x={5} y={2} w={6} h={5} c={CGA.skin} />
      <P x={4} y={3} w={8} h={1} c={CGA.brown} />
      <P x={6} y={4} w={1} h={1} c={CGA.black} />
      <P x={9} y={4} w={1} h={1} c={CGA.black} />
      <P x={7} y={6} w={2} h={1} c={CGA.red} />
      <P x={4} y={7} w={8} h={5} c={CGA.blue} />
      <P x={3} y={8} w={1} h={3} c={CGA.skin} />
      <P x={12} y={8} w={1} h={3} c={CGA.skin} />
      <P x={5} y={12} w={2} h={3} c={CGA.darkGray} />
      <P x={9} y={12} w={2} h={3} c={CGA.darkGray} />
    </PixelArt>
  )
}

/** Detective badge / agency logo */
export function AgencyLogo({ size = 80 }: { size?: number }) {
  return (
    <PixelArt size={size}>
      <P x={0} y={0} w={16} h={16} c={CGA.blue} />
      <P x={2} y={2} w={12} h={12} c={CGA.brightBlue} />
      <P x={4} y={4} w={8} h={8} c={CGA.yellow} />
      <P x={6} y={5} w={4} h={1} c={CGA.brown} />
      <P x={7} y={6} w={2} h={4} c={CGA.brown} />
      <P x={5} y={10} w={6} h={1} c={CGA.brown} />
      <P x={1} y={1} w={1} h={1} c={CGA.white} />
      <P x={14} y={1} w={1} h={1} c={CGA.white} />
    </PixelArt>
  )
}

/** Plane icon for travel */
export function PlaneIcon({ size = 48 }: { size?: number }) {
  return (
    <PixelArt size={size}>
      <P x={1} y={7} w={14} h={2} c={CGA.lightGray} />
      <P x={3} y={5} w={10} h={1} c={CGA.white} />
      <P x={5} y={4} w={6} h={1} c={CGA.white} />
      <P x={7} y={9} w={2} h={3} c={CGA.darkGray} />
      <P x={2} y={6} w={3} h={2} c={CGA.brightBlue} />
      <P x={11} y={6} w={3} h={2} c={CGA.brightBlue} />
      <P x={12} y={3} w={2} h={1} c={CGA.red} />
    </PixelArt>
  )
}

/** Thief silhouette flash */
export function ThiefSilhouette({ size = 48 }: { size?: number }) {
  return (
    <PixelArt size={size}>
      <P x={5} y={2} w={6} h={4} c={CGA.black} />
      <P x={4} y={3} w={8} h={1} c={CGA.red} />
      <P x={3} y={6} w={10} h={6} c={CGA.black} />
      <P x={2} y={7} w={2} h={1} c={CGA.black} />
      <P x={12} y={7} w={2} h={1} c={CGA.black} />
      <P x={4} y={12} w={3} h={3} c={CGA.black} />
      <P x={9} y={12} w={3} h={3} c={CGA.black} />
      <P x={11} y={4} w={3} h={2} c={CGA.gold} />
    </PixelArt>
  )
}
