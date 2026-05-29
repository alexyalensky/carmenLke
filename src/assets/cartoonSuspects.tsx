import type { Suspect } from '../game/types'

const HAIR: Record<string, string> = {
  אדום: '#D94F4F',
  שחור: '#2C2C2C',
  חום: '#8B5A2B',
  בלונד: '#F2C94C',
  אפור: '#9E9E9E',
}

const SHIRTS = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F97316', '#EC4899', '#14B8A6', '#6366F1']

type Extra = 'glasses' | 'hat' | 'mustache' | 'cap' | 'headband' | 'earring' | 'beard' | 'bowtie'

const EXTRAS: Extra[] = ['glasses', 'hat', 'mustache', 'cap', 'headband', 'earring', 'beard', 'bowtie']

function hashId(id: string): number {
  return id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
}

function suspectStyle(suspect: Pick<Suspect, 'id' | 'hair' | 'gender' | 'build' | 'hobby'>) {
  const h = hashId(suspect.id)
  const female = suspect.gender === 'אישה'
  const tall = suspect.build === 'גבוה' || suspect.build === 'גבוהה'
  return {
    hair: HAIR[suspect.hair] ?? '#8B5A2B',
    skin: h % 3 === 0 ? '#E8B88A' : h % 3 === 1 ? '#C68642' : '#F5D0A9',
    shirt: SHIRTS[h % SHIRTS.length]!,
    extra: EXTRAS[(h + suspect.hobby.length) % EXTRAS.length]!,
    female,
    tall,
    eyeOffset: (h % 5) - 2,
    hobby: suspect.hobby,
  }
}

function ExtraFeature({ extra }: { extra: Extra }) {
  switch (extra) {
    case 'glasses':
      return (
        <>
          <rect x="26" y="34" width="12" height="8" rx="2" fill="none" stroke="#333" strokeWidth="2" />
          <rect x="42" y="34" width="12" height="8" rx="2" fill="none" stroke="#333" strokeWidth="2" />
          <line x1="38" y1="38" x2="42" y2="38" stroke="#333" strokeWidth="2" />
        </>
      )
    case 'hat':
      return (
        <>
          <ellipse cx="40" cy="22" rx="22" ry="6" fill="#4A3728" />
          <rect x="28" y="8" width="24" height="16" rx="3" fill="#5D4037" />
        </>
      )
    case 'cap':
      return (
        <>
          <path d="M 22 26 Q 40 10 58 26 L 58 30 Q 40 22 22 30 Z" fill="#2563EB" />
          <rect x="18" y="28" width="44" height="4" rx="2" fill="#1D4ED8" />
        </>
      )
    case 'mustache':
      return <path d="M 32 48 Q 40 52 48 48" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
    case 'beard':
      return <ellipse cx="40" cy="52" rx="14" ry="10" fill="#555" opacity="0.85" />
    case 'headband':
      return <rect x="24" y="24" width="32" height="5" rx="2" fill="#EF4444" />
    case 'earring':
      return (
        <>
          <circle cx="22" cy="42" r="2" fill="#FFD700" />
          <circle cx="58" cy="42" r="2" fill="#FFD700" />
        </>
      )
    case 'bowtie':
      return (
        <>
          <polygon points="40,50 32,46 32,54" fill="#DC2626" />
          <polygon points="40,50 48,46 48,54" fill="#DC2626" />
          <circle cx="40" cy="50" r="2" fill="#991B1B" />
        </>
      )
  }
}

export function CartoonSuspectPortrait({
  suspect,
  size = 80,
  className = '',
  name,
}: {
  suspect: Pick<Suspect, 'id' | 'hair' | 'gender' | 'build' | 'hobby'>
  size?: number
  className?: string
  name?: string
}) {
  const s = suspectStyle(suspect)
  const headY = s.tall ? 18 : 22
  const bodyH = s.tall ? 28 : 24

  return (
    <figure
      className={`cartoon-frame suspect-cartoon ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-label={name}
    >
      <svg viewBox="0 0 80 80" width={size} height={size} aria-hidden="true">
        <rect width="80" height="80" rx="8" fill="#1e293b" />
        <ellipse cx="40" cy="72" rx="18" ry="4" fill="#000" opacity="0.2" />
        <rect x="26" y={headY + 22} width="28" height={bodyH} rx="8" fill={s.shirt} />
        <rect x="36" y={headY + 18} width="8" height="8" fill={s.skin} />
        <ellipse cx="40" cy={headY + 10} rx={s.female ? 15 : 16} ry={s.female ? 17 : 16} fill={s.skin} />
        <path
          d={`M ${40 - (s.female ? 16 : 17)} ${headY + 12} Q 40 ${headY - 6} ${40 + (s.female ? 16 : 17)} ${headY + 12} L ${40 + (s.female ? 14 : 15)} ${headY + 20} Q 40 ${headY + 8} ${40 - (s.female ? 14 : 15)} ${headY + 20} Z`}
          fill={s.hair}
        />
        <ellipse cx={34 + s.eyeOffset * 0.3} cy={headY + 10} rx="3" ry="4" fill="#fff" />
        <ellipse cx={46 - s.eyeOffset * 0.3} cy={headY + 10} rx="3" ry="4" fill="#fff" />
        <circle cx={34 + s.eyeOffset * 0.3} cy={headY + 11} r="1.8" fill="#1a1a2e" />
        <circle cx={46 - s.eyeOffset * 0.3} cy={headY + 11} r="1.8" fill="#1a1a2e" />
        <path
          d={`M 34 ${headY + 16} Q 40 ${headY + 20} 46 ${headY + 16}`}
          fill="none"
          stroke="#333"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <ExtraFeature extra={s.extra} />
      </svg>
    </figure>
  )
}
