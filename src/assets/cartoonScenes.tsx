import { createContext, useContext, type ReactElement } from 'react'
import type { SiteScene } from '../game/types'

type SceneDraw = (variant: 'scene' | 'witness') => ReactElement

const SiteIdContext = createContext<string | undefined>(undefined)

function useSiteId(): string | undefined {
  return useContext(SiteIdContext)
}

const SKY = '#87CEEB'
const GROUND = '#6B8E23'
const WALL = '#94A3B8'
const DARK = '#1e293b'

function SceneSvg({
  children,
  size,
  className,
  bg = '#334155',
  ariaLabel,
}: {
  children: ReactElement
  size: number
  className?: string
  bg?: string
  ariaLabel?: string
}) {
  return (
    <figure
      className={`cartoon-frame scene-cartoon ${className ?? ''}`.trim()}
      style={{ width: size, height: size }}
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 80 80" width={size} height={size} aria-hidden="true">
        <rect width="80" height="80" rx="6" fill={bg} />
        {children}
      </svg>
    </figure>
  )
}

function hashId(id: string): number {
  return id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
}

const SHIRT_PALETTE = ['#EAB308', '#16A34A', '#3B82F6', '#EF4444', '#A855F7', '#F97316', '#0EA5E9', '#EC4899']

/** Simple cartoon person for witnesses */
function Person({
  x,
  y,
  shirt,
  skin,
  hat,
  scale = 1,
}: {
  x: number
  y: number
  shirt?: string
  skin?: string
  hat?: string
  scale?: number
}) {
  const siteId = useSiteId()
  const h = siteId ? hashId(siteId) : 0
  const resolvedShirt = shirt ?? SHIRT_PALETTE[h % SHIRT_PALETTE.length]!
  const resolvedSkin = skin ?? (h % 3 === 0 ? '#E8B88A' : h % 3 === 1 ? '#C68642' : '#F5D0A9')
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {hat && <rect x="-8" y="-14" width="16" height="6" rx="2" fill={hat} />}
      <circle cx="0" cy="-6" r="7" fill={resolvedSkin} />
      <rect x="-6" y="2" width="12" height="14" rx="3" fill={resolvedShirt} />
      <circle cx="-2" cy="-7" r="1" fill="#111" />
      <circle cx="2" cy="-7" r="1" fill="#111" />
    </g>
  )
}

