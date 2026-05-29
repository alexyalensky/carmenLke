import type { ReactElement, ReactNode } from 'react'
import type { SiteScene, Suspect } from '../game/types'

/** Carmen Sandiego Deluxe Edition–style VGA palette */
export const D = {
  black: '#000000',
  white: '#FFFFFF',
  skin: '#FFAA77',
  skinDark: '#CC7744',
  skinLight: '#FFCC99',
  hairBlack: '#1A1A1A',
  hairBrown: '#8B4513',
  hairBlonde: '#FFD700',
  hairRed: '#CC2200',
  hairGray: '#888888',
  pink: '#FF69B4',
  pinkDark: '#DB1493',
  blue: '#4169E1',
  blueDark: '#2040A0',
  yellow: '#FFD700',
  red: '#DD0000',
  green: '#00AA44',
  cyan: '#00CCCC',
  orange: '#FF8800',
  purple: '#8844CC',
  navy: '#223366',
  tan: '#CBA876',
  olive: '#556B2F',
  lime: '#88CC44',
  magenta: '#FF44FF',
  brown: '#8B4513',
  gray: '#888888',
  lightGray: '#CCCCCC',
  darkGray: '#444444',
  gold: '#FFCC00',
  sky: '#6699FF',
  water: '#2266CC',
  sand: '#DDAA66',
} as const

function Px({ x, y, w = 1, h = 1, c }: { x: number; y: number; w?: number; h?: number; c: string }) {
  return <rect x={x} y={y} width={w} height={h} fill={c} />
}

function hashId(id: string): number {
  return id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
}

function checkerboard(variant: 0 | 1) {
  const light = variant === 0 ? D.pink : D.blue
  const dark = variant === 0 ? D.pinkDark : D.blueDark
  const tiles: ReactElement[] = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      tiles.push(
        <Px key={`${row}-${col}`} x={col * 8} y={row * 8} w={8} h={8} c={(row + col) % 2 === 0 ? light : dark} />,
      )
    }
  }
  return tiles
}

function DeluxeFrame({
  children,
  size,
  label,
  variant = 0,
  className = '',
  viewW = 32,
  viewH = 32,
}: {
  children: ReactNode
  size: number
  label?: string
  variant?: 0 | 1
  className?: string
  viewW?: number
  viewH?: number
}) {
  const height = viewH === viewW ? size : Math.round(size * (viewH / viewW))
  return (
    <figure
      className={`deluxe-portrait-frame ${className}`.trim()}
      style={{ width: size, height }}
      aria-label={label}
    >
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        width={size}
        height={height}
        shapeRendering="crispEdges"
        aria-hidden={label ? undefined : true}
      >
        {checkerboard(variant)}
        {children}
      </svg>
    </figure>
  )
}

/** Standard bust — head + shoulders */
function Bust({
  skin = D.skin,
  hair = D.hairBrown,
  shirt = D.blue,
  hairTop = 6,
  hairH = 4,
  hairW = 12,
  hairX = 10,
  faceY = 10,
  female = false,
  extra,
}: {
  skin?: string
  hair?: string
  shirt?: string
  hairTop?: number
  hairH?: number
  hairW?: number
  hairX?: number
  faceY?: number
  female?: boolean
  extra?: ReactNode
}) {
  const fw = female ? 8 : 9
  const fx = female ? 12 : 11
  return (
    <>
      <Px x={hairX} y={hairTop} w={hairW} h={hairH} c={hair} />
      <Px x={fx} y={faceY} w={fw} h={9} c={skin} />
      <Px x={fx + 1} y={faceY + 3} w={2} h={2} c={D.black} />
      <Px x={fx + (female ? 4 : 5)} y={faceY + 3} w={2} h={2} c={D.black} />
      <Px x={fx + 2} y={faceY + 6} w={female ? 4 : 5} h={1} c={D.red} />
      <Px x={8} y={faceY + 9} w={16} h={10} c={shirt} />
      <Px x={6} y={faceY + 10} w={3} h={6} c={skin} />
      <Px x={23} y={faceY + 10} w={3} h={6} c={skin} />
      {extra}
    </>
  )
}

