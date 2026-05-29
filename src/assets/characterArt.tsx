import type { ReactElement } from 'react'
import { CGA, P, PixelArt } from './PixelArt'

export function SuspectPortrait({ suspectId, size = 80, label }: { suspectId: string; size?: number; label?: string }) {
  const configs: Record<string, { hair: string; skin: string; shirt: string; extra?: ReactElement }> = {
    dana: { hair: CGA.red, skin: CGA.skin, shirt: CGA.magenta },
    yossi: { hair: CGA.black, skin: CGA.skinDark, shirt: CGA.blue },
    maya: { hair: CGA.yellow, skin: CGA.skin, shirt: CGA.green },
    ron: { hair: CGA.brown, skin: CGA.skin, shirt: CGA.brown },
    lila: { hair: CGA.black, skin: CGA.skin, shirt: CGA.brightRed },
    omar: { hair: CGA.darkGray, skin: CGA.skinDark, shirt: CGA.cyan },
    nina: { hair: CGA.brightMagenta, skin: CGA.skin, shirt: CGA.brightBlue },
  }
  const cfg = configs[suspectId] ?? { hair: CGA.brown, skin: CGA.skin, shirt: CGA.darkGray }

  return (
    <PixelArt size={size} label={label} className="suspect-portrait">
      <P x={0} y={0} w={16} h={16} c={CGA.darkGray} />
      <P x={4} y={2} w={8} h={5} c={cfg.skin} />
      <P x={3} y={2} w={10} h={2} c={cfg.hair} />
      <P x={5} y={4} w={2} h={1} c={CGA.black} />
      <P x={9} y={4} w={2} h={1} c={CGA.black} />
      <P x={7} y={6} w={2} h={1} c={CGA.red} />
      <P x={3} y={7} w={10} h={6} c={cfg.shirt} />
      <P x={2} y={8} w={2} h={4} c={cfg.skin} />
      <P x={12} y={8} w={2} h={4} c={cfg.skin} />
      <P x={4} y={13} w={3} h={2} c={CGA.black} />
      <P x={9} y={13} w={3} h={2} c={CGA.black} />
      {suspectId === 'omar' && <P x={11} y={3} w={2} h={2} c={CGA.gold} />}
      {suspectId === 'nina' && <P x={4} y={1} w={8} h={1} c={CGA.brightMagenta} />}
    </PixelArt>
  )
}