const SCENE_DRAW: Record<SiteScene, SceneDraw> = {
  'delivery-boy': (v) =>
    v === 'witness' ? (
      <Person x={40} y={42} shirt="#EAB308" hat="#DC2626" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="50" width="80" height="30" fill={GROUND} />
        <rect x="10" y="35" width="25" height="20" rx="2" fill="#F59E0B" />
        <rect x="12" y="38" width="8" height="6" fill="#fff" />
        <Person x={52} y={38} shirt="#EAB308" hat="#DC2626" />
        <rect x="48" y="48" width="16" height="10" rx="1" fill="#92400E" />
      </>
    ),
  market: (v) =>
    v === 'witness' ? (
      <Person x={40} y={40} shirt="#16A34A" scale={1.5} />
    ) : (
      <>
        <rect x="0" y="55" width="80" height="25" fill="#D97706" />
        <rect x="5" y="30" width="20" height="25" fill="#EF4444" />
        <rect x="30" y="32" width="20" height="23" fill="#22C55E" />
        <rect x="55" y="28" width="20" height="27" fill="#F97316" />
        <Person x={40} y={48} shirt="#16A34A" />
      </>
    ),
  sewers: (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#64748B" skin="#94A3B8" scale={1.3} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="80" fill="#0f172a" />
        <ellipse cx="40" cy="70" rx="30" ry="8" fill="#1e293b" />
        <rect x="25" y="20" width="30" height="40" rx="15" fill="#334155" />
        <circle cx="40" cy="15" r="8" fill="#475569" />
        <Person x={40} y={42} shirt="#64748B" skin="#94A3B8" />
        <rect x="10" y="60" width="60" height="3" fill="#475569" />
      </>
    ),
  'taxi-driver': (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#FACC15" hat="#1e293b" scale={1.5} />
    ) : (
      <>
        <rect x="0" y="55" width="80" height="25" fill="#374151" />
        <rect x="15" y="40" width="50" height="18" rx="4" fill="#FACC15" />
        <rect x="20" y="43" width="15" height="10" fill="#87CEEB" />
        <circle cx="25" cy="58" r="5" fill="#111" />
        <circle cx="55" cy="58" r="5" fill="#111" />
        <Person x={58} y={36} shirt="#1e293b" hat="#1e293b" scale={0.9} />
      </>
    ),
  'street-vendor': (v) =>
    v === 'witness' ? (
      <Person x={40} y={40} shirt="#F97316" scale={1.5} />
    ) : (
      <>
        <rect x="0" y="58" width="80" height="22" fill={GROUND} />
        <rect x="20" y="42" width="40" height="16" rx="2" fill="#78350F" />
        <ellipse cx="40" cy="42" rx="22" ry="4" fill="#92400E" />
        <Person x={40} y={46} shirt="#F97316" />
        <circle cx="30" cy="48" r="3" fill="#EF4444" />
        <circle cx="50" cy="48" r="3" fill="#22C55E" />
      </>
    ),
  'hotel-clerk': (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#7C3AED" scale={1.5} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="80" fill="#4C1D95" />
        <rect x="10" y="35" width="60" height="30" rx="2" fill="#6D28D9" />
        <rect x="15" y="40" width="50" height="8" fill="#C4B5FD" />
        <Person x={40} y={44} shirt="#EDE9FE" />
        <rect x="55" y="38" width="8" height="12" fill="#FDE68A" />
      </>
    ),
  'dock-worker': (v) =>
    v === 'witness' ? (
      <Person x={40} y={40} shirt="#0369A1" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="45" width="80" height="35" fill="#0EA5E9" />
        <rect x="5" y="30" width="35" height="18" fill="#854D0E" />
        <rect x="45" y="35" width="30" height="12" fill="#64748B" />
        <Person x={60} y={38} shirt="#0369A1" />
      </>
    ),
  subway: (v) =>
    v === 'witness' ? (
      <Person x={40} y={40} shirt="#64748B" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="80" fill="#1e293b" />
        <rect x="5" y="45" width="70" height="25" rx="3" fill="#475569" />
        <rect x="10" y="50" width="25" height="12" fill="#94A3B8" />
        <circle cx="20" cy="68" r="4" fill="#FACC15" />
        <circle cx="60" cy="68" r="4" fill="#FACC15" />
        <Person x={50} y={48} shirt="#64748B" />
      </>
    ),
  alley: (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#374151" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="80" fill="#0f172a" />
        <rect x="0" y="20" width="25" height="60" fill="#334155" />
        <rect x="55" y="15" width="25" height="65" fill="#475569" />
        <rect x="0" y="70" width="80" height="10" fill="#1e293b" />
        <Person x={40} y={52} shirt="#374151" />
      </>
    ),
  rooftop: (v) =>
    v === 'witness' ? (
      <Person x={40} y={40} shirt="#DC2626" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="50" fill={SKY} />
        <rect x="0" y="50" width="80" height="30" fill="#78716C" />
        <rect x="10" y="42" width="15" height="12" fill="#57534E" />
        <rect x="55" y="38" width="20" height="16" fill="#57534E" />
        <Person x={40} y={48} shirt="#DC2626" />
      </>
    ),
  newsstand: (v) =>
    v === 'witness' ? (
      <Person x={40} y={40} shirt="#1D4ED8" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="55" width="80" height="25" fill={GROUND} />
        <rect x="25" y="30" width="30" height="28" fill="#1E40AF" />
        <rect x="28" y="33" width="8" height="10" fill="#fff" />
        <rect x="38" y="33" width="8" height="10" fill="#FEF08A" />
        <Person x={40} y={48} shirt="#1D4ED8" />
      </>
    ),
  'bus-driver': (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#059669" hat="#111" scale={1.5} />
    ) : (
      <>
        <rect x="0" y="58" width="80" height="22" fill="#374151" />
        <rect x="8" y="38" width="64" height="22" rx="4" fill="#10B981" />
        <rect x="12" y="42" width="18" height="12" fill="#87CEEB" />
        <Person x={55} y={36} shirt="#059669" hat="#111" scale={0.85} />
      </>
    ),
  'fish-market': (v) =>
    v === 'witness' ? (
      <Person x={40} y={40} shirt="#0EA5E9" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="50" width="80" height="30" fill="#0284C7" />
        <rect x="15" y="35" width="50" height="18" fill="#E0F2FE" />
        <ellipse cx="30" cy="44" rx="8" ry="3" fill="#94A3B8" />
        <ellipse cx="50" cy="42" rx="10" ry="4" fill="#64748B" />
        <Person x={65} y={42} shirt="#0EA5E9" />
      </>
    ),
  monk: (v) =>
    v === 'witness' ? (
      <Person x={40} y={40} shirt="#F97316" skin="#D4956A" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="55" width="80" height="25" fill={GROUND} />
        <rect x="30" y="15" width="20" height="40" fill="#DC2626" />
        <polygon points="40,8 25,18 55,18" fill="#F97316" />
        <Person x={40} y={48} shirt="#F97316" skin="#D4956A" />
      </>
    ),
  'tour-guide': (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#2563EB" hat="#FACC15" scale={1.5} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="45" fill={SKY} />
        <rect x="0" y="45" width="80" height="35" fill={GROUND} />
        <rect x="50" y="25" width="20" height="25" fill="#78716C" />
        <Person x={28} y={48} shirt="#2563EB" hat="#FACC15" />
        <rect x="22" y="52" width="4" height="12" fill="#92400E" />
      </>
    ),
  'cafe-waiter': (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#FFFFFF" scale={1.5} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="80" fill="#78350F" />
        <rect x="15" y="45" width="50" height="8" rx="2" fill="#92400E" />
        <circle cx="25" cy="42" r="4" fill="#fff" />
        <circle cx="55" cy="42" r="4" fill="#fff" />
        <Person x={40} y={44} shirt="#FFFFFF" />
      </>
    ),
  'museum-guard': (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#1e293b" hat="#1e293b" scale={1.5} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="80" fill="#44403C" />
        <rect x="20" y="20" width="40" height="35" fill="#78716C" />
        <rect x="25" y="25" width="30" height="20" fill="#FDE68A" />
        <Person x={40} y={52} shirt="#1e293b" hat="#1e293b" />
      </>
    ),
  'train-conductor': (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#1E3A8A" hat="#1e293b" scale={1.5} />
    ) : (
      <>
        <rect x="0" y="58" width="80" height="22" fill="#374151" />
        <rect x="5" y="35" width="70" height="25" rx="2" fill="#3B82F6" />
        <rect x="10" y="40" width="12" height="10" fill="#87CEEB" />
        <Person x={58} y={38} shirt="#1E3A8A" hat="#1e293b" scale={0.9} />
      </>
    ),
  'park-jogger': (v) =>
    v === 'witness' ? (
      <Person x={40} y={40} shirt="#22C55E" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="40" fill={SKY} />
        <rect x="0" y="40" width="80" height="40" fill="#15803D" />
        <circle cx="15" cy="35" r="10" fill="#166534" />
        <circle cx="65" cy="38" r="8" fill="#166534" />
        <Person x={45} y={48} shirt="#22C55E" />
      </>
    ),
  construction: (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#F97316" hat="#FACC15" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="60" width="80" height="20" fill="#78716C" />
        <rect x="20" y="25" width="40" height="35" fill="#475569" />
        <polygon points="40,10 15,28 65,28" fill="#FACC15" />
        <Person x={55} y={48} shirt="#F97316" hat="#FACC15" />
      </>
    ),
  airport: (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#0369A1" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="80" fill={SKY} />
        <polygon points="10,50 70,50 60,35 20,35" fill="#E2E8F0" />
        <rect x="30" y="52" width="20" height="6" fill="#64748B" />
        <Person x={40} y={48} shirt="#0369A1" />
      </>
    ),
  bazaar: (v) =>
    v === 'witness' ? (
      <Person x={40} y={40} shirt="#A855F7" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="55" width="80" height="25" fill="#D97706" />
        <path d="M 10 55 L 20 30 L 35 55 Z" fill="#EF4444" />
        <path d="M 30 55 L 45 25 L 60 55 Z" fill="#F97316" />
        <path d="M 55 55 L 65 32 L 75 55 Z" fill="#EAB308" />
        <Person x={40} y={50} shirt="#A855F7" />
      </>
    ),
  'bridge-toll': (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#64748B" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="50" width="80" height="30" fill="#0EA5E9" />
        <rect x="0" y="40" width="80" height="6" fill={WALL} />
        <rect x="30" y="28" width="20" height="14" fill="#475569" />
        <Person x={40} y={44} shirt="#64748B" />
      </>
    ),
  'beach-lifeguard': (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#EF4444" skin="#F5D0A9" scale={1.5} />
    ) : (
      <>
        <rect x="0" y="45" width="80" height="35" fill="#0EA5E9" />
        <rect x="0" y="55" width="80" height="25" fill="#FDE68A" />
        <rect x="55" y="35" width="8" height="18" fill="#DC2626" />
        <Person x={30} y={48} shirt="#EF4444" skin="#F5D0A9" />
      </>
    ),
  'police-informant': (v) =>
    v === 'witness' ? (
      <Person x={40} y={38} shirt="#1E3A8A" hat="#1e293b" scale={1.4} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="80" fill={DARK} />
        <rect x="20" y="50" width="40" height="6" fill="#475569" />
        <Person x={40} y={44} shirt="#1E3A8A" hat="#1e293b" />
        <ellipse cx="40" cy="70" rx="25" ry="4" fill="#000" opacity="0.4" />
      </>
    ),
  'underground-garage': (v) =>
    v === 'witness' ? (
      <Person x={40} y={40} shirt="#374151" scale={1.3} />
    ) : (
      <>
        <rect x="0" y="0" width="80" height="80" fill="#0f172a" />
        <rect x="10" y="45" width="30" height="18" rx="2" fill="#64748B" />
        <rect x="45" y="48" width="25" height="15" rx="2" fill="#475569" />
        <circle cx="20" cy="65" r="3" fill="#FACC15" />
        <Person x={62} y={48} shirt="#374151" />
      </>
    ),
}

export function CartoonSceneArt({
  scene,
  siteId,
  size = 72,
  className = '',
  label,
}: {
  scene: SiteScene
  siteId?: string
  size?: number
  className?: string
  label?: string
}) {
  const draw = SCENE_DRAW[scene]
  return (
    <SiteIdContext.Provider value={siteId}>
      <SceneSvg size={size} className={className} ariaLabel={label}>
        {draw('scene')}
      </SceneSvg>
    </SiteIdContext.Provider>
  )
}

export function CartoonWitnessArt({
  scene,
  siteId,
  size = 56,
  className = '',
  label,
}: {
  scene: SiteScene
  siteId?: string
  size?: number
  className?: string
  label?: string
}) {
  const draw = SCENE_DRAW[scene]
  return (
    <SiteIdContext.Provider value={siteId}>
      <SceneSvg size={size} className={className} bg="#1e293b" ariaLabel={label ?? 'עד'}>
        {draw('witness')}
      </SceneSvg>
    </SiteIdContext.Provider>
  )
}