const WITNESS_ART: Record<SiteScene, (v: 0 | 1) => ReactElement> = {
  'delivery-boy': () => (
    <>
      <Bust shirt={D.orange} hair={D.hairBrown} extra={<><Px x={9} y={4} w={14} h={3} c={D.red} /><Px x={22} y={18} w={6} h={5} c={D.tan} /></>} />
    </>
  ),
  market: () => (
    <>
      <Bust shirt={D.green} hair={D.hairBlack} extra={<><Px x={8} y={19} w={16} h={3} c={D.white} /><Px x={10} y={22} w={4} h={3} c={D.red} /><Px x={18} y={22} w={4} h={3} c={D.lime} /></>} />
    </>
  ),
  sewers: () => (
    <>
      <Bust skin={D.skinDark} shirt={D.gray} hair={D.hairBlack} extra={<><Px x={8} y={3} w={16} h={4} c={D.yellow} /><Px x={24} y={16} w={3} h={6} c={D.gold} /></>} />
    </>
  ),
  'taxi-driver': () => (
    <>
      <Bust shirt={D.yellow} hair={D.hairBlack} extra={<><Px x={9} y={4} w={14} h={3} c={D.black} /><Px x={7} y={7} w={18} h={1} c={D.black} /></>} />
    </>
  ),
  'street-vendor': () => (
    <>
      <Bust shirt={D.red} hair={D.hairBrown} extra={<><Px x={8} y={19} w={16} h={2} c={D.white} /><Px x={22} y={20} w={5} h={4} c={D.orange} /></>} />
    </>
  ),
  'hotel-clerk': () => (
    <>
      <Bust shirt={D.navy} hair={D.hairBlack} extra={<><Px x={11} y={20} w={10} h={2} c={D.red} /><Px x={13} y={22} w={6} h={2} c={D.red} /><Px x={9} y={4} w={14} h={3} c={D.navy} /></>} />
    </>
  ),
  'dock-worker': () => (
    <>
      <Bust skin={D.skinDark} shirt={D.olive} hair={D.hairBlack} extra={<><Px x={8} y={5} w={16} h={2} c={D.red} /><Px x={6} y={19} w={20} h={4} c={D.olive} /></>} />
    </>
  ),
  subway: () => (
    <>
      <Bust shirt={D.orange} hair={D.hairGray} extra={<><Px x={8} y={19} w={16} h={3} c={D.yellow} /><Px x={10} y={22} w={12} h={2} c={D.yellow} /></>} />
    </>
  ),
  alley: () => (
    <>
      <Bust shirt={D.darkGray} hair={D.hairBlack} extra={<><Px x={7} y={3} w={18} h={4} c={D.black} /><Px x={8} y={7} w={16} h={1} c={D.black} /><Px x={10} y={18} w={12} h={8} c={D.darkGray} /></>} />
    </>
  ),
  rooftop: () => (
    <>
      <Bust shirt={D.cyan} hair={D.hairBlonde} hairTop={5} extra={<Px x={8} y={5} w={16} h={2} c={D.hairBlonde} />} />
    </>
  ),
  newsstand: () => (
    <>
      <Bust shirt={D.lightGray} hair={D.hairBrown} extra={<><Px x={9} y={4} w={14} h={3} c={D.brown} /><Px x={22} y={17} w={6} h={7} c={D.white} /><Px x={23} y={18} w={4} h={1} c={D.black} /></>} />
    </>
  ),
  'bus-driver': () => (
    <>
      <Bust shirt={D.navy} hair={D.hairGray} extra={<><Px x={8} y={3} w={16} h={5} c={D.navy} /><Px x={10} y={5} w={12} h={2} c={D.black} /><Px x={8} y={19} w={16} h={2} c={D.gold} /></>} />
    </>
  ),
  'fish-market': () => (
    <>
      <Bust shirt={D.white} hair={D.hairRed} extra={<><Px x={8} y={19} w={16} h={3} c={D.white} /><Px x={22} y={20} w={6} h={3} c={D.cyan} /><Px x={23} y={21} w={4} h={1} c={D.white} /></>} />
    </>
  ),
  monk: () => (
    <>
      <Bust skin={D.skinLight} shirt={D.orange} hair={D.hairGray} hairH={1} hairTop={8} extra={<Px x={7} y={18} w={18} h={12} c={D.orange} />} />
    </>
  ),
  'tour-guide': () => (
    <>
      <Bust shirt={D.green} hair={D.hairBrown} extra={<><Px x={8} y={3} w={16} h={4} c={D.tan} /><Px x={22} y={14} w={5} h={4} c={D.gold} /><Px x={23} y={15} w={3} h={2} c={D.sky} /></>} />
    </>
  ),
  'cafe-waiter': () => (
    <>
      <Bust shirt={D.black} hair={D.hairBlack} extra={<><Px x={8} y={19} w={16} h={4} c={D.white} /><Px x={22} y={16} w={4} h={6} c={D.white} /></>} />
    </>
  ),
  'museum-guard': () => (
    <>
      <Bust shirt={D.navy} hair={D.hairBlack} extra={<><Px x={8} y={3} w={16} h={5} c={D.navy} /><Px x={10} y={6} w={12} h={1} c={D.gold} /><Px x={8} y={19} w={16} h={2} c={D.gold} /></>} />
    </>
  ),
  'train-conductor': () => (
    <>
      <Bust shirt={D.navy} hair={D.hairGray} extra={<><Px x={7} y={2} w={18} h={5} c={D.navy} /><Px x={9} y={4} w={14} h={2} c={D.gold} /><Px x={8} y={19} w={16} h={3} c={D.gold} /></>} />
    </>
  ),
  'park-jogger': () => (
    <>
      <Bust shirt={D.lime} hair={D.hairBrown} female extra={<><Px x={9} y={4} w={14} h={2} c={D.red} /><Px x={7} y={22} w={4} h={4} c={D.lime} /><Px x={21} y={22} w={4} h={4} c={D.lime} /></>} />
    </>
  ),
  construction: () => (
    <>
      <Bust skin={D.skinDark} shirt={D.orange} hair={D.hairBlack} extra={<><Px x={7} y={2} w={18} h={5} c={D.yellow} /><Px x={8} y={19} w={16} h={4} c={D.orange} /></>} />
    </>
  ),
  airport: () => (
    <>
      <Bust shirt={D.navy} hair={D.hairBrown} extra={<><Px x={8} y={19} w={16} h={2} c={D.gold} /><Px x={6} y={21} w={4} h={3} c={D.gold} /><Px x={22} y={21} w={4} h={3} c={D.gold} /><Px x={9} y={4} w={14} h={3} c={D.navy} /></>} />
    </>
  ),
  bazaar: () => (
    <>
      <Bust skin={D.skinDark} shirt={D.purple} hair={D.hairBlack} extra={<><Px x={7} y={3} w={18} h={5} c={D.red} /><Px x={9} y={5} w={14} h={2} c={D.gold} /></>} />
    </>
  ),
  'bridge-toll': () => (
    <>
      <Bust shirt={D.lightGray} hair={D.hairBrown} extra={<><Px x={9} y={4} w={14} h={3} c={D.blue} /><Px x={22} y={18} w={5} h={5} c={D.yellow} /></>} />
    </>
  ),
  'beach-lifeguard': () => (
    <>
      <Bust skin={D.skinLight} shirt={D.red} hair={D.hairBlonde} extra={<><Px x={22} y={17} w={4} h={5} c={D.red} /><Px x={23} y={18} w={2} h={2} c={D.white} /><Px x={9} y={4} w={14} h={2} c={D.hairBlonde} /></>} />
    </>
  ),
  'police-informant': () => (
    <>
      <Bust shirt={D.darkGray} hair={D.hairBlack} extra={<><Px x={7} y={3} w={18} h={4} c={D.black} /><Px x={8} y={7} w={16} h={1} c={D.black} /><Px x={9} y={18} w={14} h={8} c={D.tan} /></>} />
    </>
  ),
  'underground-garage': () => (
    <>
      <Bust skin={D.skinDark} shirt={D.olive} hair={D.hairBlack} extra={<><Px x={8} y={19} w={16} h={5} c={D.olive} /><Px x={22} y={18} w={5} h={3} c={D.gray} /><Px x={23} y={19} w={3} h={1} c={D.red} /></>} />
    </>
  ),
}