export function SiteIconArt({ icon, size = 64, label }: { icon: string; size?: number; label?: string }) {
  const icons: Record<string, ReactElement> = {
    port: (
      <>
        <P x={0} y={10} w={16} h={6} c={CGA.brightBlue} />
        <P x={2} y={6} w={6} h={4} c={CGA.brown} />
        <P x={10} y={8} w={4} h={2} c={CGA.lightGray} />
        <P x={11} y={4} w={2} h={4} c={CGA.brown} />
      </>
    ),
    market: (
      <>
        <P x={0} y={12} w={16} h={4} c={CGA.sand} />
        <P x={2} y={6} w={5} h={6} c={CGA.red} />
        <P x={9} y={6} w={5} h={6} c={CGA.green} />
        <P x={4} y={4} w={8} h={2} c={CGA.yellow} />
      </>
    ),
    museum: (
      <>
        <P x={0} y={12} w={16} h={4} c={CGA.sand} />
        <P x={2} y={5} w={12} h={7} c={CGA.white} />
        <P x={4} y={3} w={8} h={2} c={CGA.white} />
        <P x={1} y={5} w={1} h={7} c={CGA.brown} />
        <P x={14} y={5} w={1} h={7} c={CGA.brown} />
      </>
    ),
    shrine: (
      <>
        <P x={0} y={12} w={16} h={4} c={CGA.green} />
        <P x={6} y={2} w={4} h={10} c={CGA.red} />
        <P x={4} y={0} w={8} h={2} c={CGA.gold} />
      </>
    ),
    park: (
      <>
        <P x={0} y={10} w={16} h={6} c={CGA.green} />
        <P x={3} y={4} w={3} h={6} c={CGA.brown} />
        <P x={10} y={3} w={3} h={7} c={CGA.brown} />
        <P x={2} y={2} w={5} h={3} c={CGA.brightGreen} />
        <P x={9} y={1} w={5} h={4} c={CGA.brightGreen} />
      </>
    ),
    station: (
      <>
        <P x={0} y={12} w={16} h={4} c={CGA.darkGray} />
        <P x={1} y={6} w={14} h={6} c={CGA.lightGray} />
        <P x={3} y={4} w={10} h={2} c={CGA.red} />
        <P x={6} y={8} w={4} h={2} c={CGA.brightBlue} />
      </>
    ),
    cafe: (
      <>
        <P x={0} y={12} w={16} h={4} c={CGA.brown} />
        <P x={2} y={6} w={12} h={6} c={CGA.yellow} />
        <P x={5} y={4} w={6} h={2} c={CGA.red} />
        <P x={7} y={8} w={2} h={2} c={CGA.white} />
      </>
    ),
    hotel: (
      <>
        <P x={3} y={2} w={10} h={12} c={CGA.lightGray} />
        <P x={5} y={4} w={2} h={2} c={CGA.brightCyan} />
        <P x={9} y={4} w={2} h={2} c={CGA.brightCyan} />
        <P x={5} y={8} w={2} h={2} c={CGA.brightCyan} />
        <P x={9} y={8} w={2} h={2} c={CGA.brightCyan} />
        <P x={6} y={0} w={4} h={2} c={CGA.red} />
      </>
    ),
    bazaar: (
      <>
        <P x={0} y={10} w={16} h={6} c={CGA.sand} />
        <P x={1} y={5} w={4} h={5} c={CGA.red} />
        <P x={6} y={4} w={4} h={6} c={CGA.yellow} />
        <P x={11} y={5} w={4} h={5} c={CGA.green} />
      </>
    ),
    beach: (
      <>
        <P x={0} y={8} w={16} h={8} c={CGA.brightCyan} />
        <P x={0} y={12} w={16} h={4} c={CGA.sand} />
        <P x={12} y={2} w={3} h={3} c={CGA.yellow} />
      </>
    ),
    gate: (
      <>
        <P x={0} y={12} w={16} h={4} c={CGA.green} />
        <P x={2} y={4} w={3} h={8} c={CGA.brown} />
        <P x={11} y={4} w={3} h={8} c={CGA.brown} />
        <P x={2} y={2} w={12} h={2} c={CGA.brown} />
      </>
    ),
    palace: (
      <>
        <P x={0} y={12} w={16} h={4} c={CGA.green} />
        <P x={3} y={5} w={10} h={7} c={CGA.white} />
        <P x={5} y={2} w={6} h={3} c={CGA.white} />
        <P x={7} y={0} w={2} h={2} c={CGA.gold} />
      </>
    ),
    bridge: (
      <>
        <P x={0} y={10} w={16} h={6} c={CGA.brightBlue} />
        <P x={0} y={8} w={16} h={2} c={CGA.lightGray} />
        <P x={2} y={6} w={2} h={2} c={CGA.lightGray} />
        <P x={12} y={6} w={2} h={2} c={CGA.lightGray} />
      </>
    ),
    opera: (
      <>
        <P x={0} y={10} w={16} h={6} c={CGA.brightBlue} />
        <P x={2} y={5} w={5} h={5} c={CGA.white} />
        <P x={9} y={5} w={5} h={5} c={CGA.white} />
        <P x={4} y={3} w={8} h={2} c={CGA.white} />
      </>
    ),
    mosque: (
      <>
        <P x={0} y={12} w={16} h={4} c={CGA.sand} />
        <P x={4} y={4} w={8} h={8} c={CGA.brown} />
        <P x={3} y={2} w={10} h={2} c={CGA.brown} />
        <P x={7} y={0} w={2} h={2} c={CGA.gold} />
      </>
    ),
    plaza: (
      <>
        <P x={0} y={10} w={16} h={6} c={CGA.sand} />
        <P x={6} y={3} w={4} h={7} c={CGA.white} />
        <P x={2} y={8} w={12} h={2} c={CGA.lightGray} />
        <P x={7} y={1} w={2} h={2} c={CGA.gold} />
      </>
    ),
    statue: (
      <>
        <P x={0} y={12} w={16} h={4} c={CGA.green} />
        <P x={7} y={2} w={2} h={10} c={CGA.lightGray} />
        <P x={5} y={0} w={6} h={2} c={CGA.lightGray} />
        <P x={4} y={4} w={8} h={2} c={CGA.lightGray} />
      </>
    ),
    harbour: (
      <>
        <P x={0} y={8} w={16} h={8} c={CGA.brightBlue} />
        <P x={2} y={10} w={8} h={3} c={CGA.brown} />
        <P x={12} y={9} w={3} h={2} c={CGA.lightGray} />
      </>
    ),
    library: (
      <>
        <P x={2} y={3} w={12} h={11} c={CGA.brown} />
        <P x={4} y={5} w={3} h={4} c={CGA.yellow} />
        <P x={9} y={5} w={3} h={4} c={CGA.yellow} />
        <P x={6} y={10} w={4} h={3} c={CGA.darkGray} />
      </>
    ),
    tower: (
      <>
        <P x={0} y={12} w={16} h={4} c={CGA.darkGray} />
        <P x={6} y={1} w={4} h={11} c={CGA.red} />
        <P x={5} y={0} w={6} h={1} c={CGA.white} />
        <P x={7} y={4} w={2} h={2} c={CGA.brightCyan} />
      </>
    ),
  }

  return (
    <PixelArt size={size} label={label}>
      {icons[icon] ?? (
        <>
          <P x={2} y={4} w={12} h={10} c={CGA.lightGray} />
          <P x={4} y={2} w={8} h={2} c={CGA.white} />
        </>
      )}
    </PixelArt>
  )
}