const SCENE_BG: Record<SiteScene, ReactElement> = {
  'delivery-boy': <><Px x={0} y={20} w={48} h={12} c={D.sand} /><Px x={0} y={0} w={48} h={20} c={D.sky} /><Px x={30} y={14} w={14} h={10} c={D.orange} /></>,
  market: <><Px x={0} y={22} w={48} h={10} c={D.sand} /><Px x={4} y={10} w={10} h={12} c={D.red} /><Px x={18} y={8} w={12} h={14} c={D.green} /><Px x={34} y={12} w={10} h={10} c={D.orange} /></>,
  sewers: <><Px x={0} y={0} w={48} h={32} c={D.darkGray} /><Px x={14} y={8} w={20} h={16} c={D.black} /><Px x={20} y={4} w={8} h={6} c={D.gray} /></>,
  'taxi-driver': <><Px x={0} y={22} w={48} h={10} c={D.darkGray} /><Px x={8} y={14} w={32} h={10} c={D.yellow} /><Px x={0} y={0} w={48} h={14} c={D.blue} /></>,
  'street-vendor': <><Px x={0} y={24} w={48} h={8} c={D.sand} /><Px x={16} y={16} w={16} h={8} c={D.brown} /><Px x={14} y={14} w={20} h={3} c={D.red} /></>,
  'hotel-clerk': <><Px x={0} y={0} w={48} h={32} c={D.purple} /><Px x={8} y={12} w={32} h={16} c={D.navy} /><Px x={12} y={16} w={24} h={4} c={D.gold} /></>,
  'dock-worker': <><Px x={0} y={18} w={48} h={14} c={D.water} /><Px x={4} y={12} w={20} h={8} c={D.brown} /><Px x={28} y={14} w={16} h={6} c={D.gray} /></>,
  subway: <><Px x={0} y={0} w={48} h={32} c={D.black} /><Px x={4} y={16} w={40} h={14} c={D.gray} /><Px x={8} y={20} w={32} h={8} c={D.lightGray} /></>,
  alley: <><Px x={0} y={0} w={48} h={32} c={D.black} /><Px x={0} y={0} w={14} h={32} c={D.darkGray} /><Px x={34} y={0} w={14} h={32} c={D.darkGray} /></>,
  rooftop: <><Px x={0} y={0} w={48} h={18} c={D.sky} /><Px x={0} y={18} w={48} h={14} c={D.gray} /><Px x={20} y={14} w={8} h={6} c={D.darkGray} /></>,
  newsstand: <><Px x={0} y={24} w={48} h={8} c={D.sand} /><Px x={16} y={10} w={16} h={14} c={D.blue} /><Px x={18} y={12} w={4} h={6} c={D.white} /><Px x={26} y={12} w={4} h={6} c={D.white} /></>,
  'bus-driver': <><Px x={0} y={22} w={48} h={10} c={D.darkGray} /><Px x={6} y={12} w={36} h={12} c={D.green} /><Px x={10} y={14} w={10} h={6} c={D.cyan} /></>,
  'fish-market': <><Px x={0} y={20} w={48} h={12} c={D.water} /><Px x={8} y={14} w={32} h={6} c={D.white} /><Px x={12} y={15} w={8} h={2} c={D.cyan} /><Px x={24} y={15} w={10} h={2} c={D.gray} /></>,
  monk: <><Px x={0} y={22} w={48} h={10} c={D.green} /><Px x={18} y={6} w={12} h={16} c={D.red} /><Px x={14} y={2} w={20} h={5} c={D.orange} /></>,
  'tour-guide': <><Px x={0} y={0} w={48} h={20} c={D.sky} /><Px x={0} y={20} w={48} h={12} c={D.green} /><Px x={32} y={10} w={12} h={14} c={D.gray} /></>,
  'cafe-waiter': <><Px x={0} y={0} w={48} h={32} c={D.brown} /><Px x={10} y={18} w={28} h={4} c={D.tan} /><Px x={14} y={14} w={6} h={4} c={D.white} /><Px x={28} y={14} w={6} h={4} c={D.white} /></>,
  'museum-guard': <><Px x={0} y={0} w={48} h={32} c={D.purple} /><Px x={12} y={8} w={24} h={20} c={D.navy} /><Px x={16} y={12} w={16} h={10} c={D.gold} /></>,
  'train-conductor': <><Px x={0} y={22} w={48} h={10} c={D.darkGray} /><Px x={4} y={12} w={40} h={12} c={D.blue} /><Px x={8} y={14} w={8} h={6} c={D.cyan} /></>,
  'park-jogger': <><Px x={0} y={0} w={48} h={16} c={D.sky} /><Px x={0} y={16} w={48} h={16} c={D.green} /><Px x={6} y={10} w={8} h={10} c={D.brown} /><Px x={34} y={12} w={8} h={8} c={D.brown} /></>,
  construction: <><Px x={0} y={24} w={48} h={8} c={D.sand} /><Px x={16} y={8} w={16} h={16} c={D.gray} /><Px x={10} y={2} w={28} h={6} c={D.yellow} /></>,
  airport: <><Px x={0} y={0} w={48} h={20} c={D.sky} /><Px x={0} y={20} w={48} h={12} c={D.sand} /><Px x={20} y={10} w={20} h={8} c={D.lightGray} /></>,
  bazaar: <><Px x={0} y={20} w={48} h={12} c={D.sand} /><Px x={6} y={8} w={12} h={12} c={D.red} /><Px x={20} y={6} w={14} h={14} c={D.orange} /><Px x={36} y={10} w={10} h={10} c={D.purple} /></>,
  'bridge-toll': <><Px x={0} y={18} w={48} h={14} c={D.water} /><Px x={0} y={14} w={48} h={4} c={D.gray} /><Px x={20} y={8} w={8} h={8} c={D.lightGray} /></>,
  'beach-lifeguard': <><Px x={0} y={16} w={48} h={16} c={D.water} /><Px x={0} y={24} w={48} h={8} c={D.sand} /><Px x={38} y={8} w={6} h={12} c={D.red} /></>,
  'police-informant': <><Px x={0} y={0} w={48} h={32} c={D.black} /><Px x={20} y={4} w={8} h={10} c={D.yellow} /><Px x={18} y={24} w={12} h={4} c={D.darkGray} /></>,
  'underground-garage': <><Px x={0} y={0} w={48} h={32} c={D.black} /><Px x={6} y={16} w={16} h={10} c={D.gray} /><Px x={26} y={18} w={16} h={8} c={D.darkGray} /></>,
}

type SuspectDesign = {
  skin: string
  hair: string
  shirt: string
  hat?: ReactNode
  props?: ReactNode
  female?: boolean
  tile: 0 | 1
  hairTop?: number
  hairColor?: string
}

const HAIR_MAP: Record<string, string> = {
  אדום: D.hairRed,
  שחור: D.hairBlack,
  חום: D.hairBrown,
  בלונד: D.hairBlonde,
  אפור: D.hairGray,
}

const SUSPECT_DESIGNS: Record<string, SuspectDesign> = {
  dana: { skin: D.skin, hair: D.hairRed, shirt: D.purple, tile: 0, props: <Px x={22} y={14} w={4} h={4} c={D.black} /> },
  yossi: { skin: D.skinDark, hair: D.hairBlack, shirt: D.green, tile: 1, female: true, hat: <Px x={8} y={4} w={16} h={3} c={D.green} /> },
  maya: { skin: D.skin, hair: D.hairBrown, shirt: D.cyan, tile: 0, props: <Px x={21} y={15} w={5} h={4} c={D.gray} /> },
  ron: { skin: D.skinLight, hair: D.hairBlonde, shirt: D.orange, tile: 1, female: true, hat: <Px x={9} y={3} w={14} h={4} c={D.tan} /> },
  lila: { skin: D.skin, hair: D.hairGray, shirt: D.magenta, tile: 0, props: <Px x={10} y={20} w={12} h={2} c={D.white} /> },
  omar: { skin: D.skinDark, hair: D.hairRed, shirt: D.blue, tile: 1, female: true, props: <Px x={22} y={16} w={5} h={5} c={D.cyan} /> },
  nina: { skin: D.skin, hair: D.hairBlack, shirt: D.red, tile: 0, props: <Px x={8} y={20} w={16} h={3} c={D.red} /> },
  avi: { skin: D.skinDark, hair: D.hairBrown, shirt: D.green, tile: 1, female: true, hat: <Px x={7} y={3} w={18} h={4} c={D.green} /> },
  tali: { skin: D.skinLight, hair: D.hairBlonde, shirt: D.yellow, tile: 0, props: <Px x={22} y={17} w={5} h={5} c={D.white} /> },
  guy: { skin: D.skin, hair: D.hairGray, shirt: D.navy, tile: 1, female: true, hat: <Px x={8} y={3} w={16} h={5} c={D.navy} /> },
  noa: { skin: D.skin, hair: D.hairRed, shirt: D.olive, tile: 0, hat: <Px x={9} y={4} w={14} h={3} c={D.red} /> },
  ido: { skin: D.skinDark, hair: D.hairBlack, shirt: D.purple, tile: 1, female: true, props: <Px x={10} y={19} w={12} h={4} c={D.gold} /> },
  shira: { skin: D.skin, hair: D.hairBrown, shirt: D.red, tile: 0, props: <Px x={22} y={14} w={5} h={6} c={D.white} /> },
  amir: { skin: D.skinLight, hair: D.hairBlonde, shirt: D.cyan, tile: 1, female: true, hat: <Px x={8} y={2} w={16} h={5} c={D.gold} /> },
  yael: { skin: D.skin, hair: D.hairGray, shirt: D.brown, tile: 0, hat: <Px x={7} y={3} w={18} h={4} c={D.brown} /> },
  tom: { skin: D.skinDark, hair: D.hairRed, shirt: D.magenta, tile: 1, female: true, props: <Px x={9} y={20} w={14} h={3} c={D.magenta} /> },
  hila: { skin: D.skin, hair: D.hairBlack, shirt: D.orange, tile: 0, hat: <Px x={8} y={4} w={16} h={3} c={D.black} /> },
  eran: { skin: D.skinLight, hair: D.hairBrown, shirt: D.green, tile: 1, female: true, props: <Px x={22} y={16} w={5} h={6} c={D.green} /> },
  gal: { skin: D.skin, hair: D.hairBlonde, shirt: D.navy, tile: 0, hat: <Px x={7} y={2} w={18} h={5} c={D.navy} /> },
  rotem: { skin: D.skinDark, hair: D.hairGray, shirt: D.red, tile: 1, female: true, hat: <Px x={9} y={3} w={14} h={4} c={D.red} /> },
  uri: { skin: D.skin, hair: D.hairRed, shirt: D.olive, tile: 0, props: <Px x={8} y={19} w={16} h={4} c={D.olive} /> },
  merav: { skin: D.skinLight, hair: D.hairBlack, shirt: D.purple, tile: 1, female: true, props: <Px x={10} y={20} w={12} h={3} c={D.gold} /> },
  dan: { skin: D.skin, hair: D.hairBrown, shirt: D.cyan, tile: 0, hat: <Px x={8} y={3} w={16} h={4} c={D.cyan} /> },
  inbar: { skin: D.skinDark, hair: D.hairBlonde, shirt: D.orange, tile: 1, female: true, hat: <Px x={9} y={4} w={14} h={3} c={D.orange} /> },
  itay: { skin: D.skin, hair: D.hairGray, shirt: D.navy, tile: 0, props: <Px x={22} y={15} w={5} h={5} c={D.yellow} /> },
  carmit: { skin: D.skinLight, hair: D.hairRed, shirt: D.green, tile: 1, female: true, hat: <Px x={8} y={2} w={16} h={5} c={D.green} /> },
  ben: { skin: D.skin, hair: D.hairBlack, shirt: D.brown, tile: 0, hat: <Px x={7} y={3} w={18} h={4} c={D.black} /> },
  sapir: { skin: D.skinDark, hair: D.hairBrown, shirt: D.magenta, tile: 1, female: true, props: <Px x={9} y={19} w={14} h={4} c={D.white} /> },
}