export function TreasureArt({ treasureId, size = 80, label }: { treasureId: string; size?: number; label?: string }) {
  const arts: Record<string, ReactElement> = {
    'gold-statue': (
      <>
        <P x={6} y={2} w={4} h={3} c={CGA.gold} />
        <P x={5} y={5} w={6} h={5} c={CGA.gold} />
        <P x={4} y={10} w={8} h={4} c={CGA.brown} />
      </>
    ),
    'blue-diamond': (
      <>
        <P x={7} y={3} w={2} h={2} c={CGA.brightCyan} />
        <P x={5} y={5} w={6} h={4} c={CGA.brightBlue} />
        <P x={6} y={9} w={4} h={3} c={CGA.brightBlue} />
        <P x={7} y={12} w={2} h={2} c={CGA.brightCyan} />
      </>
    ),
    papyrus: (
      <>
        <P x={4} y={2} w={8} h={12} c={CGA.yellow} />
        <P x={5} y={4} w={6} h={1} c={CGA.brown} />
        <P x={5} y={7} w={6} h={1} c={CGA.brown} />
        <P x={5} y={10} w={6} h={1} c={CGA.brown} />
      </>
    ),
    crown: (
      <>
        <P x={4} y={8} w={8} h={4} c={CGA.gold} />
        <P x={5} y={4} w={2} h={4} c={CGA.gold} />
        <P x={9} y={4} w={2} h={4} c={CGA.gold} />
        <P x={7} y={2} w={2} h={4} c={CGA.gold} />
        <P x={5} y={6} w={1} h={2} c={CGA.red} />
        <P x={10} y={6} w={1} h={2} c={CGA.red} />
      </>
    ),
    painting: (
      <>
        <P x={3} y={2} w={10} h={10} c={CGA.brown} />
        <P x={4} y={3} w={8} h={8} c={CGA.brightBlue} />
        <P x={5} y={5} w={3} h={3} c={CGA.yellow} />
        <P x={9} y={6} w={2} h={4} c={CGA.green} />
      </>
    ),
    mask: (
      <>
        <P x={4} y={3} w={8} h={9} c={CGA.gold} />
        <P x={5} y={5} w={2} h={2} c={CGA.brightBlue} />
        <P x={9} y={5} w={2} h={2} c={CGA.brightBlue} />
        <P x={6} y={9} w={4} h={2} c={CGA.red} />
      </>
    ),
    'gold-coin': (
      <>
        <P x={4} y={4} w={8} h={8} c={CGA.gold} />
        <P x={6} y={6} w={4} h={4} c={CGA.yellow} />
        <P x={7} y={7} w={2} h={2} c={CGA.brown} />
      </>
    ),
    katana: (
      <>
        <P x={2} y={7} w={10} h={2} c={CGA.lightGray} />
        <P x={10} y={5} w={4} h={2} c={CGA.brown} />
        <P x={12} y={3} w={2} h={4} c={CGA.gold} />
      </>
    ),
    jade: (
      <>
        <P x={5} y={2} w={6} h={4} c={CGA.green} />
        <P x={4} y={6} w={8} h={6} c={CGA.brightGreen} />
        <P x={6} y={12} w={4} h={2} c={CGA.brown} />
      </>
    ),
    ruby: (
      <>
        <P x={6} y={3} w={4} h={3} c={CGA.brightRed} />
        <P x={5} y={6} w={6} h={4} c={CGA.red} />
        <P x={6} y={10} w={4} h={3} c={CGA.brightRed} />
        <P x={7} y={13} w={2} h={2} c={CGA.red} />
      </>
    ),
  }

  return (
    <PixelArt size={size} label={label} className="treasure-art">
      {arts[treasureId] ?? arts['gold-coin']}
    </PixelArt>
  )
}