function designForSuspect(suspect: Pick<Suspect, 'id' | 'hair' | 'gender' | 'build'>): SuspectDesign {
  const base = SUSPECT_DESIGNS[suspect.id]
  if (base) return { ...base, hair: HAIR_MAP[suspect.hair] ?? base.hair, female: suspect.gender === 'אישה' }
  const h = hashId(suspect.id)
  return {
    skin: h % 3 === 0 ? D.skin : h % 3 === 1 ? D.skinDark : D.skinLight,
    hair: HAIR_MAP[suspect.hair] ?? D.hairBrown,
    shirt: [D.red, D.blue, D.green, D.purple, D.orange, D.cyan, D.magenta, D.navy][h % 8]!,
    tile: (h % 2) as 0 | 1,
    female: suspect.gender === 'אישה',
  }
}

function SuspectBust({ design }: { design: SuspectDesign }) {
  return (
    <>
      {design.hat}
      <Bust
        skin={design.skin}
        hair={design.hair}
        shirt={design.shirt}
        female={design.female}
        extra={design.props}
      />
    </>
  )
}

export function DeluxeWitnessPortrait({
  scene,
  siteId,
  size = 72,
  className = '',
  label,
}: {
  scene: SiteScene
  siteId: string
  size?: number
  className?: string
  label?: string
}) {
  const variant = (hashId(siteId) % 2) as 0 | 1
  const draw = WITNESS_ART[scene]
  return (
    <DeluxeFrame size={size} label={label} variant={variant} className={className}>
      {draw(variant)}
    </DeluxeFrame>
  )
}

export function DeluxeSceneArt({
  scene,
  siteId,
  size = 320,
  className = '',
  label,
}: {
  scene: SiteScene
  siteId: string
  size?: number
  className?: string
  label?: string
}) {
  const variant = (hashId(siteId) % 2) as 0 | 1
  return (
    <DeluxeFrame size={size} label={label} variant={variant} className={className} viewW={48} viewH={32}>
      {SCENE_BG[scene]}
    </DeluxeFrame>
  )
}

export function DeluxeSuspectPortrait({
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
  const design = designForSuspect(suspect)
  return (
    <DeluxeFrame size={size} label={name} variant={design.tile} className={`suspect-deluxe ${className}`.trim()}>
      <SuspectBust design={design} />
    </DeluxeFrame>
  )
}
